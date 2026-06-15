"use client";

import {useEffect, useState} from "react";
import {AlertTriangle, ArrowRight, Calendar, Car, Clock, DollarSign, Loader2, MapPin, Tag} from "lucide-react";
import UserSidebar from "@/components/sidebar/userSidebar";
import Link from "next/link";
import {handleRequestErrors} from "@/utils/functions";
import ParkingSessionService from "@/services/ParkingSessionService";
import TransactionsService from "@/services/TransactionsService";
import CardsService from "@/services/CardsService";
import {PaymentErrorResponse, setUpCardTokenPayment} from "@nebula-ltd/pok-payments-js";

interface ActiveSession {
    id: string;
    createdAt: string;
    entryTime: string;
    status: string;
    vehicle?: { type: string; plateNumber: string };
    spot: {
        spotNumber: string;
        floor: number;
        type?: {
            name: string;
            size: string;
            baseHourlyRate: number;
            effectiveHourlyRate: number;
            isDiscounted: boolean;
            activeRuleName: string | null;
        };
        lot?: { name: string };
    };
}

export default function UserSessionPage() {
    const [session, setSession] = useState<ActiveSession | null>(null);
    const [loading, setLoading] = useState(true);
    const [checkingOut, setCheckingOut] = useState(false);
    const [elapsedSeconds, setElapsedSeconds] = useState(0);
    const [checkoutError, setCheckoutError] = useState<string | null>(null);

    useEffect(() => {
        ParkingSessionService.getUserActiveSession()
            .then(setSession)
            .catch(handleRequestErrors)
            .finally(() => setLoading(false));
    }, []);

    useEffect(() => {
        if (!session) return;
        const startMs = new Date(session.createdAt ?? session.entryTime).getTime();
        const calc = () => setElapsedSeconds(Math.max(0, Math.floor((Date.now() - startMs) / 1000)));
        calc();
        const t = setInterval(calc, 1000);
        return () => clearInterval(t);
    }, [session]);

    const formatDuration = (s: number) => {
        const h = Math.floor(s / 3600);
        const m = Math.floor((s % 3600) / 60);
        const sec = s % 60;
        if (h > 0) return `${h}h ${String(m).padStart(2, "0")}m ${String(sec).padStart(2, "0")}s`;
        if (m > 0) return `${m}m ${String(sec).padStart(2, "0")}s`;
        return `${sec}s`;
    };

    const effectiveRate = session?.spot?.type?.effectiveHourlyRate
        ?? session?.spot?.type?.baseHourlyRate
        ?? 0;

    const currentCost = ((elapsedSeconds / 3600) * effectiveRate).toFixed(2);

    const handleCheckout = async () => {
        if (!session) return;
        setCheckingOut(true);
        setCheckoutError(null);
        try {
            const transaction = await ParkingSessionService.endSession(session.id);
            const {sdkOrderId} = transaction;

            const cards = await CardsService.listUserCards();
            const defaultCard = cards?.find((c: any) => c.isDefault) ?? cards?.[0];
            if (!defaultCard) throw new Error("No payment card found. Please add a card first.");

            const payerAuthentication = await TransactionsService.prepare3DS(sdkOrderId, defaultCard.id);

            setUpCardTokenPayment({
                containerId: "pok-payment-container",
                orderId: sdkOrderId,
                payerAuthentication: payerAuthentication as any,
                env: "staging",
                onSuccess: async () => {
                    await TransactionsService.finalize(sdkOrderId);
                    window.location.href = "/user/parking/paymentModal";
                },
                onError: (err: PaymentErrorResponse) => {
                    console.error("Payment error:", err);
                    setCheckoutError("Payment failed. Please try again.");
                    setCheckingOut(false);
                },
            });
        } catch (err: any) {
            console.error("Checkout error:", err);
            setCheckoutError(err?.response?.data?.message ?? err?.message ?? "Checkout failed.");
            setCheckingOut(false);
        }
    };

    if (loading) return (
        <UserSidebar>
            <div
                className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50">
                <Loader2 className="w-8 h-8 text-blue-600 animate-spin mb-3"/>
                <p className="text-sm text-gray-600 font-medium">Loading your session…</p>
            </div>
        </UserSidebar>
    );

    const startTime = session ? new Date(session.createdAt ?? session.entryTime) : null;

    return (
        <UserSidebar>
            <div
                className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30 p-4 md:p-8 max-w-4xl mx-auto space-y-5">

                <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                    <h1 className="text-2xl font-bold text-gray-800">Active Parking Session</h1>
                    <p className="text-sm text-gray-500 mt-1">Costs accrue in real time — check out when ready to
                        leave.</p>
                </div>

                {!session ? (
                    <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center shadow-sm space-y-5">
                        <div
                            className="w-14 h-14 bg-indigo-50 text-indigo-500 rounded-2xl flex items-center justify-center mx-auto">
                            <Clock size={28}/>
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-gray-800">No Active Session</h3>
                            <p className="text-sm text-gray-500 max-w-xs mx-auto mt-1">You are not currently parked.</p>
                        </div>
                        <Link href="/user/park"
                              className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold transition shadow-sm">
                            Find a Spot <ArrowRight size={16}/>
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

                        {/* ── Left: live metrics + session info ── */}
                        <div className="md:col-span-2 space-y-5">

                            {/* Live ticker */}
                            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                                <div className="grid grid-cols-2 divide-x divide-gray-100">
                                    <div className="p-5">
                                        <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-1 mb-2">
                                            <Clock size={11} className="text-blue-500"/> Time parked
                                        </p>
                                        <p className="text-2xl font-bold text-gray-900 font-mono tabular-nums">
                                            {formatDuration(elapsedSeconds)}
                                        </p>
                                        {startTime && (
                                            <p className="text-[10px] text-gray-400 mt-1">
                                                Since {startTime.toLocaleTimeString([], {
                                                hour: "2-digit",
                                                minute: "2-digit"
                                            })}
                                            </p>
                                        )}
                                    </div>
                                    <div className="p-5">
                                        <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-1 mb-2">
                                            <DollarSign size={11} className="text-emerald-500"/> Running cost
                                        </p>
                                        <p className="text-2xl font-bold text-emerald-600 font-mono tabular-nums">
                                            €{currentCost}
                                        </p>
                                        <p className="text-[10px] text-gray-400 mt-1">
                                            @€{Number(effectiveRate).toFixed(2)}/hr
                                            {session.spot.type?.isDiscounted && (
                                                <span className="ml-1 text-emerald-500">· discounted</span>
                                            )}
                                        </p>
                                    </div>
                                </div>

                                {/* Progress bar — visual of elapsed time within the current hour */}
                                <div className="px-5 pb-4 pt-1">
                                    <div className="flex justify-between text-[10px] text-gray-400 mb-1">
                                        <span>Progress into current hour</span>
                                        <span>{Math.floor((elapsedSeconds % 3600) / 60)}m {elapsedSeconds % 60}s</span>
                                    </div>
                                    <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-emerald-400 rounded-full transition-all duration-1000"
                                            style={{width: `${((elapsedSeconds % 3600) / 3600) * 100}%`}}
                                        />
                                    </div>
                                    <p className="text-[10px] text-gray-400 mt-1">
                                        Partial hours billed at the per-second rate — you pay exactly what you use.
                                    </p>
                                </div>
                            </div>

                            {/* Session details */}
                            <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm space-y-4">
                                <h3 className="text-sm font-bold text-gray-700 pb-2 border-b border-gray-100">Session
                                    Details</h3>

                                <div className="grid grid-cols-2 gap-3">
                                    <DetailTile icon={<MapPin size={15}/>} color="blue"
                                                label="Spot"
                                                value={`${session.spot.spotNumber} · Floor ${session.spot.floor}`}/>
                                    <DetailTile icon={<Calendar size={15}/>} color="emerald"
                                                label="Started at" value={startTime?.toLocaleTimeString([], {
                                        hour: "2-digit",
                                        minute: "2-digit"
                                    }) ?? "—"}/>
                                    {session.spot.lot && (
                                        <DetailTile icon={<MapPin size={15}/>} color="purple"
                                                    label="Facility" value={session.spot.lot.name}/>
                                    )}
                                    {session.spot.type && (
                                        <DetailTile icon={<DollarSign size={15}/>} color="amber"
                                                    label="Spot type"
                                                    value={`${session.spot.type.name} · ${session.spot.type.size}`}/>
                                    )}
                                    {session.vehicle && (
                                        <DetailTile icon={<Car size={15}/>} color="slate"
                                                    label="Vehicle" value={session.vehicle.plateNumber}/>
                                    )}
                                </div>

                                {session.spot.type?.activeRuleName && (
                                    <div
                                        className="flex items-center gap-2 text-xs text-emerald-700 bg-emerald-50 border border-emerald-100 rounded-xl px-3 py-2">
                                        <Tag size={12}/>
                                        Active promo: <strong>{session.spot.type.activeRuleName}</strong>
                                        {session.spot.type.isDiscounted && (
                                            <span className="ml-auto text-emerald-600 font-bold">
                                                €{Number(session.spot.type.baseHourlyRate).toFixed(2)} → €{Number(effectiveRate).toFixed(2)}/hr
                                            </span>
                                        )}
                                    </div>
                                )}

                                <div
                                    className="bg-amber-50 border border-amber-200 rounded-xl p-3 flex items-start gap-2 text-xs text-amber-700">
                                    <AlertTriangle size={13} className="shrink-0 mt-0.5"/>
                                    Please end your session before leaving the facility. The meter keeps running until
                                    you check out.
                                </div>
                            </div>
                        </div>

                        {/* ── Right: checkout panel ── */}
                        <div
                            className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm flex flex-col gap-4 h-fit sticky top-6">
                            <div>
                                <h3 className="text-sm font-bold text-gray-800">Ready to Leave?</h3>
                                <p className="text-xs text-gray-400 mt-0.5">
                                    Final amount is locked at the moment you tap check out.
                                </p>
                            </div>

                            {/* Single cost display */}
                            <div className="bg-gradient-to-br from-slate-900 to-slate-700 rounded-xl p-4 text-center">
                                <p className="text-[10px] text-slate-400 mb-1 uppercase tracking-wider">Amount due</p>
                                <p className="text-4xl font-black text-white font-mono tabular-nums">€{currentCost}</p>
                                <p className="text-[10px] text-slate-400 mt-1.5">
                                    {formatDuration(elapsedSeconds)} @ €{Number(effectiveRate).toFixed(2)}/hr
                                </p>
                            </div>

                            <div className="text-xs text-gray-400 space-y-1.5 bg-slate-50 rounded-xl p-3">
                                <div className="flex justify-between">
                                    <span>Duration</span>
                                    <span
                                        className="font-medium text-gray-600 font-mono">{formatDuration(elapsedSeconds)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Rate</span>
                                    <div className="text-right">
                                        {session.spot.type?.isDiscounted && (
                                            <span className="line-through text-gray-300 mr-1.5">
                                                €{Number(session.spot.type.baseHourlyRate).toFixed(2)}
                                            </span>
                                        )}
                                        <span
                                            className="font-medium text-gray-600">€{Number(effectiveRate).toFixed(2)}/hr</span>
                                    </div>
                                </div>
                                <div className="flex justify-between border-t border-slate-200 pt-1.5">
                                    <span className="font-semibold text-gray-600">Total estimate</span>
                                    <span className="font-bold text-gray-800">€{currentCost}</span>
                                </div>
                            </div>

                            {checkoutError && (
                                <div
                                    className="bg-red-50 border border-red-200 rounded-xl px-3 py-2 text-xs text-red-600 flex items-start gap-2">
                                    <AlertTriangle size={12} className="shrink-0 mt-0.5"/>
                                    {checkoutError}
                                </div>
                            )}

                            <button
                                onClick={handleCheckout}
                                disabled={checkingOut}
                                className="w-full py-3 bg-rose-600 hover:bg-rose-700 disabled:opacity-60 text-white rounded-xl text-sm font-bold transition shadow-sm flex items-center justify-center gap-2"
                            >
                                {checkingOut
                                    ? <><Loader2 size={15} className="animate-spin"/> Processing…</>
                                    : "End Session & Check Out"
                                }
                            </button>

                            <p className="text-[10px] text-gray-400 text-center">
                                Payment is processed securely via POK
                            </p>
                        </div>
                    </div>
                )}
            </div>

            <div id="pok-payment-container"/>
        </UserSidebar>
    );
}

function DetailTile({icon, color, label, value}: { icon: any; color: string; label: string; value: string }) {
    const colors: Record<string, string> = {
        blue: "bg-blue-50 text-blue-600",
        emerald: "bg-emerald-50 text-emerald-600",
        purple: "bg-purple-50 text-purple-600",
        amber: "bg-amber-50 text-amber-600",
        slate: "bg-slate-100 text-slate-600",
    };
    return (
        <div className="flex items-center gap-2.5">
            <div
                className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${colors[color] ?? colors.slate}`}>
                {icon}
            </div>
            <div>
                <p className="text-[10px] text-gray-400 uppercase font-semibold">{label}</p>
                <p className="text-xs font-bold text-gray-800 leading-tight">{value}</p>
            </div>
        </div>
    );
}