import React, { useState, useEffect } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Train, Menu, X } from "lucide-react";

export default function HomeLayout() {
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const [scrolled, setScrolled] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener("scroll", onScroll);
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    const btnGradient =
        "rounded-lg font-semibold px-5 py-2 transition-opacity shadow-md text-white bg-gradient-to-br from-rail-700 to-rail-500 hover:opacity-85";

    return (
        <div className="flex flex-col min-h-screen bg-gray-100">
            {/* Navbar */}
            <nav
                className={`sticky top-0 z-50 flex items-center justify-between px-6 sm:px-8 h-16 transition-all duration-300 ${scrolled
                    ? "bg-white/90 backdrop-blur-md border-b border-gray-200"
                    : "bg-transparent border-b border-transparent"
                    }`}
            >
                {/* Logo */}
                <Link to="/" className="flex items-center gap-2 no-underline">
                    <div className="w-9 h-9 rounded-lg flex items-center justify-center bg-gradient-to-br from-rail-700 to-rail-500 text-white shadow-lg">
                        <Train size={20} />
                    </div>
                    <span className="font-display font-bold text-rail-900 text-lg">
                        RailManager
                    </span>
                </Link>

                {/* Desktop nav links */}
                <div className="hidden sm:flex items-center gap-2">
                    {isAuthenticated ? (
                        <button
                            className={btnGradient}
                            onClick={() => navigate("/dashboard")}
                        >
                            Go to Dashboard
                        </button>
                    ) : (
                        <>
                            <Link
                                to="/login"
                                className="px-4 py-2 rounded-lg border border-gray-300 font-semibold text-rail-700 hover:bg-blue-50 transition"
                            >
                                Sign in
                            </Link>
                            <Link to="/register" className={btnGradient}>
                                Get Started
                            </Link>
                        </>
                    )}
                </div>

                {/* Hamburger menu for sm */}
                <div className="sm:hidden">
                    <button onClick={() => setMobileOpen(!mobileOpen)}>
                        {mobileOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </nav>

            {/* Mobile drawer fixed at top */}
            {mobileOpen && (
                <div className="sm:hidden fixed top-16 left-0 right-0 bg-white border-b border-gray-200 shadow-md flex flex-col items-center gap-3 py-4 z-40">
                    {isAuthenticated ? (
                        <button
                            className={btnGradient}
                            onClick={() => navigate("/dashboard")}
                        >
                            Go to Dashboard
                        </button>
                    ) : (
                        <div className="flex flex-col gap-3 w-full px-6">
                            <Link
                                to="/login"
                                className="w-full text-center px-4 py-2 rounded-lg border border-gray-300 font-semibold text-rail-700 hover:bg-blue-50 transition"
                                onClick={() => setMobileOpen(false)}
                            >
                                Sign in
                            </Link>
                            <Link
                                to="/register"
                                className={btnGradient + " text-center w-full"}
                                onClick={() => setMobileOpen(false)}
                            >
                                Get Started
                            </Link>
                        </div>
                    )}
                </div>
            )}

            {/* Main content */}
            <main className="flex-1">
                <Outlet />
            </main>

            {/* Footer */}
            <footer className="bg-rail-950 text-white py-12 px-6">
                <div className="max-w-6xl mx-auto flex flex-col gap-12">
                    {/* Top row */}
                    <div className="flex flex-wrap justify-between gap-8">
                        {/* Brand */}
                        <div className="max-w-xs">
                            <div className="flex items-center gap-2 mb-3">
                                <div className="w-9 h-9 rounded-lg flex items-center justify-center bg-white/20">
                                    <Train size={20} />
                                </div>
                                <span className="font-display font-bold text-lg">RailManager</span>
                            </div>
                            <p className="text-blue-200 text-sm leading-relaxed">
                                A full-stack train management system built with Node.js, React, MySQL, and JWT authentication.
                            </p>
                        </div>

                        {/* Navigation */}
                        <div>
                            <p className="font-display font-semibold text-xs text-blue-300 uppercase tracking-wide mb-3">
                                Navigation
                            </p>
                            <div className="flex flex-col gap-2">
                                {[
                                    ["Home", "/"],
                                    ["Sign In", "/login"],
                                    ["Register", "/register"],
                                ].map(([label, to]) => (
                                    <Link
                                        key={label}
                                        to={to}
                                        className="text-blue-200 hover:text-white text-sm transition"
                                    >
                                        {label}
                                    </Link>
                                ))}
                            </div>
                        </div>

                        {/* Tech stack */}
                        <div>
                            <p className="font-display font-semibold text-xs text-blue-300 uppercase tracking-wide mb-3">
                                Tech Stack
                            </p>
                            <div className="flex flex-col gap-1 text-blue-200 text-sm">
                                {["React 19 + Vite 6", "Tailwind CSS v4", "Ant Design v6"].map(
                                    (t) => (
                                        <div key={t}>{t}</div>
                                    )
                                )}
                            </div>
                        </div>

                        {/* CTA */}
                        <div className="flex flex-col justify-center">
                            <p className="font-display font-semibold text-white mb-4">
                                Ready to get started?
                            </p>
                            <Link to="/register" className={btnGradient + " text-center"}>
                                Create Free Account
                            </Link>
                        </div>
                    </div>

                    {/* Bottom row */}
                    <div className="border-t border-white/20 pt-6 flex flex-wrap justify-between items-center gap-4">
                        <p className="text-gray-400 text-xs">
                            © {new Date().getFullYear()} RailManager. Built for academic demonstration purposes.
                        </p>
                        <div className="flex gap-6">
                            {["Privacy Policy", "Terms of Service"].map((l) => (
                                <span key={l} className="text-gray-400 text-xs cursor-pointer">
                                    {l}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}