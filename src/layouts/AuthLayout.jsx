import React from "react"
import { Outlet, Navigate, Link } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { Train } from "lucide-react"

export default function AuthLayout() {
    const { isAuthenticated } = useAuth()

    // Already logged in — redirect to dashboard
    if (isAuthenticated) return <Navigate to="/dashboard" replace />

    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-br from-rail-950 to-rail-700">

            {/* ── Navbar ───────────────────────────── */}
            <nav className="absolute top-0 left-0 right-0 z-50 flex items-center justify-between px-6 sm:px-10 py-4">
                {/* Logo */}
                <Link to="/" className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-lg flex items-center justify-center bg-rail-700/80 text-white shadow-sm">
                        <Train size={20} />
                    </div>
                    <span className="font-display font-bold text-rail-100 text-lg">
                        RailManager
                    </span>
                </Link>
            </nav>

            {/* ── Auth page content ────────────────── */}
            <Outlet />
        </div>
    )
}