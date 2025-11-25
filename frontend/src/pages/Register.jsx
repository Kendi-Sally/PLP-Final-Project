import React, { useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext.jsx";

export default function Register(){
  const { login } = useAuth();
  const [name,setName]=useState(''); const [email,setEmail]=useState(''); const [password,setPassword]=useState('');
  const [err,setErr]=useState(''); const [loading,setLoading]=useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setErr(''); setLoading(true);
    try {
      const res = await axios.post('http://localhost:5000/api/auth/register', { name, email, password });
      login(res.data.token);
    } catch (err) {
      setErr(err?.response?.data?.msg || 'Registration failed');
    } finally { setLoading(false); }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="auth-title">Create Account</h2>
        <p className="auth-sub">Register and start creating flashcards</p>

        <form className="auth-form" onSubmit={submit}>
          <input className="input" type="text" placeholder="Full name" value={name} onChange={e=>setName(e.target.value)} required />
          <input className="input" type="email" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} required />
          <input className="input" type="password" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} required />
          {err && <div className="auth-error">{err}</div>}
          <button className="btn" type="submit" disabled={loading}>{loading ? 'Registering...' : 'Register'}</button>
        </form>
      </div>
    </div>
  );
}
