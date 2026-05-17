"use client";

import React, { useState, useEffect } from "react";
import { Clock, DollarSign, MapPin, Calendar, Loader2, AlertTriangle, ArrowRight } from "lucide-react";
import UserSidebar from "@/components/sidebar/userSidebar";
import Link from "next/link";
import { handleRequestErrors } from "@/utils/functions";

interface ActiveSessionData {
    sessionId: string;
    spotNumber: string;
    floor: number;
    startedAt: string;
    baseHourlyRate: number;
}

export default function UserSessionPage() {
    const [session, setSession] = useState<ActiveSessionData | null>({
        sessionId: "sess_89432",
        spotNumber: "A-12",
        floor: 1,
        startedAt: new Date(Date.now() - 105 * 60 * 1000).toISOString(),
        baseHourlyRate: 2.50,
    });
    const [loading, setLoading] = useState(false);
    const [elapsedSeconds, setElapsedSeconds] = useState(0);

    useEffect(() => {
        if (!session) return;
        const calculateElapsed = () => {
            const start = new Date(session.startedAt).getTime();
            const now = new Date().getTime();
            setElapsedSeconds(Math.max(0, Math.floor((now - start) / 1000)));
        };
        calculateElapsed();
        const interval = setInterval(calculateElapsed, 1000);
        return () => clearInterval(interval);
    }, [session]);

    const formatTime = (totalSeconds: number) => {
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;
        return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
    };

    const currentCost = session
        ? ((elapsedSeconds / 3600) * session.baseHourlyRate).toFixed(2)
        : "0.00";

    const handleEndSession = async () => {
        if (!window.confirm("Are you sure you want to end your parking session?")) return;
        try {
            setLoading(true);
            // await SessionService.endActive(session.sessionId);
            alert(`Session for spot ${session?.spotNumber} terminated successfully!`);
            setSession(null);
        } catch (err) {
            handleRequestErrors(err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <UserSidebar>
                <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50">
                    <Loader2 className="w-8 h-8 text-blue-600 animate-spin mb-3" />
                    <p className="text-sm text-gray-600 font-medium">Processing your session…</p>
                </div>
            </UserSidebar>
        );
    }

    return (
        <UserSidebar>
            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30 p-4 md:p-8 max-w-4xl mx-auto space-y-6">

                {/* Header */}
                <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                    <h1 className="text-2xl font-bold text-gray-800">Active Parking Session</h1>
                    <p className="text-sm text-gray-500 mt-1">Monitor or release your current parking spot allocation.</p>
                </div>

                {!session ? (
                    /* Empty State */
                    <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center shadow-sm space-y-5">
                        <div className="w-14 h-14 bg-indigo-50 text-indigo-500 rounded-2xl flex items-center justify-center mx-auto">
                            <Clock size={28} />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-gray-800">No Active Session</h3>
                            <p className="text-sm text-gray-500 max-w-xs mx-auto mt-1">
                                You are not currently parked in any spot.
                            </p>
                        </div>
                        <Link
                            href="/dashboard/map"
                            className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold transition shadow-sm"
                        >
                            Find a Parking Spot <ArrowRight size={16} />
                        </Link>
                    </div>
                ) : (
                    /* Active Session */
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                        {/* Main Metrics Panel (2 cols) */}
                        <div className="md:col-span-2 space-y-6">

                            {/* Timer & Cost */}
                            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm grid grid-cols-2 gap-6">
                                <div>
                                    <span className="text-xs text-gray-500 font-semibold uppercase tracking-wider flex items-center gap-1">
                                        <Clock size={14} className="text-blue-500" /> Duration
                                    </span>
                                    <p className="text-3xl font-bold text-gray-800 font-mono mt-1">
                                        {formatTime(elapsedSeconds)}
                                    </p>
                                </div>
                                <div>
                                    <span className="text-xs text-gray-500 font-semibold uppercase tracking-wider flex items-center gap-1">
                                        <DollarSign size={14} className="text-emerald-500" /> Current Cost
                                    </span>
                                    <p className="text-3xl font-bold text-emerald-600 font-mono mt-1">
                                        ${currentCost}
                                    </p>
                                </div>
                            </div>

                            {/* Spot Details */}
                            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm space-y-4">
                                <h3 className="text-sm font-bold text-gray-700 border-b border-gray-100 pb-3">Parking Details</h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-9 h-9 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center">
                                            <MapPin size={18} />
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-400 uppercase font-semibold">Spot</p>
                                            <p className="text-sm font-bold text-gray-800">{session.spotNumber} (Floor {session.floor})</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="w-9 h-9 bg-emerald-50 text-emerald-600 rounded-lg flex items-center justify-center">
                                            <Calendar size={18} />
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-400 uppercase font-semibold">Start Time</p>
                                            <p className="text-sm font-bold text-gray-800">
                                                {new Date(session.startedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 flex items-start gap-2.5 text-xs text-amber-700">
                                    <AlertTriangle size={14} className="shrink-0 mt-0.5" />
                                    <span>Rate: <strong>${session.baseHourlyRate.toFixed(2)}/hr</strong>. Please end the session before leaving the lot.</span>
                                </div>
                            </div>
                        </div>

                        {/* End Session Action (1 col) */}
                        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm flex flex-col justify-between space-y-6">
                            <div>
                                <h3 className="text-sm font-bold text-gray-800">Ready to Leave?</h3>
                                <p className="text-xs text-gray-500 mt-1">End the session to finalise billing and release the spot.</p>
                            </div>
                            <button
                                onClick={handleEndSession}
                                className="w-full py-3 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-sm font-bold transition shadow-sm hover:shadow-md"
                            >
                                End Session & Check Out
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </UserSidebar>
    );
}