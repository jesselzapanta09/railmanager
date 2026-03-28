import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import {
    Shield,
    Zap,
    Database,
    Calendar,
    Cpu,
    Train,
    ChevronRight,
    Check
} from "lucide-react";
import { getAbout } from "./services/api";

export default function Home() {
    const { isAuthenticated } = useAuth();
    const heroRef = useRef(null);

    const [aboutText, setAboutText] = useState("");
    const [subtitle, setSubtitle] = useState("");

    useEffect(() => {
        async function fetchAbout() {
            try {
                const { data } = await getAbout();
                setAboutText(data.title);
                setSubtitle(data.subtitle);
            } catch (err) {
                console.error("Failed to fetch about:", err);
                setAboutText("");
            }
        }
        fetchAbout();
    }, []);


    // Parallax subtle scroll on hero
    useEffect(() => {
        const onScroll = () => {
            if (heroRef.current) {
                heroRef.current.style.transform = `translateY(${window.scrollY * 0.25}px)`;
            }
        };
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    return (
        <div className="font-body">
            {/* HERO */}
            <section className="relative min-h-screen flex items-center overflow-hidden bg-linear-to-br from-rail-950 via-rail-900 to-rail-700">
                {/* Decorative background */}
                <div ref={heroRef} className="absolute inset-0 pointer-events-none overflow-hidden">
                    <div className="absolute top-[-15%] right-[-10%] w-175 h-175 rounded-full bg-rail-500/10 border border-white/5" />
                    <div className="absolute bottom-[-20%] left-[-8%] w-125 h-125 rounded-full bg-rail-700/20 border border-white/5" />
                    <div className="absolute top-[30%] left-[5%] w-80 h-80 rounded-full bg-rail-500/5" />
                    {/* Grid dots */}
                    <svg className="absolute inset-0 opacity-[0.04]" width="100%" height="100%">
                        <defs>
                            <pattern id="dots" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
                                <circle cx="2" cy="2" r="1.5" fill="white" />
                            </pattern>
                        </defs>
                        <rect width="100%" height="100%" fill="url(#dots)" />
                    </svg>
                </div>

                {/* Hero content */}
                <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 pt-32 pb-20 w-full flex flex-wrap gap-12 items-center">
                    {/* Left text */}
                    <div className="flex-1 min-w-75 max-w-150">
                        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full mb-6 bg-sky-400/10 border border-sky-400/25">
                            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                            <span className="text-sky-300 text-xs font-mono font-medium">
                                FULL-STACK DEMO PROJECT
                            </span>
                        </div>

                        <h1 className="font-display font-extrabold text-white text-4xl sm:text-5xl md:text-6xl lg:text-7xl leading-tight mb-6 tracking-tight">
                            Modern Train <br />
                            <span className="text-sky-300">Fleet Management</span> <br />
                            System
                        </h1>

                        <p className="text-blue-200 text-lg leading-relaxed max-w-lg mb-10">
                            A complete REST API + React dashboard for managing train records.
                        </p>

                        <div className="flex flex-wrap gap-3">
                            <Link
                                to={isAuthenticated ? "/dashboard" : "/register"}
                                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-linear-to-br from-rail-700 to-rail-500 text-white font-bold shadow-xl shadow-rail-500/40 transition-transform hover:-translate-y-0.5 hover:shadow-2xl hover:shadow-rail-500/50"
                            >
                                {isAuthenticated ? "Go to Dashboard" : "Get Started Free"}
                                <ChevronRight className="w-4 h-4" />
                            </Link>
                            <Link
                                to="/login"
                                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-white/10 text-white font-semibold border border-white/20 transition-all hover:bg-white/20 hover:border-white/40"
                            >
                                Sign In
                            </Link>
                        </div>

                        {/* About */}
                        <div className="flex flex-wrap gap-4 mt-8 sm:gap-6 sm:mt-10 md:gap-8 md:mt-12">
                            <div className="w-full sm:w-auto">
                                <div className="font-display font-bold text-2xl sm:text-3xl md:text-4xl text-white">
                                    {aboutText || "Loading..."}
                                </div>
                                <div className="text-sky-300 text-sm sm:text-md md:text-lg mt-1 sm:mt-1.5 md:mt-2">
                                    {subtitle}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right floating card */}
                    <div className="flex-1 min-w-62.5 max-w-sm flex justify-center">
                        <div className="bg-white/5 rounded-3xl border border-white/10 p-6 w-full backdrop-blur-xl shadow-2xl">
                            <div className="flex justify-between items-center mb-4">
                                <span className="font-semibold text-white text-sm">Train Fleet</span>
                                <div className="px-3 py-1 rounded-lg bg-rail-500/30 text-sky-300 text-xs font-semibold">3 records</div>
                            </div>
                            {/* Rows */}
                            {[
                                { name: "LRT Line 1", price: "₱30.00", route: "Baclaran – Roosevelt", colorClass: "text-green-400" },
                                { name: "MRT Line 3", price: "₱35.00", route: "Taft Ave – North EDSA", colorClass: "text-blue-400" },
                                { name: "PNR Commuter", price: "₱50.00", route: "Tutuban – Calamba", colorClass: "text-amber-400" }
                            ].map((t, i) => (
                                <div key={i} className="px-4 py-3 rounded-xl mb-2 bg-white/5 border border-white/10 flex justify-between items-center">
                                    <div>
                                        <div className="font-semibold text-white text-sm">{t.name}</div>
                                        <div className="text-white/50 text-xs mt-0.5">{t.route}</div>
                                    </div>
                                    <div className={`font-mono font-semibold text-sm ${t.colorClass}`}>{t.price}</div>
                                </div>
                            ))}
                            <div className="flex gap-2 mt-2">
                                <div className="flex-1 px-2 py-2 rounded-lg bg-rail-500/25 text-center text-sky-300 text-xs font-semibold">
                                    + Add Train
                                </div>
                                <div className="flex-1 px-2 py-2 rounded-lg bg-white/5 text-center text-white/50 text-xs">
                                    Export
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom wave */}
                <div className="absolute bottom-0 left-0 right-0">
                    <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="block w-full">
                        <path d="M0 40C240 80 480 0 720 40C960 80 1200 0 1440 40V80H0V40Z" fill="#DBEAFE" />
                    </svg>
                </div>
            </section>


            {/* TECH STACK */}
            <section className="py-14 px-6 sm:px-8 bg-blue-100 border-b border-blue-200">
                <div className="max-w-7xl mx-auto text-center">
                    <p className="text-steel-800 text-xs font-mono tracking-widest mb-6 uppercase">Frontend Built With</p>
                    <div className="flex flex-wrap justify-center gap-3">
                        {[
                            { label: "React 19", color: "text-blue-600", bg: "bg-blue-50" },
                            { label: "Vite 6", color: "text-purple-600", bg: "bg-purple-50" },
                            { label: "Tailwind CSS v4", color: "text-sky-600", bg: "bg-sky-50" },
                            { label: "Ant Design v6", color: "text-orange-600", bg: "bg-orange-50" },
                            { label: "Axios", color: "text-green-600", bg: "bg-green-50" },
                            { label: "React Router 6", color: "text-red-600", bg: "bg-red-50" },
                        ].map(t => (
                            <span key={t.label} className={`px-5 py-2 rounded-full font-semibold text-sm ${t.color} ${t.bg}`}>{t.label}</span>
                        ))}
                    </div>
                </div>
            </section>

            {/* FEATURES */}
            <section className="py-24 px-6 sm:px-8 bg-gray-50">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-14">
                        <div className="inline-block px-4 py-1 rounded-full mb-3.5 bg-blue-100 text-rail-700 text-xs font-mono font-semibold tracking-wider uppercase">Features</div>
                        <h2 className="font-display font-bold text-4xl md:text-5xl text-rail-900 mb-3">Everything you need</h2>
                        <p className="text-steel-500 text-lg max-w-lg mx-auto">
                            A production-grade API and frontend covering authentication, CRUD, and data management.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[
                            { icon: Shield, color: "text-blue-600", bg: "bg-blue-50", title: "JWT Authentication", desc: "Secure login and registration with JSON Web Tokens. Tokens are blacklisted on logout for full session control." },
                            { icon: Database, color: "text-green-600", bg: "bg-green-50", title: "MySQL Database", desc: "Three relational tables — users, trains, and token blacklist — with full CRUD operations via Express routes." },
                            { icon: Calendar, color: "text-purple-600", bg: "bg-purple-50", title: "Train Management", desc: "Add, edit, delete, and search trains by name, price, and route. Sortable table with pagination." },
                            { icon: Zap, color: "text-orange-600", bg: "bg-orange-50", title: "Vite + React 19", desc: "Blazing-fast development with Vite 6, React 19, and hot module replacement. Production builds in seconds." },
                            { icon: Cpu, color: "text-sky-600", bg: "bg-sky-50", title: "REST API", desc: "RESTful endpoints covering register, login, logout, and full train CRUD. Tested with Postman." },
                            { icon: Train, color: "text-blue-600", bg: "bg-blue-50", title: "Ant Design v6", desc: "Professional UI components — forms, tables, modals, and notifications — styled with Tailwind CSS v4." },
                        ].map((f, i) => {
                            const Icon = f.icon;
                            return (
                                <div key={i} className="bg-white rounded-2xl p-7 border border-gray-200 shadow-sm hover:-translate-y-1 hover:shadow-xl transition-all">
                                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${f.color} ${f.bg}`}>
                                        <Icon className="w-6 h-6" />
                                    </div>
                                    <h3 className="font-display font-semibold text-lg text-rail-900 mb-2">{f.title}</h3>
                                    <p className="text-steel-500 text-sm leading-relaxed">{f.desc}</p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>
        </div>
    );
}