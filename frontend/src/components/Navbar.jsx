import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import * as Toggle from "@radix-ui/react-toggle";

export default function Navbar() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [dark, setDark] = useState(localStorage.getItem('theme') === 'dark');

  useEffect(() => {
    if (dark) document.body.classList.add('dark');
    else document.body.classList.remove('dark');
    localStorage.setItem('theme', dark ? 'dark' : 'light');
  }, [dark]);

  return (
    <header className="navbar">
      <div className="nav-left">
        <Link to="/" className="nav-logo">Flashcards</Link>
        <Link to="/" className="nav-link">Dashboard</Link>
        <Link to="/study" className="nav-link">Study</Link>
      </div>

      <div className="nav-right">
        <Toggle.Root pressed={dark} onPressedChange={() => setDark(d => !d)} aria-label="Toggle theme">
          <button className="btn icon">{dark ? "☀️" : "🌙"}</button>
        </Toggle.Root>
        <button className="btn" onClick={() => { logout(); navigate('/login'); }}>Logout</button>
      </div>
    </header>
  );
}
