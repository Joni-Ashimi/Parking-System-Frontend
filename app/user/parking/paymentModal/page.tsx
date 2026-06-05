// app/(user)/user/parking/success/page.tsx
"use client";

import {useEffect, useState} from "react";
import {ArrowRight, CheckCircle, Clock, MapPin} from "lucide-react";
import UserSidebar from "@/components/sidebar/userSidebar";
import Link from "next/link";

export default function ParkingSuccessPage() {
    const [show, setShow] = useState(false);

    // Animate in on mount
    useEffect(() => {
        const t = setTimeout(() => setShow(true), 100);
        return () => clearTimeout(t);
    }, []);

    return (
        <UserSidebar>
            <div
                className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50/40 flex items-center justify-center p-6">
                <div
                    className={`w-full max-w-md transition-all duration-500 ${show ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>

                    {/* Main card */}
                    <div className="bg-white rounded-3xl shadow-xl border border-emerald-100 overflow-hidden">

                        {/* Top stripe */}
                        <div className="bg-gradient-to-r from-emerald-500 to-teal-500 px-6 py-8 text-center">
                            <div
                                className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
                                <CheckCircle size={36} className="text-white"/>
                            </div>
                            <h1 className="text-2xl font-black text-white">Payment Successful</h1>
                            <p className="text-emerald-100 text-sm mt-1">Your parking session has ended</p>
                        </div>

                        {/* Body */}
                        <div className="px-6 py-6 space-y-4">
                            <p className="text-sm text-gray-500 text-center">
                                Thank you! Your payment has been processed and the spot has been released.
                            </p>

                            <div className="bg-slate-50 rounded-2xl p-4 space-y-3 border border-slate-100">
                                <div className="flex items-center gap-3 text-sm text-gray-600">
                                    <div
                                        className="w-8 h-8 bg-emerald-50 text-emerald-600 rounded-lg flex items-center justify-center shrink-0">
                                        <CheckCircle size={15}/>
                                    </div>
                                    <span>Session ended & spot released</span>
                                </div>
                                <div className="flex items-center gap-3 text-sm text-gray-600">
                                    <div
                                        className="w-8 h-8 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center shrink-0">
                                        <Clock size={15}/>
                                    </div>
                                    <span>Payment confirmed at {new Date().toLocaleTimeString([], {
                                        hour: "2-digit",
                                        minute: "2-digit"
                                    })}</span>
                                </div>
                                <div className="flex items-center gap-3 text-sm text-gray-600">
                                    <div
                                        className="w-8 h-8 bg-purple-50 text-purple-600 rounded-lg flex items-center justify-center shrink-0">
                                        <MapPin size={15}/>
                                    </div>
                                    <span>Drive safely!</span>
                                </div>
                            </div>

                            <div className="flex flex-col gap-2 pt-2">
                                <Link
                                    href="/user/park"
                                    className="w-full py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-xl text-sm font-bold transition flex items-center justify-center gap-2 shadow-sm"
                                >
                                    Park Again <ArrowRight size={15}/>
                                </Link>
                                <Link
                                    href="/dashboard"
                                    className="w-full py-2.5 border border-gray-200 hover:bg-gray-50 text-gray-600 rounded-xl text-sm font-medium transition text-center"
                                >
                                    Go to Dashboard
                                </Link>
                            </div>
                        </div>
                    </div>

                    <p className="text-center text-xs text-gray-400 mt-4">
                        Payment processed securely via POK
                    </p>
                </div>
            </div>
        </UserSidebar>
    );
}