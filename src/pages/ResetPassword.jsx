import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";

export default function ResetPassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();

  const [accessToken, setAccessToken] = useState(null);

  useEffect(() => {
    // Extract access_token from URL hash
    const hash = window.location.hash;
    if (hash.includes("access_token") && hash.includes("type=recovery")) {
      const token = new URLSearchParams(hash.slice(1)).get("access_token");
      setAccessToken(token);
      // Set session so supabase knows the user
      supabase.auth.setSession({ access_token: token });
    }
  }, []);

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    if (!accessToken) {
      setErrorMsg("Invalid or expired reset link.");
      return;
    }

    if (password !== confirmPassword) {
      setErrorMsg("Passwords do not match.");
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });
    setLoading(false);

    if (error) setErrorMsg(error.message);
    else {
      alert("Password reset successfully! Please log in.");
      navigate("/login");
    }
  };

  return (
    <div>
      <h2>Set Your New Password</h2>
      {errorMsg && <p style={{ color: "red" }}>{errorMsg}</p>}
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
          {loading ? "Updating..." : "Set Password"}
        </button>
      </form>
    </div>
  );
}








