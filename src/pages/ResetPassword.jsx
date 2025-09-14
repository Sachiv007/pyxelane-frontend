import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";

export default function ResetPassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [recoveryToken, setRecoveryToken] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const hashParams = new URLSearchParams(window.location.hash.substring(1));
    const type = hashParams.get("type");
    const token = hashParams.get("access_token") || hashParams.get("token"); // SPA hash token

    if (type === "recovery" && token) {
      setRecoveryToken(token);
    } else {
      setErrorMsg("Invalid password reset link.");
    }
  }, []);

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    if (!recoveryToken) {
      setErrorMsg("No valid token. Please request a new password reset email.");
      return;
    }

    if (password !== confirmPassword) {
      setErrorMsg("Passwords do not match.");
      return;
    }

    setLoading(true);

    const { error } = await supabase.auth.updateUser({
      password,
      token: recoveryToken,
    });

    setLoading(false);

    if (error) {
      setErrorMsg(error.message);
    } else {
      alert("Password reset successfully! Please log in.");
      navigate("/login");
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "50px auto", textAlign: "center" }}>
      <h2>Reset Your Password</h2>
      {errorMsg && <p style={{ color: "red" }}>{errorMsg}</p>}
      <form onSubmit={handlePasswordReset}>
        <input
          type="password"
          placeholder="New password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{ width: "100%", padding: "10px", margin: "10px 0" }}
        />
        <input
          type="password"
          placeholder="Confirm new password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          style={{ width: "100%", padding: "10px", margin: "10px 0" }}
        />
        <button
          type="submit"
          disabled={loading}
          style={{
            width: "100%",
            padding: "12px",
            backgroundColor: "#6b5bfa",
            color: "white",
            fontWeight: "bold",
            border: "none",
            borderRadius: "6px",
            cursor: loading ? "not-allowed" : "pointer",
          }}
        >
          {loading ? "Updating..." : "Reset Password"}
        </button>
      </form>
      <button
        onClick={() => navigate("/login")}
        style={{ marginTop: "15px", background: "none", border: "none", color: "#6b5bfa", cursor: "pointer" }}
      >
        ⬅ Back to Login
      </button>
    </div>
  );
}



