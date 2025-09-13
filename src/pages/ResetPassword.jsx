import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";

export default function ResetPassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [recoveryToken, setRecoveryToken] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Parse token from URL hash (#)
    const hashParams = new URLSearchParams(window.location.hash.substring(1));
    const token = hashParams.get("token");
    const type = hashParams.get("type");

    if (!token || type !== "recovery") {
      alert("Invalid or missing password reset token.");
      navigate("/login");
      return;
    }

    setRecoveryToken(token);
  }, [navigate]);

  const handlePasswordReset = async (e) => {
    e.preventDefault();

    if (!recoveryToken) {
      alert("Missing token. Please request a new password reset email.");
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password, token: recoveryToken });
    setLoading(false);

    if (error) {
      alert("Failed to reset password: " + error.message);
    } else {
      alert("Password reset successfully. Please log in.");
      navigate("/login");
    }
  };

  return (
    <div className="reset-container">
      <div className="reset-box">
        <h2>Reset Password</h2>
        <form onSubmit={handlePasswordReset}>
          <input type="password" placeholder="New password" value={password} onChange={e => setPassword(e.target.value)} required />
          <input type="password" placeholder="Confirm new password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required />
          <button type="submit" disabled={loading}>{loading ? "Updating..." : "Update Password"}</button>
        </form>
      </div>
    </div>
  );
}






