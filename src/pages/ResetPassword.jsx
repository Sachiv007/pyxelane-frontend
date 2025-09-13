// src/pages/ResetPassword.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";

export default function ResetPassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [ready, setReady] = useState(false); // only show form after session is set
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      // read both hash and query just in case
      const hashParams = new URLSearchParams(window.location.hash.substring(1));
      const queryParams = new URLSearchParams(window.location.search);

      // Supabase typically returns the session token in the hash as "access_token"
      const token =
        hashParams.get("access_token") ||
        hashParams.get("token") ||
        queryParams.get("access_token") ||
        queryParams.get("token");

      const type =
        hashParams.get("type") ||
        queryParams.get("type");

      console.log("Reset page - url:", window.location.href);
      console.log("Parsed token:", token, "type:", type);

      if (!token || type !== "recovery") {
        // Not a valid recovery flow — redirect to login
        console.warn("Missing or invalid recovery token/type", { token, type });
        alert("Invalid or missing password reset token.");
        navigate("/login");
        return;
      }

      // Set the Supabase session from the token so updateUser() works
      try {
        const { error: setErr } = await supabase.auth.setSession({ access_token: token });
        if (setErr) {
          console.error("Failed to set Supabase session from token:", setErr);
          alert("Failed to initialize password reset session. Try requesting a new reset link.");
          navigate("/login");
          return;
        }

        // Remove the token from the URL for security (keeps UX cleaner)
        // Keep path /reset-password but clear hash and query
        const cleanUrl = window.location.origin + "/reset-password";
        window.history.replaceState({}, document.title, cleanUrl);

        setReady(true);
      } catch (err) {
        console.error("Unexpected error while setting session:", err);
        alert("An unexpected error occurred. Try requesting a new reset link.");
        navigate("/login");
      }
    })();
  }, [navigate]);

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    setLoading(true);
    // Now that we've set the session, updateUser will succeed
    const { error } = await supabase.auth.updateUser({ password });
    setLoading(false);

    if (error) {
      console.error("Supabase updateUser error:", error);
      alert("Failed to reset password: " + error.message);
    } else {
      alert("Password has been reset successfully. Please log in.");
      navigate("/login");
    }
  };

  if (!ready) {
    // show a friendly spinner / loading while session is being initialized
    return <div style={{ padding: 30 }}>Preparing password reset... (if this hangs, check console)</div>;
  }

  return (
    <div className="reset-container">
      <div className="reset-box">
        <h2>Reset Your Password</h2>
        <form onSubmit={handlePasswordReset}>
          <input
            type="password"
            placeholder="New password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Confirm new password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          <button type="submit" disabled={loading}>
            {loading ? "Updating..." : "Update Password"}
          </button>
        </form>
        <button onClick={() => navigate("/login")}>⬅ Back to Login</button>
      </div>
    </div>
  );
}








