import React, { useState, useEffect } from "react"
import { Link, Outlet, useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

const TrainIcon = () => (
    <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
        <path d="M4 16c0 1.1.9 2 2 2h1v2h2v-2h6v2h2v-2h1c1.1 0 2-.9 2-2V8H4v8zm2-6h12v4H6v-4zM15 3l-1-2H10L9 3H4v2h16V3h-5z" />
    </svg>
)

export default function HomeLayout() {
    const { isAuthenticated } = useAuth()
    const navigate = useNavigate()
    const [scrolled, setScrolled] = useState(false)

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 20)
        window.addEventListener("scroll", onScroll)
        return () => window.removeEventListener("scroll", onScroll)
    }, [])

    return (
        <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: "#f6f7f9" }}>

            {/* ── Navbar ─────────────────────────────────────────────── */}
            <nav
                style={{
                    position: "sticky", top: 0, zIndex: 100,
                    background: scrolled ? "rgba(255,255,255,0.92)" : "transparent",
                    backdropFilter: scrolled ? "blur(12px)" : "none",
                    borderBottom: scrolled ? "1px solid #eceef2" : "1px solid transparent",
                    transition: "all 0.3s ease",
                    padding: "0 2rem",
                    height: 68,
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                }}>
                {/* Logo */}
                <Link to="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{
                        width: 38, height: 38, borderRadius: 10,
                        background: "linear-gradient(135deg,#0054a0,#0c87e8)",
                        display: "flex", alignItems: "center", justifyContent: "center", color: "white",
                        boxShadow: "0 4px 12px rgba(12,135,232,0.30)",
                    }}>
                        <TrainIcon />
                    </div>
                    <span style={{ fontFamily: "Sora,sans-serif", fontWeight: 700, fontSize: "1.15rem", color: "#0a3c6d" }}>
                        RailManager
                    </span>
                </Link>

                {/* Nav links */}
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    {isAuthenticated ? (
                        <button onClick={() => navigate("/dashboard")}
                            style={{
                                marginLeft: 8, padding: "9px 20px", borderRadius: 10, border: "none", cursor: "pointer",
                                background: "linear-gradient(135deg,#0054a0,#0c87e8)", color: "white",
                                fontFamily: "DM Sans,sans-serif", fontWeight: 600, fontSize: "0.9rem",
                                boxShadow: "0 3px 10px rgba(12,135,232,0.30)", transition: "opacity 0.2s",
                            }}
                            onMouseEnter={e => e.currentTarget.style.opacity = "0.85"}
                            onMouseLeave={e => e.currentTarget.style.opacity = "1"}>
                            Go to Dashboard
                        </button>
                    ) : (
                        <div style={{ display: "flex", alignItems: "center", gap: 8, marginLeft: 8 }}>
                            <Link to="/login"
                                style={{
                                    padding: "9px 18px", borderRadius: 10, border: "1.5px solid #d5d9e2",
                                    color: "#0054a0", fontFamily: "DM Sans,sans-serif", fontWeight: 600,
                                    fontSize: "0.9rem", textDecoration: "none", transition: "all 0.2s",
                                    background: "white",
                                }}
                                onMouseEnter={e => { e.currentTarget.style.borderColor = "#0054a0"; e.currentTarget.style.background = "#f0f7ff" }}
                                onMouseLeave={e => { e.currentTarget.style.borderColor = "#d5d9e2"; e.currentTarget.style.background = "white" }}>
                                Sign in
                            </Link>
                            <Link to="/register"
                                style={{
                                    padding: "9px 20px", borderRadius: 10, border: "none",
                                    background: "linear-gradient(135deg,#0054a0,#0c87e8)", color: "white",
                                    fontFamily: "DM Sans,sans-serif", fontWeight: 600, fontSize: "0.9rem",
                                    textDecoration: "none", boxShadow: "0 3px 10px rgba(12,135,232,0.30)",
                                    transition: "opacity 0.2s",
                                }}
                                onMouseEnter={e => e.currentTarget.style.opacity = "0.85"}
                                onMouseLeave={e => e.currentTarget.style.opacity = "1"}>
                                Get Started
                            </Link>
                        </div>
                    )}
                </div>
            </nav>

            {/* ── Page content ───────────────────────────────────────── */}
            <main style={{ flex: 1 }}>
                <Outlet />
            </main>

            {/* ── Footer ─────────────────────────────────────────────── */}
            <footer style={{ background: "#072649", color: "white", padding: "3rem 2rem 2rem" }}>
                <div style={{ maxWidth: 1100, margin: "0 auto" }}>

                    {/* Top row */}
                    <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", gap: "2rem", marginBottom: "2.5rem" }}>

                        {/* Brand */}
                        <div style={{ maxWidth: 280 }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
                                <div style={{
                                    width: 36, height: 36, borderRadius: 9, display: "flex", alignItems: "center",
                                    justifyContent: "center", background: "rgba(255,255,255,0.15)", color: "white",
                                }}>
                                    <TrainIcon />
                                </div>
                                <span style={{ fontFamily: "Sora,sans-serif", fontWeight: 700, fontSize: "1.1rem" }}>
                                    RailManager
                                </span>
                            </div>
                            <p style={{ color: "#93c5fd", fontSize: "0.875rem", lineHeight: 1.7, margin: 0 }}>
                                A full-stack train management system built with Node.js, React, MySQL, and JWT authentication.
                            </p>
                        </div>

                        {/* Links */}
                        <div>
                            <p style={{ fontFamily: "Sora,sans-serif", fontWeight: 600, fontSize: "0.8rem", color: "#7cc4fb", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 14 }}>
                                Navigation
                            </p>
                            {[["Home", "/"], ["Features", "/features"], ["Sign In", "/login"], ["Register", "/register"]].map(([label, to]) => (
                                <div key={label} style={{ marginBottom: 10 }}>
                                    <Link to={to} style={{ color: "#93c5fd", fontSize: "0.9rem", textDecoration: "none", transition: "color 0.2s" }}
                                        onMouseEnter={e => e.target.style.color = "white"}
                                        onMouseLeave={e => e.target.style.color = "#93c5fd"}>
                                        {label}
                                    </Link>
                                </div>
                            ))}
                        </div>

                        {/* Tech stack */}
                        <div>
                            <p style={{ fontFamily: "Sora,sans-serif", fontWeight: 600, fontSize: "0.8rem", color: "#7cc4fb", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 14 }}>
                                Tech Stack
                            </p>
                            {["React 19 + Vite 6", "Tailwind CSS v4", "Ant Design v6", "Node.js + Express", "MySQL + JWT"].map(t => (
                                <div key={t} style={{ color: "#93c5fd", fontSize: "0.875rem", marginBottom: 8 }}>{t}</div>
                            ))}
                        </div>

                        {/* CTA */}
                        <div style={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
                            <p style={{ fontFamily: "Sora,sans-serif", fontWeight: 600, fontSize: "1rem", marginBottom: 16, color: "white" }}>
                                Ready to get started?
                            </p>
                            <Link to="/register"
                                style={{
                                    display: "inline-block", padding: "12px 28px", borderRadius: 10,
                                    background: "linear-gradient(135deg,#0054a0,#0c87e8)", color: "white",
                                    fontFamily: "DM Sans,sans-serif", fontWeight: 600, fontSize: "0.95rem",
                                    textDecoration: "none", textAlign: "center",
                                    boxShadow: "0 4px 16px rgba(12,135,232,0.40)", transition: "opacity 0.2s",
                                }}
                                onMouseEnter={e => e.currentTarget.style.opacity = "0.85"}
                                onMouseLeave={e => e.currentTarget.style.opacity = "1"}>
                                Create Free Account
                            </Link>
                        </div>
                    </div>

                    {/* Divider */}
                    <div style={{ borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: "1.5rem", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
                        <p style={{ color: "#64748b", fontSize: "0.825rem", margin: 0 }}>
                            © {new Date().getFullYear()} RailManager. Built for academic demonstration purposes.
                        </p>
                        <div style={{ display: "flex", gap: "1.5rem" }}>
                            {["Privacy Policy", "Terms of Service"].map(l => (
                                <span key={l} style={{ color: "#64748b", fontSize: "0.825rem", cursor: "pointer" }}>{l}</span>
                            ))}
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    )
}