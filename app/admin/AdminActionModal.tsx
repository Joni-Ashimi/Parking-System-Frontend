"use client";

import React from "react";

export type ModalVariant = "danger" | "success" | "warning" | "info";

interface AdminActionModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    description: React.ReactNode;
    confirmLabel?: string;
    cancelLabel?: string;
    variant?: ModalVariant;
    icon?: React.ReactNode;
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
                                         }: AdminActionModalProps) {
    if (!isOpen) return null;

    const variantStyles = {
        danger: {
            iconColor: "text-red-600",
            btnConfirm: "bg-red-600 hover:bg-red-700 focus:ring-red-500 text-white",
        },
        success: {
            iconColor: "text-emerald-600",
            btnConfirm: "bg-emerald-600 hover:bg-emerald-700 focus:ring-emerald-500 text-white",
        },
        warning: {
            iconColor: "text-amber-500",
            btnConfirm: "bg-amber-500 hover:bg-amber-600 focus:ring-amber-500 text-white",
        },
        info: {
            iconColor: "text-blue-600",
            btnConfirm: "bg-blue-600 hover:bg-blue-700 focus:ring-blue-500 text-white",
        },
    };

    const currentStyle = variantStyles[variant];

    const defaultIcon = (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
        </svg>
    );

    return (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/30 backdrop-blur-[4px] p-5 pt-16 animate-in fade-in slide-in-from-top-4 duration-200">
            <div className="w-full max-w-md p-6 bg-white rounded-xl shadow-2xl border border-gray-100">

                <div className={`flex items-center gap-3 ${currentStyle.iconColor} mb-4`}>
                    {icon || defaultIcon}
                    <h3 className="text-lg font-bold text-gray-900">{title}</h3>
                </div>

                <div className="text-sm text-gray-500 mb-6 leading-relaxed">
                    {description}
                </div>

                <div className="flex justify-end gap-3">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-300"
                    >
                        {cancelLabel}
                    </button>
                    <button
                        type="button"
                        onClick={onConfirm}
                        className={`px-4 py-2 text-sm font-medium rounded-lg shadow-md transition-colors focus:outline-none focus:ring-2 ${currentStyle.btnConfirm}`}
                    >
                        {confirmLabel}
                    </button>
                </div>

            </div>
        </div>
    );
}