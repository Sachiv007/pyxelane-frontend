import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";

export default function ResetPassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [recoveryToken, setRecoveryToken] = useState(null);

  useEffect(() => {
    // 1️⃣ Try reading from hash first
    const hashParams = new URLSearchParams(window.location.hash.substring(1));
    let token = hashParams.get("token");

    // 2️⃣ If no token in hash, try query parameters
    if (!token) {
      const queryParams = new URLSearchParams(window.location.search);
      token = queryParams.get("token");
    }

    const type = hashParams.get("type") || new URLSearchParams(window.location.search).get("type");

    if (!token || type !== "recovery") {
      alert("Invalid or missing password reset token.");
      navigate("/login");
    } else {
      setRecoveryToken(token);
    }
  }, [navigate]);

  const handlePasswordReset = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    if (!recoveryToken) {
      alert("Missing token. Please request a new password reset email.");
      return;
    }

    setLoading(true);

    // Use the recovery token to update the password
    const { error } = await supabase.auth.updateUser({ password, token: recoveryToken });

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





