// frontend/app/admin/violations/page.tsx
"use client";

import React, {useCallback, useEffect, useState} from "react";
import {AlertTriangle, CheckCircle2, Clock, Eye, FileText, Shield, Users, X} from "lucide-react";
import type {TableColumnsType} from "antd";
import AdminSidebar from "@/components/sidebar/adminSidebar";
import DataTable from "@/app/core/components/DataTable";
import ViolationService from "@/services/ViolationService";
import {formatDate, handleRequestErrors} from "@/utils/functions";

type ViolationType = "overstay" | "fraud" | "other";
type ViolationStatus = "PENDING" | "RESOLVED";

export interface Violation {
    id: string;
    userId: string;
    type: ViolationType;
    description: string;
    penaltyAmount: number | null;
    status: ViolationStatus;
    createdAt: string;
    resolvedAt: string | null;
    deletedAt?: string | null;
    user?: {
        id: string;
        name: string;
        email: string;
        profileImageUrl?: string;
        gender?: string;
    };
}

interface TableParams {
    page?: number;
    pageSize?: number;
    qs?: string;
    sortBy?: string;
    sortOrder?: "ASC" | "DESC";
    filters?: Record<string, (string | number | boolean)[] | null>;
}

interface GlobalStats {
    total: number;
    pending: number;
    resolved: number;
    overstay: number;
    unpaid: number;
    fraud: number;
}

function DescriptionModal({violation, onClose}: { violation: Violation; onClose: () => void }) {
    const typeMeta = getTypeMeta(violation.type);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm"/>
            <div
                className="relative bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 border border-gray-100 animate-scale-up"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${typeMeta.bg}`}>
                            <typeMeta.Icon size={18} className={typeMeta.iconColor}/>
                        </div>
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-0.5">Violation
                                Detail</p>
                            <h3 className="text-base font-bold text-gray-900">{typeMeta.label}</h3>
                        </div>
                    </div>
                    <button onClick={onClose}
                            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors">
                        <X size={16}/>
                    </button>
                </div>

                {violation.user && (
                    <div
                        className="flex items-center gap-3 bg-gray-50 rounded-xl px-4 py-3 mb-4 border border-gray-100">
                        <img
                            src={
                                violation.user.profileImageUrl && violation.user.profileImageUrl !== "null"
                                    ? violation.user.profileImageUrl
                                    : (violation.user.gender === "MALE"
                                        ? "https://res.cloudinary.com/dorwowkmx/image/upload/v1778960498/male-face-avatar-icon-set-flat-design-social-media-profiles_1281173-3806_mcwkod.jpg"
                                        : "https://res.cloudinary.com/dorwowkmx/image/upload/v1778960555/avatar-profile-icon-flat-style-female-user-profile-vector-illustration-isolated-background-women-profile-sign-business-concept_157943-38866_li4tqs.jpg")
                            }
                            alt={violation.user.name}
                            className="w-9 h-9 rounded-full object-cover ring-2 ring-white shadow-sm"
                        />
                        <div>
                            <p className="text-sm font-semibold text-gray-900">{violation.user.name}</p>
                            <p className="text-xs text-gray-500">{violation.user.email}</p>
                        </div>
                    </div>
                )}

                <div className="mb-4">
                    <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-2">Description</p>
                    <p className="text-sm text-gray-700 leading-relaxed bg-gray-50 rounded-xl p-4 border border-gray-100 whitespace-pre-wrap">
                        {violation.description}
                    </p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                    <div className="bg-gray-50 rounded-xl px-4 py-3 border border-gray-100">
                        <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold mb-1">Reported</p>
                        <p className="text-sm font-medium text-gray-800">{formatDate(violation.createdAt)}</p>
                    </div>
                    <div className="bg-gray-50 rounded-xl px-4 py-3 border border-gray-100">
                        <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold mb-1">Status</p>
                        <StatusBadge status={violation.status}/>
                    </div>
                </div>
            </div>
        </div>
    );
}

function getTypeMeta(type: ViolationType) {
    const map = {
        overstay: {
            label: "Overstay",
            Icon: Clock,
            bg: "bg-amber-100",
            iconColor: "text-amber-600",
            badge: "bg-amber-50 text-amber-700 border-amber-200"
        },
        fraud: {
            label: "Fraud",
            Icon: Shield,
            bg: "bg-purple-100",
            iconColor: "text-purple-600",
            badge: "bg-purple-50 text-purple-700 border-purple-200"
        },
        other: {
            label: "Other",
            Icon: FileText,
            bg: "bg-gray-100",
            iconColor: "text-gray-600",
            badge: "bg-gray-50 text-gray-700 border-gray-200"
        },
    };
    return map[type] ?? map.other;
}

function TypeBadge({type}: { type: ViolationType }) {
    const {label, Icon, badge} = getTypeMeta(type);
    return (
        <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border whitespace-nowrap ${badge}`}>
            <Icon size={11}/>
            {label}
        </span>
    );
}

function StatusBadge({status}: { status: ViolationStatus }) {
    if (status?.toUpperCase() === "RESOLVED") {
        return (
            <span
                className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 whitespace-nowrap">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"/>
                Resolved
            </span>
        );
    }
    return (
        <span
            className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200 whitespace-nowrap">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"/>
            Pending
        </span>
    );
}

function DescriptionCell({violation, onExpand}: { violation: Violation; onExpand: (v: Violation) => void }) {
    const maxLen = 45;
    const isLong = violation.description.length > maxLen;
    return (
        <div className="flex items-center gap-2 max-w-xs min-w-0">
            <p className="text-sm text-gray-700 truncate">
                {isLong ? violation.description.slice(0, maxLen) + "…" : violation.description}
            </p>
            {isLong && (
                <button
                    onClick={() => onExpand(violation)}
                    className="flex-shrink-0 inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded-md border border-indigo-200 text-indigo-600 hover:bg-indigo-50 transition-colors"
                >
                    <Eye size={11}/>
                    More
                </button>
            )}
        </div>
    );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function ViolationsPage() {
    const [violations, setViolations] = useState<Violation[]>([]);
    const [total, setTotal] = useState(0);
    const [stats, setStats] = useState<GlobalStats>({
        total: 0,
        pending: 0,
        resolved: 0,
        overstay: 0,
        unpaid: 0,
        fraud: 0
    });
    const [expandedViolation, setExpandedViolation] = useState<Violation | null>(null);

    const fetchStats = useCallback(async () => {
        try {
            const res = await ViolationService.getStats();
            setStats(res.data);
        } catch (err) {
            handleRequestErrors(err);
        }
    }, []);

    // Fixed: Properly extracts the newly layout-wrapped payload matching pagination object arrays
    const getData = useCallback(async (params: TableParams) => {
        const {page = 1, pageSize = 10, qs = "", sortBy, sortOrder, filters} = params;
        try {
            const res = await ViolationService.getAll({
                page,
                pageSize,
                qs,
                sortBy,
                sortOrder,
                status: filters?.status?.[0] ?? undefined,
                type: filters?.type ? filters.type.join(",") : undefined,
            } as any);

            let finalData: Violation[] = [];
            let finalTotal: number = 0;

            if (res && res.data) {
                if (res.data.data && Array.isArray(res.data.data)) {
                    finalData = res.data.data;
                    finalTotal = typeof res.data.total === "number" ? res.data.total : res.data.data.length;
                } else if (Array.isArray(res.data)) {
                    finalData = res.data;
                    finalTotal = res.data.length;
                }
            }

            setViolations(Array.isArray(finalData) ? finalData : []);
            setTotal(finalTotal);
        } catch (err) {
            handleRequestErrors(err);
            setViolations([]);
        }
    }, []);

    useEffect(() => {
        fetchStats();
    }, [fetchStats]);

    const columns: TableColumnsType<Violation> = [
        {
            title: "User",
            dataIndex: "user",
            key: "user",
            width: "30%",
            render: (_, record) => (
                <div className="flex items-center gap-3 max-w-xs min-w-0">
                    {record.user ? (
                        <>
                            <img
                                src={
                                    record.user.profileImageUrl && record.user.profileImageUrl !== "null"
                                        ? record.user.profileImageUrl
                                        : (record.user.gender === "MALE"
                                            ? "https://res.cloudinary.com/dorwowkmx/image/upload/v1778960498/male-face-avatar-icon-set-flat-design-social-media-profiles_1281173-3806_mcwkod.jpg"
                                            : "https://res.cloudinary.com/dorwowkmx/image/upload/v1778960555/avatar-profile-icon-flat-style-female-user-profile-vector-illustration-isolated-background-women-profile-sign-business-concept_157943-38866_li4tqs.jpg")
                                }
                                alt={record.user.name}
                                className="w-10 h-10 rounded-full object-cover ring-2 ring-gray-100 flex-shrink-0"
                            />
                            <div className="flex flex-col leading-tight min-w-0">
                                <p className="text-sm font-semibold text-gray-900 truncate">{record.user.name}</p>
                                <p className="text-xs text-gray-500 truncate">{record.user.email}</p>
                            </div>
                        </>
                    ) : (
                        <div className="flex items-center gap-2 text-gray-400">
                            <div
                                className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                                <Users size={16}/>
                            </div>
                            <span className="text-xs font-mono">
                                {record.userId?.slice(0, 8) ?? "N/A"}…
                            </span>
                        </div>
                    )}
                </div>
            ),
            sorter: true,
        },
        {
            title: "Type",
            dataIndex: "type",
            key: "type",
            width: 140,
            filters: [
                {text: "Overstay", value: "overstay"},
                {text: "Fraud", value: "fraud"},
                {text: "Other", value: "other"},
            ],
            render: (type: ViolationType) => <TypeBadge type={type}/>,
        },
        {
            title: "Description",
            dataIndex: "description",
            key: "description",
            render: (_, record) => <DescriptionCell violation={record} onExpand={setExpandedViolation}/>,
        },
        {
            title: "Status",
            dataIndex: "status",
            key: "status",
            width: 130,
            filters: [
                {text: "Pending", value: "PENDING"},
                {text: "Resolved", value: "RESOLVED"},
            ],
            render: (status: ViolationStatus) => <StatusBadge status={status}/>,
        },
        {
            title: "Reported At",
            dataIndex: "createdAt",
            key: "createdAt",
            sorter: true,
            render: (value: string) => (
                <div className="flex items-center gap-1.5 text-sm text-gray-600 whitespace-nowrap">
                    <AlertTriangle size={13} className="text-amber-400 flex-shrink-0"/>
                    {formatDate(value)}
                </div>
            ),
        },
        {
            title: "Resolved At",
            dataIndex: "resolvedAt",
            key: "resolvedAt",
            sorter: true,
            render: (value: string, record) => {
                if (record.status.toUpperCase() !== "RESOLVED" || !value) {
                    return <span className="text-xs text-gray-400 italic">Not Resolved</span>;
                }
                return (
                    <span
                        className="inline-flex items-center gap-1.5 text-xs text-emerald-600 font-medium whitespace-nowrap">
                        <CheckCircle2 size={13} className="flex-shrink-0"/>
                        {formatDate(value)}
                    </span>
                );
            },
        },
        {
            title: "Detail",
            key: "detail",
            align: "right",
            render: (_, record) => (
                <button
                    onClick={() => setExpandedViolation(record)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-indigo-200 text-indigo-600 hover:bg-indigo-50 hover:border-indigo-400 transition-all"
                >
                    <FileText size={13}/>
                    View
                </button>
            ),
        },
    ];

    // @ts-ignore
    // @ts-ignore
    return (
        <AdminSidebar>
            <div className="min-h-screen bg-slate-50">
                <header className="bg-white border-b border-gray-200 px-8 py-4 sticky top-0 z-10">
                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="text-2xl font-semibold text-gray-900">Violations & Enforcement</h1>
                            <p className="text-sm text-gray-400 mt-0.5">Track overstays, unpaid sessions, and fraud</p>
                        </div>
                        <div className="flex items-center gap-2 px-3 py-1.5 bg-red-50 border border-red-100 rounded-lg">
                            <Shield size={14} className="text-red-500"/>
                            <span className="text-sm text-red-600 font-medium">Enforcement Active</span>
                        </div>
                    </div>
                </header>

                <div className="p-8 space-y-6">
                    <div
                        className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-rose-600 via-red-500 to-orange-500 p-7 text-white">
                        <div className="absolute -top-8 -right-8 w-40 h-40 bg-white/10 rounded-full"/>
                        <div className="absolute top-4 right-24 w-20 h-20 bg-white/10 rounded-full"/>
                        <div className="absolute -bottom-6 right-12 w-28 h-28 bg-rose-800/40 rounded-full"/>
                        <div className="relative z-10">
                            <p className="text-rose-200 text-sm font-medium uppercase tracking-widest mb-1">Enforcement
                                Dashboard</p>
                            <h2 className="text-3xl font-bold mb-1">Monitor violations</h2>
                            <p className="text-rose-200 text-sm">Review infractions and track resolution status across
                                all users.</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
                        {[
                            {
                                label: "Total",
                                value: stats.total,
                                color: "text-gray-900",
                                bg: "bg-gray-100",
                                Icon: Shield
                            },
                            {
                                label: "Pending",
                                value: stats.pending,
                                color: "text-amber-600",
                                bg: "bg-amber-100",
                                Icon: Clock
                            },
                            {
                                label: "Resolved",
                                value: stats.resolved,
                                color: "text-emerald-600",
                                bg: "bg-emerald-100",
                                Icon: CheckCircle2
                            },
                            {
                                label: "Overstay",
                                value: stats.overstay,
                                color: "text-amber-700",
                                bg: "bg-amber-50",
                                Icon: Clock
                            },
                            {
                                label: "Fraud",
                                value: stats.fraud,
                                color: "text-purple-600",
                                bg: "bg-purple-100",
                                Icon: Shield
                            },
                        ].map(({label, value, color, bg, Icon}) => (
                            <div key={label}
                                 className="bg-white rounded-2xl border border-gray-200 p-5 flex items-center gap-4 shadow-sm">
                                <div
                                    className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center flex-shrink-0`}>
                                    <Icon size={18} className={color}/>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">{label}</p>
                                    <p className={`text-2xl font-bold leading-tight ${color}`}>{value}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                        <DataTable<Violation>
                            title="All Violations"
                            columns={columns}
                            data={violations}
                            getData={getData}
                            allowSearch={true}
                            total={total}
                            defaultPageSize={10}
                            pageSizeOptions={[10, 20, 50]}
                            allowFilter={true}
                        />
                    </div>
                </div>
            </div>

            {expandedViolation && (
                <DescriptionModal violation={expandedViolation} onClose={() => setExpandedViolation(null)}/>
            )}
        </AdminSidebar>
    );
}