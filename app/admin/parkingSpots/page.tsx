"use client";

import {useState} from "react";
import {AlertCircle, Check, Plus, X,} from "lucide-react";
import AdminSidebar from "@/components/sidebar/adminSidebar";
import SpotCard from "@/components/admin/SpotCard";

type VehicleSize = "small" | "medium" | "large";
type SpotStatus = "available" | "occupied" | "maintenance";

export interface ParkingSpot {
    id: string;
    spotNumber: string;
    size: VehicleSize;
    status: SpotStatus;
    pricePerHour: number;
}

interface SizePricing {
    small: number;
    medium: number;
    large: number;
}

// Mock Data
const initialSpots: ParkingSpot[] = [
    {id: "1", spotNumber: "A01", size: "small", status: "available", pricePerHour: 5},
    {id: "2", spotNumber: "A02", size: "small", status: "occupied", pricePerHour: 5},
    {id: "3", spotNumber: "B01", size: "medium", status: "available", pricePerHour: 8},
    {id: "4", spotNumber: "B02", size: "medium", status: "maintenance", pricePerHour: 8},
    {id: "5", spotNumber: "C01", size: "large", status: "available", pricePerHour: 12},
    {id: "6", spotNumber: "C02", size: "large", status: "occupied", pricePerHour: 12},
];

const initialPricing: SizePricing = {
    small: 5,
    medium: 8,
    large: 12,
};

export default function ParkingSpotsConfig() {
    const [spots, setSpots] = useState<ParkingSpot[]>(initialSpots);
    const [pricing, setPricing] = useState<SizePricing>(initialPricing);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingSpot, setEditingSpot] = useState<ParkingSpot | null>(null);
    const [filterStatus, setFilterStatus] = useState<SpotStatus | "all">("all");
    const [filterSize, setFilterSize] = useState<VehicleSize | "all">("all");

    const [formData, setFormData] = useState({
        spotNumber: "",
        size: "medium" as VehicleSize,
        status: "available" as SpotStatus,
    });

    const totalSpots = spots.length;
    const availableSpots = spots.filter((s) => s.status === "available").length;
    const occupiedSpots = spots.filter((s) => s.status === "occupied").length;
    const maintenanceSpots = spots.filter((s) => s.status === "maintenance").length;

    const filteredSpots = spots.filter((spot) => {
        if (filterStatus !== "all" && spot.status !== filterStatus) return false;
        if (filterSize !== "all" && spot.size !== filterSize) return false;
        return true;
    });

    const handleOpenModal = (spot?: ParkingSpot) => {
        if (spot) {
            setEditingSpot(spot);
            setFormData({
                spotNumber: spot.spotNumber,
                size: spot.size,
                status: spot.status,
            });
        } else {
            setEditingSpot(null);
            setFormData({spotNumber: "", size: "medium", status: "available"});
        }
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingSpot(null);
    };

    const handleSaveSpot = () => {
        const price = pricing[formData.size];
        if (editingSpot) {
            setSpots((prev) =>
                prev.map((s) =>
                    s.id === editingSpot.id ? {...s, ...formData, pricePerHour: price} : s
                )
            );
        } else {
            const newSpot: ParkingSpot = {
                id: Date.now().toString(),
                ...formData,
                pricePerHour: price,
            };
            setSpots((prev) => [...prev, newSpot]);
        }
        handleCloseModal();
    };

    const handleDeleteSpot = (id: string) => {
        if (confirm("Are you sure you want to delete this spot?")) {
            setSpots((prev) => prev.filter((s) => s.id !== id));
        }
    };

    const handleToggleMaintenance = (id: string) => {
        setSpots((prev) =>
            prev.map((s) =>
                s.id === id
                    ? {...s, status: s.status === "maintenance" ? "available" : "maintenance"}
                    : s
            )
        );
    };

    const handleUpdatePricing = (size: VehicleSize, value: number) => {
        setPricing((prev) => ({...prev, [size]: value}));
        setSpots((prev) =>
            prev.map((spot) => (spot.size === size ? {...spot, pricePerHour: value} : spot))
        );
    };

    const StatCard = ({
                          label,
                          value,
                          color,
                      }: {
        label: string;
        value: number | string;
        color: "gray" | "green" | "blue" | "orange";
    }) => {
        const gradients = {
            gray: "from-gray-500 to-gray-600",
            green: "from-emerald-500 to-green-600",
            blue: "from-blue-500 to-indigo-600",
            orange: "from-amber-500 to-orange-600",
        };
        return (
            <div
                className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                <div className={`h-1.5 w-full bg-gradient-to-r ${gradients[color]}`}/>
                <div className="p-5">
                    <p className="text-sm font-medium text-gray-500 mb-1">{label}</p>
                    <p className="text-3xl font-bold text-gray-800">{value}</p>
                </div>
            </div>
        );
    };

    return (
        <AdminSidebar>
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-slate-50">
                <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 px-8 py-4 sticky top-0 z-10">
                    <div className="flex justify-between items-center flex-wrap gap-4">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-800 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                                Parking Spots Configuration
                            </h1>
                            <p className="text-sm text-gray-500 mt-1">
                                Manage spots, update pricing, and monitor occupancy
                            </p>
                        </div>
                        <button
                            onClick={() => handleOpenModal()}
                            className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl shadow-md hover:shadow-lg transition-all duration-200 font-medium"
                        >
                            <Plus size={18}/>
                            Add New Spot
                        </button>
                    </div>
                </header>

                <div className="p-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mb-8">
                        <StatCard label="Total Spots" value={totalSpots} color="gray"/>
                        <StatCard label="Available" value={availableSpots} color="green"/>
                        <StatCard label="Occupied" value={occupiedSpots} color="blue"/>
                        <StatCard label="Maintenance" value={maintenanceSpots} color="orange"/>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 mb-6">
                        <div
                            className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-xl shadow-sm border border-gray-200">
                            <label className="text-sm font-medium text-gray-600">Status:</label>
                            <select
                                value={filterStatus}
                                onChange={(e) => setFilterStatus(e.target.value as any)}
                                className="px-2 py-1 text-sm bg-transparent border-0 focus:ring-0"
                            >
                                <option value="all">All</option>
                                <option value="available">Available</option>
                                <option value="occupied">Occupied</option>
                                <option value="maintenance">Maintenance</option>
                            </select>
                        </div>
                        <div
                            className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-xl shadow-sm border border-gray-200">
                            <label className="text-sm font-medium text-gray-600">Size:</label>
                            <select
                                value={filterSize}
                                onChange={(e) => setFilterSize(e.target.value as any)}
                                className="px-2 py-1 text-sm bg-transparent border-0 focus:ring-0"
                            >
                                <option value="all">All</option>
                                <option value="small">Small</option>
                                <option value="medium">Medium</option>
                                <option value="large">Large</option>
                            </select>
                        </div>
                        {(filterStatus !== "all" || filterSize !== "all") && (
                            <button
                                onClick={() => {
                                    setFilterStatus("all");
                                    setFilterSize("all");
                                }}
                                className="text-sm font-medium text-blue-600 hover:text-blue-800 flex items-center gap-1 bg-blue-50 px-3 py-1.5 rounded-xl border border-blue-200"
                            >
                                <X size={14}/> Clear filters
                            </button>
                        )}
                    </div>

                    {filteredSpots.length === 0 ? (
                        <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center shadow-sm">
                            <AlertCircle size={48} className="mx-auto text-gray-300 mb-4"/>
                            <h3 className="text-lg font-semibold text-gray-800 mb-1">No spots found</h3>
                            <p className="text-gray-500">Try adjusting your filters or add a new spot.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                            {filteredSpots.map((spot) => (
                                <SpotCard
                                    key={spot.id}
                                    spot={spot}
                                    onEdit={handleOpenModal}
                                    onDelete={handleDeleteSpot}
                                    onToggleMaintenance={handleToggleMaintenance}
                                />
                            ))}
                        </div>
                    )}
                </div>

                {isModalOpen && (
                    <div
                        className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
                            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4">
                                <h2 className="text-xl font-bold text-white">
                                    {editingSpot ? "Edit Parking Spot" : "Add New Parking Spot"}
                                </h2>
                            </div>
                            <div className="p-6 space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Spot Number *
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.spotNumber}
                                        onChange={(e) =>
                                            setFormData({...formData, spotNumber: e.target.value.toUpperCase()})
                                        }
                                        placeholder="e.g., A12"
                                        className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Vehicle Size
                                    </label>
                                    <select
                                        value={formData.size}
                                        onChange={(e) =>
                                            setFormData({...formData, size: e.target.value as VehicleSize})
                                        }
                                        className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                                    >
                                        <option value="small">Small (Motorcycle)</option>
                                        <option value="medium">Medium (Car)</option>
                                        <option value="large">Large (Truck/Van)</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                                    <select
                                        value={formData.status}
                                        onChange={(e) =>
                                            setFormData({...formData, status: e.target.value as SpotStatus})
                                        }
                                        className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                                    >
                                        <option value="available">Available</option>
                                        <option value="occupied">Occupied</option>
                                        <option value="maintenance">Maintenance</option>
                                    </select>
                                </div>

                                <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                                    <p className="text-sm text-gray-600">
                                        Hourly rate for this spot:{" "}
                                        <span className="font-bold text-gray-800">
                    ${pricing[formData.size].toFixed(2)}
                  </span>
                                    </p>
                                    <p className="text-xs text-gray-500 mt-1">
                                        Rate is determined by vehicle size. Change it in the price configuration panel.
                                    </p>
                                </div>
                            </div>

                            <div className="flex justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50">
                                <button
                                    onClick={handleCloseModal}
                                    className="px-5 py-2.5 text-gray-700 font-medium hover:bg-gray-200 rounded-xl transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSaveSpot}
                                    disabled={!formData.spotNumber.trim()}
                                    className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-xl hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2 shadow-md"
                                >
                                    <Check size={18}/>
                                    {editingSpot ? "Save Changes" : "Create Spot"}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </AdminSidebar>
    );
}