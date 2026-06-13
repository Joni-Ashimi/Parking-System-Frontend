"use client";

import {useEffect, useMemo, useState} from "react";
import {AlertCircle, Bike, Car, CheckCircle2, CreditCard, MapPin, Navigation, Tag, Truck, X} from "lucide-react";
import UserSidebar from "@/components/sidebar/userSidebar";
import ParkingSpotService from "@/services/ParkingSpotService";
import CardsService from "@/services/CardsService";
import VehicleService from "@/services/VehicleService";
import ParkingSessionService from "@/services/ParkingSessionService";
import {handleRequestErrors} from "@/utils/functions";
import dynamic from "next/dynamic";
import {useRouter} from "next/navigation";

const AddCardModal = dynamic(() => import("@/components/payment/AddCardModal"), {ssr: false});
const ReservationModal = dynamic(() => import("@/components/payment/ReservationModal"), {ssr: false});

type VehicleSize = "small" | "medium" | "large";
type SpotStatus = "available" | "occupied" | "maintenance" | "reserved";

interface SpotType {
    id: string;
    name: string;
    size: VehicleSize;
    baseHourlyRate: number;
    effectiveHourlyRate: number;
    isDiscounted: boolean;
    activeRuleName: string | null;
}

interface ParkingSpot {
    id: string;
    spotNumber: string;
    floor: number;
    status: SpotStatus;
    type?: SpotType;
    lot?: { id: string; name: string };
}

interface Vehicle {
    id: string;
    type: string;
    plateNumber: string;
    isDefault: boolean;
}

interface Card {
    id: string;
    hiddenNumber: string;
    isDefault: boolean;
    pokCardId: string;
}

const VEHICLE_SIZE_MAP: Record<string, VehicleSize> = {
    car: "medium",
    motorcycle: "small",
    truck: "large",
    bus: "large",
};

const VEHICLE_ICONS: Record<string, any> = {
    car: Car,
    motorcycle: Bike,
    truck: Truck,
    bus: Truck,
};

const SPOT_SIZE_MAP: Record<string, VehicleSize> = {
    small: "small",
    standard: "medium",
    large: "large",
};

export default function DynamicUserMapPage() {
    const [spots, setSpots] = useState<ParkingSpot[]>([]);
    const [selectedSpot, setSelectedSpot] = useState<ParkingSpot | null>(null);
    const [loading, setLoading] = useState(true);
    const [userCards, setUserCards] = useState<Card[]>([]);
    const [defaultVehicle, setDefaultVehicle] = useState<Vehicle | null>(null);
    const [isAddCardOpen, setIsAddCardOpen] = useState(false);
    const [isReserveOpen, setIsReserveOpen] = useState(false);
    const router = useRouter();

    const compatibleSize = defaultVehicle ? VEHICLE_SIZE_MAP[defaultVehicle.type] : null;

    useEffect(() => {
        Promise.all([
            CardsService.listUserCards(),
            VehicleService.getDefaultVehicle().catch(() => null),
        ]).then(([cards, vehicle]) => {
            setUserCards(cards || []);
            setDefaultVehicle(vehicle);
        });
    }, []);

    useEffect(() => {
        ParkingSpotService.findAllUserMap()
            .then(r => setSpots(Array.isArray(r) ? r : r?.data ?? []))
            .catch(handleRequestErrors)
            .finally(() => setLoading(false));
    }, []);

    const spotsByRow = useMemo(() => {
        const groups: Record<string, ParkingSpot[]> = {};
        spots.forEach(spot => {
            if (!spot?.spotNumber) return;
            const row = spot.spotNumber.split("-")[0].trim().toUpperCase();
            if (!groups[row]) groups[row] = [];
            groups[row].push(spot);
        });
        Object.values(groups).forEach(g =>
            g.sort((a, b) => (parseInt(a.spotNumber.split("-")[1]) || 0) - (parseInt(b.spotNumber.split("-")[1]) || 0))
        );
        return groups;
    }, [spots]);

    const sortedRows = useMemo(() => Object.keys(spotsByRow).sort(), [spotsByRow]);

    const defaultCard = userCards.find(c => c.isDefault) ?? userCards[0] ?? null;

    const handleSpotClick = (spot: ParkingSpot) => {
        if (spot.status !== "available") return;
        if (compatibleSize && spot.type?.size) {
            const normalizedSpotSize = SPOT_SIZE_MAP[spot.type.size.toLowerCase()] ?? spot.type.size.toLowerCase();
            if (normalizedSpotSize !== compatibleSize) return;
        }
        setSelectedSpot(spot);
    };

    const getSpotState = (spot: ParkingSpot): "selected" | "compatible" | "incompatible" | "occupied" | "maintenance" => {
        if (selectedSpot?.id === spot.id) return "selected";
        if (spot.status === "occupied") return "occupied";
        if (spot.status === "maintenance" || spot.status === "reserved") return "maintenance";
        if (compatibleSize && spot.type?.size) {
            const normalizedSpotSize = SPOT_SIZE_MAP[spot.type.size.toLowerCase()] ?? spot.type.size.toLowerCase();
            if (normalizedSpotSize !== compatibleSize) return "incompatible";
        }
        return "compatible";
    };


    const spotStateClasses: Record<string, string> = {
        selected: "bg-blue-600 border-white text-white scale-105 shadow-lg ring-2 ring-blue-400 z-10",
        compatible: "bg-emerald-50 border-emerald-400 text-emerald-900 hover:bg-emerald-100 cursor-pointer",
        incompatible: "bg-slate-600 border-transparent text-slate-400 opacity-50 cursor-not-allowed",
        occupied: "bg-slate-700 border-transparent text-slate-500 opacity-40 cursor-not-allowed",
        maintenance: "bg-amber-900/40 border-amber-600/40 text-amber-400 opacity-60 cursor-not-allowed",
    };

    if (loading) return (
        <UserSidebar>
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
                <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mb-3"/>
                <p className="text-sm text-gray-500 font-medium">Loading parking map…</p>
            </div>
        </UserSidebar>
    );

    return (
        <UserSidebar>
            <div className="min-h-screen bg-slate-50 p-4 md:p-6 flex flex-col lg:flex-row gap-5">

                {/* ── Left: Map ── */}
                <div className="flex-1 space-y-4 min-w-0">

                    {/* Header */}
                    <div
                        className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 flex items-start justify-between gap-4">
                        <div>
                            <h1 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                                <Navigation size={18} className="text-blue-500"/> Live Parking Grid
                            </h1>
                            <p className="text-xs text-gray-400 mt-0.5">Real-time availability — select a spot to
                                reserve.</p>
                        </div>
                        {defaultVehicle && (() => {
                            const Icon = VEHICLE_ICONS[defaultVehicle.type] ?? Car;
                            return (
                                <div
                                    className="flex items-center gap-2 bg-blue-50 border border-blue-100 rounded-xl px-3 py-2 shrink-0">
                                    <Icon size={15} className="text-blue-600"/>
                                    <div className="text-right">
                                        <p className="text-[10px] text-blue-400 font-medium uppercase">Your vehicle</p>
                                        <p className="text-xs font-bold text-blue-700">{defaultVehicle.plateNumber}</p>
                                    </div>
                                </div>
                            );
                        })()}
                    </div>

                    {/* Legend */}
                    <div className="flex flex-wrap gap-3 px-1">
                        {[
                            {color: "bg-emerald-400", label: "Compatible"},
                            {color: "bg-slate-500", label: "Incompatible size"},
                            {color: "bg-slate-700", label: "Occupied"},
                            {color: "bg-amber-600", label: "Maintenance"},
                            {color: "bg-blue-600", label: "Selected"},
                        ].map(({color, label}) => (
                            <span key={label} className="flex items-center gap-1.5 text-xs text-gray-500">
                                <span className={`w-2.5 h-2.5 rounded-sm ${color}`}/>
                                {label}
                            </span>
                        ))}
                    </div>

                    {/* Grid */}
                    <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
                        {spots.length === 0 ? (
                            <div className="py-16 text-center text-gray-400 text-sm">No spots available.</div>
                        ) : (
                            <div className="space-y-6 bg-slate-100 p-4 rounded-xl border border-slate-200">
                                {sortedRows.map(row => (
                                    <div key={row} className="relative pl-7">
                                        <span
                                            className="absolute left-0 top-1/2 -translate-y-1/2 font-black text-xs text-slate-400">{row}</span>
                                        <div className="bg-slate-800 p-3 rounded-xl grid grid-cols-10 gap-2">
                                            {spotsByRow[row].map(spot => {
                                                const state = getSpotState(spot);
                                                return (
                                                    <button
                                                        key={spot.id}
                                                        disabled={state === "occupied" || state === "maintenance" || state === "incompatible"}
                                                        onClick={() => handleSpotClick(spot)}
                                                        title={spot.type ? `${spot.type.name} · €${spot.type.effectiveHourlyRate}/hr` : spot.spotNumber}
                                                        className={`h-16 rounded-lg transition-all flex flex-col items-center justify-between p-1.5 border text-[9px] font-bold font-mono w-full ${spotStateClasses[state]}`}
                                                    >
                                                        <span
                                                            className="tracking-tight leading-tight">{spot.spotNumber.split("-")[1] ?? spot.spotNumber}</span>
                                                        {state === "occupied"
                                                            ? <Car size={12} className="text-slate-500"/>
                                                            : state === "selected"
                                                                ? <CheckCircle2 size={12}/>
                                                                : <div className="w-1 h-1 rounded-full bg-current"/>
                                                        }
                                                        {spot.type?.isDiscounted && state === "compatible" && (
                                                            <span
                                                                className="text-[7px] text-emerald-600 font-black">DEAL</span>
                                                        )}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* ── Right: Spot Detail Panel ── */}
                {selectedSpot && (
                    <div className="w-full lg:w-72 xl:w-80 shrink-0 space-y-4 sticky top-6 h-fit">

                        {/* Spot info card */}
                        <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm space-y-4">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h2 className="text-base font-bold text-gray-900">Spot {selectedSpot.spotNumber}</h2>
                                    <p className="text-xs text-gray-400">Floor {selectedSpot.floor}</p>
                                </div>
                                <button onClick={() => setSelectedSpot(null)}
                                        className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 transition">
                                    <X size={16}/>
                                </button>
                            </div>

                            {selectedSpot.lot && (
                                <div className="flex items-center gap-2 text-xs text-gray-500">
                                    <MapPin size={13} className="text-gray-400"/>
                                    {selectedSpot.lot.name}
                                </div>
                            )}

                            {selectedSpot.type && (
                                <div className="bg-slate-50 rounded-xl p-3 space-y-2.5 border border-slate-100">
                                    <div className="flex justify-between items-center">
                                        <span className="text-xs text-gray-500">Category</span>
                                        <span
                                            className="text-xs font-bold text-gray-800 bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                                            {selectedSpot.type.name} · {selectedSpot.type.size}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center border-t border-slate-200 pt-2">
                                        <span className="text-xs text-gray-500">Rate</span>
                                        <div className="text-right">
                                            {selectedSpot.type.isDiscounted ? (
                                                <>
                                                    <span className="text-xs line-through text-gray-400 mr-1">
                                                        €{Number(selectedSpot.type.baseHourlyRate).toFixed(2)}
                                                    </span>
                                                    <span className="text-sm font-extrabold text-emerald-600">
                                                        €{selectedSpot.type.effectiveHourlyRate.toFixed(2)}/hr
                                                    </span>
                                                </>
                                            ) : (
                                                <span className="text-sm font-extrabold text-gray-900">
                                                    €{Number(selectedSpot.type.effectiveHourlyRate ?? selectedSpot.type.baseHourlyRate).toFixed(2)}/hr
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    {selectedSpot.type.activeRuleName && (
                                        <div
                                            className="flex items-center gap-1.5 text-[10px] text-emerald-700 bg-emerald-50 rounded-lg px-2 py-1">
                                            <Tag size={10}/>
                                            {selectedSpot.type.activeRuleName} active
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Payment method */}
                        <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm space-y-3">
                            <p className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Payment
                                Method</p>
                            {defaultCard ? (
                                <div
                                    className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
                                    <div
                                        className="w-9 h-9 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center shrink-0">
                                        <CreditCard size={16} className="text-white"/>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-xs font-bold text-gray-800 truncate">
                                            •••• {defaultCard.hiddenNumber?.slice(-4) ?? "????"}
                                        </p>
                                        <p className="text-[10px] text-gray-400">
                                            {defaultCard.isDefault ? "Default card" : `Card ${userCards.indexOf(defaultCard) + 1}`}
                                        </p>
                                    </div>
                                    {defaultCard.isDefault && (
                                        <span
                                            className="text-[9px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded-full shrink-0">DEFAULT</span>
                                    )}
                                </div>
                            ) : (
                                <div className="text-center py-4 border-2 border-dashed border-gray-200 rounded-xl">
                                    <p className="text-xs text-gray-400 mb-2">No payment method saved</p>
                                </div>
                            )}
                            <button
                                onClick={() => setIsAddCardOpen(true)}
                                className="w-full text-xs text-blue-600 hover:text-blue-700 font-medium py-1.5 border border-blue-100 hover:border-blue-200 rounded-lg bg-blue-50 hover:bg-blue-100 transition"
                            >
                                + Add / change card
                            </button>
                        </div>

                        {/* Reserve button */}
                        <button
                            onClick={() => {
                                if (!defaultCard) {
                                    setIsAddCardOpen(true);
                                    return;
                                }
                                setIsReserveOpen(true);
                            }}
                            className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl shadow-md font-semibold text-sm transition-all hover:-translate-y-0.5"
                        >
                            Reserve Spot
                        </button>

                        {!defaultVehicle && (
                            <p className="text-xs text-center text-amber-600 flex items-center justify-center gap-1">
                                <AlertCircle size={12}/> Set a default vehicle to filter compatible spots
                            </p>
                        )}
                    </div>
                )}
            </div>

            {isAddCardOpen && (
                <AddCardModal
                    onClose={() => setIsAddCardOpen(false)}
                    onComplete={async () => {
                        setIsAddCardOpen(false);
                        const updated = await CardsService.listUserCards();
                        setUserCards(updated || []);
                    }}
                />
            )}

            {isReserveOpen && selectedSpot && defaultCard && (
                <ReservationModal
                    spot={selectedSpot}
                    card={defaultCard}
                    onClose={() => setIsReserveOpen(false)}
                    onConfirm={async () => {
                        try {
                            await ParkingSessionService.reserveSpot(selectedSpot.id, defaultCard.id);
                            router.push("/user/parking");
                        } catch (err) {
                            handleRequestErrors(err);
                        }
                    }}
                />
            )}
        </UserSidebar>
    );
}