import React, { useState, useEffect } from "react";
import { Outlet, Link, useNavigate, useLocation } from "react-router-dom";
import { App } from "antd";
import {
    Train,
    LayoutDashboard,
    Users,
    KeyRound,
    LogOut,
    Menu,
    X
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import Avatar from "../components/Avatar";

const SIDEBAR_W = 240;
const BREAKPOINT = 1024;

const NAV = [
    { label: "Dashboard", to: "/admin/dashboard", icon: LayoutDashboard },
    { label: "Users", to: "/admin/users", icon: Users },
    { label: "Manage Trains", to: "/admin/trains", icon: Train },
    { label: "Edit Profile", to: "/admin/edit-profile", icon: KeyRound },
];

function useIsDesktop() {
    const [isDesktop, setIsDesktop] = useState(window.innerWidth >= BREAKPOINT);
    useEffect(() => {
        const handler = () => setIsDesktop(window.innerWidth >= BREAKPOINT);
        window.addEventListener("resize", handler);
        return () => window.removeEventListener("resize", handler);
    }, []);
    return isDesktop;
}

export default function AdminLayout() {
    const { user, logoutUser } = useAuth();
    const { message } = App.useApp();
    const navigate = useNavigate();
    const location = useLocation();
    const isDesktop = useIsDesktop();
    const [menuOpen, setMenuOpen] = useState(false);

    // Close menu on route change or resize to desktop
    useEffect(() => {
        setMenuOpen(false);
    }, [location.pathname]);

    useEffect(() => {
        if (isDesktop) setMenuOpen(false);
    }, [isDesktop]);

    const handleLogout = async () => {
        await logoutUser();
        message.success("Logged out successfully");
        navigate("/login");
    };

    // ── Sidebar content (desktop only) ──────────────────────────
    const SidebarContent = () => (
        <div className="w-60 h-screen bg-[#072649] flex flex-col shadow-[2px_0_20px_rgba(0,0,0,0.18)]">
            {/* Brand */}
            <div className="px-5 py-6 border-b border-white/8">
                <Link
                    to="/"
                    className="no-underline flex items-center gap-2.5"
                >
                    <div className="w-[34px] h-[34px] rounded-[9px] bg-gradient-to-br from-[#0054a0] to-[#0c87e8] flex items-center justify-center text-white">
                        <Train size={18} />
                    </div>
                    <div>
                        <div className="font-display font-bold text-white text-[0.95rem]">
                            RailManager
                        </div>
                        <div className="text-[0.68rem] text-[#7cc4fb] font-mono">
                            ADMIN PANEL
                        </div>
                    </div>
                </Link>
            </div>

            {/* Nav items */}
            <nav className="flex-1 px-3 py-4 flex flex-col gap-1">
                {NAV.map((n) => {
                    const active = location.pathname === n.to;
                    const IconComponent = n.icon;
                    return (
                        <Link
                            key={n.to}
                            to={n.to}
                            style={{
                                display: "flex", alignItems: "center", gap: 10,
                                padding: "11px 12px", borderRadius: 9, textDecoration: "none",
                                color: active ? "white" : "rgba(255,255,255,0.7)",
                                background: active ? "rgba(12,135,232,0.3)" : "transparent",
                                fontFamily: "DM Sans,sans-serif", fontWeight: active ? 600 : 400,
                                fontSize: "0.9rem", marginBottom: 4, transition: "background 0.15s",
                            }}
                        >
                            <IconComponent size={18} className={active ? "text-[#7cc4fb]" : "text-white/40"} />
                            {n.label}
                        </Link>
                    );
                })}
            </nav>

            {/* User + logout */}
            <div className="px-3 py-4 border-t border-white/8">
                <div className="flex items-center gap-2.5 px-3.5 py-2.5 mb-1.5 rounded-[10px] bg-white/5">
                    <Avatar user={user} />
                    <div className="overflow-hidden">
                        <div className="text-white font-body font-semibold text-[0.85rem] whitespace-nowrap overflow-hidden text-ellipsis">
                            {user?.username}
                        </div>
                        <div className="text-[#7cc4fb] text-[0.68rem] font-mono">ADMIN</div>
                    </div>
                </div>
                <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2.5 px-3.5 py-2 rounded-[10px] border-none bg-transparent text-white/50 font-body text-[0.875rem] cursor-pointer transition-all duration-150 hover:bg-[rgba(231,74,74,0.15)] hover:text-[rgba(255,130,130,0.9)]"
                >
                    <LogOut size={16} />
                    Logout
                </button>
            </div>
        </div>
    );

    // ════════════════════════════════════════════════════════════
    return (
        <div className="flex min-h-screen bg-gray-50">
            {/* ── DESKTOP: fixed sidebar ── */}
            {isDesktop && (
                <div className="w-60 flex-shrink-0">
                    <div className="fixed top-0 left-0 z-40">
                        <SidebarContent />
                    </div>
                </div>
            )}

            {/* ── MOBILE: top navbar ── */}
            {!isDesktop && (
                <nav className="fixed top-0 left-0 right-0 z-50 h-[62px] bg-[#072649] flex items-center justify-between px-5 shadow-[0_2px_8px_rgba(0,0,0,0.25)]">
                    {/* Logo */}
                    <Link
                        to="/admin/dashboard"
                        className="no-underline flex items-center gap-2.5"
                    >
                        <div className="w-8 h-8 rounded-[9px] bg-gradient-to-br from-[#0054a0] to-[#0c87e8] flex items-center justify-center text-white">
                            <Train size={18} />
                        </div>
                        <div>
                            <div className="font-display font-bold text-white text-[0.9rem]">
                                RailManager
                            </div>
                            <div className="text-[0.6rem] text-[#7cc4fb] font-mono">
                                ADMIN
                            </div>
                        </div>
                    </Link>

                    {/* Avatar + hamburger */}
                    <div className="flex items-center gap-2.5">
                        <Avatar user={user} />
                        <button
                            onClick={() => setMenuOpen((v) => !v)}
                            className="bg-white/10 border border-white/20 rounded-lg px-1.5 py-1 text-white cursor-pointer flex items-center"
                        >
                            {menuOpen ? <X size={22} /> : <Menu size={22} />}
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
                        className="fixed inset-0 z-[44] bg-black/35"
                    />

                    {/* Dropdown panel */}
                    <div className="fixed top-[62px] left-0 right-0 z-[45] bg-[#072649] border-b border-white/8 shadow-[0_8px_24px_rgba(0,0,0,0.3)] px-4 py-3">
                        {/* User info */}
                        <div className="flex items-center gap-2.5 px-3 py-2.5 rounded-[10px] bg-white/6 mb-3">
                            <Avatar user={user} />
                            <div>
                                <div className="text-white font-body font-semibold text-[0.9rem]">
                                    {user?.username}
                                </div>
                                <div className="text-[#7cc4fb] text-[0.65rem] font-mono">ADMIN</div>
                            </div>
                        </div>

                        {/* Nav links */}
                        {NAV.map((n) => {
                            const active = location.pathname === n.to;
                            const IconComponent = n.icon;
                            return (
                                <Link
                                    key={n.to}
                                    to={n.to}
                                    style={{
                                        display: "flex", alignItems: "center", gap: 10,
                                        padding: "11px 12px", borderRadius: 9, textDecoration: "none",
                                        color: active ? "white" : "rgba(255,255,255,0.7)",
                                        background: active ? "rgba(12,135,232,0.3)" : "transparent",
                                        fontFamily: "DM Sans,sans-serif", fontWeight: active ? 600 : 400,
                                        fontSize: "0.9rem", marginBottom: 4, transition: "background 0.15s",
                                    }}>
                                    <IconComponent size={18} className={active ? "text-[#7cc4fb]" : "text-white/40"} />
                                    {n.label}
                                </Link>
                            );
                        })}

                        {/* Divider */}
                        <div className="border-t border-white/8 my-2" />

                        {/* Logout */}
                        <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-2.5 px-3 py-3 rounded-[9px] border-none bg-transparent text-[rgba(255,120,120,0.85)] font-body font-medium text-[0.9rem] cursor-pointer transition-colors duration-150 hover:bg-[rgba(231,74,74,0.15)]"
                        >
                            <LogOut size={16} />
                            Logout
                        </button>
                    </div>
                </>
            )}

            {/* ── Main content ── */}
            <main className="flex-1 min-w-0" style={{ paddingTop: isDesktop ? 0 : 62 }}>
                <Outlet />
            </main>
        </div>
    );
}