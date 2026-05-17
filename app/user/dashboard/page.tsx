"use client";

import React, {useState} from "react";
import {ArrowRight, Car, Clock, MapPin, ShieldCheck, User} from "lucide-react";
import UserSidebar from "@/components/sidebar/userSidebar";
import Link from "next/link";

export default function UserDashboard() {
    // Simple states for high-level numbers (mocked or fetched easily)
    const [userFirstName, setUserFirstName] = useState("Driver");
    const [activeSession, setActiveSession] = useState<{ spot: string; duration: string } | null>({
        spot: "A-12",
        duration: "1h 45m"
    });

    return (
        <UserSidebar>
            <div className="min-h-screen bg-slate-50 p-4 md:p-8 space-y-8">

                {/* Welcome Banner */}
                <header
                    className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-black text-gray-900">Welcome Back, {userFirstName}!</h1>
                        <p className="text-sm text-gray-500 mt-0.5">Quick look at your account status and parking
                            metrics.</p>
                    </div>
                    <div
                        className="flex items-center gap-2 bg-emerald-50 text-emerald-800 text-xs font-semibold px-3 py-1.5 rounded-xl border border-emerald-200 w-fit">
                        <ShieldCheck size={16}/> Verified Account
                    </div>
                </header>

                {/* Highlight Banner: Live Activity Tracker */}
                {activeSession ? (
                    <div
                        className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-6 text-white shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-white/10 rounded-xl backdrop-blur-md animate-pulse">
                                <Clock size={24}/>
                            </div>
                            <div>
                                <p className="text-xs text-blue-100 uppercase tracking-wider font-bold">Active Parking
                                    Session</p>
                                <p className="text-lg font-bold">Spot {activeSession.spot} •
                                    Elapsed: {activeSession.duration}</p>
                            </div>
                        </div>
                        <Link href="/user/parking"
                              className="bg-white text-blue-600 px-4 py-2 rounded-xl text-sm font-bold shadow-sm hover:bg-blue-50 transition flex items-center gap-1.5 self-start sm:self-auto">
                            Manage Session <ArrowRight size={16}/>
                        </Link>
                    </div>
                ) : (
                    <div
                        className="bg-white border border-dashed border-gray-300 rounded-2xl p-6 text-center text-gray-500">
                        <p className="text-sm">You do not have any active parking sessions right now.</p>
                        <Link href="/dashboard/map"
                              className="inline-block mt-3 text-sm font-bold text-blue-600 hover:underline">
                            Find and reserve a spot now →
                        </Link>
                    </div>
                )}

                {/* Navigation Quick Links Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

                    {/* Card 1: Map Layout */}
                    <Link href="/user/park"
                          className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition group">
                        <div
                            className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-4 group-hover:bg-blue-600 group-hover:text-white transition">
                            <MapPin size={20}/>
                        </div>
                        <h3 className="font-bold text-gray-800 flex items-center gap-1">
                            Parking Grid <ArrowRight size={14}
                                                     className="opacity-0 group-hover:opacity-100 transition-all transform group-hover:translate-x-0.5"/>
                        </h3>
                        <p className="text-xs text-gray-400 mt-1">View the live terminal layout and reserve spaces
                            visually.</p>
                    </Link>

                    {/* Card 2: Vehicles */}
                    <Link href="/user/my-vehicles"
                          className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition group">
                        <div
                            className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center mb-4 group-hover:bg-emerald-600 group-hover:text-white transition">
                            <Car size={20}/>
                        </div>
                        <h3 className="font-bold text-gray-800 flex items-center gap-1">
                            My Garage <ArrowRight size={14}
                                                  className="opacity-0 group-hover:opacity-100 transition-all transform group-hover:translate-x-0.5"/>
                        </h3>
                        <p className="text-xs text-gray-400 mt-1">Manage your license plates and authorized sizing
                            profiles.</p>
                    </Link>

                    {/* Card 3: Sessions Placeholder */}
                    <Link href="/dashboard/sessions"
                          className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition group">
                        <div
                            className="w-10 h-10 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center mb-4 group-hover:bg-amber-600 group-hover:text-white transition">
                            <Clock size={20}/>
                        </div>
                        <h3 className="font-bold text-gray-800 flex items-center gap-1">
                            History & Sessions <ArrowRight size={14}
                                                           className="opacity-0 group-hover:opacity-100 transition-all transform group-hover:translate-x-0.5"/>
                        </h3>
                        <p className="text-xs text-gray-400 mt-1">Track active status trackers, total pricing, and
                            logs.</p>
                    </Link>

                    {/* Card 4: Profile Placeholder */}
                    <Link href="/user/me"
                          className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition group">
                        <div
                            className="w-10 h-10 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center mb-4 group-hover:bg-purple-600 group-hover:text-white transition">
                            <User size={20}/>
                        </div>
                        <h3 className="font-bold text-gray-800 flex items-center gap-1">
                            Account Settings <ArrowRight size={14}
                                                         className="opacity-0 group-hover:opacity-100 transition-all transform group-hover:translate-x-0.5"/>
                        </h3>
                        <p className="text-xs text-gray-400 mt-1">Update your security flags, user credentials, and
                            info.</p>
                    </Link>

                </div>

            </div>
        </UserSidebar>
    );
}