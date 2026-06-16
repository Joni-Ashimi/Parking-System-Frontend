"use client";

import React, {useState} from "react";
import {Loader2} from "lucide-react";

export type ModalVariant = "danger" | "success" | "warning" | "info";

interface AdminActionModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => Promise<void> | void;
    title: string;
    description: React.ReactNode;
    confirmLabel?: string;
    cancelLabel?: string;
    variant?: ModalVariant;
    icon?: React.ReactNode;
    children?: React.ReactNode;
    loadingLabel?: string;
}

export default function AdminActionModal({
                                             isOpen,
                                             onClose,
                                             onConfirm,
                                             title,
                                             description,
                                             confirmLabel = "Confirm",
                                             cancelLabel = "Cancel",
                                             variant = "danger",
                                             icon,
                                             children,
                                             loadingLabel,
                                         }: AdminActionModalProps) {
    const [isLoading, setIsLoading] = useState(false);

    if (!isOpen) return null;
    // style

    const variantStyles = {
        danger: {
            iconColor: "text-red-600",
            btnConfirm: "bg-red-600 hover:bg-red-700 focus:ring-red-500 text-white disabled:bg-red-400",
            progressBar: "bg-red-500",
        },
        success: {
            iconColor: "text-emerald-600",
            btnConfirm: "bg-emerald-600 hover:bg-emerald-700 focus:ring-emerald-500 text-white disabled:bg-emerald-400",
            progressBar: "bg-emerald-500",
        },
        warning: {
            iconColor: "text-amber-500",
            btnConfirm: "bg-amber-500 hover:bg-amber-600 focus:ring-amber-500 text-white disabled:bg-amber-300",
            progressBar: "bg-amber-500",
        },
        info: {
            iconColor: "text-blue-600",
            btnConfirm: "bg-blue-600 hover:bg-blue-700 focus:ring-blue-500 text-white disabled:bg-blue-400",
            progressBar: "bg-blue-500",
        },
    };

    const currentStyle = variantStyles[variant];

    const handleConfirm = async () => {
        setIsLoading(true);
        try {
            await onConfirm();
        } finally {
            setIsLoading(false);
        }
    };

    const defaultIcon = (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
        </svg>
    );

    return (
        <div
            className="fixed inset-0 z-50 flex items-start justify-center bg-black/30 backdrop-blur-[4px] p-5 pt-16 animate-in fade-in slide-in-from-top-4 duration-200">
            <div className="w-full max-w-md bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden">
                <div className="h-1 w-full bg-gray-100 overflow-hidden">
                    {isLoading && (
                        <div
                            className={`h-full ${currentStyle.progressBar} animate-pulse`}
                            style={{
                                width: "100%",
                                backgroundImage: `repeating-linear-gradient(
                                    90deg,
                                    transparent,
                                    transparent 40%,
                                    rgba(255,255,255,0.3) 40%,
                                    rgba(255,255,255,0.3) 60%
                                )`,
                                backgroundSize: "200% 100%",
                                animation: "shimmer 1.2s infinite linear",
                            }}
                        />
                    )}
                </div>

                <div className="p-6">
                    <div className={`flex items-center gap-3 ${currentStyle.iconColor} mb-4`}>
                        {icon || defaultIcon}
                        <h3 className="text-lg font-bold text-gray-900">{title}</h3>
                    </div>

                    <div className="text-sm text-gray-500 mb-6 leading-relaxed">
                        {description}
                    </div>

                    {children}

                    {isLoading && (
                        <div className="flex items-center gap-2 mt-4 mb-2 text-sm text-gray-500">
                            <Loader2 size={14} className="animate-spin flex-shrink-0"/>
                            <span>{loadingLabel ?? "Processing, please wait…"}</span>
                        </div>
                    )}

                    <div className="flex justify-end gap-3 mt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={isLoading}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {cancelLabel}
                        </button>
                        <button
                            type="button"
                            onClick={handleConfirm}
                            disabled={isLoading}
                            className={`px-4 py-2 text-sm font-medium rounded-lg shadow-md transition-colors focus:outline-none focus:ring-2 disabled:cursor-not-allowed flex items-center gap-2 ${currentStyle.btnConfirm}`}
                        >
                            {isLoading && <Loader2 size={14} className="animate-spin"/>}
                            {isLoading ? (loadingLabel ?? "Processing…") : confirmLabel}
                        </button>
                    </div>
                </div>
            </div>

            <style>{`
                @keyframes shimmer {
                    0% { background-position: 200% 0; }
                    100% { background-position: -200% 0; }
                }
            `}</style>
        </div>
    );
}