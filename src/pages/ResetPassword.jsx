import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";

export default function ResetPassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // 🔍 Log full URL to debug
    console.log("FULL URL:", window.location.href);
    console.log("HASH PART:", window.location.hash);
    console.log("SEARCH PART:", window.location.search);

    const hashParams = new URLSearchParams(window.location.hash.substring(1));
    const queryParams = new URLSearchParams(window.location.search);

    const type = hashParams.get("type") || queryParams.get("type");
    const token = hashParams.get("access_token") || queryParams.get("token");

    console.log("TYPE:", type);
    console.log("TOKEN:", token);

    if (!token || type !== "recovery") {
      alert("Invalid or missing password reset token.");
      navigate("/login");
    }
  }, [navigate]);

  const handlePasswordReset = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    setLoading(true);

    // ⚡ Supabase automatically uses the token in the current session when type=recovery
    const { error } = await supabase.auth.updateUser({ password });

    setLoading(false);

    if (error) {
      alert("Failed to reset password: " + error.message);
    } else {
      alert("Password has been reset successfully. Please log in.");
      navigate("/login");
    }
  };

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







