import React, { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import { useNavigate } from "react-router-dom";

export default function ResetPassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [session, setSession] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Get current session
    const fetchSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
    };
    fetchSession();
  }, []);

  const handlePasswordReset = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    setLoading(true);

    // Update password using current session
    const { error } = await supabase.auth.updateUser({ password });

    setLoading(false);

    if (error) {
      alert("Failed to reset password: " + error.message);
    } else {
      alert("Password updated successfully! Please log in.");
      navigate("/login");
    }
  };

  if (!session) {
    return (
      <div style={{ padding: "2rem" }}>
        <h2>Reset Password</h2>
        <p>Please use the password reset link sent to your email.</p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: "400px", margin: "2rem auto" }}>
      <h2>Reset Your Password</h2>
      <form onSubmit={handlePasswordReset}>
        <input
          type="password"
          placeholder="New password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{ width: "100%", margin: "0.5rem 0", padding: "0.5rem" }}
        />
        <input
          type="password"
          placeholder="Confirm new password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          style={{ width: "100%", margin: "0.5rem 0", padding: "0.5rem" }}
        />
        <button type="submit" disabled={loading} style={{ padding: "0.5rem 1rem" }}>
          {loading ? "Updating..." : "Update Password"}
        </button>
      </form>
    </div>
  );
}
