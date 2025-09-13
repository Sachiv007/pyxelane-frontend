import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";

export default function ResetPassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [recoveryToken, setRecoveryToken] = useState(null);

  // On mount, grab recovery token from URL
  useEffect(() => {
    const hashParams = new URLSearchParams(window.location.hash.substring(1));
    const token = hashParams.get("access_token");
    const type = hashParams.get("type");

    if (type === "recovery" && token) {
      setRecoveryToken(token);
    } else {
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

    if (!recoveryToken) {
      alert("No recovery token found. Please request a new password reset.");
      navigate("/login");
      return;
    }

    setLoading(true);

    // Use the recovery token to update the password
    const { error } = await supabase.auth.updateUser(
      { password },
      { accessToken: recoveryToken }
    );

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




