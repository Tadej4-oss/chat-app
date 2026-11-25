"use client"

import Link from "next/link";
import "./navbar.css"
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default  function Navbar() {
  const [user, setUser] = useState(null)

  const router = useRouter()

  useEffect(() => {
    fetch("/api/sessions")
      .then(res => res.json())
      .then(data => setUser(data.user))
  },[])

  async function handleLogout() {
    try {
      const res = await fetch("/api/logout", {
      method: "GET"
    })

    window.location.replace("/home");
      
    } catch (err) {
      console.log("Error During Logour:", err)
    }
    finally{
      router.refresh
    }
  }

  
    return (
        <>
        <header className="topbar">
          <Link className="nav-link home-nav" href="/home">
            Home
          </Link>
          <nav className="nav-links" aria-label="Main navigation">
            {user ? 
            (
            <>
                <button type="button" onClick={handleLogout} className="nav-link login-nav logout-nav">
                    Sign Out
                </button>
            </>
            ) : 
            (
            <>
                <Link className="nav-link login-nav" href="/login">
                    Login
                </Link>
            </>
            )}
            <Link className="nav-link register-nav" href="/register">
              Register
            </Link>
          </nav>
        </header>
        </>
    )
}  