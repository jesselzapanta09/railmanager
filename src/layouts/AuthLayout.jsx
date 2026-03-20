import React from "react"
import { Outlet, Link, Navigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

const TrainIcon = () => (
    <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
        <path d="M4 16c0 1.1.9 2 2 2h1v2h2v-2h6v2h2v-2h1c1.1 0 2-.9 2-2V8H4v8zm2-6h12v4H6v-4zM15 3l-1-2H10L9 3H4v2h16V3h-5z" />
    </svg>
)

export default function AuthLayout() {
    const { isAuthenticated } = useAuth()

    // Already logged in — send to dashboard
    if (isAuthenticated) return <Navigate to="/dashboard" replace />

    return (
        <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>

            {/* ── Minimal auth nav ───────────────────────────────────── */}
            <nav style={{
                position: "absolute", top: 0, left: 0, right: 0, zIndex: 50,
                padding: "1.25rem 2rem",
                display: "flex", alignItems: "center", justifyContent: "space-between",
            }}>
                {/* Logo — back to home */}
                <Link to="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: 9 }}>
                    <div style={{
                        width: 34, height: 34, borderRadius: 9,
                        background: "rgba(255,255,255,0.15)",
                        display: "flex", alignItems: "center", justifyContent: "center", color: "white",
                    }}>
                        <TrainIcon />
                    </div>
                    <span style={{ fontFamily: "Sora,sans-serif", fontWeight: 700, fontSize: "1.05rem", color: "white" }}>
                        RailManager
                    </span>
                </Link>

                {/* Back to home link */}
                <Link to="/"
                    style={{
                        display: "flex", alignItems: "center", gap: 6,
                        color: "rgba(255,255,255,0.75)", fontFamily: "DM Sans,sans-serif",
                        fontWeight: 500, fontSize: "0.875rem", textDecoration: "none",
                        padding: "7px 14px", borderRadius: 8,
                        border: "1px solid rgba(255,255,255,0.2)",
                        transition: "all 0.2s",
                    }}
                    onMouseEnter={e => { e.currentTarget.style.color = "white"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.5)" }}
                    onMouseLeave={e => { e.currentTarget.style.color = "rgba(255,255,255,0.75)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.2)" }}>
                    <svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14">
                        <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" />
                    </svg>
                    Back to home
                </Link>
            </nav>

            {/* ── Auth page content (Login or Register) ──────────────── */}
            <Outlet />
        </div>
    )
}