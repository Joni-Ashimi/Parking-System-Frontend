"use client";

import { useState } from "react";
import {
    Car,
    Bike,
    Truck,
    Edit2,
    Save,
    X,
    AlertCircle,
    Plus,
    Shield,
} from "lucide-react";
import AdminSidebar from "@/components/sidebar/adminSidebar";

export default function PricingPage() {
    const [editingId, setEditingId] = useState<string | null>(null);
    const [prices, setPrices] = useState([
        { id: "bike", type: "Motorcycle", icon: Bike, basePrice: 2, hourlyRate: 2, dailyRate: 15, size: "Small", spots: 15 },
        { id: "car", type: "Car", icon: Car, basePrice: 5, hourlyRate: 5, dailyRate: 35, size: "Standard", spots: 35 },
        { id: "truck", type: "Truck", icon: Truck, basePrice: 10, hourlyRate: 10, dailyRate: 70, size: "Large", spots: 10 },
    ]);

    const [editForm, setEditForm] = useState({
        hourlyRate: 0,
        dailyRate: 0,
    });

    const handleEdit = (price: any) => {
        setEditingId(price.id);
        setEditForm({
            hourlyRate: price.hourlyRate,
            dailyRate: price.dailyRate,
        });
    };

    const handleSave = (id: string) => {
        setPrices(prices.map(price =>
            price.id === id
                ? { ...price, hourlyRate: editForm.hourlyRate, dailyRate: editForm.dailyRate }
                : price
        ));
        setEditingId(null);
    };

    const handleCancel = () => {
        setEditingId(null);
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <AdminSidebar />
            {/* Main Content */}
            <div className="ml-64">
                {/* Header */}
                <header className="bg-white border-b border-gray-200 px-8 py-4">
                    <div className="flex justify-between items-center">
                        <h1 className="text-2xl font-semibold text-gray-800">
                            Pricing Configuration
                        </h1>
                        <div className="flex items-center gap-3">
                            <div className="flex items-center gap-2 px-3 py-1 bg-gray-100 rounded-lg">
                                <Shield size={16} className="text-green-600" />
                                <span className="text-sm text-gray-600">Admin Access</span>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Content */}
                <div className="p-8">
                    {/* Header Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <PricingStatCard
                            title="Average Hourly Rate"
                            value="$5.67"
                            change="+0.50"
                            trend="up"
                        />
                        <PricingStatCard
                            title="Daily Revenue"
                            value="$892"
                            change="+12%"
                            trend="up"
                        />
                        <PricingStatCard
                            title="Occupancy Rate"
                            value="75%"
                            change="+5%"
                            trend="up"
                        />
                    </div>

                    {/* Pricing Cards */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                        {prices.map((price) => (
                            <div key={price.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
                                {/* Header */}
                                <div className={`p-6 ${
                                    price.id === "car" ? "bg-gradient-to-r from-blue-50 to-blue-100" : "bg-gray-50"
                                }`}>
                                    <div className="flex items-center justify-between mb-4">
                                        <div className={`p-3 rounded-xl ${
                                            price.id === "car" ? "bg-blue-600 text-white" : "bg-white text-gray-700"
                                        }`}>
                                            <price.icon size={24} />
                                        </div>
                                        {price.id === "car" && (
                                            <span className="px-2 py-1 bg-blue-600 text-white text-xs rounded-full">
                        Most Popular
                      </span>
                                        )}
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-800 mb-1">{price.type}</h3>
                                    <p className="text-sm text-gray-500">{price.size} • {price.spots} spots</p>
                                </div>

                                {/* Pricing Details */}
                                <div className="p-6 space-y-4">
                                    {/* Hourly Rate */}
                                    <div className="flex justify-between items-center py-2 border-b border-gray-100">
                                        <span className="text-gray-600">Hourly Rate</span>
                                        {editingId === price.id ? (
                                            <div className="flex items-center gap-2">
                                                <span className="text-gray-500">$</span>
                                                <input
                                                    type="number"
                                                    value={editForm.hourlyRate}
                                                    onChange={(e) => setEditForm({ ...editForm, hourlyRate: parseFloat(e.target.value) })}
                                                    className="w-20 px-2 py-1 border border-gray-200 rounded text-right focus:outline-none focus:border-blue-400"
                                                    step="0.50"
                                                />
                                                <span className="text-gray-500">/hour</span>
                                            </div>
                                        ) : (
                                            <span className="text-xl font-semibold text-gray-800">
                        ${price.hourlyRate}<span className="text-sm font-normal text-gray-500">/hour</span>
                      </span>
                                        )}
                                    </div>

                                    {/* Daily Rate */}
                                    <div className="flex justify-between items-center py-2 border-b border-gray-100">
                                        <span className="text-gray-600">Daily Rate</span>
                                        {editingId === price.id ? (
                                            <div className="flex items-center gap-2">
                                                <span className="text-gray-500">$</span>
                                                <input
                                                    type="number"
                                                    value={editForm.dailyRate}
                                                    onChange={(e) => setEditForm({ ...editForm, dailyRate: parseFloat(e.target.value) })}
                                                    className="w-20 px-2 py-1 border border-gray-200 rounded text-right focus:outline-none focus:border-blue-400"
                                                    step="5"
                                                />
                                                <span className="text-gray-500">/day</span>
                                            </div>
                                        ) : (
                                            <span className="text-xl font-semibold text-gray-800">
                        ${price.dailyRate}<span className="text-sm font-normal text-gray-500">/day</span>
                      </span>
                                        )}
                                    </div>

                                    {/* Savings Badge */}
                                    <div className="bg-green-50 rounded-lg p-3">
                                        <p className="text-xs text-green-700">
                                            Save ${(price.hourlyRate * 24) - price.dailyRate} with daily rate!
                                        </p>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex gap-2 pt-2">
                                        {editingId === price.id ? (
                                            <>
                                                <button
                                                    onClick={() => handleSave(price.id)}
                                                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center justify-center gap-2"
                                                >
                                                    <Save size={16} />
                                                    Save
                                                </button>
                                                <button
                                                    onClick={handleCancel}
                                                    className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition flex items-center justify-center gap-2"
                                                >
                                                    <X size={16} />
                                                    Cancel
                                                </button>
                                            </>
                                        ) : (
                                            <button
                                                onClick={() => handleEdit(price)}
                                                className="w-full px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition flex items-center justify-center gap-2"
                                            >
                                                <Edit2 size={16} />
                                                Edit Pricing
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Special Offers Section */}
                    <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-semibold text-gray-800">Special Offers</h3>
                            <button className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1">
                                <Plus size={14} />
                                Add Offer
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <OfferCard
                                title="Early Bird Special"
                                description="Park before 8 AM and get 20% off"
                                discount="20%"
                                validUntil="Dec 31, 2024"
                            />
                            <OfferCard
                                title="Weekend Package"
                                description="Saturday & Sunday parking at 15% off"
                                discount="15%"
                                validUntil="Dec 31, 2024"
                            />
                            <OfferCard
                                title="Monthly Pass"
                                description="Unlimited parking for 30 days"
                                discount="$150"
                                validUntil="Ongoing"
                            />
                            <OfferCard
                                title="Student Discount"
                                description="Valid student ID required"
                                discount="10%"
                                validUntil="Ongoing"
                            />
                        </div>
                    </div>

                    {/* Pricing Notes */}
                    <div className="bg-blue-50 rounded-xl p-4 flex items-start gap-3">
                        <AlertCircle size={18} className="text-blue-600 mt-0.5" />
                        <div>
                            <p className="text-sm font-medium text-blue-800">Pricing Notes</p>
                            <p className="text-xs text-blue-600 mt-1">
                                Changes to pricing will take effect immediately. Customers with active sessions will be charged at the new rates.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}


// Pricing Stat Card Component
function PricingStatCard({ title, value, change, trend }: any) {
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

function OfferCard({ title, description, discount, validUntil }: any) {
    return (
        <div className="border border-gray-200 rounded-lg p-4 hover:border-blue-200 hover:shadow-sm transition-all">
            <div className="flex justify-between items-start mb-2">
                <h4 className="font-medium text-gray-800">{title}</h4>
                <span className="text-lg font-bold text-blue-600">{discount}</span>
            </div>
            <p className="text-sm text-gray-500 mb-2">{description}</p>
            <p className="text-xs text-gray-400">Valid until: {validUntil}</p>
        </div>
    );
}