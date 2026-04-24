"use client";

import { useState, useEffect, useCallback } from "react";
import {
    Car,
    Clock,
    MapPin,
    DollarSign,
    ArrowLeft,
    Square,
    Timer,
    Shield,
    ChevronRight,
} from "lucide-react";
import Link from "next/link";

// Mock session data – replace with real data from API/state
const sessionData = {
    spot: "A12",
    vehiclePlate: "ABC-1234",
    startTime: new Date(Date.now() - 15 * 60 * 1000), // 15 mins ago for demo
    ratePerHour: 5.0,
};

export default function ActiveSessionPage() {
    const [elapsed, setElapsed] = useState(0); // in seconds
    const [cost, setCost] = useState(0);
    const [showEndConfirm, setShowEndConfirm] = useState(false);

    const update = useCallback(() => {
        const now = new Date();
        const diffSeconds = Math.floor((now.getTime() - sessionData.startTime.getTime()) / 1000);
        setElapsed(diffSeconds);
        const hours = diffSeconds / 3600;
        setCost(hours * sessionData.ratePerHour);
    }, []);

    useEffect(() => {
        update();
        const interval = setInterval(update, 1000);
        return () => clearInterval(interval);
    }, [update]);

    const formatTime = (totalSeconds: number) => {
        const h = Math.floor(totalSeconds / 3600);
        const m = Math.floor((totalSeconds % 3600) / 60);
        const s = totalSeconds % 60;
        return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
    };

    const handleEndParking = () => {
        alert(`Parking ended. Total: $${cost.toFixed(2)}`);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-950 via-slate-900 to-black text-white relative overflow-hidden">
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-blue-600/20 rounded-full blur-3xl" />
                <div className="absolute bottom-[-10%] right-[-5%] w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-3xl" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-600/5 rounded-full blur-3xl" />
            </div>

            <header className="relative z-10 backdrop-blur-md bg-black/30 border-b border-white/10">
                <div className="max-w-4xl mx-auto px-6 py-5 flex items-center justify-between">
                    <Link
                        href="/user/dashboard"
                        className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
                    >
                        <ArrowLeft size={20} />
                        <span className="text-sm font-medium">Back</span>
                    </Link>
                    <div className="flex items-center gap-2">
                        <Shield size={16} className="text-emerald-400" />
                        <span className="text-sm text-emerald-400 font-medium">Live Session</span>
                    </div>
                </div>
            </header>

            <main className="relative z-10 max-w-lg mx-auto px-6 pt-12 pb-24">
                <div className="text-center mb-10">
                    <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 px-4 py-1.5 rounded-full text-emerald-300 text-sm font-medium backdrop-blur-sm">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
                        Session Active
                    </div>
                </div>

                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl shadow-black/20">
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-4">
                            <div className="p-4 bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl shadow-lg shadow-blue-500/20">
                                <Car size={32} />
                            </div>
                            <div>
                                <h2 className="text-3xl font-bold tracking-wide">{sessionData.vehiclePlate}</h2>
                                <div className="flex items-center gap-2 mt-1 text-gray-400">
                                    <MapPin size={14} />
                                    <span className="text-sm">Spot {sessionData.spot}</span>
                                </div>
                            </div>
                        </div>
                        <ChevronRight size={20} className="text-gray-600" />
                    </div>

                    {/* Timer & Cost – the core */}
                    <div className="space-y-6 mb-8">
                        {/* Timer */}
                        <div className="bg-black/30 rounded-2xl p-6 border border-white/5">
                            <div className="flex items-center gap-3 text-gray-400 mb-2">
                                <Clock size={18} />
                                <span className="text-sm font-medium">Elapsed Time</span>
                            </div>
                            <div className="text-5xl font-mono font-bold tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-300">
                                {formatTime(elapsed)}
                            </div>
                        </div>

                        {/* Cost */}
                        <div className="bg-black/30 rounded-2xl p-6 border border-white/5">
                            <div className="flex items-center gap-3 text-gray-400 mb-2">
                                <DollarSign size={18} />
                                <span className="text-sm font-medium">Current Cost</span>
                            </div>
                            <div className="text-5xl font-mono font-bold tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-green-300">
                                ${cost.toFixed(2)}
                            </div>
                        </div>

                        {/* Rate indicator */}
                        <div className="text-center text-sm text-gray-500 flex items-center justify-center gap-1">
                            <Timer size={14} />
                            <span>Rate: ${sessionData.ratePerHour.toFixed(2)} / hour</span>
                        </div>
                    </div>

                    {/* End Parking Button */}
                    {!showEndConfirm ? (
                        <button
                            onClick={() => setShowEndConfirm(true)}
                            className="w-full py-4 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-semibold rounded-2xl shadow-lg shadow-red-600/25 transition-all duration-200 flex items-center justify-center gap-3 text-lg"
                        >
                            <Square size={24} fill="currentColor" />
                            End Parking
                        </button>
                    ) : (
                        <div className="space-y-3">
                            <p className="text-center text-gray-300 font-medium">
                                End your session now?
                            </p>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setShowEndConfirm(false)}
                                    className="flex-1 py-3 bg-gray-700 hover:bg-gray-600 text-white font-medium rounded-xl transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleEndParking}
                                    className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-medium rounded-xl transition-colors flex items-center justify-center gap-2"
                                >
                                    Confirm & Pay
                                    <DollarSign size={18} />
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Additional quick info */}
                <p className="text-center text-xs text-gray-500 mt-6">
                    This session will be automatically billed to your payment method.
                </p>
            </main>
        </div>
    );
}