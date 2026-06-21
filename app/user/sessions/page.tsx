"use client";

import {useEffect, useState} from "react";
import {Calendar, Car, CheckCircle, Clock, DollarSign, Tag, XCircle,} from "lucide-react";
import type {TableColumnsType, TableProps} from "antd";
import {Table} from "antd";
import UserSidebar from "@/components/sidebar/userSidebar";
import ParkingSessionService from "@/services/ParkingSessionService";
import {handleRequestErrors} from "@/utils/functions";
import Link from "next/link";

interface SessionHistory {
    id: string;
    createdAt: string;
    entryTime: string;
    exitTime: string | null;
    status: string;
    price: number | null;
    vehicle?: { type: string; plateNumber: string };
    spot: {
        spotNumber: string;
        floor: number;
        type?: {
            name: string;
            size: string;
            baseHourlyRate: number;
            effectiveHourlyRate?: number;
            isDiscounted?: boolean;
        };
        lot?: { name: string };
    };
    transaction?: {
        id: string;
        sdkOrderId: string;
        status: string;
        finalAmount: number;
        paymentCurrency: string;
    };
}

const STATUS_CONFIG: Record<string, { label: string; classes: string; icon: any }> = {
    completed: {label: "Completed", classes: "bg-emerald-100 text-emerald-800 border-emerald-200", icon: CheckCircle},
    active: {label: "Active", classes: "bg-blue-100 text-blue-800 border-blue-200", icon: Clock},
    cancelled: {label: "Cancelled", classes: "bg-red-100 text-red-800 border-red-200", icon: XCircle},
};

function StatusBadge({status}: { status: string }) {
    const cfg = STATUS_CONFIG[status.toLowerCase()] ?? STATUS_CONFIG.cancelled;
    const Icon = cfg.icon;
    return (
        <span
            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold border ${cfg.classes}`}>
            <Icon size={10}/> {cfg.label}
        </span>
    );
}

function formatDuration(entryTime: string, exitTime: string | null): string {
    if (!exitTime) return "—";
    const ms = new Date(exitTime).getTime() - new Date(entryTime).getTime();
    const h = Math.floor(ms / 3600000);
    const m = Math.floor((ms % 3600000) / 60000);
    if (h > 0) return `${h}h ${m}m`;
    return `${m}m`;
}

function getDurationMs(entryTime: string, exitTime: string | null): number {
    if (!exitTime) return 0;
    return new Date(exitTime).getTime() - new Date(entryTime).getTime();
}

export default function SessionHistoryPage() {
    const [sessions, setSessions] = useState<SessionHistory[]>([]);
    const [loading, setLoading] = useState(true);
    const [pagination, setPagination] = useState({current: 1, pageSize: 10});

    useEffect(() => {
        ParkingSessionService.getSessionHistory()
            .then(setSessions)
            .catch(handleRequestErrors)
            .finally(() => setLoading(false));
    }, []);

    const [currentPageRows, setCurrentPageRows] = useState<SessionHistory[]>([]);
    useEffect(() => {
        const start = (pagination.current - 1) * pagination.pageSize;
        setCurrentPageRows(sessions.slice(start, start + pagination.pageSize));
    }, [sessions, pagination]);

    const handleTableChange: TableProps<SessionHistory>["onChange"] = (paginationConfig, _filters, _sorter, extra) => {
        const newPage = paginationConfig.current ?? 1;
        const newPageSize = paginationConfig.pageSize ?? 10;
        setPagination({current: newPage, pageSize: newPageSize});
        const visible = extra.currentDataSource;
        const start = (newPage - 1) * newPageSize;
        setCurrentPageRows(visible.slice(start, start + newPageSize));
    };

    const pageSpent = currentPageRows
        .filter((s) => s.transaction?.status === "success")
        .reduce((sum, s) => sum + Number(s.transaction?.finalAmount ?? 0), 0);

    const pageCompletedCount = currentPageRows.filter((s) => s.status.toLowerCase() === "completed").length;

    const totalSpent = sessions
        .filter((s) => s.transaction?.status === "success")
        .reduce((sum, s) => sum + Number(s.transaction?.finalAmount ?? 0), 0);

    const completedCount = sessions.filter((s) => s.status.toLowerCase() === "completed").length;

    const columns: TableColumnsType<SessionHistory> = [
        {
            title: "Date",
            dataIndex: "createdAt",
            key: "createdAt",
            sorter: (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
            render: (value: string) => (
                <div>
                    <p className="text-sm font-semibold text-gray-800">
                        {new Date(value).toLocaleDateString([], {day: "2-digit", month: "short", year: "numeric"})}
                    </p>
                    <p className="text-xs text-gray-400">
                        {new Date(value).toLocaleTimeString([], {hour: "2-digit", minute: "2-digit"})}
                    </p>
                </div>
            ),
        },
        {
            title: "Spot",
            dataIndex: ["spot", "spotNumber"],
            key: "spotNumber",
            sorter: (a, b) => a.spot.spotNumber.localeCompare(b.spot.spotNumber),
            render: (_, record) => (
                <div className="flex items-center gap-2">
                    <div
                        className="w-8 h-8 bg-blue-50 text-blue-700 rounded-lg flex items-center justify-center text-xs font-bold shrink-0">
                        {record?.spot?.spotNumber.split("-")[1] ?? record?.spot?.spotNumber}
                    </div>
                    <div>
                        <p className="text-sm font-semibold text-gray-800">{record?.spot?.spotNumber}</p>
                        <p className="text-xs text-gray-400">{record?.spot?.lot?.name ?? "—"}</p>
                    </div>
                </div>
            ),
        },
        {
            title: "Vehicle",
            dataIndex: ["vehicle", "plateNumber"],
            key: "vehicle",
            sorter: (a, b) => (a.vehicle?.plateNumber ?? "").localeCompare(b.vehicle?.plateNumber ?? ""),
            render: (_, record) =>
                record.vehicle ? (
                    <div>
                        <p className="text-sm font-semibold text-gray-800 font-mono">{record.vehicle.plateNumber}</p>
                        <p className="text-xs text-gray-400 capitalize">{record.vehicle.type}</p>
                    </div>
                ) : (
                    <span className="text-xs text-gray-300">—</span>
                ),
        },
        {
            title: "Duration",
            key: "duration",
            sorter: (a, b) =>
                getDurationMs(a.entryTime ?? a.createdAt, a.exitTime) -
                getDurationMs(b.entryTime ?? b.createdAt, b.exitTime),
            render: (_, record) => (
                <div className="flex items-center gap-1.5 text-sm text-gray-700">
                    <Clock size={13} className="text-gray-400"/>
                    <span className="font-mono">
                        {formatDuration(record.entryTime ?? record.createdAt, record.exitTime)}
                    </span>
                </div>
            ),
        },
        {
            title: "Amount",
            dataIndex: "price",
            key: "price",
            sorter: (a, b) => Number(a.price ?? 0) - Number(b.price ?? 0),
            render: (price: number | null, record) =>
                price != null ? (
                    <div>
                        <p className="text-sm font-bold text-gray-900">€{Number(price).toFixed(2)}</p>
                        {record?.spot?.type && (
                            <p className="text-xs text-gray-400">
                                @€{Number(record?.spot?.type.effectiveHourlyRate ?? record?.spot?.type.baseHourlyRate).toFixed(2)}/hr
                            </p>
                        )}
                    </div>
                ) : (
                    <span className="text-xs text-gray-300">—</span>
                ),
        },
        {
            title: "Status",
            dataIndex: "status",
            key: "status",
            sorter: (a, b) => a.status.localeCompare(b.status),
            render: (status: string, record) => (
                <div className="space-y-1">
                    <StatusBadge status={status}/>
                    {record?.spot?.type?.isDiscounted && (
                        <div className="flex items-center gap-1 text-[10px] text-emerald-600">
                            <Tag size={9}/> Discounted
                        </div>
                    )}
                </div>
            ),
        },
    ];

    return (
        <UserSidebar>
            <div className="min-h-screen bg-slate-50 p-4 md:p-8 space-y-5 max-w-6xl mx-auto">

                {/* Header */}
                <div
                    className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                            <Clock size={18} className="text-blue-500"/> Parking History
                        </h1>
                        <p className="text-xs text-gray-400 mt-0.5">Your complete record of past parking sessions.</p>
                    </div>
                    <Link
                        href="/user/park"
                        className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold transition shrink-0"
                    >
                        <Car size={14}/> Park now
                    </Link>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {/* Total sessions — always global */}
                    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4 flex items-center gap-3">
                        <div
                            className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 text-blue-600 bg-blue-50">
                            <Car size={16}/>
                        </div>
                        <div>
                            <p className="text-[10px] text-gray-400 uppercase font-semibold">Total sessions</p>
                            <p className="text-lg font-bold text-gray-900">{sessions.length}</p>
                        </div>
                    </div>

                    {/* Completed — page-scoped */}
                    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4 flex items-center gap-3">
                        <div
                            className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 text-emerald-600 bg-emerald-50">
                            <CheckCircle size={16}/>
                        </div>
                        <div>
                            <p className="text-[10px] text-gray-400 uppercase font-semibold">
                                Completed
                                {pageCompletedCount !== completedCount && (
                                    <span
                                        className="ml-1 normal-case text-gray-300 font-normal">· {completedCount} total</span>
                                )}
                            </p>
                            <div className="flex items-end gap-1.5">
                                <p className="text-lg font-bold text-gray-900">{pageCompletedCount}</p>
                                {pageCompletedCount !== completedCount && (
                                    <p className="text-xs text-gray-400 mb-0.5">this page</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Total spent — page-scoped */}
                    <div
                        className="col-span-2 md:col-span-1 bg-white rounded-2xl border border-gray-200 shadow-sm p-4 flex items-center gap-3">
                        <div
                            className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 text-purple-600 bg-purple-50">
                            <DollarSign size={16}/>
                        </div>
                        <div>
                            <p className="text-[10px] text-gray-400 uppercase font-semibold">
                                Total spent
                                {pageSpent !== totalSpent && (
                                    <span
                                        className="ml-1 normal-case text-gray-300 font-normal">· €{totalSpent.toFixed(2)} overall</span>
                                )}
                            </p>
                            <div className="flex items-end gap-1.5">
                                <p className="text-lg font-bold text-gray-900">€{pageSpent.toFixed(2)}</p>
                                {pageSpent !== totalSpent && (
                                    <p className="text-xs text-gray-400 mb-0.5">this page</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Table */}
                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                        <h2 className="text-sm font-semibold text-gray-700">
                            All Sessions
                            <span className="ml-2 text-xs font-normal text-gray-400">({sessions.length})</span>
                        </h2>
                        <div className="flex items-center gap-1.5 text-xs text-gray-400">
                            <Calendar size={12}/>
                            Sorted by most recent
                        </div>
                    </div>

                    <Table<SessionHistory>
                        columns={columns}
                        dataSource={sessions}
                        rowKey="id"
                        loading={loading}
                        onChange={handleTableChange}
                        pagination={{
                            current: pagination.current,
                            pageSize: pagination.pageSize,
                            total: sessions.length,
                            showSizeChanger: true,
                            pageSizeOptions: ["5", "10", "20"],
                            showTotal: (total, range) =>
                                `${range[0]}–${range[1]} of ${total} sessions`,
                            className: "px-6 py-3",
                        }}
                        className="session-history-table"
                        locale={{
                            emptyText: (
                                <div className="py-16 text-center">
                                    <Car size={36} className="text-gray-200 mx-auto mb-3"/>
                                    <p className="text-sm font-semibold text-gray-700">No sessions yet</p>
                                    <p className="text-xs text-gray-400 mt-1">You haven't parked yet.</p>
                                </div>
                            ),
                        }}
                    />
                </div>
            </div>
        </UserSidebar>
    );
}