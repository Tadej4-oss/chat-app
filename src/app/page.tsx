"use client"

import Link from "next/link";
import { useEffect, useState } from "react";
import "./page.css"

export default function Home() {
  type User = {
    username: string,
    id: number
  }

  const [user, setUser] = useState<User>()
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    fetch("/api/sessions")
      .then(res => res.json())
      .then(data => setUser(data.user))
      .catch(error => console.error("Session error:", error))
      .finally(() => setLoading(false))
  },[])
  return (
    <>
    {loading ? (
      <main className="app-loading" role="status" aria-live="polite">
        <section className="app-loading__card">
          <span className="app-loading__spinner" aria-hidden="true" />
          <div>
            <p className="app-loading__title">Checking your session</p>
            <p className="app-loading__description">Getting things ready for you...</p>
          </div>
        </section>
      </main>
    ) : user ? 
  <main className="enter-chat-page">
    <section className="enter-chat-div">
      <p className="enter-chat-eyebrow">You're signed in</p>
      <h1>Welcome to the Chat App, {user.username}</h1>
      <Link href="/home">Enter chat app</Link>
    </section>
  </main>
     : 
    <>
      <main className="login-prompt">
        <section className="login-prompt__card" aria-labelledby="login-prompt-title">
          <div className="login-prompt__icon" aria-hidden="true">
            <svg width="27" height="27" viewBox="0 0 24 24" fill="none">
              <path
                d="M20 11.5a7.5 7.5 0 0 1-7.5 7.5H6l-3 2v-6.5A7.5 7.5 0 1 1 20 11.5Z"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M8 11.5h.01M12 11.5h.01M16 11.5h.01"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
              />
            </svg>
          </div>

          <p className="login-prompt__eyebrow">
            Your conversations await
          </p>
          <h1 id="login-prompt-title" className="login-prompt__title">
            Please Login To Continue
          </h1>
          <p className="login-prompt__description">
            Sign in to pick up where you left off and join the conversation.
          </p>

          <Link href="/login" className="login-prompt__sign-in">
            Sign in
            <span aria-hidden="true" className="login-prompt__arrow">
              →
            </span>
          </Link>

          <p className="login-prompt__register">
            New around here?{" "}
            <Link href="/register">
              Create an account
            </Link>
          </p>
        </section>
      </main>
    </>}
    </>
  );
}
