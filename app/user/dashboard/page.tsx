"use client";

import React, {useEffect, useState} from "react";
import {ArrowRight, Car, Clock, MapPin, ShieldCheck, User} from "lucide-react";
import UserSidebar from "@/components/sidebar/userSidebar";
import Link from "next/link";
import UserService from "@/services/UserService";
import ParkingSessionService from "@/services/ParkingSessionService";

interface ActiveSession {
    spot: string;
    duration: string;
}

export default function UserDashboard() {
    const [userFirstName, setUserFirstName] = useState("");
    const [activeSession, setActiveSession] = useState<ActiveSession | null>(null);

    useEffect(() => {
        UserService.getMe().then(res => {
            const firstName = res.data.name.split(" ")[0];
            setUserFirstName(firstName);
        }).catch(console.error);
    }, []);

    const getElapsed = (entryTime: string) => {
        const diff = Date.now() - new Date(entryTime).getTime();
        const h = Math.floor(diff / 3600000);
        const m = Math.floor((diff % 3600000) / 60000);
        return h > 0 ? `${h}h ${m}m` : `${m}m`;
    };

    return (
        <UserSidebar>
            <div className="min-h-screen bg-slate-50 p-4 md:p-8 space-y-6">

                {/* Header */}
                <header className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <div>
                        <h1 className="text-xl md:text-2xl font-black text-gray-900">
                            Welcome Back{userFirstName ? `, ${userFirstName}` : ""}!
                        </h1>
                        <p className="text-sm text-gray-500 mt-0.5">
                            Quick look at your account status and parking metrics.
                        </p>
                    </div>
                    <div className="flex items-center gap-2 bg-emerald-50 text-emerald-800 text-xs font-semibold px-3 py-1.5 rounded-xl border border-emerald-200 w-fit">
                        <ShieldCheck size={15}/> Verified Account
                    </div>
                </header>

                {/* Active Session Banner */}
                {activeSession && (
                    <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-5 text-white shadow-md flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-start gap-3">
                            <div className="p-2.5 bg-white/10 rounded-xl backdrop-blur-md shrink-0">
                                <Clock size={20}/>
                            </div>
                            <div>
                                <p className="text-xs text-blue-100 uppercase tracking-wider font-bold">
                                    Active Parking Session
                                </p>
                                <p className="text-base font-bold mt-0.5">
                                    Spot {activeSession.spot} · Elapsed: {activeSession.duration}
                                </p>
                            </div>
                        </div>
                        <Link
                            href="/user/parking"
                            className="bg-white text-blue-600 px-4 py-2 rounded-xl text-sm font-bold shadow-sm hover:bg-blue-50 transition flex items-center gap-1.5 w-fit"
                        >
                            Manage Session <ArrowRight size={15}/>
                        </Link>
                    </div>
                )}

                {/* Quick Links Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
                    <Link
                        href="/user/park"
                        className="bg-white p-4 md:p-5 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md hover:border-blue-200 transition group flex flex-col gap-3"
                    >
                        <div className="w-9 h-9 md:w-10 md:h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition">
                            <MapPin size={18}/>
                        </div>
                        <div>
                            <h3 className="font-bold text-gray-800 text-sm md:text-base flex items-center gap-1">
                                Parking Grid
                                <ArrowRight size={13} className="opacity-0 group-hover:opacity-100 transition-all group-hover:translate-x-0.5"/>
                            </h3>
                            <p className="text-xs text-gray-400 mt-1 leading-relaxed hidden sm:block">
                                View the live terminal layout and reserve spaces visually.
                            </p>
                            <p className="text-xs text-gray-400 mt-1 leading-relaxed sm:hidden">
                                Browse & reserve spots.
                            </p>
                        </div>
                    </Link>

                    <Link
                        href="/user/my-vehicles"
                        className="bg-white p-4 md:p-5 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md hover:border-emerald-200 transition group flex flex-col gap-3"
                    >
                        <div className="w-9 h-9 md:w-10 md:h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition">
                            <Car size={18}/>
                        </div>
                        <div>
                            <h3 className="font-bold text-gray-800 text-sm md:text-base flex items-center gap-1">
                                My Garage
                                <ArrowRight size={13} className="opacity-0 group-hover:opacity-100 transition-all group-hover:translate-x-0.5"/>
                            </h3>
                            <p className="text-xs text-gray-400 mt-1 leading-relaxed hidden sm:block">
                                Manage your license plates and authorized sizing profiles.
                            </p>
                            <p className="text-xs text-gray-400 mt-1 leading-relaxed sm:hidden">
                                Manage your vehicles.
                            </p>
                        </div>
                    </Link>

                    <Link
                        href="/user/sessions"
                        className="bg-white p-4 md:p-5 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md hover:border-amber-200 transition group flex flex-col gap-3"
                    >
                        <div className="w-9 h-9 md:w-10 md:h-10 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center group-hover:bg-amber-600 group-hover:text-white transition">
                            <Clock size={18}/>
                        </div>
                        <div>
                            <h3 className="font-bold text-gray-800 text-sm md:text-base flex items-center gap-1">
                                History
                                <ArrowRight size={13} className="opacity-0 group-hover:opacity-100 transition-all group-hover:translate-x-0.5"/>
                            </h3>
                            <p className="text-xs text-gray-400 mt-1 leading-relaxed hidden sm:block">
                                Track active sessions, total pricing, and logs.
                            </p>
                            <p className="text-xs text-gray-400 mt-1 leading-relaxed sm:hidden">
                                Sessions & history.
                            </p>
                        </div>
                    </Link>

                    <Link
                        href="/user/me"
                        className="bg-white p-4 md:p-5 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md hover:border-purple-200 transition group flex flex-col gap-3"
                    >
                        <div className="w-9 h-9 md:w-10 md:h-10 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center group-hover:bg-purple-600 group-hover:text-white transition">
                            <User size={18}/>
                        </div>
                        <div>
                            <h3 className="font-bold text-gray-800 text-sm md:text-base flex items-center gap-1">
                                Account
                                <ArrowRight size={13} className="opacity-0 group-hover:opacity-100 transition-all group-hover:translate-x-0.5"/>
                            </h3>
                            <p className="text-xs text-gray-400 mt-1 leading-relaxed hidden sm:block">
                                Update your security flags, credentials, and info.
                            </p>
                            <p className="text-xs text-gray-400 mt-1 leading-relaxed sm:hidden">
                                Settings & security.
                            </p>
                        </div>
                    </Link>
                </div>
            </div>
        </UserSidebar>
    );
}