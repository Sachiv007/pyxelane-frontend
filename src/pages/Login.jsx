import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "../supabaseClient";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Handle user login
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);

    if (error) {
      alert("Login failed: " + error.message);
    } else {
      navigate("/user");
    }
  };

  // Handle forgot password — uses Supabase default recovery page
  const handleForgotPassword = async () => {
    if (!email) return alert("Enter your email to reset password.");

    const { error } = await supabase.auth.resetPasswordForEmail(email);

    if (error) {
      alert("Error sending reset email: " + error.message);
    } else {
      alert(
        "Password reset email sent! Check your inbox. Follow the link to reset your password."
      );
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "50px auto", textAlign: "center" }}>
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{ width: "100%", padding: "10px", margin: "10px 0" }}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
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
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>

      {/* Forgot password link */}
      {/*<p style={{ margin: "15px 0" }}>
        <button
          onClick={handleForgotPassword}
          style={{
            background: "none",
            border: "none",
            color: "#6b5bfa",
            cursor: "pointer",
            textDecoration: "underline",
            fontSize: "0.9rem",
          }}
        >
          Forgot password?
        </button>
      </p>*/}

      {/* Sign Up button */}
      <p style={{ marginTop: "20px" }}>
        Don't have an account?{" "}
        <Link
          to="/signup"
          style={{
            padding: "8px 16px",
            backgroundColor: "#6b5bfa",
            color: "white",
            borderRadius: "6px",
            textDecoration: "none",
            fontWeight: "bold",
          }}
        >
          Sign Up
        </Link>
      </p>
    </div>
  );
}
