"use client";

import "../auth.css"
import { useState } from "react";
import Link from "next/link";

export default function Login() {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  async function handleLogin(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try{
        const response = await fetch("/api/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ username, password }),
        });

        if (response.status !== 200) {
            const data = await response.json();
            setError(data.message || "Error during login");
            return;
        }

        const data = await response.json();
        console.log(data);
        window.location.replace("/home");

    }catch (error){
        console.error("Error during login:", error);
    } 
    finally{
      setUsername("");
      setPassword("");

    }
  }

  return (
    <main className="auth-container">
      <section className="auth-card" aria-labelledby="login-title">
        <div className="auth-icon" aria-hidden="true">
          <svg width="27" height="27" viewBox="0 0 24 24" fill="none">
            <path
              d="M12 3 5 6v5c0 4.5 3 8.2 7 10 4-1.8 7-5.5 7-10V6l-7-3Z"
              stroke="currentColor"
              strokeWidth="1.7"
              strokeLinejoin="round"
            />
            <path
              d="m9 12 2 2 4-4"
              stroke="currentColor"
              strokeWidth="1.7"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <p className="auth-eyebrow">Welcome back</p>
        <h1 id="login-title" className="auth-title">Sign in to your account</h1>
        <p className="auth-description">Pick up where you left off and join the conversation.</p>

        <form className="auth-form" onSubmit={handleLogin}>
          <div className="auth-fields">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
            />

            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
            />
          </div>

          <div className="auth-options">
            <span className="auth-muted">Secure sign in</span>
            <label className="remember-option" htmlFor="rememberMe">
              <input type="checkbox" id="rememberMe" name="rememberMe" />
              Remember me
            </label>
          </div>

          <button className="auth-submit" type="submit">
            Sign in <span aria-hidden="true">→</span>
          </button>
        </form>

        <p className="auth-switch">
          New around here? <Link href="/register">Create an account</Link>
        </p>
        <p className="auth-message auth-message--error" aria-live="polite">
          {error}
        </p>
      </section>
    </main>
  );
}
