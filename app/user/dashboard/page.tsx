"use client";

import {useEffect, useState} from "react";
import {AlertCircle, ArrowRight, Car, CheckCircle, Clock, MapPin, Users,} from "lucide-react";
import Link from "next/link";
import UserSideBar from "@/components/sidebar/userSidebar";

// Mock data – will be replaced with API later
const mockLotStatus = {
    totalSpots: 60,
    availableSpots: 12,
    hourlyRate: 5,
};

export default function UserHomePage() {
    const [lotStatus, setLotStatus] = useState(mockLotStatus);
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    const occupancyPercentage = ((lotStatus.totalSpots - lotStatus.availableSpots) / lotStatus.totalSpots) * 100;
    const isAlmostFull = occupancyPercentage >= 80;
    const isFull = lotStatus.availableSpots === 0;

    const getStatusConfig = () => {
        if (isFull) {
            return {
                message: "Parking Full",
                subMessage: "No spots available at the moment",
                color: "text-red-600",
                bg: "bg-red-50",
                border: "border-red-200",
                icon: AlertCircle,
            };
        }
        if (isAlmostFull) {
            return {
                message: "Almost Full",
                subMessage: `Only ${lotStatus.availableSpots} spots left`,
                color: "text-amber-600",
                bg: "bg-amber-50",
                border: "border-amber-200",
                icon: AlertCircle,
            };
        }
        return {
            message: "Parking Available",
            subMessage: `${lotStatus.availableSpots} spots open`,
            color: "text-emerald-600",
            bg: "bg-emerald-50",
            border: "border-emerald-200",
            icon: CheckCircle,
        };
    };

    const statusConfig = getStatusConfig();
    const StatusIcon = statusConfig.icon;

    return (
        <>
            <UserSideBar>
                <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100">
                    <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-10">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                            <div className="flex justify-between items-center">
                                <div className="flex items-center gap-2">
                                    <div className="p-2 bg-blue-600 rounded-xl">
                                        <Car size={24} className="text-white"/>
                                    </div>
                                    <span className="text-xl font-bold text-gray-800">ParkEasy</span>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="text-right hidden sm:block">
                                        <p className="text-sm text-gray-500">Current Time</p>
                                        <p className="font-mono text-lg font-medium text-gray-800">
                                            {currentTime.toLocaleTimeString([], {hour: "2-digit", minute: "2-digit"})}
                                        </p>
                                    </div>
                                    <Link
                                        href="/user/sessions"
                                        className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium transition-colors text-sm"
                                    >
                                        My Sessions
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </header>

                    {/* Main Content */}
                    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                            {/* Left Column – Status & CTA */}
                            <div className="space-y-8">
                                {/* Welcome Banner */}
                                <div>
                                    <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-3">
                                        Find Your Spot,{" "}
                                        <span
                                            className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  Instantly
                </span>
                                    </h1>
                                    <p className="text-lg text-gray-600">
                                        Secure parking with online payment. No more circling the block.
                                    </p>
                                </div>

                                {/* Status Card */}
                                <div
                                    className={`rounded-2xl border-2 p-6 ${statusConfig.bg} ${statusConfig.border}`}
                                >
                                    <div className="flex items-start gap-4">
                                        <div className={`p-3 rounded-xl ${statusConfig.bg}`}>
                                            <StatusIcon size={32} className={statusConfig.color}/>
                                        </div>
                                        <div className="flex-1">
                                            <h2 className={`text-2xl font-bold ${statusConfig.color}`}>
                                                {statusConfig.message}
                                            </h2>
                                            <p className="text-gray-600 mt-1">{statusConfig.subMessage}</p>

                                            {/* Occupancy Bar */}
                                            <div className="mt-4">
                                                <div className="flex justify-between text-sm mb-1">
                                                    <span className="text-gray-600">Occupancy</span>
                                                    <span className="font-medium text-gray-800">
                        {lotStatus.totalSpots - lotStatus.availableSpots}/{lotStatus.totalSpots} spots
                      </span>
                                                </div>
                                                <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                                                    <div
                                                        className={`h-full rounded-full transition-all duration-500 ${
                                                            isFull
                                                                ? "bg-red-500"
                                                                : isAlmostFull
                                                                    ? "bg-amber-500"
                                                                    : "bg-emerald-500"
                                                        }`}
                                                        style={{width: `${occupancyPercentage}%`}}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* CTA Button */}
                                <div>
                                    <Link
                                        href="/user/park"
                                        className={`
                  inline-flex items-center gap-3 px-8 py-4 rounded-xl font-semibold text-white text-lg
                  shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200
                  ${
                                            isFull
                                                ? "bg-gray-400 cursor-not-allowed pointer-events-none"
                                                : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                                        }
                `}
                                        aria-disabled={isFull}
                                    >
                                        {isFull ? "No Spots Available" : "Start Parking"}
                                        <ArrowRight size={20}/>
                                    </Link>
                                    {isFull && (
                                        <p className="text-sm text-gray-500 mt-2">
                                            Check back soon – spots may become available.
                                        </p>
                                    )}
                                </div>

                                {/* Quick Info */}
                                <div className="flex flex-wrap gap-4 pt-4">
                                    <div
                                        className="flex items-center gap-2 bg-white rounded-xl px-4 py-3 shadow-sm border border-gray-200">
                                        <MapPin size={18} className="text-blue-600"/>
                                        <span className="text-sm text-gray-700">123 Main Street, City</span>
                                    </div>
                                    <div
                                        className="flex items-center gap-2 bg-white rounded-xl px-4 py-3 shadow-sm border border-gray-200">
                                        <Clock size={18} className="text-blue-600"/>
                                        <span className="text-sm text-gray-700">24/7 Access</span>
                                    </div>
                                    <div
                                        className="flex items-center gap-2 bg-white rounded-xl px-4 py-3 shadow-sm border border-gray-200">
                                        <DollarSign size={18} className="text-blue-600"/>
                                        <span className="text-sm text-gray-700">${lotStatus.hourlyRate}/hour</span>
                                    </div>
                                </div>
                            </div>

                            <div className="hidden lg:block">
                                <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6">
                                    <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                                        <Car size={20} className="text-blue-600"/>
                                        Live Parking Map
                                    </h3>
                                    <div className="grid grid-cols-6 gap-2">
                                        {Array.from({length: 36}).map((_, i) => {
                                            const isOccupied = i >= lotStatus.availableSpots;
                                            return (
                                                <div
                                                    key={i}
                                                    className={`
                        aspect-square rounded-lg border-2 flex items-center justify-center
                        ${isOccupied
                                                        ? "bg-blue-100 border-blue-300"
                                                        : "bg-green-100 border-green-300"
                                                    }
                      `}
                                                >
                                                    {isOccupied ? (
                                                        <Car size={14} className="text-blue-600"/>
                                                    ) : (
                                                        <div className="w-2 h-2 rounded-full bg-green-500"/>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                    <div className="flex items-center justify-between mt-4 text-sm">
                                        <div className="flex items-center gap-2">
                                            <div className="w-3 h-3 rounded-sm bg-green-500"></div>
                                            <span className="text-gray-600">Available</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="w-3 h-3 rounded-sm bg-blue-500"></div>
                                            <span className="text-gray-600">Occupied</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Users size={14} className="text-gray-500"/>
                                            <span className="text-gray-600">{lotStatus.availableSpots} open</span>
                                        </div>
                                    </div>
                                    <p className="text-xs text-gray-500 text-center mt-4">
                                        Map shows real‑time availability
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="mt-16">
                            <h3 className="text-xl font-semibold text-gray-800 mb-4">Recent Activity</h3>
                            <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
                                <div className="space-y-3">
                                    <ActivityItem user="You" action="parked" time="2 hours ago"/>
                                    <ActivityItem user="Sarah" action="checked out" time="1 hour ago"/>
                                    <ActivityItem user="Mike" action="started parking" time="30 minutes ago"/>
                                </div>
                            </div>
                        </div>
                    </main>
                </div>
            </UserSideBar>
        </>
    );
}

function ActivityItem({user, action, time}: { user: string; action: string; time: string }) {
    return (
        <div className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
            <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                    <Users size={14} className="text-gray-600"/>
                </div>
                <div>
                    <p className="text-sm font-medium text-gray-800">
                        {user} <span className="text-gray-500">{action}</span>
                    </p>
                </div>
            </div>
            <span className="text-xs text-gray-400">{time}</span>
        </div>
    );
}

function DollarSign({size, className}: { size: number; className?: string }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
        >
            <line x1="12" y1="1" x2="12" y2="23"/>
            <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
        </svg>
    );
}