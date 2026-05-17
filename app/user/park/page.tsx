"use client";

import {useEffect, useMemo, useState} from "react";
import {Car, DollarSign, Layers, Loader2, Navigation, X} from "lucide-react";
import UserSidebar from "@/components/sidebar/userSidebar";
import ParkingSpotService from "@/services/ParkingSpotService";
import {handleRequestErrors} from "@/utils/functions";

// Mapped types to match your full backend entity schema
type VehicleSize = "small" | "medium" | "large";
type SpotStatus = "available" | "occupied" | "maintenance" | "reserved";

interface ParkingSpot {
    id: string;
    spotNumber: string;
    floor: number;
    status: SpotStatus;
    type?: {
        id: string;
        name: string;
        size: VehicleSize;
        baseHourlyRate: string | number;
    };
    lot?: {
        id: string;
        name: string;
    };
}

export default function DynamicUserMapPage() {
    const [spots, setSpots] = useState<ParkingSpot[]>([]);
    const [selectedSpot, setSelectedSpot] = useState<ParkingSpot | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLiveSpots = async () => {
            try {
                setLoading(true);
                const response = await ParkingSpotService.findAllUserMap();
                setSpots(response.data);
            } catch (err) {
                handleRequestErrors(err);
            } finally {
                setLoading(false);
            }
        };

        fetchLiveSpots();
    }, []);

    // Parse, Group, and Sort Grid Layout structures on the fly
    const spotsByDynamicRow = useMemo(() => {
        const groupings: Record<string, ParkingSpot[]> = {};
        const safeSpots = Array.isArray(spots) ? spots : [];

        safeSpots.forEach((spot) => {
            if (!spot || !spot.spotNumber) return;

            // Extract the row prefix (e.g., "A" from "A-02")
            const parts = spot.spotNumber.split("-");
            const rowLetter = parts[0].trim().toUpperCase();

            if (!groupings[rowLetter]) {
                groupings[rowLetter] = [];
            }
            groupings[rowLetter].push(spot);
        });

        // Sort slot positions inside row tracks sequentially (e.g., A-01, A-02)
        Object.keys(groupings).forEach((rowLetter) => {
            groupings[rowLetter].sort((a, b) => {
                const numA = parseInt(a.spotNumber.split("-")[1], 10) || 0;
                const numB = parseInt(b.spotNumber.split("-")[1], 10) || 0;
                return numA - numB;
            });
        });

        return groupings;
    }, [spots]);

    // Track rows sequentially down the screen layout (A, B, C, D, E...)
    const sortedRowKeys = useMemo(() => {
        return Object.keys(spotsByDynamicRow).sort();
    }, [spotsByDynamicRow]);

    if (loading) {
        return (
            <UserSidebar>
                <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
                    <Loader2 className="w-8 h-8 text-blue-600 animate-spin mb-2"/>
                    <p className="text-sm text-gray-500 font-medium">Loading real-time map infrastructure...</p>
                </div>
            </UserSidebar>
        );
    }

    return (
        <UserSidebar>
            <div className="min-h-screen bg-slate-50 p-4 md:p-8 flex flex-col lg:flex-row gap-6">

                {/* Left Side: The Interactive Map Container */}
                <div className="flex-1 space-y-6">
                    <header className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                        <h1 className="text-xl font-extrabold text-gray-900">Live Parking Grid</h1>
                        <p className="text-xs text-gray-500 mt-0.5">This map updates fluidly as changes are authorized
                            by management.</p>
                    </header>

                    <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm space-y-8">
                        <div
                            className="flex items-center justify-between text-xs text-gray-400 pb-2 border-b border-gray-100">
                            <span className="flex items-center gap-1.5 font-bold uppercase"><Navigation size={14}/> Dynamic Grid Matrix</span>
                            <span>Entrance Area →</span>
                        </div>

                        {spots.length === 0 ? (
                            <div className="py-12 text-center text-gray-400 text-sm">
                                No active zones mapped in the database at the moment.
                            </div>
                        ) : (
                            <div className="space-y-8 bg-slate-100 p-4 md:p-6 rounded-xl border border-slate-200">
                                {sortedRowKeys.map((rowKey) => (
                                    <div key={rowKey} className="relative pl-6">
                                        {/* Row Label Identifier */}
                                        <div
                                            className="absolute left-0 top-1/2 -translate-y-1/2 font-black text-sm text-slate-400">
                                            {rowKey}
                                        </div>

                                        {/* STRICT 10-COLUMN GRID LAYOUT */}
                                        <div
                                            className="bg-slate-800 p-4 rounded-xl shadow-inner grid grid-cols-10 gap-3">
                                            {spotsByDynamicRow[rowKey].map((spot) => {
                                                const isSelected = selectedSpot?.id === spot.id;
                                                const isAvailable = spot.status === "available";

                                                return (
                                                    <button
                                                        key={spot.id}
                                                        disabled={!isAvailable}
                                                        onClick={() => setSelectedSpot(spot)}
                                                        className={`h-20 rounded transition-all flex flex-col items-center justify-between p-1.5 border font-mono w-full ${
                                                            isSelected
                                                                ? "bg-blue-600 border-white text-white scale-105 shadow-md ring-2 ring-blue-400 z-10"
                                                                : isAvailable
                                                                    ? "bg-emerald-50 border-emerald-500 text-emerald-900 hover:bg-emerald-100/80"
                                                                    : spot.status === "occupied"
                                                                        ? "bg-slate-700 border-transparent text-slate-500 opacity-40 cursor-not-allowed"
                                                                        : "bg-amber-100 border-amber-400 text-amber-700 cursor-not-allowed"
                                                        }`}
                                                    >
                                                        <span
                                                            className="text-[10px] font-bold tracking-tight">{spot.spotNumber}</span>
                                                        {spot.status === "occupied" ? (
                                                            <Car size={16} className="text-slate-500"/>
                                                        ) : (
                                                            <div className="w-1.5 h-1.5 rounded-full bg-current"/>
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

                {/* Right Side: Contextual Spot Information Window Panel */}
                {selectedSpot && (
                    <div
                        className="w-full lg:w-80 bg-white border border-gray-200 rounded-2xl p-6 shadow-sm h-fit space-y-6 animate-fadeIn sticky top-8">
                        <div className="flex justify-between items-center pb-3 border-b border-gray-100">
                            <div>
                                <h2 className="text-lg font-bold text-gray-800">Spot Details</h2>
                                <p className="text-xs text-gray-400">Selected Allocation</p>
                            </div>
                            <button
                                onClick={() => setSelectedSpot(null)}
                                className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition"
                            >
                                <X size={18}/>
                            </button>
                        </div>

                        <div className="space-y-4">
                            {/* Spot Number / Name */}
                            <div className="flex items-center gap-3">
                                <div
                                    className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center font-bold">
                                    {selectedSpot.spotNumber.split("-")[1] || selectedSpot.spotNumber}
                                </div>
                                <div>
                                    <p className="text-xs text-gray-400 font-medium">Spot Code Identification</p>
                                    <p className="text-sm font-bold text-gray-800">Row
                                        Assignment {selectedSpot.spotNumber}</p>
                                </div>
                            </div>

                            {/* Deck / Floor Elevation */}
                            <div className="flex items-center gap-3">
                                <div
                                    className="w-10 h-10 bg-slate-50 text-slate-600 rounded-xl flex items-center justify-center">
                                    <Layers size={18}/>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-400 font-medium">Floor / Level</p>
                                    <p className="text-sm font-bold text-gray-800">Deck {selectedSpot.floor || 1}</p>
                                </div>
                            </div>

                            {/* Linked Category Size Pricing Configuration */}
                            {selectedSpot.type && (
                                <div className="p-4 bg-slate-50 rounded-xl border border-gray-100 space-y-2">
                                    <div className="flex justify-between items-center text-xs">
                                        <span className="text-gray-500 font-medium">Tariff Category:</span>
                                        <span
                                            className="font-bold text-gray-800 uppercase bg-blue-100 text-blue-800 px-2 py-0.5 rounded text-[10px]">
                                            {selectedSpot.type.name} ({selectedSpot.type.size})
                                        </span>
                                    </div>
                                    <div
                                        className="flex justify-between items-center pt-2 border-t border-gray-200/60 text-xs">
                                        <span className="text-gray-500 font-medium flex items-center gap-1">
                                            <DollarSign size={13}/> Base Hourly Rate:
                                        </span>
                                        <span className="font-extrabold text-gray-900 text-sm">
                                            ${Number(selectedSpot.type.baseHourlyRate || 0).toFixed(2)}/hr
                                        </span>
                                    </div>
                                </div>
                            )}

                            {/* Attached Structure Lot Identity metadata mapping */}
                            {selectedSpot.lot && (
                                <div className="text-xs text-center text-gray-400 pt-2 border-t border-gray-100">
                                    Facility Location: <span
                                    className="font-semibold text-gray-600">{selectedSpot.lot.name}</span>
                                </div>
                            )}
                        </div>

                        <button
                            className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl shadow-md font-semibold text-sm transition-all transform hover:-translate-y-0.5"
                            onClick={() => alert(`Proceeding to lock reservation for slot: ${selectedSpot.spotNumber}`)}
                        >
                            Reserve Spot
                        </button>
                    </div>
                )}

            </div>
        </UserSidebar>
    );
}