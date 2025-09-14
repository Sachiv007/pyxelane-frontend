import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";

export default function ResetPassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();

  // Handle tokens from both hash and query string
  useEffect(() => {
    const handleRecoveryToken = async () => {
      const hash = window.location.hash; // for #access_token
      const search = window.location.search; // for ?token=

      if (hash) {
        // Supabase SPA mode — automatically handled
        return;
      }

      if (search.includes("type=recovery") && search.includes("token=")) {
        try {
          const { data, error } = await supabase.auth.exchangeCodeForSession(
            search
          );
          if (error) {
            console.error("Token exchange error:", error.message);
            setErrorMsg("Invalid or expired reset link.");
          } else {
            console.log("Session recovered:", data);
          }
        } catch (err) {
          console.error(err);
          setErrorMsg("Something went wrong during password reset.");
        }
      }
    };

    handleRecoveryToken();
  }, []);

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    if (password !== confirmPassword) {
      setErrorMsg("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.auth.updateUser({ password });

      setLoading(false);

      if (error) {
        setErrorMsg(error.message);
      } else {
        alert("Password reset successfully! Please log in.");
        navigate("/login");
      }
    } catch (err) {
      setLoading(false);
      setErrorMsg(err.message);
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
        style={{
          marginTop: "15px",
          background: "none",
          border: "none",
          color: "#6b5bfa",
          cursor: "pointer",
        }}
      >
        ⬅ Back to Login
      </button>
    </div>
  );
}




