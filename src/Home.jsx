import React, { useEffect, useRef } from "react"
import { Link } from "react-router-dom"
import { useAuth } from "./context/AuthContext"

// ── Icons ────────────────────────────────────────────────────────────────────
const IconShield = () => <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24"><path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 4l6 2.67V11c0 3.83-2.59 7.43-6 8.7-3.41-1.27-6-4.87-6-8.7V7.67L12 5z" /></svg>
const IconSpeed = () => <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24"><path d="M20.38 8.57l-1.23 1.85a8 8 0 01-.22 7.58H5.07A8 8 0 0115.58 6.85l1.85-1.23A10 10 0 003.35 19a2 2 0 001.72 1h13.85a2 2 0 001.74-1 10 10 0 00-.27-10.44zm-9.79 6.84a2 2 0 002.83 0l5.66-8.49-8.49 5.66a2 2 0 000 2.83z" /></svg>
const IconDb = () => <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24"><path d="M12 3C7.58 3 4 4.79 4 7s3.58 4 8 4 8-1.79 8-4-3.58-4-8-4zm0 9c-4.42 0-8-1.79-8-4v3c0 2.21 3.58 4 8 4s8-1.79 8-4v-3c0 2.21-3.58 4-8 4zm0 5c-4.42 0-8-1.79-8-4v3c0 2.21 3.58 4 8 4s8-1.79 8-4v-3c0 2.21-3.58 4-8 4z" /></svg>
const IconRoute = () => <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24"><path d="M17 12h-5v5h5v-5zM16 1v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2h-1V1h-2zm3 18H5V8h14v11z" /></svg>
const IconApi = () => <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24"><path d="M14.5 2.5c0 1.5-1.5 7-1.5 7h-2C10.5 9.5 9 4 9 2.5a2.5 2.5 0 015 0zM12 12a2 2 0 100-4 2 2 0 000 4zm-5.5 9.5C5 21.5 4 20 4 18c0-1.37.55-2.61 1.44-3.5H4l1-4h14l1 4h-1.44C19.45 15.39 20 16.63 20 18c0 2-1 3.5-2.5 3.5-.83 0-1.55-.42-2-1.06-.45.64-1.17 1.06-2 1.06s-1.55-.42-2-1.06c-.45.64-1.17 1.06-2 1.06s-1.55-.42-2-1.06c-.45.64-1.17 1.06-2 1.06z" /></svg>
const IconTrain = () => <svg viewBox="0 0 24 24" fill="currentColor" width="28" height="28"><path d="M4 16c0 1.1.9 2 2 2h1v2h2v-2h6v2h2v-2h1c1.1 0 2-.9 2-2V8H4v8zm2-6h12v4H6v-4zM15 3l-1-2H10L9 3H4v2h16V3h-5z" /></svg>
const IconArrow = () => <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z" /></svg>
const IconCheck = () => <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" /></svg>

export default function Home() {
    const { isAuthenticated } = useAuth()
    const heroRef = useRef(null)

    // Parallax subtle scroll on hero
    useEffect(() => {
        const onScroll = () => {
            if (heroRef.current) {
                heroRef.current.style.transform = `translateY(${window.scrollY * 0.25}px)`
            }
        }
        window.addEventListener("scroll", onScroll, { passive: true })
        return () => window.removeEventListener("scroll", onScroll)
    }, [])

    return (
        <div style={{ fontFamily: "DM Sans,sans-serif" }}>

            {/* ===============HERO ===============*/}
            <section style={{
                minHeight: "100vh", position: "relative", overflow: "hidden",
                display: "flex", alignItems: "center",
                background: "linear-gradient(145deg, #072649 0%, #0a3c6d 45%, #0054a0 100%)",
            }}>
                {/* Background decorative circles */}
                <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none" }} ref={heroRef}>
                    <div style={{ position: "absolute", top: "-15%", right: "-10%", width: 700, height: 700, borderRadius: "50%", background: "rgba(12,135,232,0.08)", border: "1px solid rgba(255,255,255,0.05)" }} />
                    <div style={{ position: "absolute", bottom: "-20%", left: "-8%", width: 500, height: 500, borderRadius: "50%", background: "rgba(0,84,160,0.15)", border: "1px solid rgba(255,255,255,0.04)" }} />
                    <div style={{ position: "absolute", top: "30%", left: "5%", width: 300, height: 300, borderRadius: "50%", background: "rgba(12,135,232,0.05)" }} />
                    {/* Grid dots */}
                    <svg width="100%" height="100%" style={{ position: "absolute", inset: 0, opacity: 0.04 }}>
                        <defs>
                            <pattern id="dots" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
                                <circle cx="2" cy="2" r="1.5" fill="white" />
                            </pattern>
                        </defs>
                        <rect width="100%" height="100%" fill="url(#dots)" />
                    </svg>
                </div>
                

                {/* Hero content */}
                <div style={{ position: "relative", zIndex: 2, maxWidth: 1100, margin: "0 auto", padding: "8rem 2rem 5rem", width: "100%" }}>
                    <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "3rem" }}>

                        {/* Left — text */}
                        <div style={{ flex: "1 1 500px" }}>
                            <div style={{
                                display: "inline-flex", alignItems: "center", gap: 8, padding: "6px 14px",
                                borderRadius: 100, marginBottom: "1.5rem",
                                background: "rgba(124,196,251,0.12)", border: "1px solid rgba(124,196,251,0.25)",
                            }}>
                                <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#4ade80", display: "inline-block", animation: "pulseDot 2s infinite" }}></span>
                                <span style={{ color: "#7cc4fb", fontSize: "0.8rem", fontFamily: "JetBrains Mono,monospace", fontWeight: 500 }}>
                                    FULL-STACK DEMO PROJECT
                                </span>
                            </div>

                            <h1 style={{
                                fontFamily: "Sora,sans-serif", fontWeight: 800, color: "white",
                                fontSize: "clamp(2.4rem, 5vw, 3.8rem)", lineHeight: 1.12,
                                marginBottom: "1.5rem", letterSpacing: "-0.02em",
                            }}>
                                Modern Train<br />
                                <span style={{ color: "#7cc4fb" }}>Fleet Management</span><br />
                                System
                            </h1>

                            <p style={{
                                color: "#bfdbfe", fontSize: "1.1rem", lineHeight: 1.75,
                                maxWidth: 480, marginBottom: "2.5rem",
                            }}>
                                A complete REST API + React dashboard for managing train records —
                                built with Node.js, MySQL, JWT authentication, and Ant Design.
                            </p>

                            {/* CTA buttons */}
                            <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
                                <Link to={isAuthenticated ? "/dashboard" : "/register"}
                                    style={{
                                        display: "inline-flex", alignItems: "center", gap: 8,
                                        padding: "14px 28px", borderRadius: 12, textDecoration: "none",
                                        background: "linear-gradient(135deg,#0054a0,#0c87e8)", color: "white",
                                        fontFamily: "DM Sans,sans-serif", fontWeight: 700, fontSize: "1rem",
                                        boxShadow: "0 6px 24px rgba(12,135,232,0.45)", transition: "all 0.2s",
                                    }}
                                    onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 10px 30px rgba(12,135,232,0.55)" }}
                                    onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 6px 24px rgba(12,135,232,0.45)" }}>
                                    {isAuthenticated ? "Go to Dashboard" : "Get Started Free"}
                                    <IconArrow />
                                </Link>

                                <Link to="/login"
                                    style={{
                                        display: "inline-flex", alignItems: "center", gap: 8,
                                        padding: "14px 28px", borderRadius: 12, textDecoration: "none",
                                        background: "rgba(255,255,255,0.08)", color: "white",
                                        fontFamily: "DM Sans,sans-serif", fontWeight: 600, fontSize: "1rem",
                                        border: "1.5px solid rgba(255,255,255,0.2)", transition: "all 0.2s",
                                    }}
                                    onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.14)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.4)" }}
                                    onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.08)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.2)" }}>
                                    Sign In
                                </Link>
                            </div>

                            {/* Mini stats */}
                            <div style={{ display: "flex", gap: "2rem", marginTop: "3rem", flexWrap: "wrap" }}>
                                {[["+10", "API Endpoints"], ["3", "DB Tables"], ["JWT", "Auth"]].map(([val, label]) => (
                                    <div key={label}>
                                        <div style={{ fontFamily: "Sora,sans-serif", fontWeight: 700, fontSize: "1.6rem", color: "white" }}>{val}</div>
                                        <div style={{ color: "#7cc4fb", fontSize: "0.8rem", marginTop: 2 }}>{label}</div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Right — floating card mockup */}
                        <div style={{ flex: "1 1 340px", display: "flex", justifyContent: "center" }}>
                            <div style={{
                                background: "rgba(255,255,255,0.06)", borderRadius: 20,
                                border: "1px solid rgba(255,255,255,0.12)",
                                padding: "1.5rem", width: "100%", maxWidth: 380,
                                backdropFilter: "blur(12px)",
                                boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
                            }}>
                                {/* Mock table header */}
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
                                    <span style={{ fontFamily: "Sora,sans-serif", fontWeight: 600, color: "white", fontSize: "0.9rem" }}>Train Fleet</span>
                                    <div style={{ padding: "5px 12px", borderRadius: 8, background: "rgba(12,135,232,0.3)", color: "#7cc4fb", fontSize: "0.75rem", fontWeight: 600 }}>3 records</div>
                                </div>
                                {/* Mock rows */}
                                {[
                                    { name: "LRT Line 1", price: "₱30.00", route: "Baclaran – Roosevelt", color: "#4ade80" },
                                    { name: "MRT Line 3", price: "₱35.00", route: "Taft Ave – North EDSA", color: "#60a5fa" },
                                    { name: "PNR Commuter", price: "₱50.00", route: "Tutuban – Calamba", color: "#f59e0b" },
                                ].map((t, i) => (
                                    <div key={i} style={{
                                        padding: "0.75rem 1rem", borderRadius: 10, marginBottom: 8,
                                        background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)",
                                        display: "flex", justifyContent: "space-between", alignItems: "center",
                                    }}>
                                        <div>
                                            <div style={{ fontFamily: "DM Sans,sans-serif", fontWeight: 600, color: "white", fontSize: "0.875rem" }}>{t.name}</div>
                                            <div style={{ color: "rgba(255,255,255,0.45)", fontSize: "0.75rem", marginTop: 2 }}>{t.route}</div>
                                        </div>
                                        <div style={{ fontFamily: "JetBrains Mono,monospace", fontWeight: 600, color: t.color, fontSize: "0.875rem" }}>{t.price}</div>
                                    </div>
                                ))}
                                {/* Mock action buttons */}
                                <div style={{ display: "flex", gap: 8, marginTop: "0.5rem" }}>
                                    <div style={{ flex: 1, padding: "8px", borderRadius: 8, background: "rgba(12,135,232,0.25)", textAlign: "center", color: "#7cc4fb", fontSize: "0.8rem", fontWeight: 600 }}>+ Add Train</div>
                                    <div style={{ flex: 1, padding: "8px", borderRadius: 8, background: "rgba(255,255,255,0.06)", textAlign: "center", color: "rgba(255,255,255,0.5)", fontSize: "0.8rem" }}>Export</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom wave */}
                <div style={{ position: "absolute", bottom: -2, left: 0, right: 0 }}>
                    <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ display: "block", width: "100%" }}>
                        <path d="M0 40C240 80 480 0 720 40C960 80 1200 0 1440 40V80H0V40Z" fill="#f6f7f9" />
                    </svg>
                </div>
            </section>

            {/* ════════════════════════════════════════════════════
          FEATURES
      ════════════════════════════════════════════════════ */}
            <section style={{ padding: "6rem 2rem", background: "#f6f7f9" }}>
                <div style={{ maxWidth: 1100, margin: "0 auto" }}>
                    <div style={{ textAlign: "center", marginBottom: "3.5rem" }}>
                        <div style={{
                            display: "inline-block", padding: "5px 16px", borderRadius: 100, marginBottom: 14,
                            background: "#e0effe", color: "#0054a0", fontSize: "0.78rem",
                            fontFamily: "JetBrains Mono,monospace", fontWeight: 600, letterSpacing: "0.06em",
                        }}>
                            FEATURES
                        </div>
                        <h2 style={{ fontFamily: "Sora,sans-serif", fontWeight: 700, fontSize: "clamp(1.8rem,3vw,2.5rem)", color: "#0a3c6d", marginBottom: "0.75rem" }}>
                            Everything you need
                        </h2>
                        <p style={{ color: "#677890", fontSize: "1.05rem", maxWidth: 480, margin: "0 auto" }}>
                            A production-grade API and frontend covering authentication, CRUD, and data management.
                        </p>
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: "1.5rem" }}>
                        {[
                            { icon: <IconShield />, color: "#0054a0", bg: "#e0effe", title: "JWT Authentication", desc: "Secure login and registration with JSON Web Tokens. Tokens are blacklisted on logout for full session control." },
                            { icon: <IconDb />, color: "#1e8449", bg: "#d5f5e3", title: "MySQL Database", desc: "Three relational tables — users, trains, and token blacklist — with full CRUD operations via Express routes." },
                            { icon: <IconRoute />, color: "#6c3483", bg: "#e8daef", title: "Train Management", desc: "Add, edit, delete, and search trains by name, price, and route. Sortable table with pagination." },
                            { icon: <IconSpeed />, color: "#ba4a00", bg: "#fdebd0", title: "Vite + React 19", desc: "Blazing-fast development with Vite 6, React 19, and hot module replacement. Production builds in seconds." },
                            { icon: <IconApi />, color: "#1a5276", bg: "#d6eaf8", title: "REST API", desc: "RESTful endpoints covering register, login, logout, and full train CRUD. Tested with Postman." },
                            { icon: <IconTrain />, color: "#0054a0", bg: "#e0effe", title: "Ant Design v6", desc: "Professional UI components — forms, tables, modals, and notifications — styled with Tailwind CSS v4." },
                        ].map((f, i) => (
                            <div key={i} style={{
                                background: "white", borderRadius: 16, padding: "1.75rem",
                                border: "1px solid #eceef2",
                                boxShadow: "0 1px 3px rgba(0,0,0,0.04),0 4px 12px rgba(0,0,0,0.04)",
                                transition: "all 0.25s",
                            }}
                                onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "0 8px 30px rgba(0,0,0,0.10)" }}
                                onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 1px 3px rgba(0,0,0,0.04),0 4px 12px rgba(0,0,0,0.04)" }}>
                                <div style={{ width: 48, height: 48, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", color: f.color, background: f.bg, marginBottom: "1rem" }}>
                                    {f.icon}
                                </div>
                                <h3 style={{ fontFamily: "Sora,sans-serif", fontWeight: 600, fontSize: "1rem", color: "#0a3c6d", marginBottom: "0.5rem" }}>{f.title}</h3>
                                <p style={{ color: "#677890", fontSize: "0.875rem", lineHeight: 1.7, margin: 0 }}>{f.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ════════════════════════════════════════════════════
          TECH STACK BANNER
      ════════════════════════════════════════════════════ */}
            <section style={{ padding: "3.5rem 2rem", background: "#f6f7f9", borderTop: "1px solid #eceef2" }}>
                <div style={{ maxWidth: 1100, margin: "0 auto", textAlign: "center" }}>
                    <p style={{ color: "#8795aa", fontSize: "0.825rem", fontFamily: "JetBrains Mono,monospace", letterSpacing: "0.08em", marginBottom: "1.5rem" }}>
                        BUILT WITH
                    </p>
                    <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "1rem" }}>
                        {[
                            { label: "React 19", color: "#0054a0", bg: "#e0effe" },
                            { label: "Vite 6", color: "#6c3483", bg: "#e8daef" },
                            { label: "Tailwind CSS v4", color: "#1a5276", bg: "#d6eaf8" },
                            { label: "Ant Design v6", color: "#ba4a00", bg: "#fdebd0" },
                            { label: "Axios", color: "#1e8449", bg: "#d5f5e3" },
                            { label: "React Router 6", color: "#922b21", bg: "#fadbd8" },
                            { label: "Node.js", color: "#1e8449", bg: "#d5f5e3" },
                            { label: "Express.js", color: "#3b4453", bg: "#eceef2" },
                            { label: "MySQL 8", color: "#1a5276", bg: "#d6eaf8" },
                            { label: "JWT", color: "#6c3483", bg: "#e8daef" },
                        ].map(t => (
                            <span key={t.label} style={{
                                padding: "8px 18px", borderRadius: 100,
                                background: t.bg, color: t.color,
                                fontFamily: "DM Sans,sans-serif", fontWeight: 600, fontSize: "0.85rem",
                            }}>
                                {t.label}
                            </span>
                        ))}
                    </div>
                </div>
            </section>

            {/* ════════════════════════════════════════════════════
          CTA SECTION
      ════════════════════════════════════════════════════ */}
            <section style={{
                padding: "6rem 2rem", textAlign: "center",
                background: "linear-gradient(145deg,#072649 0%,#0054a0 100%)",
                position: "relative", overflow: "hidden",
            }}>
                <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
                    <div style={{ position: "absolute", top: "-30%", right: "-5%", width: 500, height: 500, borderRadius: "50%", background: "rgba(12,135,232,0.1)" }} />
                    <div style={{ position: "absolute", bottom: "-20%", left: "-5%", width: 400, height: 400, borderRadius: "50%", background: "rgba(0,84,160,0.2)" }} />
                </div>
                <div style={{ position: "relative", zIndex: 2, maxWidth: 640, margin: "0 auto" }}>
                    <h2 style={{ fontFamily: "Sora,sans-serif", fontWeight: 800, fontSize: "clamp(1.8rem,3vw,2.6rem)", color: "white", marginBottom: "1rem" }}>
                        Ready to explore the project?
                    </h2>
                    <p style={{ color: "#bfdbfe", fontSize: "1.05rem", lineHeight: 1.75, marginBottom: "2.5rem" }}>
                        Register an account, log in to the dashboard, and start managing trains with full CRUD operations.
                    </p>

                    {/* Checklist */}
                    <div style={{ display: "inline-flex", flexDirection: "column", alignItems: "flex-start", gap: 10, marginBottom: "2.5rem", textAlign: "left" }}>
                        {["Free to use, no credit card needed", "Full source code available", "REST API + React frontend included"].map(item => (
                            <div key={item} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                <div style={{ width: 22, height: 22, borderRadius: "50%", background: "rgba(74,222,128,0.2)", border: "1px solid #4ade80", display: "flex", alignItems: "center", justifyContent: "center", color: "#4ade80", flexShrink: 0 }}>
                                    <IconCheck />
                                </div>
                                <span style={{ color: "#bfdbfe", fontSize: "0.95rem" }}>{item}</span>
                            </div>
                        ))}
                    </div>

                    <div style={{ display: "flex", justifyContent: "center", gap: 12, flexWrap: "wrap" }}>
                        <Link to="/register"
                            style={{
                                display: "inline-flex", alignItems: "center", gap: 8,
                                padding: "14px 32px", borderRadius: 12, textDecoration: "none",
                                background: "white", color: "#0054a0",
                                fontFamily: "DM Sans,sans-serif", fontWeight: 700, fontSize: "1rem",
                                boxShadow: "0 6px 24px rgba(0,0,0,0.25)", transition: "all 0.2s",
                            }}
                            onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 10px 32px rgba(0,0,0,0.3)" }}
                            onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 6px 24px rgba(0,0,0,0.25)" }}>
                            Create Account
                            <IconArrow />
                        </Link>
                        <Link to="/login"
                            style={{
                                display: "inline-flex", alignItems: "center", gap: 8,
                                padding: "14px 28px", borderRadius: 12, textDecoration: "none",
                                background: "rgba(255,255,255,0.1)", color: "white",
                                fontFamily: "DM Sans,sans-serif", fontWeight: 600, fontSize: "1rem",
                                border: "1.5px solid rgba(255,255,255,0.25)", transition: "all 0.2s",
                            }}
                            onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.18)"}
                            onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.1)"}>
                            Sign In
                        </Link>
                    </div>
                </div>
            </section>

        </div>
    )
}