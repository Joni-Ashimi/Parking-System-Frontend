"use client";

import React, {useState} from "react";
import {Calendar, FileText, Mail, MessageSquare, Phone, Tag, User, X, ZoomIn} from "lucide-react";
import {formatDate} from "@/utils/functions";

export interface FeedbackRecord {
    id: string;
    subject: string;
    category: string;
    message: string;
    photos: string[] | string | null;
    status: string;
    createdAt: string;
    user: {
        id: string;
        name: string;
        email: string;
        phoneNumber?: string;
        profileImageUrl?: string;
        gender?: string;
    };
}

interface FeedbackViewModalProps {
    isOpen: boolean;
    onClose: () => void;
    feedback: FeedbackRecord;
}

export default function FeedbackViewModal({isOpen, onClose, feedback}: FeedbackViewModalProps) {
    const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);

    if (!isOpen) return null;

    const photoList: string[] = Array.isArray(feedback.photos)
        ? feedback.photos
        : typeof feedback.photos === "string" && feedback.photos
            ? feedback.photos.split(",")
            : [];

    return (
        <>
            <div
                className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fade-in">
                <div
                    className="bg-white rounded-2xl shadow-xl border border-slate-100 max-w-2xl w-full max-h-[85vh] overflow-hidden flex flex-col">
                    <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-slate-50">
                        <div className="flex items-center gap-2.5">
                            <div
                                className="w-9 h-9 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                                <MessageSquare size={18}/>
                            </div>
                            <div>
                                <h3 className="text-base font-semibold text-gray-900">Feedback Details</h3>
                                <p className="text-xs text-gray-400 font-medium">ID: {feedback.id}</p>
                            </div>
                        </div>
                        <button onClick={onClose}
                                className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition-colors">
                            <X size={18}/>
                        </button>
                    </div>

                    <div className="p-6 overflow-y-auto space-y-6 flex-1">
                        <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-3">
                            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
                                <User size={12}/> Submitter Information
                            </h4>
                            <div className="flex items-center gap-3">
                                <img
                                    src={
                                        feedback.user?.profileImageUrl && feedback.user.profileImageUrl !== "null"
                                            ? feedback.user.profileImageUrl
                                            : (feedback.user?.gender === "MALE"
                                                ? "https://res.cloudinary.com/dorwowkmx/image/upload/v1778960498/male-face-avatar-icon-set-flat-design-social-media-profiles_1281173-3806_mcwkod.jpg"
                                                : "https://res.cloudinary.com/dorwowkmx/image/upload/v1778960555/avatar-profile-icon-flat-style-female-user-profile-vector-illustration-isolated-background-women-profile-sign-business-concept_157943-38866_li4tqs.jpg")
                                    }
                                    alt={feedback.user?.name}
                                    className="w-12 h-12 rounded-full object-cover ring-2 ring-white shadow-sm"
                                />
                                <div className="space-y-0.5">
                                    <p className="text-sm font-semibold text-gray-900">{feedback.user?.name || "Unknown User"}</p>
                                    <div
                                        className="flex flex-col gap-0.5 sm:flex-row sm:items-center sm:gap-4 text-xs text-gray-500 font-medium">
                                        <span className="flex items-center gap-1"><Mail
                                            size={12}/> {feedback.user?.email}</span>
                                        {feedback.user?.phoneNumber && (
                                            <span className="flex items-center gap-1"><Phone
                                                size={12}/> {feedback.user?.phoneNumber}</span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <span
                                    className="text-[10px] font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1">
                                    <Tag size={10}/> Category
                                </span>
                                <span
                                    className="inline-flex px-2.5 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-100">
                                    {feedback.category}
                                </span>
                            </div>
                            <div className="space-y-1">
                                <span
                                    className="text-[10px] font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1">
                                    <Calendar size={10}/> Submitted On
                                </span>
                                <p className="text-sm font-medium text-gray-700 mt-0.5">
                                    {formatDate(feedback.createdAt)}
                                </p>
                            </div>
                        </div>

                        <div className="space-y-4 pt-2 border-t border-gray-100">
                            <div className="space-y-1">
                                <span
                                    className="text-[10px] font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1">
                                    <FileText size={10}/> Subject
                                end</span>
                                <p className="text-base font-semibold text-gray-900">{feedback.subject}</p>
                            </div>

                            <div className="space-y-1.5">
                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                                    Message Description
                                </span>
                                <div
                                    className="p-4 rounded-xl bg-gray-50 border border-gray-200 text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">
                                    {feedback.message}
                                </div>
                            </div>
                        </div>

                        {photoList.length > 0 && (
                            <div className="space-y-2 pt-2 border-t border-gray-100">
                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                                    Attached Photos ({photoList.length})
                                </span>
                                <div className="grid grid-cols-3 gap-3">
                                    {photoList.map((url, index) => (
                                        <button
                                            key={index}
                                            type="button"
                                            onClick={() => setSelectedPhoto(url)} // ◄ Intercept and save to state
                                            className="group relative h-28 rounded-xl overflow-hidden border border-gray-200 bg-gray-50 hover:border-indigo-400 transition-all text-left"
                                        >
                                            <img
                                                src={url}
                                                alt={`Attachment ${index + 1}`}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                                            />
                                            <div
                                                className="absolute inset-0 bg-black/0 group-hover:bg-black/30 flex flex-col items-center justify-center transition-colors gap-1">
                                                <ZoomIn
                                                    className="text-white opacity-0 group-hover:opacity-100 transition-opacity"
                                                    size={16}/>
                                                <span
                                                    className="text-white text-[10px] font-medium opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 px-2 py-0.5 rounded">
                                                    Enlarge Image
                                                </span>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="px-6 py-3.5 border-t border-gray-100 bg-gray-50 flex justify-end">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 bg-white border border-gray-200 text-gray-700 text-xs font-medium rounded-xl hover:bg-gray-50 transition-colors"
                        >
                            Close View
                        </button>
                    </div>
                </div>
            </div>

            {selectedPhoto && (
                <div
                    onClick={() => setSelectedPhoto(null)} // Click layout background context to close
                    className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 cursor-zoom-out animate-fade-in"
                >
                    <button
                        onClick={() => setSelectedPhoto(null)}
                        className="absolute top-6 right-6 p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/10 transition-colors"
                    >
                        <X size={20}/>
                    </button>

                    <div
                        onClick={(e) => e.stopPropagation()} // Prevent closing backdrop event bubble triggers
                        className="relative max-w-4xl max-h-[90vh] flex items-center justify-center animate-scale-up"
                    >
                        <img
                            src={selectedPhoto}
                            alt="Preview Zoomed"
                            className="rounded-xl object-contain max-w-full max-h-[90vh] shadow-2xl border border-white/5"
                        />
                    </div>
                </div>
            )}
        </>
    );
}