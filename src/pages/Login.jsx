import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);

    if (error) alert("Login failed: " + error.message);
    else navigate("/user");
  };

  const handleForgotPassword = async () => {
    if (!email) return alert("Enter your email to reset password.");
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
  redirectTo: "http://localhost:5173/reset-password", // or your Render URL
});


    if (error) alert("Error sending reset email: " + error.message);
    else alert("Password reset email sent! Check your inbox.");
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">{loading ? "Logging in..." : "Login"}</button>
      </form>
      <button onClick={handleForgotPassword}>Forgot Password?</button>
    </div>
  );
}




