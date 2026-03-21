import React, { useState, useEffect } from "react"
import { Outlet, Link, useNavigate, useLocation } from "react-router-dom"
import { App } from "antd"
import { useAuth } from "../context/AuthContext"
import Avatar from './../components/Avatar';

const IconTrain = () => <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M4 16c0 1.1.9 2 2 2h1v2h2v-2h6v2h2v-2h1c1.1 0 2-.9 2-2V8H4v8zm2-6h12v4H6v-4zM15 3l-1-2H10L9 3H4v2h16V3h-5z" /></svg>
const IconDash = () => <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z" /></svg>
const IconLogout = () => <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16"><path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z" /></svg>
const IconMenu = () => <svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22"><path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z" /></svg>
const IconClose = () => <svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" /></svg>

const SIDEBAR_W = 240
const BREAKPOINT = 1024

const IconUsers = () => <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" /></svg>

const IconKey = () => <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M12.65 10C11.83 7.67 9.61 6 7 6c-3.31 0-6 2.69-6 6s2.69 6 6 6c2.61 0 4.83-1.67 5.65-4H17v4h4v-4h2v-4H12.65zM7 14c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z" /></svg>

const NAV = [
    { label: "Dashboard", to: "/admin/dashboard", icon: <IconDash /> },
    { label: "Users", to: "/admin/users", icon: <IconUsers /> },
    { label: "Manage Trains", to: "/admin/trains", icon: <IconTrain /> },
    { label: "Edit Profile", to: "/admin/edit-profile", icon: <IconKey /> },
]

function useIsDesktop() {
    const [isDesktop, setIsDesktop] = useState(window.innerWidth >= BREAKPOINT)
    useEffect(() => {
        const handler = () => setIsDesktop(window.innerWidth >= BREAKPOINT)
        window.addEventListener("resize", handler)
        return () => window.removeEventListener("resize", handler)
    }, [])
    return isDesktop
}

export default function AdminLayout() {
    const { user, logoutUser } = useAuth()
    const { message } = App.useApp()
    const navigate = useNavigate()
    const location = useLocation()
    const isDesktop = useIsDesktop()
    const [menuOpen, setMenuOpen] = useState(false)

    // Close menu on route change or resize to desktop
    useEffect(() => { setMenuOpen(false) }, [location.pathname])
    useEffect(() => { if (isDesktop) setMenuOpen(false) }, [isDesktop])

    const handleLogout = async () => {
        await logoutUser()
        message.success("Logged out successfully")
        navigate("/login")
    }

    // ── Sidebar content (desktop only) ──────────────────────────
    const SidebarContent = () => (
        <div style={{
            width: SIDEBAR_W, height: "100vh",
            background: "#072649", display: "flex", flexDirection: "column",
            boxShadow: "2px 0 20px rgba(0,0,0,0.18)",
        }}>
            {/* Brand */}
            <div style={{ padding: "1.5rem 1.25rem", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
                <Link to="/admin/dashboard"
                    style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{
                        width: 34, height: 34, borderRadius: 9,
                        background: "linear-gradient(135deg,#0054a0,#0c87e8)",
                        display: "flex", alignItems: "center", justifyContent: "center", color: "white",
                    }}>
                        <IconTrain />
                    </div>
                    <div>
                        <div style={{ fontFamily: "Sora,sans-serif", fontWeight: 700, color: "white", fontSize: "0.95rem" }}>
                            RailManager
                        </div>
                        <div style={{ fontSize: "0.68rem", color: "#7cc4fb", fontFamily: "JetBrains Mono,monospace" }}>
                            ADMIN PANEL
                        </div>
                    </div>
                </Link>
            </div>

            {/* Nav items */}
            <nav style={{ flex: 1, padding: "1rem 0.75rem", display: "flex", flexDirection: "column", gap: 4 }}>
                {NAV.map(n => {
                    const active = location.pathname === n.to
                    return (
                        <Link key={n.to} to={n.to}
                            style={{
                                display: "flex", alignItems: "center", gap: 10,
                                padding: "10px 14px", borderRadius: 10, textDecoration: "none",
                                color: active ? "white" : "rgba(255,255,255,0.6)",
                                background: active ? "rgba(12,135,232,0.25)" : "transparent",
                                borderLeft: active ? "3px solid #0c87e8" : "3px solid transparent",
                                fontFamily: "DM Sans,sans-serif", fontWeight: active ? 600 : 400,
                                fontSize: "0.9rem", transition: "all 0.15s",
                            }}
                            onMouseEnter={e => { if (!active) e.currentTarget.style.background = "rgba(255,255,255,0.06)" }}
                            onMouseLeave={e => { if (!active) e.currentTarget.style.background = "transparent" }}>
                            <span style={{ color: active ? "#7cc4fb" : "rgba(255,255,255,0.4)" }}>{n.icon}</span>
                            {n.label}
                        </Link>
                    )
                })}
            </nav>

            {/* User + logout */}
            <div style={{ padding: "1rem 0.75rem", borderTop: "1px solid rgba(255,255,255,0.08)" }}>
                <div style={{
                    display: "flex", alignItems: "center", gap: 10,
                    padding: "10px 14px", marginBottom: 6, borderRadius: 10,
                    background: "rgba(255,255,255,0.05)",
                }}>
                    {/* <div style={{
                        width: 32, height: 32, borderRadius: "50%", flexShrink: 0,
                        background: "linear-gradient(135deg,#0054a0,#0c87e8)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        color: "white", fontFamily: "Sora,sans-serif", fontWeight: 700, fontSize: "0.85rem",
                    }}>
                        {user?.username?.[0]?.toUpperCase()}
                    </div> */}
                    <Avatar user={user}/>
                    <div style={{ overflow: "hidden" }}>
                        <div style={{ color: "white", fontFamily: "DM Sans,sans-serif", fontWeight: 600, fontSize: "0.85rem", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                            {user?.username}
                        </div>
                        <div style={{ color: "#7cc4fb", fontSize: "0.68rem", fontFamily: "JetBrains Mono,monospace" }}>ADMIN</div>
                    </div>
                </div>
                <button onClick={handleLogout}
                    style={{ width: "100%", display: "flex", alignItems: "center", gap: 10, padding: "9px 14px", borderRadius: 10, border: "none", background: "transparent", color: "rgba(255,255,255,0.5)", fontFamily: "DM Sans,sans-serif", fontSize: "0.875rem", cursor: "pointer", transition: "all 0.15s" }}
                    onMouseEnter={e => { e.currentTarget.style.background = "rgba(231,74,74,0.15)"; e.currentTarget.style.color = "rgba(255,130,130,0.9)" }}
                    onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "rgba(255,255,255,0.5)" }}>
                    <IconLogout /> Logout
                </button>
            </div>
        </div>
    )

    // ════════════════════════════════════════════════════════════
    return (
        <div style={{ display: "flex", minHeight: "100vh", background: "#f6f7f9" }}>

            {/* ── DESKTOP: fixed sidebar ── */}
            {isDesktop && (
                <div style={{ width: SIDEBAR_W, flexShrink: 0 }}>
                    <div style={{ position: "fixed", top: 0, left: 0, zIndex: 40 }}>
                        <SidebarContent />
                    </div>
                </div>
            )}

            {/* ── MOBILE: top navbar ── */}
            {!isDesktop && (
                <nav style={{
                    position: "fixed", top: 0, left: 0, right: 0, zIndex: 50,
                    height: 62, background: "#072649",
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    padding: "0 1.25rem",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.25)",
                }}>
                    {/* Logo */}
                    <Link to="/admin/dashboard"
                        style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: 10 }}>
                        <div style={{
                            width: 32, height: 32, borderRadius: 9,
                            background: "linear-gradient(135deg,#0054a0,#0c87e8)",
                            display: "flex", alignItems: "center", justifyContent: "center", color: "white",
                        }}>
                            <IconTrain />
                        </div>
                        <div>
                            <div style={{ fontFamily: "Sora,sans-serif", fontWeight: 700, color: "white", fontSize: "0.9rem" }}>
                                RailManager
                            </div>
                            <div style={{ fontSize: "0.6rem", color: "#7cc4fb", fontFamily: "JetBrains Mono,monospace" }}>
                                ADMIN
                            </div>
                        </div>
                    </Link>

                    {/* Avatar + hamburger */}
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        {/* <div style={{
                            width: 32, height: 32, borderRadius: "50%",
                            background: "rgba(255,255,255,0.15)",
                            display: "flex", alignItems: "center", justifyContent: "center",
                            color: "white", fontFamily: "Sora,sans-serif", fontWeight: 700, fontSize: "0.85rem",
                        }}>
                            {user?.username?.[0]?.toUpperCase()}
                        </div> */}
                        <Avatar user={user}/>
                        <button
                            onClick={() => setMenuOpen(v => !v)}
                            style={{
                                background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)",
                                borderRadius: 8, padding: "5px 7px", color: "white",
                                cursor: "pointer", display: "flex", alignItems: "center",
                            }}>
                            {menuOpen ? <IconClose /> : <IconMenu />}
                        </button>
                    </div>
                </nav>
            )}

            {/* ── MOBILE: dropdown menu ── */}
            {!isDesktop && menuOpen && (
                <>
                    {/* Backdrop */}
                    <div
                        onClick={() => setMenuOpen(false)}
                        style={{ position: "fixed", inset: 0, zIndex: 44, background: "rgba(0,0,0,0.35)" }}
                    />
                    {/* Dropdown panel */}
                    <div style={{
                        position: "fixed", top: 62, left: 0, right: 0,
                        zIndex: 45, background: "#072649",
                        borderBottom: "1px solid rgba(255,255,255,0.08)",
                        boxShadow: "0 8px 24px rgba(0,0,0,0.3)",
                        padding: "0.75rem 1rem",
                    }}>
                        {/* User info */}
                        <div style={{
                            display: "flex", alignItems: "center", gap: 10,
                            padding: "10px 12px", borderRadius: 10,
                            background: "rgba(255,255,255,0.06)", marginBottom: "0.75rem",
                        }}>
                            {/* <div style={{
                                width: 34, height: 34, borderRadius: "50%", flexShrink: 0,
                                background: "linear-gradient(135deg,#0054a0,#0c87e8)",
                                display: "flex", alignItems: "center", justifyContent: "center",
                                color: "white", fontFamily: "Sora,sans-serif", fontWeight: 700, fontSize: "0.9rem",
                            }}>
                                {user?.username?.[0]?.toUpperCase()}
                            </div> */}
                            <Avatar user={user}/>
                            <div>
                                <div style={{ color: "white", fontFamily: "DM Sans,sans-serif", fontWeight: 600, fontSize: "0.9rem" }}>
                                    {user?.username}
                                </div>
                                <div style={{ color: "#7cc4fb", fontSize: "0.65rem", fontFamily: "JetBrains Mono,monospace" }}>ADMIN</div>
                            </div>
                        </div>

                        {/* Nav links */}
                        {NAV.map(n => {
                            const active = location.pathname === n.to
                            return (
                                <Link key={n.to} to={n.to}
                                    style={{
                                        display: "flex", alignItems: "center", gap: 10,
                                        padding: "11px 12px", borderRadius: 9, textDecoration: "none",
                                        color: active ? "white" : "rgba(255,255,255,0.7)",
                                        background: active ? "rgba(12,135,232,0.3)" : "transparent",
                                        fontFamily: "DM Sans,sans-serif", fontWeight: active ? 600 : 400,
                                        fontSize: "0.9rem", marginBottom: 4, transition: "background 0.15s",
                                    }}>
                                    <span style={{ color: active ? "#7cc4fb" : "rgba(255,255,255,0.4)" }}>{n.icon}</span>
                                    {n.label}
                                </Link>
                            )
                        })}

                        {/* Divider */}
                        <div style={{ borderTop: "1px solid rgba(255,255,255,0.08)", margin: "0.5rem 0" }} />

                        {/* Logout */}
                        <button onClick={handleLogout}
                            style={{
                                width: "100%", display: "flex", alignItems: "center", gap: 10,
                                padding: "11px 12px", borderRadius: 9, border: "none",
                                background: "transparent", color: "rgba(255,120,120,0.85)",
                                fontFamily: "DM Sans,sans-serif", fontWeight: 500, fontSize: "0.9rem",
                                cursor: "pointer", transition: "background 0.15s",
                            }}
                            onMouseEnter={e => e.currentTarget.style.background = "rgba(231,74,74,0.15)"}
                            onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                            <IconLogout /> Logout
                        </button>
                    </div>
                </>
            )}

            {/* ── Main content ── */}
            <main style={{
                flex: 1,
                paddingTop: isDesktop ? 0 : 62,
                minWidth: 0,
            }}>
                <Outlet />
            </main>
        </div>
    )
}