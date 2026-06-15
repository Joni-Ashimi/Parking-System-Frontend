"use client";

import { useState, useEffect } from "react";
import { Check, AlertCircle } from "lucide-react";
import {ParkingSpot, SpotStatus} from "@/app/admin/parkingSpots/page";

interface SpotCategory {
    id: string;
    name: string;
    size: string;
}

interface AdminSpotActionModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (payload: any) => Promise<void>;
    editingSpot: ParkingSpot | null;
    categories: SpotCategory[];
    lots: { id: string; name: string }[];
    existingSpots: ParkingSpot[];
}

export default function AdminSpotActionModal({
                                                 isOpen,
                                                 onClose,
                                                 onSave,
                                                 editingSpot,
                                                 categories,
                                                 lots,
                                                 existingSpots
                                             }: AdminSpotActionModalProps) {
    const [spotNumber, setSpotNumber] = useState("");
    const [floor, setFloor] = useState(1);
    const [typeId, setTypeId] = useState("");
    const [status, setStatus] = useState<SpotStatus>("available");
    const [lotId, setLotId] = useState("");

    const [validationError, setValidationError] = useState<string | null>(null);

    useEffect(() => {
        if (isOpen) {
            setValidationError(null);
            if (editingSpot) {
                setSpotNumber(editingSpot.spotNumber || "");
                setFloor(editingSpot.floor || 1);
                setTypeId(editingSpot?.type?.id || categories[0]?.id || "");
                setStatus(editingSpot.status || "available");
                setLotId(editingSpot?.lot?.id || lots[0]?.id || "");
            } else {
                setSpotNumber("");
                setFloor(1);
                setTypeId(categories[0]?.id || "");
                setStatus("available");
                setLotId(lots[0]?.id || "");
            }
        }
    }, [isOpen, editingSpot, categories, lots]);

    if (!isOpen) return null;

    const handleFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setValidationError(null);

        const cleanSpot = spotNumber.trim().toUpperCase();

        if (!cleanSpot) {
            setValidationError("Spot number cannot be empty.");
            return;
        }

        const parts = cleanSpot.split("-");
        const targetRow = parts[0]?.trim();

        if (!targetRow || parts.length < 2) {
            setValidationError("Invalid formatting sequence. Please input values using 'Row-Number' (e.g., A-01).");
            return;
        }

        const isChangingRow = !editingSpot || editingSpot.spotNumber.split("-")[0].toUpperCase() !== targetRow;

        if (isChangingRow) {
            const currentCountInRow = existingSpots.filter(spot =>
                spot.lot?.id === lotId &&
                spot.spotNumber.toUpperCase().startsWith(`${targetRow}-`)
            ).length;

            const MAX_ROW_COLUMNS = 10;
            if (currentCountInRow >= MAX_ROW_COLUMNS) {
                const nextRowSuggestion = String.fromCharCode(targetRow.charCodeAt(0) + 1);
                setValidationError(
                    `Row group "${targetRow}" has hit its layout ceiling of ${MAX_ROW_COLUMNS} elements. ` +
                    `Please shift layout mapping to row "${nextRowSuggestion}".`
                );
                return;
            }
        }

        try {
            await onSave({
                spotNumber: cleanSpot,
                floor: Number(floor),
                typeId: typeId || categories[0]?.id,
                status: status,
                lotId: lotId || lots[0]?.id
            });
        } catch (error: any) {
            setValidationError(error?.response?.data?.message || "Failed to persist infrastructure layout adjustments.");
        }
    };

    return (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4">
                    <h2 className="text-xl font-bold text-white">
                        {editingSpot ? "Edit Parking Spot" : "Add New Parking Spot"}
                    </h2>
                </div>

                <form onSubmit={handleFormSubmit}>
                    <div className="p-6 space-y-4">
                        {validationError && (
                            <div className="p-3 bg-red-50 border border-red-200 text-red-800 text-xs font-semibold rounded-xl flex items-start gap-2">
                                <AlertCircle size={16} className="text-red-600 mt-0.5" />
                                <p>{validationError}</p>
                            </div>
                        )}

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Spot Number *
                            </label>
                            <input
                                type="text"
                                value={spotNumber}
                                onChange={(e) => setSpotNumber(e.target.value)}
                                placeholder="e.g., A-12"
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Floor Level
                            </label>
                            <input
                                type="number"
                                value={floor}
                                onChange={(e) => setFloor(parseInt(e.target.value) || 1)}
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Spot Category Type (Linked Rates)
                            </label>
                            <select
                                value={typeId}
                                onChange={(e) => setTypeId(e.target.value)}
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                            >
                                {categories.map((category) => (
                                    <option key={category.id} value={category.id}>
                                        {category.name} ({category.size})
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                            <select
                                value={status}
                                onChange={(e) => setStatus(e.target.value as SpotStatus)}
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                            >
                                <option value="available">Available</option>
                                <option value="occupied">Occupied</option>
                                <option value="maintenance">Maintenance</option>
                                <option value="reserved">Reserved</option>
                            </select>
                        </div>

                        <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                            <p className="text-xs text-gray-500 mt-1">
                                Rate is determined dynamically by the configuration for this category structural mapping.
                            </p>
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-5 py-2.5 text-gray-700 font-medium hover:bg-gray-200 rounded-xl transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={!spotNumber.trim()}
                            className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-xl hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2 shadow-md"
                        >
                            <Check size={18}/>
                            {editingSpot ? "Save Changes" : "Create Spot"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}