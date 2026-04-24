"use client";

import {useState} from "react";
import {Camera, CreditCard, Save, Shield, Star, X,} from "lucide-react";
import UserSideBar from "@/components/sidebar/userSidebar";
import CImageInput from "@/components/core/inputs/CImageInput";

// Mock user data
const initialUser = {
    name: "Alex Johnson",
    email: "alex@example.com",
    phone: "+1 (555) 123-4567",
    avatar: "AJ",
    defaultVehicle: "ABC-1234 (Car)",
    notifications: {
        email: true,
        push: false,
        promotions: true,
    },
    paymentMethod: {
        type: "Visa",
        last4: "4242",
        expiry: "12/26",
    },
};

export default function ProfilePage() {
    const [user, setUser] = useState(initialUser);
    const [avatar, setAvatar] = useState<string | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editForm, setEditForm] = useState({name: user.name, email: user.email, phone: user.phone});

    const handleSave = () => {
        setUser((prev) => ({
            ...prev,
            name: editForm.name,
            email: editForm.email,
            phone: editForm.phone,
        }));
        setIsEditing(false);
    };

    return (
        <>
            <UserSideBar>
                <div className="min-h-screen bg-gradient-to-br from-gray-50 to-slate-100">
                    <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                        {/* Page Header */}
                        <div className="mb-8">
                            <h1 className="text-3xl font-bold text-gray-800">My Profile</h1>
                            <p className="text-gray-500 mt-1">Manage your personal information and preferences.</p>
                        </div>

                        <div className="space-y-6">
                            {/* Avatar & Name Card */}
                            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
                                <div className="flex flex-col sm:flex-row items-center gap-6">
                                    <div className="relative w-24 h-24">
                                        <div className="w-24 h-24 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full flex items-center justify-center text-white text-3xl font-bold shadow-lg overflow-hidden">
                                            {avatar ? (
                                                <img src={avatar} className="w-full h-full object-cover" />
                                            ) : (
                                                user.avatar
                                            )}
                                        </div>

                                        <CImageInput
                                            onImageChange={(file, url) => {
                                                setAvatar(url);
                                            }}
                                        />
                                    </div>
                                    <div className="text-center sm:text-left">
                                        <h2 className="text-2xl font-bold text-gray-800">{user.name}</h2>
                                        <p className="text-gray-500">{user.email}</p>
                                        <p className="text-sm text-gray-400 mt-1">{user.phone}</p>
                                    </div>
                                    <div className="sm:ml-auto">
                                        {!isEditing ? (
                                            <button
                                                onClick={() => setIsEditing(true)}
                                                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors font-medium text-sm"
                                            >
                                                Edit Profile
                                            </button>
                                        ) : (
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={handleSave}
                                                    className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium text-sm flex items-center gap-1"
                                                >
                                                    <Save size={16}/>
                                                    Save
                                                </button>
                                                <button
                                                    onClick={() => setIsEditing(false)}
                                                    className="px-4 py-2 bg-gray-100 text-gray-600 rounded-xl hover:bg-gray-200 transition-colors"
                                                >
                                                    <X size={16}/>
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {isEditing && (
                                    <div className="mt-6 grid gap-4 sm:grid-cols-2">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Full
                                                Name</label>
                                            <input
                                                type="text"
                                                value={editForm.name}
                                                onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                                                className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
                                            />
                                        </div>
                                        <div>
                                            <label
                                                className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                            <input
                                                type="email"
                                                value={editForm.email}
                                                onChange={(e) => setEditForm({...editForm, email: e.target.value})}
                                                className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
                                            />
                                        </div>
                                        <div className="sm:col-span-2">
                                            <label
                                                className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                                            <input
                                                type="tel"
                                                value={editForm.phone}
                                                onChange={(e) => setEditForm({...editForm, phone: e.target.value})}
                                                className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="grid gap-6 sm:grid-cols-2">
                                {/* Default Vehicle */}
                                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
                                    <div className="flex items-center gap-3 mb-3">
                                        <Star size={20} className="text-blue-600"/>
                                        <h3 className="font-semibold text-gray-800">Default Vehicle</h3>
                                    </div>
                                    <p className="text-lg font-medium text-gray-700">{user.defaultVehicle}</p>
                                    <button className="mt-3 text-sm text-blue-600 hover:text-blue-800 font-medium">
                                        Change
                                    </button>
                                </div>

                                {/* Payment Method */}
                                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
                                    <div className="flex items-center gap-3 mb-3">
                                        <CreditCard size={20} className="text-blue-600"/>
                                        <h3 className="font-semibold text-gray-800">Payment Method</h3>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-6 bg-blue-600 rounded"/>
                                        <div>
                                            <p className="font-medium text-gray-700">{user.paymentMethod.type} •••• {user.paymentMethod.last4}</p>
                                            <p className="text-sm text-gray-500">Expires {user.paymentMethod.expiry}</p>
                                        </div>
                                    </div>
                                    <button className="mt-3 text-sm text-blue-600 hover:text-blue-800 font-medium">
                                        Update
                                    </button>
                                </div>
                            </div>

                            <div className="bg-white rounded-2xl border border-red-200 shadow-sm p-6">
                                <div className="flex items-center gap-3 mb-4">
                                    <Shield size={20} className="text-red-600"/>
                                    <h3 className="font-semibold text-red-800">Danger Zone</h3>
                                </div>
                                <p className="text-sm text-gray-600 mb-4">
                                    Permanently delete your account and all data. This action cannot be undone.
                                </p>
                                <button
                                    className="px-4 py-2 bg-red-50 text-red-700 border border-red-200 rounded-xl hover:bg-red-100 transition-colors font-medium text-sm">
                                    Delete Account
                                </button>
                            </div>
                        </div>
                    </main>
                </div>
            </UserSideBar>
        </>
    );
}