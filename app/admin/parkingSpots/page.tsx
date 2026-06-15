"use client";

import {useCallback, useEffect, useState} from "react";
import {AlertCircle, Check, Plus, X,} from "lucide-react";
import AdminSidebar from "@/components/sidebar/adminSidebar";
import SpotCard from "@/components/admin/SpotCard";
import ParkingSpotService, {ParkingSpotPayload, ParkingSpotStatusType} from "@/services/ParkingSpotService";
import SpotCategoryService from "@/services/SpotCategoryService";
import Pagination from "@/components/core/Pagination";
import ParkingLotService from "@/services/ParkingLotService";
import {handleRequestErrors} from "@/utils/functions";
import AdminActionModal from "@/app/admin/AdminActionModal";

type VehicleSize = "small" | "medium" | "large";
export type SpotStatus = "available" | "occupied" | "maintenance";

export interface ParkingSpot {
    id: string;
    spotNumber: string;
    floor: number;
    status: SpotStatus;
    type?: {
        id: string;
        name: string;
        size: VehicleSize;
        baseHourlyRate: string | number;
        effectiveHourlyRate?: string | number;
    };
    lot?: {
        id: string;
        name: string;
    }
};

interface SpotCategory {
    id: string;
    name: string;
    size: VehicleSize;
    baseHourlyRate: number;
    effectiveHourlyRate: number;
};

export default function ParkingSpotsConfig() {
    const [spots, setSpots] = useState<ParkingSpot[]>([]);
    const [categories, setCategories] = useState<SpotCategory[]>([]);
    const [lots, setLots] = useState<any[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingSpot, setEditingSpot] = useState<ParkingSpot | null>(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
    const [selectedSpot, setSelectedSpot] = useState<ParkingSpot | null>(null);

    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(8);
    const [qs, setQs] = useState("");
    const [meta, setMeta] = useState({totalPages: 1, total: 0, pageSize: 8});
    const [stats, setStats] = useState({
        totalSpots: 0,
        availableSpots: 0,
        occupiedSpots: 0,
        maintenanceSpots: 0
    });
    const [isTypeDropdownOpen, setIsTypeDropdownOpen] = useState(false);

    const [filterStatus, setFilterStatus] = useState<SpotStatus | "all">("all");
    const [filterSize, setFilterSize] = useState<VehicleSize | "all">("all");

    const [loading, setLoading] = useState(true);

    const [formData, setFormData] = useState({
        spotNumber: "",
        floor: 1,
        typeId: "",
        status: "available" as SpotStatus,
        lotId: "",
    });

    const fetchData = useCallback(async () => {
        try {
            setLoading(true);
            const [spotsResponse, categoriesResponse, stats, lotsResponse] = await Promise.all([
                ParkingSpotService.findAll({page, pageSize, qs}),
                SpotCategoryService.findAll(),
                ParkingSpotService.getStats(),
                ParkingLotService.findAll(),
            ]);
            setSpots(spotsResponse.data.data);
            setMeta(spotsResponse.data.meta);
            setCategories(categoriesResponse.data);
            setStats(stats.data);
            setLots(lotsResponse.data);
            if (categoriesResponse.data.length > 0) {
                setFormData((prev) => ({
                    ...prev,
                    typeId: categoriesResponse.data[0].id,
                    lotId: lotsResponse?.data[0]?.id || ""
                }));
            }
        } catch (error) {
            handleRequestErrors(error);
        } finally {
            setLoading(false);
        }
    }, [page, pageSize, qs]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const spotsList = Array.isArray(spots) ? spots : (spots as any).data || [];
    const filteredSpots = spotsList.filter((spot: { status: string; type: { size: string; }; lot: { id: any; }; }) => {
        if (filterStatus !== "all" && spot.status !== filterStatus) return false;
        if (filterSize !== "all" && spot?.type?.size?.toLowerCase() !== filterSize) return false;
        return true;
    });

    const handleOpenModal = (spot?: ParkingSpot) => {
        if (spot) {
            setEditingSpot(spot);
            setFormData({
                spotNumber: spot.spotNumber,
                floor: spot.floor || 1,
                typeId: spot?.type?.id || categories[0]?.id,
                status: spot.status,
                lotId: spot?.lot?.id || lots[0]?.id,
            });
        } else {
            setEditingSpot(null);
            setFormData({
                spotNumber: "",
                floor: 1,
                typeId: categories[0]?.id || "",
                status: "available",
                lotId: lots[0]?.id || "",
            });
        }
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingSpot(null);
    };

    const handleSaveSpot = async () => {
        try {
            const payload: ParkingSpotPayload = {
                spotNumber: formData.spotNumber,
                floor: formData.floor,
                lotId: formData.lotId,
                typeId: formData.typeId,
                status: formData.status as ParkingSpotStatusType,
            };

            if (editingSpot) {
                await ParkingSpotService.updateStatus(editingSpot?.id, payload.status);
            } else {
                await ParkingSpotService.create(payload);
            }
            await fetchData();
            handleCloseModal();
        } catch (error) {
            handleRequestErrors(error);
        }
    };


    const handleDeleteClick = (spot: ParkingSpot) => {
        setSelectedSpot(spot);
        setIsDeleteModalOpen(true);
    };

    const handleCloseDeleteModal = () => {
        setIsDeleteModalOpen(false);
        setSelectedSpot(null);
    };

    const handleConfirmDelete = async () => {
        if (!selectedSpot) return;

        try {
            setLoading(true);
            await ParkingSpotService.remove(selectedSpot.id);
            setSpots((prev) => prev.filter((s) => s.id !== selectedSpot.id));
            await fetchData();
        } catch (error) {
            handleRequestErrors(error);
        } finally {
            setSelectedSpot(null);
            setLoading(false);
        }
    };

    const handleToggleMaintenance = async (id: string) => {
        const targetSpot = spots.find((s) => s.id === id);
        if (!targetSpot) return;
        const nextStatus = targetSpot.status === "maintenance" ? "available" : "maintenance";

        try {
            await ParkingSpotService.updateStatus(id, nextStatus);
            await fetchData();
        } catch (error) {
            handleRequestErrors(error);
        }
    };

    const currentSelectedCategory = categories.find((c) => c.id === formData.typeId);
    const displayedHourlyRate = currentSelectedCategory ? currentSelectedCategory.effectiveHourlyRate : 0;

    if (loading) {
        return (
            <AdminSidebar>
                <div className="min-h-screen flex items-center justify-center bg-gray-50">
                    <p className="text-gray-500 font-medium animate-pulse">Loading spot stats...</p>
                </div>
            </AdminSidebar>
        );
    }
    ;


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
            gray: "from-gray-700 to-gray-800",
            green: "from-emerald-500 to-green-600",
            blue: "from-blue-900 to-indigo-600",
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
                        <StatCard label="Total Spots" value={stats.totalSpots} color="gray"/>
                        <StatCard label="Available" value={stats.availableSpots} color="green"/>
                        <StatCard label="Occupied" value={stats.occupiedSpots} color="blue"/>
                        <StatCard label="Maintenance" value={stats.maintenanceSpots} color="orange"/>
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
                        <>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                                {filteredSpots.map((spot: ParkingSpot) => (
                                    <SpotCard
                                        key={spot.id}
                                        spot={spot}
                                        onEdit={handleOpenModal}
                                        onDelete={handleDeleteClick}
                                        onToggleMaintenance={handleToggleMaintenance}
                                    />
                                ))}
                            </div>
                            <Pagination
                                currentPage={page}
                                totalPages={meta.totalPages}
                                totalItems={meta.total}
                                pageSize={meta.pageSize}
                                onPageChange={(targetPage) => setPage(targetPage)}
                            />
                        </>
                    )}
                </div>

                {isModalOpen && (
                    <div
                        className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
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
                                        Floor Level
                                    </label>
                                    <input
                                        type="number"
                                        value={formData.floor}
                                        onChange={(e) =>
                                            setFormData({...formData, floor: parseInt(e.target.value) || 1})
                                        }
                                        className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        required
                                    />
                                </div>

                                <div className="relative z-[1000] w-full">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Spot Category Type (Linked Rates)
                                    </label>

                                    <button
                                        type="button"
                                        onClick={() => setIsTypeDropdownOpen(!isTypeDropdownOpen)}
                                        className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-xl text-left flex justify-between items-center text-gray-900"
                                    >
                                        {categories.find((c) => c.id === formData.typeId)?.name || "Select Category"}
                                        <span className="text-gray-400">▼</span>
                                    </button>

                                    {isTypeDropdownOpen && (
                                        <div
                                            className="absolute z-[999] w-full mt-1 bg-white border border-gray-300 rounded-xl shadow-lg max-h-60 overflow-auto">
                                            {categories.map((category) => (
                                                <div
                                                    key={category.id}
                                                    className="bg-black-900 px-4 py-2.5 cursor-pointer hover:bg-blue-50 text-gray-900"
                                                    onClick={() => {
                                                        setFormData({...formData, typeId: category.id});
                                                        setIsTypeDropdownOpen(false);
                                                    }}
                                                >
                                                    {category.name} ({category.size})
                                                </div>
                                            ))}
                                        </div>
                                    )}
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
                                    <p className="text-xs text-gray-500 mt-1">
                                        Rate is determined dynamically by the database configuration for this category
                                        structural mapping.
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

                {isDeleteModalOpen && selectedSpot && (
                    <AdminActionModal
                        isOpen={isDeleteModalOpen && !!selectedSpot}
                        onClose={handleCloseDeleteModal}
                        onConfirm={handleConfirmDelete}
                        variant="danger"
                        title="Delete Parking Spot"
                        confirmLabel="Confirm Delete"
                        description={
                            <span>Are you sure you want to delete parking spot {selectedSpot?.spotNumber}?
                            <span className="font-semibold text-gray-800">
                            </span>{" "}on Floor {selectedSpot?.floor}? This layout alteration cannot be undone.</span>
                        }
                    />
                )}
            </div>
        </AdminSidebar>
    );
}