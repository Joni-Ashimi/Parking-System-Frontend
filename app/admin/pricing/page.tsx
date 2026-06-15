"use client";

import {useEffect, useState} from "react";
import {AlertCircle, Bike, Car, Edit2, Loader2, Plus, Save, Shield, Trash2, Truck, X} from "lucide-react";
import AdminSidebar from "@/components/sidebar/adminSidebar";
import {handleRequestErrors} from "@/utils/functions";
import AddOfferModal from "@/components/admin/AddSpecialOffer";
import PricingService from "@/services/PricingService";
import AdminActionModal from "@/app/admin/AdminActionModal";
import ParkingSessionService from "@/services/ParkingSessionService";

const VEHICLE_ICON_MAP: Record<string, any> = {
    bike: Bike,
    car: Car,
    truck: Truck,
};

interface PricingTier {
    id: string;
    type: string;
    vehicleType: string;
    basePrice: number;
    hourlyRate: number;
    dailyRate: number;
    size: string;
    spots: number;
    effectiveHourlyRate: number;
    isDiscounted: boolean;
    activeRuleName: string | null;
}

interface SpecialOffer {
    id: string;
    name: string;
    adjustmentType: "DISCOUNT" | "SURCHARGE";
    value: number;
    dayOfWeek: number;
    startHour: number;
    endHour: number;
    spotCategoryId: string;
    title: any;
    description: any;
    validUntil: any;
    discount: any;
}

export default function PricingPage() {
    const [prices, setPrices] = useState<PricingTier[]>([]);
    const [offers, setOffers] = useState<SpecialOffer[]>([]);
    const [editingId, setEditingId] = useState<string | null>(null);

    const [isOfferModalOpen, setIsOfferModalOpen] = useState(false);
    const [isLoadingCategories, setIsLoadingCategories] = useState(true);
    const [isLoadingOffers, setIsLoadingOffers] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [deleteOfferId, setDeleteOfferId] = useState<string | null>(null);

    const [stats, setStats] = useState({
        avgHourlyRate: 0,
        dailyRevenue: 0,
        occupancyRate: 0
    });

    const [editForm, setEditForm] = useState({
        hourlyRate: 0,
        dailyRate: 0,
    });

    const loadDashboardData = async () => {
        try {
            const response = await PricingService.getDashboardData();
            const order = ["motorcycle", "car", "truck"];
            const sorted = [...response].sort((a, b) =>
                order.indexOf(a.vehicleType) - order.indexOf(b.vehicleType)
            );
            setPrices(sorted);
        } catch (err) {
            handleRequestErrors(err);
        } finally {
            setIsLoadingCategories(false);
        }
    };

    const loadSpecialOffers = async () => {
        try {
            const response = await PricingService.getSpecialOffers();
            setOffers(response);
        } catch (err) {
            handleRequestErrors(err);
        } finally {
            setIsLoadingOffers(false);
        }
    };

    useEffect(() => {
        loadDashboardData();
        loadSpecialOffers();
        ParkingSessionService.getPriceMetrics().then(setStats).catch(handleRequestErrors);
    }, []);

    const handleEdit = (price: PricingTier) => {
        setEditingId(price.id);
        setEditForm({
            hourlyRate: price.hourlyRate,
            dailyRate: price.dailyRate,
        });
    };

    const handleSaveBaseRates = async (id: string) => {
        setIsSaving(true);
        try {
            await PricingService.updateCategoryRates(id, editForm);
            await Promise.all([
                loadDashboardData(),
                loadSpecialOffers(),
                ParkingSessionService.getPriceMetrics().then(setStats)
            ]);
            setEditingId(null);
        } catch (err) {
            handleRequestErrors(err);
        } finally {
            setIsSaving(false);
        }
    };

    const handleDeployOfferRule = async (formData: any) => {
        const refreshedOffersList = await PricingService.createSpecialOffer(formData);
        setOffers(refreshedOffersList);
        const refreshedCategories = await PricingService.getDashboardData();
        setPrices(refreshedCategories);
    };

    const handleCancel = () => {
        setEditingId(null);
    };

    const handleConfirmDeleteOffer = async () => {
        if (!deleteOfferId) return;
        try {
            await PricingService.deleteSpecialOffer(deleteOfferId);
            setOffers((prev) => prev.filter((offer) => offer.id !== deleteOfferId));
            const refreshedCategories = await PricingService.getDashboardData();
            setPrices(refreshedCategories);
        } catch (err) {
            handleRequestErrors(err);
        } finally {
            setDeleteOfferId(null);
        }
    };

    if (isLoadingCategories || isLoadingOffers) {
        return (
            <AdminSidebar>
                <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 gap-3">
                    <Loader2 className="w-10 h-10 text-blue-600 animate-spin"/>
                    <p className="text-sm font-medium text-gray-500">Syncing database matrix state...</p>
                </div>
            </AdminSidebar>
        );
    }

    return (
        <AdminSidebar>
            <div className="min-h-screen bg-gray-50">
                <header className="bg-white border-b border-gray-200 px-8 py-4">
                    <div className="flex justify-between items-center">
                        <h1 className="text-2xl font-semibold text-gray-800">
                            Pricing Configuration
                        </h1>
                        <div className="flex items-center gap-3">
                            <div className="flex items-center gap-2 px-3 py-1 bg-gray-100 rounded-lg">
                                <Shield size={16} className="text-green-600"/>
                                <span className="text-sm text-gray-600">Admin Access</span>
                            </div>
                        </div>
                    </div>
                </header>

                <div className="p-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <PricingStatCard
                            title="Average Hourly Rate"
                            value={`$${stats.avgHourlyRate.toFixed(2)}`}
                            change=""
                            trend="neutral"
                        />
                        <PricingStatCard
                            title="Daily Revenue"
                            value={`$${stats.dailyRevenue.toFixed(2)}`}
                            change="+0%"
                            trend="up"
                        />
                        <PricingStatCard
                            title="Occupancy Rate"
                            value={`${stats.occupancyRate}%`}
                            change=""
                            trend="neutral"
                        />
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                        {prices.map((price) => {
                            const IconComponent = VEHICLE_ICON_MAP[price.vehicleType] || Car;
                            const isCar = price.vehicleType === "car";

                            const hasActiveRule = !!price.activeRuleName;

                            return (
                                <div key={price.id}
                                     className={`bg-white rounded-xl border overflow-hidden hover:shadow-lg transition-shadow ${
                                         hasActiveRule && price.isDiscounted ? "border-green-300 ring-1 ring-green-100" :
                                             hasActiveRule && !price.isDiscounted ? "border-amber-300 ring-1 ring-amber-100" : "border-gray-200"
                                     }`}>
                                    <div
                                        className={`p-6 ${isCar ? "bg-gradient-to-r from-blue-50 to-blue-100" : "bg-gray-50"}`}>
                                        <div className="flex items-center justify-between mb-4">
                                            <div
                                                className={`p-3 rounded-xl ${isCar ? "bg-blue-600 text-white" : "bg-white text-gray-700"}`}>
                                                <IconComponent size={24}/>
                                            </div>
                                            <div className="flex flex-col items-end gap-1">
                                                {isCar && (
                                                    <span
                                                        className="px-2 py-1 bg-blue-600 text-white text-xs rounded-full font-medium">Most Popular</span>
                                                )}
                                                {hasActiveRule && (
                                                    <span
                                                        className={`px-2 py-1 text-xs font-semibold rounded-full uppercase tracking-wider ${
                                                            price.isDiscounted ? "bg-green-100 text-green-800" : "bg-amber-100 text-amber-800"}`}>
                                                    ⚡ {price.activeRuleName}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                        <h3 className="text-xl font-bold text-gray-800 mb-1">{price.type}</h3>
                                        <p className="text-sm text-gray-500">{price.size} • {price.spots} active
                                            spots</p>
                                    </div>

                                    <div className="p-6 space-y-4">
                                        <div
                                            className="flex justify-between items-center py-2 border-b border-gray-100">
                                            <span className="text-gray-600">Hourly Rate</span>
                                            {editingId === price.id ? (
                                                <div className="flex items-center gap-2">
                                                    <span className="text-gray-500">$</span>
                                                    <input
                                                        type="number"
                                                        value={editForm.hourlyRate}
                                                        disabled={isSaving}
                                                        onChange={(e) => setEditForm({
                                                            ...editForm,
                                                            hourlyRate: parseFloat(e.target.value) || 0
                                                        })}
                                                        className="w-20 px-2 py-1 border border-gray-200 rounded text-right bg-white text-gray-800"
                                                        step="0.50"
                                                    />
                                                    <span className="text-gray-500">/hour</span>
                                                </div>
                                            ) : (
                                                <div className="flex flex-col items-end">
                                                    <div className="flex items-baseline gap-1.5">
                                                        {/* NEW: If dynamic price is different, strike out original base rate */}
                                                        {hasActiveRule && price.effectiveHourlyRate !== price.hourlyRate && (
                                                            <span
                                                                className="text-sm line-through text-gray-400 font-normal">
                                            ${price.hourlyRate}
                                        </span>
                                                        )}
                                                        <span className={`text-xl font-semibold ${
                                                            hasActiveRule ? (price.isDiscounted ? "text-green-600" : "text-amber-600") : "text-gray-800"
                                                        }`}>
                                        ${price.effectiveHourlyRate ?? price.hourlyRate}
                                                            <span
                                                                className="text-sm font-normal text-gray-500">/hour</span>
                                    </span>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex gap-2 pt-2">
                                            {editingId === price.id ? (
                                                <>
                                                    <button
                                                        onClick={() => handleSaveBaseRates(price.id)}
                                                        disabled={isSaving}
                                                        className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center justify-center gap-2 disabled:opacity-60"
                                                    >
                                                        {isSaving ? <Loader2 size={16} className="animate-spin"/> :
                                                            <Save size={16}/>}
                                                        Save
                                                    </button>
                                                    <button
                                                        onClick={handleCancel}
                                                        disabled={isSaving}
                                                        className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition flex items-center justify-center gap-2 bg-white text-gray-700"
                                                    >
                                                        <X size={16}/>
                                                        Cancel
                                                    </button>
                                                </>
                                            ) : (
                                                <button
                                                    onClick={() => handleEdit(price)}
                                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition flex items-center justify-center gap-2 bg-white text-gray-700"
                                                >
                                                    <Edit2 size={16}/>
                                                    Edit Pricing
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-semibold text-gray-800">Special Applied Business Rules</h3>
                            <button
                                onClick={() => setIsOfferModalOpen(true)}
                                className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1 font-medium"
                            >
                                <Plus size={14}/>
                                Add Offer Rule
                            </button>
                        </div>

                        {offers.length === 0 ? (
                            <div className="text-center py-6 border border-dashed border-gray-200 rounded-xl">
                                <p className="text-sm text-gray-400">No active special promotion modifiers found.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {offers.map((offer) => (
                                    <OfferCard
                                        key={offer.id}
                                        id={offer.id}
                                        title={offer.title || offer.name}
                                        description={offer.description || `Applies to platform operations on weekday index ${offer.dayOfWeek}.`}
                                        discount={offer.discount || `${offer.adjustmentType === "DISCOUNT" ? "-" : "+"}${offer.value}%`}
                                        validUntil={offer.validUntil || `${offer.startHour}:00 till ${offer.endHour}:00`}
                                        onDelete={setDeleteOfferId}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                    <AddOfferModal
                        isOpen={isOfferModalOpen}
                        onClose={() => setIsOfferModalOpen(false)}
                        onSave={handleDeployOfferRule}
                        categories={prices}
                    />

                    <AdminActionModal
                        isOpen={!!deleteOfferId}
                        onClose={() => setDeleteOfferId(null)}
                        onConfirm={handleConfirmDeleteOffer}
                        variant="danger"
                        title="Remove Special Offer Rule"
                        confirmLabel="Delete Offer"
                        cancelLabel="Cancel"
                        description="Are you sure you want to delete this special offer profile? Any active discount or surcharge linked to this rule will be removed from sessions immediately."
                    />

                    <div className="bg-blue-50 rounded-xl p-4 flex items-start gap-3">
                        <AlertCircle size={18} className="text-blue-600 mt-0.5"/>
                        <div>
                            <p className="text-sm font-medium text-blue-800">Pricing Notes</p>
                            <p className="text-xs text-blue-600 mt-1">
                                Changes to pricing will take effect immediately. Customers with active sessions
                                will be charged at the new rates.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </AdminSidebar>
    );
}

function PricingStatCard({title, value, change, trend}: any) {
    return (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
            <p className="text-sm text-gray-500 mb-2">{title}</p>
            <div className="flex items-baseline justify-between">
                <span className="text-2xl font-semibold text-gray-800">{value}</span>
                <span className={`text-sm ${trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                    {change}
                </span>
            </div>
        </div>
    );
}

function OfferCard({id, title, description, discount, validUntil, onDelete}: any) {
    return (
        <div
            className="border border-gray-200 rounded-xl p-4 hover:border-blue-200 hover:shadow-sm transition-all bg-white flex justify-between items-center gap-4">
            <div className="min-w-0 flex-1">
                <div className="flex justify-between items-start mb-2">
                    <h4 className="font-medium text-gray-800">{title}</h4>
                    <span className="text-lg font-bold text-blue-600 flex-shrink-0 ml-2">{discount}</span>
                </div>
                <p className="text-sm text-gray-500 mb-2">{description}</p>
                <p className="text-xs text-gray-400">Valid until: {validUntil}</p>
            </div>

            <button
                onClick={() => onDelete(id)}
                title="Remove Rule Modifier"
                className="p-2 border border-red-100 text-red-500 rounded-lg hover:bg-red-50 hover:border-red-200 transition bg-white flex-shrink-0"
            >
                <Trash2 size={16}/>
            </button>
        </div>
    );
}