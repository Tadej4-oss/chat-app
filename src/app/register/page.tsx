"use client";

import { useState } from "react";
import Link from "next/link";
import "../auth.css"

export default function Register() {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  async function handleRegister(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setIsSuccess(false);
      return;
    }

    setIsSuccess(false);
    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      console.log("Response status:", response);

      if (response.status !== 200) {
        const data = await response.json();
        setError(data.message || "Registration failed");
        return;
      }

      const data = await response.json();
      console.log("Registration successful:", data);
      setError("Registration successful!");
      setIsSuccess(true);
      
    } 
    catch (error) {
      console.error("Error during registration:", error);
      setError("Error during registration");
    } 
    finally {
      setUsername("");
      setPassword("");
      setConfirmPassword("");
    }
  }
  return (
    <main className="auth-container">
      <section className="auth-card" aria-labelledby="register-title">
        <div className="auth-icon" aria-hidden="true">
          <svg width="27" height="27" viewBox="0 0 24 24" fill="none">
            <path
              d="M16 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2M9.5 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM19 8v6M22 11h-6"
              stroke="currentColor"
              strokeWidth="1.7"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <p className="auth-eyebrow">Join the conversation</p>
        <h1 id="register-title" className="auth-title">Create your account</h1>
        <p className="auth-description">A few details and you’ll be ready to chat.</p>

        <form className="auth-form" onSubmit={handleRegister}>
          <div className="auth-fields">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              required
              autoComplete="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />

            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              required
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <label htmlFor="confirmPassword">Confirm password</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              required
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

          <button className="auth-submit" type="submit">
            Create account <span aria-hidden="true">→</span>
          </button>
        </form>

        <p className="auth-switch">
          Already have an account? <Link href="/login">Sign in</Link>
        </p>
        <p
          className={`auth-message${isSuccess ? " auth-message--success" : ""}`}
          aria-live="polite"
        >
          {error}
        </p>
      </section>
    </main>
  );
}
