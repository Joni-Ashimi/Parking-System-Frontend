"use client";

import {useEffect, useRef, useState} from "react";
import Link from "next/link";
import {
    ArrowRight,
    Bike,
    Car,
    CreditCard,
    LogIn,
    ParkingSquare,
    Search,
    ShieldCheck,
    Sparkles,
    Truck,
    UserPlus,
    Zap,
} from "lucide-react";

function ParkingLotScene() {
    return (
        <svg
            width="100%"
            height="260"
            viewBox="0 0 620 260"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full"
        >
            <defs>
                <linearGradient id="roadGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#1e293b"/>
                    <stop offset="100%" stopColor="#0f172a"/>
                </linearGradient>
                <linearGradient id="slotFree" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="rgba(34,197,94,0.25)"/>
                    <stop offset="100%" stopColor="rgba(34,197,94,0.08)"/>
                </linearGradient>
                <linearGradient id="slotOcc" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="rgba(239,68,68,0.25)"/>
                    <stop offset="100%" stopColor="rgba(239,68,68,0.08)"/>
                </linearGradient>
                <linearGradient id="slotSel" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="rgba(99,102,241,0.4)"/>
                    <stop offset="100%" stopColor="rgba(99,102,241,0.15)"/>
                </linearGradient>
                <linearGradient id="carBlue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#60a5fa"/>
                    <stop offset="100%" stopColor="#2563eb"/>
                </linearGradient>
                <linearGradient id="carRed" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#f87171"/>
                    <stop offset="100%" stopColor="#dc2626"/>
                </linearGradient>
                <linearGradient id="carGray" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#94a3b8"/>
                    <stop offset="100%" stopColor="#475569"/>
                </linearGradient>
            </defs>

            <rect x="0" y="100" width="620" height="160" fill="url(#roadGrad)" rx="4"/>
            <line x1="310" y1="105" x2="310" y2="260" stroke="rgba(255,255,255,0.06)" strokeWidth="1.5"
                  strokeDasharray="12,10"/>
            <line x1="60" y1="100" x2="0" y2="260" stroke="rgba(255,255,255,0.04)" strokeWidth="1"/>
            <line x1="560" y1="100" x2="620" y2="260" stroke="rgba(255,255,255,0.04)" strokeWidth="1"/>

            <rect x="42" y="108" width="72" height="36" rx="3" fill="url(#slotOcc)" stroke="rgba(239,68,68,0.5)"
                  strokeWidth="0.5"/>
            <text x="78" y="120" textAnchor="middle" fill="rgba(239,68,68,0.8)" fontSize="8" fontWeight="500">A1</text>
            <rect x="52" y="116" width="52" height="22" rx="4" fill="url(#carRed)" opacity="0.9"/>
            <rect x="58" y="119" width="40" height="12" rx="2" fill="rgba(0,0,0,0.25)"/>
            <circle cx="57" cy="139" r="3.5" fill="#1e293b" stroke="#475569" strokeWidth="0.5"/>
            <circle cx="99" cy="139" r="3.5" fill="#1e293b" stroke="#475569" strokeWidth="0.5"/>

            <rect x="120" y="108" width="72" height="36" rx="3" fill="url(#slotFree)" stroke="rgba(34,197,94,0.4)"
                  strokeWidth="0.5"/>
            <text x="156" y="128" textAnchor="middle" fill="rgba(34,197,94,0.9)" fontSize="9" fontWeight="600">A2</text>
            <text x="156" y="139" textAnchor="middle" fill="rgba(34,197,94,0.6)" fontSize="7">FREE</text>

            <rect x="198" y="108" width="72" height="36" rx="3" fill="url(#slotOcc)" stroke="rgba(239,68,68,0.5)"
                  strokeWidth="0.5"/>
            <text x="234" y="120" textAnchor="middle" fill="rgba(239,68,68,0.8)" fontSize="8" fontWeight="500">A3</text>
            <rect x="208" y="116" width="52" height="22" rx="4" fill="url(#carBlue)" opacity="0.9"/>
            <rect x="214" y="119" width="40" height="12" rx="2" fill="rgba(0,0,0,0.25)"/>
            <circle cx="213" cy="139" r="3.5" fill="#1e293b" stroke="#475569" strokeWidth="0.5"/>
            <circle cx="255" cy="139" r="3.5" fill="#1e293b" stroke="#475569" strokeWidth="0.5"/>

            <rect x="276" y="108" width="72" height="36" rx="3" fill="url(#slotSel)" stroke="rgba(99,102,241,0.7)"
                  strokeWidth="1">
                <animate attributeName="strokeOpacity" values="0.7;1;0.7" dur="2s" repeatCount="indefinite"/>
            </rect>
            <text x="312" y="120" textAnchor="middle" fill="#a5b4fc" fontSize="8" fontWeight="600">A4</text>
            <text x="312" y="132" textAnchor="middle" fill="#818cf8" fontSize="7">SELECTED</text>
            <circle cx="312" cy="139" r="4" fill="rgba(99,102,241,0.4)" stroke="#818cf8" strokeWidth="0.8">
                <animate attributeName="r" values="4;6;4" dur="2s" repeatCount="indefinite"/>
                <animate attributeName="opacity" values="1;0.5;1" dur="2s" repeatCount="indefinite"/>
            </circle>

            <rect x="354" y="108" width="72" height="36" rx="3" fill="url(#slotOcc)" stroke="rgba(239,68,68,0.5)"
                  strokeWidth="0.5"/>
            <text x="390" y="120" textAnchor="middle" fill="rgba(239,68,68,0.8)" fontSize="8" fontWeight="500">A5</text>
            <rect x="364" y="116" width="52" height="22" rx="4" fill="url(#carGray)" opacity="0.9"/>
            <rect x="370" y="119" width="40" height="12" rx="2" fill="rgba(0,0,0,0.25)"/>
            <circle cx="369" cy="139" r="3.5" fill="#1e293b" stroke="#475569" strokeWidth="0.5"/>
            <circle cx="411" cy="139" r="3.5" fill="#1e293b" stroke="#475569" strokeWidth="0.5"/>

            <rect x="432" y="108" width="72" height="36" rx="3" fill="url(#slotFree)" stroke="rgba(34,197,94,0.4)"
                  strokeWidth="0.5"/>
            <text x="468" y="128" textAnchor="middle" fill="rgba(34,197,94,0.9)" fontSize="9" fontWeight="600">A6</text>
            <text x="468" y="139" textAnchor="middle" fill="rgba(34,197,94,0.6)" fontSize="7">FREE</text>

            <rect x="510" y="108" width="72" height="36" rx="3" fill="url(#slotFree)" stroke="rgba(34,197,94,0.4)"
                  strokeWidth="0.5"/>
            <text x="546" y="128" textAnchor="middle" fill="rgba(34,197,94,0.9)" fontSize="9" fontWeight="600">A7</text>
            <text x="546" y="139" textAnchor="middle" fill="rgba(34,197,94,0.6)" fontSize="7">FREE</text>

            <rect x="10" y="168" width="88" height="48" rx="4" fill="url(#slotFree)" stroke="rgba(34,197,94,0.4)"
                  strokeWidth="0.5"/>
            <text x="54" y="194" textAnchor="middle" fill="rgba(34,197,94,0.9)" fontSize="10" fontWeight="600">B1</text>
            <text x="54" y="207" textAnchor="middle" fill="rgba(34,197,94,0.6)" fontSize="8">FREE</text>

            <rect x="108" y="168" width="88" height="48" rx="4" fill="url(#slotOcc)" stroke="rgba(239,68,68,0.5)"
                  strokeWidth="0.5"/>
            <text x="152" y="176" textAnchor="middle" fill="rgba(239,68,68,0.8)" fontSize="9" fontWeight="500">B2</text>
            <rect x="118" y="180" width="68" height="30" rx="5" fill="url(#carBlue)" opacity="0.9"/>
            <rect x="126" y="184" width="52" height="16" rx="2.5" fill="rgba(0,0,0,0.28)"/>
            <circle cx="122" cy="212" r="5" fill="#1e293b" stroke="#475569" strokeWidth="0.5"/>
            <circle cx="182" cy="212" r="5" fill="#1e293b" stroke="#475569" strokeWidth="0.5"/>

            <rect x="206" y="168" width="88" height="48" rx="4" fill="url(#slotOcc)" stroke="rgba(239,68,68,0.5)"
                  strokeWidth="0.5"/>
            <text x="250" y="176" textAnchor="middle" fill="rgba(239,68,68,0.8)" fontSize="9" fontWeight="500">B3</text>
            <rect x="216" y="180" width="68" height="30" rx="5" fill="url(#carGray)" opacity="0.9"/>
            <rect x="224" y="184" width="52" height="16" rx="2.5" fill="rgba(0,0,0,0.28)"/>
            <circle cx="220" cy="212" r="5" fill="#1e293b" stroke="#475569" strokeWidth="0.5"/>
            <circle cx="280" cy="212" r="5" fill="#1e293b" stroke="#475569" strokeWidth="0.5"/>

            <rect x="304" y="168" width="88" height="48" rx="4" fill="url(#slotFree)" stroke="rgba(34,197,94,0.4)"
                  strokeWidth="0.5"/>
            <text x="348" y="194" textAnchor="middle" fill="rgba(34,197,94,0.9)" fontSize="10" fontWeight="600">B4
            </text>
            <text x="348" y="207" textAnchor="middle" fill="rgba(34,197,94,0.6)" fontSize="8">FREE</text>

            <rect x="402" y="168" width="88" height="48" rx="4" fill="url(#slotOcc)" stroke="rgba(239,68,68,0.5)"
                  strokeWidth="0.5"/>
            <text x="446" y="176" textAnchor="middle" fill="rgba(239,68,68,0.8)" fontSize="9" fontWeight="500">B5</text>
            <rect x="412" y="180" width="68" height="30" rx="5" fill="url(#carRed)" opacity="0.9"/>
            <rect x="420" y="184" width="52" height="16" rx="2.5" fill="rgba(0,0,0,0.28)"/>
            <circle cx="416" cy="212" r="5" fill="#1e293b" stroke="#475569" strokeWidth="0.5"/>
            <circle cx="476" cy="212" r="5" fill="#1e293b" stroke="#475569" strokeWidth="0.5"/>

            <rect x="500" y="168" width="112" height="48" rx="4" fill="url(#slotFree)" stroke="rgba(34,197,94,0.4)"
                  strokeWidth="0.5"/>
            <text x="556" y="194" textAnchor="middle" fill="rgba(34,197,94,0.9)" fontSize="10" fontWeight="600">B6
            </text>
            <text x="556" y="207" textAnchor="middle" fill="rgba(34,197,94,0.6)" fontSize="8">FREE</text>

            <g>
                <rect x="275" y="228" width="72" height="30" rx="6" fill="url(#carBlue)" opacity="0.95"/>
                <rect x="283" y="233" width="56" height="16" rx="3" fill="rgba(0,0,0,0.28)"/>
                <rect x="283" y="233" width="24" height="16" rx="3" fill="rgba(100,180,255,0.15)"/>
                <rect x="315" y="233" width="24" height="16" rx="3" fill="rgba(100,180,255,0.15)"/>
                <circle cx="284" cy="258" r="6" fill="#1e293b" stroke="#60a5fa" strokeWidth="1">
                    <animateTransform attributeName="transform" type="rotate" from="0 284 258" to="360 284 258"
                                      dur="0.7s" repeatCount="indefinite"/>
                </circle>
                <circle cx="338" cy="258" r="6" fill="#1e293b" stroke="#60a5fa" strokeWidth="1">
                    <animateTransform attributeName="transform" type="rotate" from="0 338 258" to="360 338 258"
                                      dur="0.7s" repeatCount="indefinite"/>
                </circle>
                <rect x="276" y="234" width="6" height="8" rx="2" fill="#fef08a" opacity="0.9">
                    <animate attributeName="opacity" values="0.9;0.5;0.9" dur="1.5s" repeatCount="indefinite"/>
                </rect>
                <rect x="340" y="234" width="6" height="8" rx="2" fill="#fef08a" opacity="0.9">
                    <animate attributeName="opacity" values="0.9;0.5;0.9" dur="1.5s" repeatCount="indefinite"/>
                </rect>
                <animateTransform attributeName="transform" type="translate" values="0,0;0,-90;0,-90" keyTimes="0;0.6;1"
                                  dur="4s" repeatCount="indefinite" calcMode="spline" keySplines="0.4 0 0.2 1;0 0 1 1"/>
            </g>

            <g transform="translate(10, 60)">
                <rect x="0" y="0" width="8" height="8" rx="2" fill="rgba(34,197,94,0.3)" stroke="rgba(34,197,94,0.6)"
                      strokeWidth="0.5"/>
                <text x="12" y="8" fill="rgba(34,197,94,0.9)" fontSize="9">Available</text>
                <rect x="72" y="0" width="8" height="8" rx="2" fill="rgba(239,68,68,0.3)" stroke="rgba(239,68,68,0.6)"
                      strokeWidth="0.5"/>
                <text x="84" y="8" fill="rgba(239,68,68,0.9)" fontSize="9">Occupied</text>
                <rect x="148" y="0" width="8" height="8" rx="2" fill="rgba(99,102,241,0.3)"
                      stroke="rgba(99,102,241,0.7)" strokeWidth="0.5"/>
                <text x="160" y="8" fill="#a5b4fc" fontSize="9">Selected</text>
            </g>

            <g transform="translate(400, 55)">
                <circle cx="6" cy="5" r="3" fill="#4ade80">
                    <animate attributeName="opacity" values="1;0.3;1" dur="1.5s" repeatCount="indefinite"/>
                </circle>
                <text x="14" y="9" fill="#4ade80" fontSize="9" fontWeight="500">Live</text>
            </g>
        </svg>
    );
}

export default function Home() {
    const [selectedVehicle, setSelectedVehicle] = useState<"Bike" | "Car" | "Truck">("Car");
    const [statsVisible, setStatsVisible] = useState(false);
    const statsRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) setStatsVisible(true);
            },
            {threshold: 0.3}
        );
        if (statsRef.current) observer.observe(statsRef.current);
        return () => observer.disconnect();
    }, []);

    const vehicles: { key: "Bike" | "Car" | "Truck"; icon: React.ReactNode; label: string; note: string }[] = [
        {key: "Bike", icon: <Bike className="w-8 h-8"/>, label: "Motorcycles", note: "Compact spots"},
        {key: "Car", icon: <Car className="w-8 h-8"/>, label: "Cars", note: "Standard & EVs"},
        {key: "Truck", icon: <Truck className="w-8 h-8"/>, label: "Trucks & Vans", note: "Oversized bays"},
    ];

    const features = [
        {
            icon: <Search className="w-5 h-5"/>,
            color: "from-blue-500/20 to-blue-600/10",
            iconColor: "text-blue-400",
            title: "Real-Time Spots",
            desc: "See availability the moment it updates, no delays.",
        },
        {
            icon: <Car className="w-5 h-5"/>,
            color: "from-purple-500/20 to-purple-600/10",
            iconColor: "text-purple-400",
            title: "All Vehicle Sizes",
            desc: "Bikes, cars, trucks — smart size-matching included.",
        },
        {
            icon: <CreditCard className="w-5 h-5"/>,
            color: "from-green-500/20 to-green-600/10",
            iconColor: "text-green-400",
            title: "Online Payment",
            desc: "Secure, fast checkout with multiple payment options.",
        },
        {
            icon: <ShieldCheck className="w-5 h-5"/>,
            color: "from-amber-500/20 to-amber-600/10",
            iconColor: "text-amber-400",
            title: "Secure Sessions",
            desc: "Automated tracking from entry to exit.",
        },
    ];

    const steps = [
        {num: "1", title: "Check availability", desc: "Find free spots instantly with live updates."},
        {num: "2", title: "Park your vehicle", desc: "System tracks your session automatically."},
        {num: "3", title: "Pay online", desc: "Quick, secure checkout with multiple options."},
    ];

    return (
        <div
            className="w-full overflow-x-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-gray-900 text-slate-100">

            <header
                className="sticky top-0 z-50 flex items-center justify-between px-6 py-3.5 border-b border-white/[0.07] bg-slate-900/80 backdrop-blur-md">
                <Link href="/" className="flex items-center gap-2 hover:opacity-90 transition-opacity">
                    <div
                        className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                        <ParkingSquare className="w-4 h-4 text-white"/>
                    </div>
                    <span className="font-semibold text-slate-100 tracking-tight">Prometrix</span>
                </Link>
                <nav className="flex items-center gap-2">
                    <Link
                        href="/login"
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 text-sm font-medium text-slate-300 hover:text-slate-100 border border-transparent hover:border-white/15 rounded-lg transition-all"
                    >
                        <LogIn className="w-3.5 h-3.5"/>
                        Sign In
                    </Link>
                    <Link
                        href="/register"
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 rounded-lg transition-all shadow-lg shadow-blue-500/20"
                    >
                        <UserPlus className="w-3.5 h-3.5"/>
                        Sign Up
                    </Link>
                </nav>
            </header>
            <section className="relative overflow-hidden px-6 pt-16 pb-10 text-center">
                <div
                    className="pointer-events-none absolute top-0 left-0 w-72 h-72 -translate-x-1/3 -translate-y-1/3 rounded-full bg-blue-500/10 blur-3xl"/>
                <div
                    className="pointer-events-none absolute bottom-0 right-0 w-72 h-72 translate-x-1/3 translate-y-1/3 rounded-full bg-purple-500/10 blur-3xl"/>
                <div
                    className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full bg-cyan-500/5 blur-3xl"/>

                <div
                    className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/25 mb-5">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse"/>
                    <Sparkles className="w-3.5 h-3.5 text-blue-400"/>
                    <span className="text-sm text-blue-400 font-medium">Smart Parking Solution</span>
                </div>

                <h1 className="text-5xl lg:text-6xl font-bold leading-tight mb-4">
                    <span className="bg-gradient-to-r from-gray-100 to-gray-300 bg-clip-text text-transparent">
                        Smarter Parking
                    </span>
                    <br/>
                    <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                        with Prometrix
                    </span>
                </h1>

                <p className="text-gray-400 text-lg max-w-xl mx-auto mb-8 leading-relaxed">
                    Find available spots instantly, park any vehicle size, and pay online —
                    all in one system built for efficiency and control.
                </p>

                <div className="flex flex-col sm:flex-row gap-3 justify-center mb-10">
                    <Link
                        href="/register"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-blue-500/30 group"
                    >
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform"/>
                        Start Parking
                    </Link>
                    <Link
                        href="/dashboard"
                        className="inline-flex items-center gap-2 px-6 py-3 border border-white/15 text-slate-300 rounded-xl font-medium hover:border-blue-500/50 hover:text-blue-400 transition-all duration-300 hover:scale-105 backdrop-blur-sm"
                    >
                        View Spots
                    </Link>
                </div>

                <div className="relative w-full max-w-2xl mx-auto overflow-hidden">
                    <ParkingLotScene/>
                </div>

            </section>
            <section className="px-6 py-16">
                <h2 className="text-2xl font-bold text-center text-slate-100 mb-2">Everything you need</h2>
                <p className="text-center text-slate-500 text-sm mb-8">Built for drivers and lot operators alike</p>
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 max-w-4xl mx-auto">
                    {features.map(({icon, color, iconColor, title, desc}) => (
                        <div
                            key={title}
                            className="group p-5 rounded-xl bg-white/[0.04] border border-white/[0.07] hover:border-blue-500/30 hover:bg-blue-500/[0.06] transition-all duration-300 hover:-translate-y-0.5"
                        >
                            <div
                                className={`w-9 h-9 rounded-lg bg-gradient-to-br ${color} flex items-center justify-center mb-3 ${iconColor}`}>
                                {icon}
                            </div>
                            <div className="text-sm font-semibold text-slate-200 mb-1">{title}</div>
                            <div className="text-xs text-slate-500 leading-relaxed">{desc}</div>
                        </div>
                    ))}
                </div>
            </section>

            <div className="mx-6 h-px bg-white/[0.06]"/>

            <section className="px-6 py-16">
                <h2 className="text-2xl font-bold text-center text-slate-100 mb-2">Supports every vehicle</h2>
                <p className="text-center text-slate-500 text-sm mb-8">Click to see your type</p>
                <div className="grid grid-cols-3 gap-3 max-w-lg mx-auto">
                    {vehicles.map(({key, icon, label, note}) => (
                        <button
                            key={key}
                            onClick={() => setSelectedVehicle(key)}
                            className={`p-5 rounded-xl border text-center transition-all duration-300 hover:scale-[1.03] ${
                                selectedVehicle === key
                                    ? "border-indigo-500/60 bg-indigo-500/10 shadow-lg shadow-indigo-500/10"
                                    : "border-white/[0.07] bg-white/[0.04] hover:border-indigo-500/30 hover:bg-indigo-500/[0.06]"
                            }`}
                        >
                            <div
                                className={`flex justify-center mb-2 transition-colors ${selectedVehicle === key ? "text-indigo-400" : "text-slate-400"}`}>
                                {icon}
                            </div>
                            <div className="text-sm font-semibold text-slate-200">{label}</div>
                            <div className="text-[11px] text-slate-500 mt-0.5">{note}</div>
                        </button>
                    ))}
                </div>
            </section>

            <div className="mx-6 h-px bg-white/[0.06]"/>

            <section className="px-6 py-16">
                <h2 className="text-2xl font-bold text-center text-slate-100 mb-2">How Prometrix works</h2>
                <p className="text-center text-slate-500 text-sm mb-10">Three steps to stress-free parking</p>
                <div className="grid sm:grid-cols-3 gap-6 max-w-2xl mx-auto">
                    {steps.map(({num, title, desc}) => (
                        <div key={num} className="text-center px-4">
                            <div
                                className="w-11 h-11 rounded-full border border-indigo-500/40 bg-gradient-to-br from-blue-500/15 to-purple-500/15 flex items-center justify-center mx-auto mb-4 text-lg font-bold text-indigo-400">
                                {num}
                            </div>
                            <div className="text-sm font-semibold text-slate-200 mb-1.5">{title}</div>
                            <div className="text-xs text-slate-500 leading-relaxed">{desc}</div>
                        </div>
                    ))}
                </div>
            </section>

            <section className="px-6 pb-12">
                <div
                    className="relative rounded-2xl overflow-hidden border border-indigo-500/25 bg-gradient-to-br from-blue-500/10 to-purple-500/10 py-12 px-8 text-center">
                    <div
                        className="pointer-events-none absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10 blur-2xl"/>
                    <h2 className="relative text-2xl font-bold text-slate-100 mb-2">Ready to simplify parking?</h2>
                    <p className="relative text-slate-400 text-sm mb-6">Join Prometrix and take control of your parking
                        experience.</p>
                    <Link
                        href="/register"
                        className="relative inline-flex items-center gap-2 px-7 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-blue-500/30 group"
                    >
                        Create Account
                        <Zap className="w-4 h-4 group-hover:rotate-12 transition-transform"/>
                    </Link>
                </div>
            </section>

            <footer className="border-t border-white/[0.06] bg-black/30 py-8 text-center">
                <p className="text-slate-500 text-sm">© {new Date().getFullYear()} Prometrix. All rights reserved.</p>
            </footer>
        </div>
    );
}