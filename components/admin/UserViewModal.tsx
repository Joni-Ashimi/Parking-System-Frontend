"use client";

import React from "react";
import {Calendar, Clock, Mail, Phone, UserCircle, UserCircle2Icon, X} from "lucide-react";
import {formatDate} from "@/utils/functions";

export interface User {
    id: string;
    name: string;
    email: string;
    gender: string;
    phone?: string;
    phoneNumber?: string;
    profileImageUrl?: string | null;
    lastLoginAt: string;
    verificationStatus: string;
    type: string;
    createdAt: string;
}

export interface AdminUserViewModalProps {
    isOpen: boolean;
    onClose: () => void;
    user: User | null;
}

export default function AdminUserViewModal({isOpen, onClose, user}: AdminUserViewModalProps) {
    if (!isOpen || !user) return null;

    // Badge styling helpers for User Roles and Statuses
    const getStatusBadge = (status: string) => {
        switch (status?.toLowerCase()) {
            case "verified":
                return "bg-emerald-50 text-emerald-700 border-emerald-200";
            case "pending":
                return "bg-amber-50 text-amber-700 border-amber-200";
            case "banned":
            default:
                return "bg-rose-50 text-rose-600 border-rose-200";
        }
    };

    const getTypeBadge = (type: string) => {
        return type?.toLowerCase() === "admin"
            ? "bg-indigo-50 text-indigo-700 border-indigo-200"
            : "bg-slate-100 text-slate-700 border-slate-200";
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-start justify-center bg-black/30 backdrop-blur-[4px] p-5 pt-16 animate-in fade-in slide-in-from-top-4 duration-200">
            <div className="w-full max-w-md bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden">

                {/* Header Profile Hero Card */}
                <div className="relative bg-gradient-to-r from-slate-900 to-indigo-950 p-6 text-white">
                    <button
                        type="button"
                        onClick={onClose}
                        className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors p-1 rounded-lg hover:bg-white/10"
                    >
                        <X size={18}/>
                    </button>

                    <div className="flex items-center gap-4 mt-2">
                        <img
                            src={
                                user?.profileImageUrl ||
                                (user?.gender === "MALE"
                                    ? "https://res.cloudinary.com/dorwowkmx/image/upload/v1778960498/male-face-avatar-icon-set-flat-design-social-media-profiles_1281173-3806_mcwkod.jpg"
                                    : "https://res.cloudinary.com/dorwowkmx/image/upload/v1778960555/avatar-profile-icon-flat-style-female-user-profile-vector-illustration-isolated-background-women-profile-sign-business-concept_157943-38866_li4tqs.jpg")
                            }
                            alt={user.name}
                            className="w-16 h-16 rounded-full object-cover ring-4 ring-white/10 bg-slate-800"
                        />
                        <div className="leading-tight">
                            <h3 className="text-xl font-bold tracking-tight">{user.name}</h3>
                            <div className="flex gap-1.5 mt-1.5">
                                <span
                                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold border uppercase tracking-wider ${getStatusBadge(user.verificationStatus)}`}>
                                    {user.verificationStatus}
                                </span>
                                <span
                                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold border uppercase tracking-wider ${getTypeBadge(user.type)}`}>
                                    {user.type || "GUEST"}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Profile Details Core Body Stack */}
                <div className="p-6 space-y-4 text-sm text-gray-600">
                    <div>
                        <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block mb-2">Account Credentials</span>
                        <div className="space-y-2.5 bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                            <div className="flex items-center gap-2.5 text-gray-700">
                                <Mail size={15} className="text-gray-400"/>
                                <span className="font-medium break-all">{user.email}</span>
                            </div>
                            <div className="flex items-center gap-2.5 text-gray-700">
                                <Phone size={15} className="text-gray-400"/>
                                <span>{user.phone || user.phoneNumber || "No phone added"}</span>
                            </div>
                            <div className="flex items-center gap-2.5 text-gray-700">
                                <UserCircle2Icon size={15} className="text-gray-400"/>
                                <span>{user.gender || "No Gender Selected"}</span>
                            </div>
                        </div>
                    </div>

                    <div>
                        <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block mb-2">System Footprint</span>
                        <div className="space-y-2.5 bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                            <div className="flex items-center justify-between text-gray-700">
                                <div className="flex items-center gap-2.5">
                                    <Calendar size={15} className="text-gray-400"/>
                                    <span>Joined Platform</span>
                                </div>
                                <span
                                    className="text-xs font-semibold text-gray-500">{formatDate(user.createdAt)}</span>
                            </div>
                            <div className="flex items-center justify-between text-gray-700">
                                <div className="flex items-center gap-2.5">
                                    <Clock size={15} className="text-gray-400"/>
                                    <span>Last Login Activity</span>
                                </div>
                                <span
                                    className="text-xs font-semibold text-gray-500">{formatDate(user.lastLoginAt)}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer Operations Controls */}
                <div className="bg-gray-50 border-t border-gray-100 px-6 py-4 flex justify-end">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors shadow-sm"
                    >
                        Close Profile
                    </button>
                </div>

            </div>
        </div>
    );
}