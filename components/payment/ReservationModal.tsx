"use client";

import {useEffect, useState} from "react";
import {createPortal} from "react-dom";
import {CheckCircle2, CreditCard, Tag, X} from "lucide-react";

interface SpotType {
    name: string;
    size: string;
    baseHourlyRate: number;
    effectiveHourlyRate: number;
    isDiscounted: boolean;
    activeRuleName: string | null;
}

interface Props {
    spot: { spotNumber: string; floor: number; type?: SpotType; lot?: { name: string } };
    card: { hiddenNumber: string; isDefault: boolean };
    onClose: () => void;
    onConfirm: () => Promise<void>;
}

export default function ReservationModal({spot, card, onClose, onConfirm}: Props) {
    const [mounted, setMounted] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);
    if (!mounted) return null;

    const rate = spot.type?.effectiveHourlyRate ?? spot.type?.baseHourlyRate ?? 0;

    return createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 p-4">
            <div className="bg-white rounded-2xl w-full max-w-sm shadow-2xl overflow-hidden">

                {/* Header */}
                <div
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-4 flex justify-between items-center">
                    <h2 className="text-white font-bold text-base">Confirm Reservation</h2>
                    <button onClick={onClose} className="text-white/70 hover:text-white transition">
                        <X size={18}/>
                    </button>
                </div>

                <div className="p-5 space-y-4">
                    {/* Spot summary */}
                    <div className="bg-slate-50 rounded-xl p-4 space-y-3 border border-slate-100">
                        <div className="flex items-center gap-3">
                            <div
                                className="w-10 h-10 bg-blue-100 text-blue-700 rounded-xl flex items-center justify-center font-black text-sm">
                                {spot.spotNumber.split("-")[1] ?? spot.spotNumber}
                            </div>
                            <div>
                                <p className="font-bold text-gray-900 text-sm">Spot {spot.spotNumber}</p>
                                <p className="text-xs text-gray-400">Floor {spot.floor}{spot.lot ? ` · ${spot.lot.name}` : ""}</p>
                            </div>
                        </div>

                        {spot.type && (
                            <div className="border-t border-slate-200 pt-3 space-y-2">
                                <div className="flex justify-between text-xs">
                                    <span className="text-gray-500">Category</span>
                                    <span
                                        className="font-semibold text-gray-800">{spot.type.name} ({spot.type.size})</span>
                                </div>
                                <div className="flex justify-between text-xs">
                                    <span className="text-gray-500">Hourly rate</span>
                                    <div className="text-right">
                                        {spot.type.isDiscounted && (
                                            <span className="line-through text-gray-400 mr-1.5">
                                                €{Number(spot.type.baseHourlyRate).toFixed(2)}
                                            </span>
                                        )}
                                        <span
                                            className={`font-bold ${spot.type.isDiscounted ? "text-emerald-600" : "text-gray-900"}`}>
                                            €{Number(rate).toFixed(2)}/hr
                                        </span>
                                    </div>
                                </div>
                                {spot.type.activeRuleName && (
                                    <div
                                        className="flex items-center gap-1.5 text-[10px] text-emerald-700 bg-emerald-50 rounded-lg px-2 py-1.5">
                                        <Tag size={10}/>
                                        Promo: {spot.type.activeRuleName}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Billing note */}
                    <div className="bg-amber-50 border border-amber-200 rounded-xl px-3 py-2.5 text-xs text-amber-700">
                        You will be billed <strong>€{Number(rate).toFixed(2)}/hr</strong> based on your actual parking
                        duration when you check out.
                    </div>

                    {/* Payment method */}
                    <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
                        <div
                            className="w-9 h-9 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center shrink-0">
                            <CreditCard size={15} className="text-white"/>
                        </div>
                        <div>
                            <p className="text-xs font-bold text-gray-800">•••• {card.hiddenNumber?.slice(-4)}</p>
                            <p className="text-[10px] text-gray-400">{card.isDefault ? "Default card" : "Selected card"}</p>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 pt-1">
                        <button
                            onClick={onClose}
                            className="flex-1 py-2.5 border border-gray-200 hover:bg-gray-50 text-gray-600 rounded-xl text-sm font-semibold transition"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={async () => {
                                setLoading(true);
                                await onConfirm();
                                setLoading(false);
                            }}
                            disabled={loading}
                            className="flex-1 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 text-white rounded-xl text-sm font-semibold transition flex items-center justify-center gap-2"
                        >
                            {loading ? <div
                                    className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"/> :
                                <CheckCircle2 size={15}/>}
                            {loading ? "Reserving…" : "Confirm"}
                        </button>
                    </div>
                </div>
            </div>
        </div>,
        document.body
    );
}