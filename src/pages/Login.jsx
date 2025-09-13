import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';
import { supabase } from '../supabaseClient';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [forgotLoading, setForgotLoading] = useState(false);
  const navigate = useNavigate();

  const handleForgotPassword = async () => {
    if (!email) {
      alert("Please enter your email first.");
      return;
    }
    setForgotLoading(true);

    const redirectUrl = import.meta.env.VITE_FRONTEND_URL 
      ? `${import.meta.env.VITE_FRONTEND_URL}/reset-password` // Important: use hash
      : 'https://www.pyxelane.com/reset-password';

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: redirectUrl,
    });

    setForgotLoading(false);

    if (error) {
      alert("Failed to send reset email: " + error.message);
    } else {
      alert("Password reset email sent. Check your inbox.");
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    setLoading(false);

    if (error) {
      alert("Login failed: " + error.message);
      return;
    }

    if (data.user?.email_confirmed_at) {
      navigate("/user");
    } else {
      alert("Please verify your email before logging in.");
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Login</h2>
        <form onSubmit={handleLogin}>
          <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />
          <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required />
          <button type="submit" disabled={loading}>{loading ? "Logging in..." : "Login"}</button>
        </form>
        <button onClick={handleForgotPassword} disabled={forgotLoading || loading}>
          {forgotLoading ? "Sending..." : "Forgot Password?"}
        </button>
      </div>
    </div>
  );
}

