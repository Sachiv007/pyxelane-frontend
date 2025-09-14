import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";

export default function ResetPassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [token, setToken] = useState(null); // store token manually
  const navigate = useNavigate();

  useEffect(() => {
    // Grab the token and type from URL hash
    const hashParams = new URLSearchParams(window.location.hash.substring(1));
    const urlToken = hashParams.get("token");
    const type = hashParams.get("type");

    if (!urlToken || type !== "recovery") {
      setErrorMsg("Invalid or missing password reset link.");
    } else {
      setToken(urlToken);
    }
  }, []);

  const handleReset = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    if (!token) {
      setErrorMsg("Missing password reset token.");
      return;
    }

    if (password !== confirmPassword) {
      setErrorMsg("Passwords do not match.");
      return;
    }

    const { error } = await supabase.auth.updateUser({
      password,
      token, // pass the token explicitly
    });

    if (error) {
      setErrorMsg(error.message);
    } else {
      alert("Password reset successfully!");
      navigate("/login");
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "50px auto", textAlign: "center" }}>
      <h2>Reset Password</h2>
      {errorMsg && <p style={{ color: "red" }}>{errorMsg}</p>}
      <form onSubmit={handleReset}>
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
          placeholder="Confirm password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          style={{ width: "100%", padding: "10px", margin: "10px 0" }}
        />
        <button
          type="submit"
          style={{
            width: "100%",
            padding: "12px",
            backgroundColor: "#6b5bfa",
            color: "white",
            fontWeight: "bold",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
          }}
        >
          Reset Password
        </button>
      </form>
    </div>
  );
}



