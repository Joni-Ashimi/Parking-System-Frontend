"use client";

import {useState} from "react";
import {AlertCircle, ArrowLeft, Bike, Car, Check, Plus, Star, Trash2, Truck,} from "lucide-react";
import Link from "next/link";
import UserSidebar from "@/components/sidebar/userSidebar";

type VehicleType = "car" | "bike" | "truck";

interface Vehicle {
    id: string;
    plateNumber: string;
    type: VehicleType;
    isDefault: boolean;
}

// Mock user vehicles
const mockVehicles: Vehicle[] = [
    {id: "v1", plateNumber: "ABC-1234", type: "car", isDefault: true},
    {id: "v2", plateNumber: "MOTO-567", type: "bike", isDefault: false},
    {id: "v3", plateNumber: "TRK-9012", type: "truck", isDefault: false},
];

export default function VehiclesPage() {
    const [vehicles, setVehicles] = useState<Vehicle[]>(mockVehicles);
    const [showAddModal, setShowAddModal] = useState(false);
    const [newPlate, setNewPlate] = useState("");
    const [newType, setNewType] = useState<VehicleType>("car");
    const [error, setError] = useState("");

    const handleSetDefault = (id: string) => {
        setVehicles((prev) =>
            prev.map((v) => ({...v, isDefault: v.id === id}))
        );
    };

    const handleDelete = (id: string) => {
        setVehicles((prev) => {
            const filtered = prev.filter((v) => v.id !== id);
            // If deleted vehicle was default, set first remaining as default
            if (filtered.length > 0 && !filtered.some((v) => v.isDefault)) {
                filtered[0].isDefault = true;
            }
            return filtered;
        });
    };

    const handleAddVehicle = () => {
        setError("");
        const plateRegex = /^[A-Z0-9-]{3,10}$/;
        if (!plateRegex.test(newPlate.toUpperCase())) {
            setError("Invalid plate format (3-10 chars, letters, numbers, hyphens).");
            return;
        }
        if (vehicles.some((v) => v.plateNumber === newPlate.toUpperCase())) {
            setError("This plate is already registered.");
            return;
        }

        const newVehicle: Vehicle = {
            id: Date.now().toString(),
            plateNumber: newPlate.toUpperCase(),
            type: newType,
            isDefault: vehicles.length === 0, // first vehicle becomes default
        };
        setVehicles((prev) => [...prev, newVehicle]);
        setNewPlate("");
        setNewType("car");
        setShowAddModal(false);
    };

    const getVehicleIcon = (type: VehicleType) => {
        switch (type) {
            case "car":
                return <Car size={28} className="text-blue-600"/>;
            case "bike":
                return <Bike size={28} className="text-emerald-600"/>;
            case "truck":
                return <Truck size={28} className="text-amber-600"/>;
        }
    };

    const getTypeLabel = (type: VehicleType) => {
        switch (type) {
            case "car":
                return "Car";
            case "bike":
                return "Motorcycle";
            case "truck":
                return "Truck / Van";
        }
    };

    return (
        <>
            <UserSidebar>
                <div className="min-h-screen bg-gradient-to-br from-gray-50 to-slate-100">
                    {/* Header */}
                    <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-20">
                        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <Link
                                        href="/user/dashboard"
                                        className="p-2 -ml-2 rounded-full hover:bg-gray-100 transition-colors"
                                    >
                                        <ArrowLeft size={20} className="text-gray-600"/>
                                    </Link>
                                    <h1 className="text-2xl font-bold text-gray-800">My Vehicles</h1>
                                </div>
                                <button
                                    onClick={() => setShowAddModal(true)}
                                    className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors shadow-sm font-medium text-sm"
                                >
                                    <Plus size={18}/>
                                    Add Vehicle
                                </button>
                            </div>
                        </div>
                    </header>

                    <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                        {vehicles.length === 0 ? (
                            <div className="text-center py-20 bg-white rounded-2xl border border-gray-200 shadow-sm">
                                <Car size={48} className="mx-auto text-gray-300 mb-4"/>
                                <h3 className="text-xl font-semibold text-gray-800 mb-2">No vehicles yet</h3>
                                <p className="text-gray-500 mb-6">
                                    Add your first vehicle to start parking.
                                </p>
                                <button
                                    onClick={() => setShowAddModal(true)}
                                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium"
                                >
                                    <Plus size={18}/>
                                    Add Vehicle
                                </button>
                            </div>
                        ) : (
                            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                {vehicles.map((vehicle) => (
                                    <div
                                        key={vehicle.id}
                                        className={`
                    relative bg-white rounded-2xl border-2 p-5 shadow-sm transition-all
                    ${vehicle.isDefault ? "border-blue-500 ring-1 ring-blue-200" : "border-gray-100 hover:border-gray-200"}
                  `}
                                    >
                                        {/* Default Badge */}
                                        {vehicle.isDefault && (
                                            <span
                                                className="absolute -top-2.5 right-4 inline-flex items-center gap-1 bg-blue-600 text-white text-xs font-medium px-3 py-1 rounded-full shadow-sm">
                      <Star size={12} fill="currentColor"/>
                      Default
                    </span>
                                        )}

                                        {/* Vehicle Info */}
                                        <div className="flex items-start gap-4">
                                            <div className="p-3 bg-gray-100 rounded-xl">
                                                {getVehicleIcon(vehicle.type)}
                                            </div>
                                            <div>
                                                <h3 className="text-xl font-bold text-gray-800 tracking-wider">
                                                    {vehicle.plateNumber}
                                                </h3>
                                                <p className="text-sm text-gray-500 mt-1">
                                                    {getTypeLabel(vehicle.type)}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Actions */}
                                        <div className="mt-5 pt-4 border-t border-gray-100 flex gap-2">
                                            {!vehicle.isDefault && (
                                                <button
                                                    onClick={() => handleSetDefault(vehicle.id)}
                                                    className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-sm font-medium text-blue-700 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                                                >
                                                    <Check size={16}/>
                                                    Set Default
                                                </button>
                                            )}
                                            <button
                                                onClick={() => handleDelete(vehicle.id)}
                                                className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-sm font-medium text-red-700 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
                                            >
                                                <Trash2 size={16}/>
                                                Remove
                                            </button>
                                        </div>
                                    </div>
                                ))}

                                {/* Add Vehicle Card (button) */}
                                <button
                                    onClick={() => setShowAddModal(true)}
                                    className="border-2 border-dashed border-gray-300 rounded-2xl flex flex-col items-center justify-center gap-3 p-8 text-gray-500 hover:border-blue-400 hover:text-blue-600 transition-all min-h-[200px] bg-white/50"
                                >
                                    <Plus size={32}/>
                                    <span className="font-medium">Add New Vehicle</span>
                                </button>
                            </div>
                        )}

                        {/* Info Note */}
                        {vehicles.length > 0 && (
                            <div
                                className="mt-8 flex items-start gap-3 bg-blue-50 text-blue-800 text-sm p-4 rounded-xl border border-blue-200">
                                <AlertCircle size={18} className="flex-shrink-0 mt-0.5"/>
                                <p>
                                    Your default vehicle is automatically selected when starting a parking session.
                                    You can change it anytime.
                                </p>
                            </div>
                        )}
                    </main>
                </div>
            </UserSidebar>

            {showAddModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div
                        className="absolute inset-0 bg-black/30 backdrop-blur-sm"
                        onClick={() => {
                            setShowAddModal(false);
                            setError("");
                        }}
                    />
                    <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in">
                        <div className="px-6 py-4 bg-gradient-to-r from-blue-600 to-blue-700">
                            <h3 className="text-lg font-bold text-white">Add New Vehicle</h3>
                        </div>

                        <div className="p-6 space-y-5">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    License Plate *
                                </label>
                                <input
                                    type="text"
                                    value={newPlate}
                                    onChange={(e) => setNewPlate(e.target.value)}
                                    placeholder="ABC-1234"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 uppercase"
                                    maxLength={10}
                                />
                                {error && (
                                    <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                                        <AlertCircle size={12}/> {error}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Vehicle Type
                                </label>
                                <div className="grid grid-cols-3 gap-3">
                                    {(["car", "bike", "truck"] as VehicleType[]).map((type) => (
                                        <button
                                            key={type}
                                            type="button"
                                            onClick={() => setNewType(type)}
                                            className={`
                        py-4 px-2 rounded-xl border-2 flex flex-col items-center gap-2 transition-all
                        ${newType === type
                                                ? "border-blue-500 bg-blue-50 text-blue-700"
                                                : "border-gray-200 hover:border-gray-300 text-gray-600"
                                            }
                      `}
                                        >
                                            {type === "car" && <Car size={24}/>}
                                            {type === "bike" && <Bike size={24}/>}
                                            {type === "truck" && <Truck size={24}/>}
                                            <span className="text-xs font-medium capitalize">{type}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end gap-3 px-6 py-4 bg-gray-50 border-t border-gray-100">
                            <button
                                onClick={() => {
                                    setShowAddModal(false);
                                    setError("");
                                }}
                                className="px-4 py-2 text-gray-700 font-medium hover:bg-gray-200 rounded-xl transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleAddVehicle}
                                className="px-5 py-2 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-colors flex items-center gap-2"
                            >
                                <Plus size={18}/>
                                Add Vehicle
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}