"use client";

import { useState } from "react";
import {
    Car,
    Wrench,
    CheckCircle,
    XCircle,
    Users,
    Clock,
    Navigation,
} from "lucide-react";
import AdminSidebar from "@/components/sidebar/adminSidebar";

// Types
interface ParkingSpot {
    id: string;
    spotNumber: string;
    row: string;
    col: number;
    status: "available" | "occupied" | "maintenance";
    currentSession?: {
        userName: string;
        vehiclePlate: string;
        startTime: Date;
    };
}

// Generate a realistic parking lot layout
const generateMockSpots = (): ParkingSpot[] => {
    const spots: ParkingSpot[] = [];
    const rows = ["A", "B", "C"];
    const spotsPerRow = 8;

    rows.forEach((row) => {
        for (let col = 1; col <= spotsPerRow; col++) {
            const spotNumber = `${row}${col.toString().padStart(2, "0")}`;
            const rand = Math.random();
            let status: ParkingSpot["status"];
            if (rand < 0.5) status = "available";
            else if (rand < 0.8) status = "occupied";
            else status = "maintenance";

            const spot: ParkingSpot = {
                id: `${row}-${col}`,
                spotNumber,
                row,
                col,
                status,
            };

            if (status === "occupied") {
                spot.currentSession = {
                    userName: ["John Doe", "Sarah Smith", "Mike Johnson", "Emma Wilson"][
                        Math.floor(Math.random() * 4)
                        ],
                    vehiclePlate: `CAR-${Math.floor(Math.random() * 1000)}`,
                    startTime: new Date(Date.now() - Math.random() * 3600000),
                };
            }
            spots.push(spot);
        }
    });
    return spots;
};

export default function ParkingMapPage() {
    const [spots, setSpots] = useState<ParkingSpot[]>(generateMockSpots());
    const [selectedSpot, setSelectedSpot] = useState<ParkingSpot | null>(null);
    const [showSpotDetails, setShowSpotDetails] = useState(false);

    // Group spots by row for rendering
    const spotsByRow = spots.reduce(
        (acc, spot) => {
            if (!acc[spot.row]) acc[spot.row] = [];
            acc[spot.row].push(spot);
            return acc;
        },
        {} as Record<string, ParkingSpot[]>
    );

    // Sort rows alphabetically
    const rows = Object.keys(spotsByRow).sort();

    // Stats
    const total = spots.length;
    const available = spots.filter((s) => s.status === "available").length;
    const occupied = spots.filter((s) => s.status === "occupied").length;
    const maintenance = spots.filter((s) => s.status === "maintenance").length;

    const handleSpotClick = (spot: ParkingSpot) => {
        setSelectedSpot(spot);
        setShowSpotDetails(true);
    };

    const handleToggleMaintenance = (spotId: string) => {
        setSpots((prev) =>
            prev.map((s) =>
                s.id === spotId
                    ? {
                        ...s,
                        status: s.status === "maintenance" ? "available" : "maintenance",
                        currentSession: s.status === "maintenance" ? undefined : s.currentSession,
                    }
                    : s
            )
        );
        if (selectedSpot?.id === spotId) {
            setSelectedSpot((prev) =>
                prev
                    ? {
                        ...prev,
                        status: prev.status === "maintenance" ? "available" : "maintenance",
                        currentSession: prev.status === "maintenance" ? undefined : prev.currentSession,
                    }
                    : null
            );
        }
    };

    const handleForceVacate = (spotId: string) => {
        if (confirm("Force vacate this spot? The session will be ended and charged.")) {
            setSpots((prev) =>
                prev.map((s) =>
                    s.id === spotId ? { ...s, status: "available", currentSession: undefined } : s
                )
            );
            setShowSpotDetails(false);
        }
    };

    // Get background style for a spot based on status
    const getSpotStyle = (status: ParkingSpot["status"]) => {
        switch (status) {
            case "available":
                return "bg-green-50 border-green-500";
            case "occupied":
                return "bg-blue-50 border-blue-500";
            case "maintenance":
                return "bg-orange-50 border-orange-500";
        }
    };

    const getStatusIcon = (status: ParkingSpot["status"]) => {
        switch (status) {
            case "available":
                return <CheckCircle size={14} className="text-green-600" />;
            case "occupied":
                return <Car size={14} className="text-blue-600" />;
            case "maintenance":
                return <Wrench size={14} className="text-orange-600" />;
        }
    };

    return (
        <div className="min-h-screen bg-gray-100">
            <AdminSidebar />
            <div className="ml-64">
                <header className="bg-white border-b border-gray-200 px-8 py-4">
                    <div className="flex justify-between items-center flex-wrap gap-4">
                        <div>
                            <h1 className="text-2xl font-semibold text-gray-800">Parking Lot Map</h1>
                            <p className="text-sm text-gray-500 mt-1">
                                Real‑time visual overview – click any spot for details and actions.
                            </p>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-3">
                                <div className="flex items-center gap-1">
                                    <div className="w-4 h-4 rounded-sm bg-green-500 border border-green-600"></div>
                                    <span className="text-xs text-gray-600">Available</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <div className="w-4 h-4 rounded-sm bg-blue-500 border border-blue-600"></div>
                                    <span className="text-xs text-gray-600">Occupied</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <div className="w-4 h-4 rounded-sm bg-orange-500 border border-orange-600"></div>
                                    <span className="text-xs text-gray-600">Maintenance</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </header>

                <div className="p-8">
                    {/* Stats */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                        <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
                            <p className="text-sm text-gray-500">Total Spots</p>
                            <p className="text-2xl font-semibold text-gray-800">{total}</p>
                        </div>
                        <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
                            <p className="text-sm text-gray-500">Available</p>
                            <p className="text-2xl font-semibold text-green-600">{available}</p>
                        </div>
                        <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
                            <p className="text-sm text-gray-500">Occupied</p>
                            <p className="text-2xl font-semibold text-blue-600">{occupied}</p>
                        </div>
                        <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
                            <p className="text-sm text-gray-500">Maintenance</p>
                            <p className="text-2xl font-semibold text-orange-600">{maintenance}</p>
                        </div>
                    </div>

                    {/* Map Container */}
                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                        <div className="p-4 border-b border-gray-200 bg-gray-50 flex items-center justify-between">
                            <h2 className="font-semibold text-gray-800 flex items-center gap-2">
                                <Navigation size={18} className="text-gray-500" />
                                Main Parking Level
                            </h2>
                            <p className="text-xs text-gray-500">
                                {rows.length} rows • {spots.length} total spots
                            </p>
                        </div>

                        {/* Parking Lot Map */}
                        <div className="p-6 bg-gray-200">
                            <div className="max-w-5xl mx-auto">
                                {/* Entrance / Exit indicator */}
                                <div className="flex items-center justify-end mb-4">
                                    <div className="bg-gray-700 text-white px-4 py-1.5 rounded-full text-xs font-medium shadow-sm">
                                        🚗 ENTRANCE / EXIT →
                                    </div>
                                </div>

                                {/* Rows of parking spots with driving lanes */}
                                <div className="space-y-8">
                                    {rows.map((row, rowIndex) => (
                                        <div key={row} className="relative">
                                            {/* Row label */}
                                            <div className="absolute -left-8 top-1/2 -translate-y-1/2 font-bold text-gray-600 text-sm">
                                                {row}
                                            </div>

                                            {/* Parking spots row */}
                                            <div className="bg-gray-800 rounded-lg p-4 shadow-inner">
                                                <div className="grid grid-cols-8 gap-3">
                                                    {spotsByRow[row]
                                                        .sort((a, b) => a.col - b.col)
                                                        .map((spot) => (
                                                            <button
                                                                key={spot.id}
                                                                onClick={() => handleSpotClick(spot)}
                                                                className={`
                                  relative aspect-[4/5] rounded-md border-2 
                                  transition-all duration-200 cursor-pointer
                                  hover:scale-105 hover:shadow-lg
                                  ${getSpotStyle(spot.status)}
                                `}
                                                            >
                                                                {/* Parking bay lines */}
                                                                <div className="absolute inset-0 flex items-center justify-center">
                                                                    <div className="w-full h-full flex flex-col items-center justify-between p-1">
                                                                        {/* Spot number at top */}
                                                                        <span className="text-[10px] font-bold text-gray-700 bg-white/60 px-1 rounded">
                                      {spot.spotNumber}
                                    </span>

                                                                        {/* Vehicle or status icon */}
                                                                        <div className="flex-1 flex items-center justify-center">
                                                                            {spot.status === "occupied" ? (
                                                                                <div className="relative w-full h-full flex items-center justify-center">
                                                                                    <Car
                                                                                        size={28}
                                                                                        className="text-gray-700 drop-shadow"
                                                                                        strokeWidth={1.5}
                                                                                    />
                                                                                    <span className="absolute bottom-0 text-[8px] font-medium text-gray-700 bg-white/70 px-1 rounded">
                                            {spot.currentSession?.vehiclePlate}
                                          </span>
                                                                                </div>
                                                                            ) : spot.status === "maintenance" ? (
                                                                                <Wrench size={20} className="text-orange-600" />
                                                                            ) : (
                                                                                <CheckCircle size={16} className="text-green-600 opacity-60" />
                                                                            )}
                                                                        </div>

                                                                        {/* Status indicator dot */}
                                                                        <div
                                                                            className={`w-2 h-2 rounded-full ${
                                                                                spot.status === "available"
                                                                                    ? "bg-green-500"
                                                                                    : spot.status === "occupied"
                                                                                        ? "bg-blue-500"
                                                                                        : "bg-orange-500"
                                                                            }`}
                                                                        />
                                                                    </div>
                                                                </div>
                                                            </button>
                                                        ))}
                                                </div>
                                            </div>

                                            {/* Driving lane between rows (except after last row) */}
                                            {rowIndex < rows.length - 1 && (
                                                <div className="h-8 flex items-center justify-center my-2">
                                                    <div className="w-full h-0.5 bg-yellow-400/50 border-t-2 border-dashed border-yellow-600"></div>
                                                    <span className="absolute text-[10px] text-gray-500 bg-gray-200 px-2">
                            DRIVING LANE
                          </span>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>

                                {/* Legend for orientation */}
                                <div className="mt-6 flex justify-center">
                                    <div className="bg-white/80 backdrop-blur-sm rounded-full px-4 py-2 shadow-sm text-xs text-gray-600 flex items-center gap-4">
                                        <span>← West</span>
                                        <span className="font-medium">Aisle</span>
                                        <span>East →</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Spot Details Modal (unchanged from previous) */}
            {showSpotDetails && selectedSpot && (
                <div
                    className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4"
                    onClick={() => setShowSpotDetails(false)}
                >
                    <div
                        className="bg-white rounded-xl shadow-xl w-full max-w-md"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex justify-between items-center p-6 border-b border-gray-200">
                            <h3 className="text-xl font-semibold text-gray-800">
                                Spot {selectedSpot.spotNumber}
                            </h3>
                            <button
                                onClick={() => setShowSpotDetails(false)}
                                className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                <XCircle size={20} className="text-gray-500" />
                            </button>
                        </div>

                        <div className="p-6 space-y-4">
                            <div className="flex items-center gap-2">
                <span
                    className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${
                        selectedSpot.status === "available"
                            ? "bg-green-100 text-green-800"
                            : selectedSpot.status === "occupied"
                                ? "bg-blue-100 text-blue-800"
                                : "bg-orange-100 text-orange-800"
                    }`}
                >
                  {getStatusIcon(selectedSpot.status)}
                    {selectedSpot.status.charAt(0).toUpperCase() + selectedSpot.status.slice(1)}
                </span>
                            </div>

                            {selectedSpot.status === "occupied" && selectedSpot.currentSession && (
                                <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                                    <div className="flex items-center gap-2">
                                        <Users size={18} className="text-gray-500" />
                                        <span className="text-gray-700">{selectedSpot.currentSession.userName}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Car size={18} className="text-gray-500" />
                                        <span className="text-gray-700">{selectedSpot.currentSession.vehiclePlate}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Clock size={18} className="text-gray-500" />
                                        <span className="text-gray-700">
                      Started: {selectedSpot.currentSession.startTime.toLocaleTimeString()}
                    </span>
                                    </div>
                                </div>
                            )}

                            <div className="space-y-2 pt-2">
                                {selectedSpot.status === "occupied" && (
                                    <button
                                        onClick={() => handleForceVacate(selectedSpot.id)}
                                        className="w-full px-4 py-2 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors flex items-center justify-center gap-2"
                                    >
                                        <XCircle size={18} />
                                        Force Vacate & Charge
                                    </button>
                                )}
                                <button
                                    onClick={() => handleToggleMaintenance(selectedSpot.id)}
                                    className={`w-full px-4 py-2 rounded-lg transition-colors flex items-center justify-center gap-2 ${
                                        selectedSpot.status === "maintenance"
                                            ? "bg-green-50 text-green-700 hover:bg-green-100"
                                            : "bg-orange-50 text-orange-700 hover:bg-orange-100"
                                    }`}
                                >
                                    <Wrench size={18} />
                                    {selectedSpot.status === "maintenance"
                                        ? "Mark as Available"
                                        : "Set Maintenance Mode"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}