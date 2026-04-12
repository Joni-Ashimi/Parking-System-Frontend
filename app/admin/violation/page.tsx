"use client";

import {useState} from "react";
import {
    AlertTriangle,
    Ban,
    CheckCircle,
    Clock,
    DollarSign,
    Filter,
    Search,
    Shield,
    Timer,
    UserX,
    XCircle,
} from "lucide-react";
import AdminSidebar from "@/components/sidebar/adminSidebar";

type ViolationType = "overstay" | "unpaid" | "fraud";
type ViolationStatus = "pending" | "resolved";

interface Violation {
    id: string;
    userId: string;
    userName: string;
    type: ViolationType;
    description: string;
    penaltyAmount: number;
    status: ViolationStatus;
    timestamp: Date;
}

// Mock data
const mockViolations: Violation[] = [
    {
        id: "v1",
        userId: "u1",
        userName: "John Doe",
        type: "overstay",
        description: "Exceeded paid time by 45 minutes",
        penaltyAmount: 15.0,
        status: "pending",
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    },
    {
        id: "v2",
        userId: "u2",
        userName: "Sarah Smith",
        type: "unpaid",
        description: "Session ended without payment",
        penaltyAmount: 25.0,
        status: "pending",
        timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
    },
    {
        id: "v3",
        userId: "u3",
        userName: "Mike Johnson",
        type: "fraud",
        description: "Multiple plate changes detected",
        penaltyAmount: 50.0,
        status: "resolved",
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
    },
    {
        id: "v4",
        userId: "u4",
        userName: "Emma Wilson",
        type: "overstay",
        description: "Exceeded paid time by 2 hours",
        penaltyAmount: 30.0,
        status: "pending",
        timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000),
    },
];

export default function ViolationsPage() {
    const [violations, setViolations] = useState<Violation[]>(mockViolations);
    const [filterType, setFilterType] = useState<ViolationType | "all">("all");
    const [filterStatus, setFilterStatus] = useState<ViolationStatus | "all">("all");
    const [searchQuery, setSearchQuery] = useState("");

    // Configuration state
    const [autoBanThreshold, setAutoBanThreshold] = useState(3);
    const [lateFeePerMinute, setLateFeePerMinute] = useState(0.5);

    // Stats
    const totalViolations = violations.length;
    const pendingViolations = violations.filter((v) => v.status === "pending").length;
    const totalPenalties = violations.reduce((sum, v) => sum + v.penaltyAmount, 0);
    const autoBansTriggered = 2; // Mock count

    // Filtered violations
    const filteredViolations = violations.filter((v) => {
        if (filterType !== "all" && v.type !== filterType) return false;
        if (filterStatus !== "all" && v.status !== filterStatus) return false;
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            return (
                v.userName.toLowerCase().includes(query) ||
                v.description.toLowerCase().includes(query)
            );
        }
        return true;
    });

    const handleResolve = (id: string) => {
        setViolations((prev) =>
            prev.map((v) => (v.id === id ? {...v, status: "resolved"} : v))
        );
    };

    const handleBanUser = (userId: string, userName: string) => {
        if (confirm(`Ban user ${userName} permanently?`)) {
            alert(`User ${userName} has been banned.`);
        }
    };

    const getTypeBadge = (type: ViolationType) => {
        const config = {
            overstay: {
                label: "Overstay",
                icon: Clock,
                color: "bg-amber-100 text-amber-800 border-amber-200",
            },
            unpaid: {
                label: "Unpaid",
                icon: DollarSign,
                color: "bg-red-100 text-red-800 border-red-200",
            },
            fraud: {
                label: "Fraud",
                icon: Shield,
                color: "bg-purple-100 text-purple-800 border-purple-200",
            },
        };
        const {label, icon: Icon, color} = config[type];
        return (
            <span
                className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border ${color}`}>
        <Icon size={12}/>
                {label}
      </span>
        );
    };

    const getStatusBadge = (status: ViolationStatus) => {
        return status === "pending" ? (
            <span
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 border border-yellow-200">
        <AlertTriangle size={12}/>
        Pending
      </span>
        ) : (
            <span
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200">
        <CheckCircle size={12}/>
        Resolved
      </span>
        );
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-slate-50">
            <AdminSidebar/>
            <div className="ml-64">
                <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 px-8 py-4 sticky top-0 z-10">
                    <div className="flex justify-between items-center flex-wrap gap-4">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-800 bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">
                                Violations & Enforcement
                            </h1>
                            <p className="text-sm text-gray-500 mt-1">
                                Track overstays, unpaid sessions, and fraud attempts
                            </p>
                        </div>
                        <div className="flex items-center gap-2 px-3 py-1.5 bg-red-50 rounded-xl border border-red-200">
                            <Shield size={16} className="text-red-600"/>
                            <span className="text-sm font-medium text-red-700">Enforcement Active</span>
                        </div>
                    </div>
                </header>

                <div className="p-8">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
                        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                            <div className="h-1.5 w-full bg-gradient-to-r from-gray-500 to-gray-600"/>
                            <div className="p-5">
                                <p className="text-sm font-medium text-gray-500 mb-1">Total Violations</p>
                                <p className="text-3xl font-bold text-gray-800">{totalViolations}</p>
                            </div>
                        </div>
                        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                            <div className="h-1.5 w-full bg-gradient-to-r from-yellow-500 to-amber-600"/>
                            <div className="p-5">
                                <p className="text-sm font-medium text-gray-500 mb-1">Pending Resolution</p>
                                <p className="text-3xl font-bold text-amber-700">{pendingViolations}</p>
                            </div>
                        </div>
                        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                            <div className="h-1.5 w-full bg-gradient-to-r from-emerald-500 to-green-600"/>
                            <div className="p-5">
                                <p className="text-sm font-medium text-gray-500 mb-1">Total Penalties</p>
                                <p className="text-3xl font-bold text-green-700">${totalPenalties.toFixed(2)}</p>
                            </div>
                        </div>
                        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                            <div className="h-1.5 w-full bg-gradient-to-r from-red-500 to-rose-600"/>
                            <div className="p-5">
                                <p className="text-sm font-medium text-gray-500 mb-1">Auto‑Bans Triggered</p>
                                <p className="text-3xl font-bold text-red-700">{autoBansTriggered}</p>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-2 bg-red-100 rounded-xl">
                                    <Ban size={20} className="text-red-600"/>
                                </div>
                                <h2 className="text-lg font-bold text-gray-800">Auto‑Ban Threshold</h2>
                            </div>
                            <p className="text-sm text-gray-600 mb-4">
                                Automatically ban a user after this many unresolved violations.
                            </p>
                            <div className="flex items-center gap-4">
                                <input
                                    type="number"
                                    min="1"
                                    max="10"
                                    value={autoBanThreshold}
                                    onChange={(e) => setAutoBanThreshold(parseInt(e.target.value) || 1)}
                                    className="w-24 px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 text-center text-lg font-semibold"
                                />
                                <span className="text-gray-600">violations</span>
                            </div>
                            <p className="text-xs text-gray-500 mt-3">
                                Current threshold: {autoBanThreshold} violations → auto‑ban.
                            </p>
                        </div>

                        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-2 bg-amber-100 rounded-xl">
                                    <Timer size={20} className="text-amber-600"/>
                                </div>
                                <h2 className="text-lg font-bold text-gray-800">Late Fee per Minute</h2>
                            </div>
                            <p className="text-sm text-gray-600 mb-4">
                                Charge this amount for every minute beyond the paid session.
                            </p>
                            <div className="flex items-center gap-4">
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                                    <input
                                        type="number"
                                        min="0"
                                        step="0.1"
                                        value={lateFeePerMinute}
                                        onChange={(e) => setLateFeePerMinute(parseFloat(e.target.value) || 0)}
                                        className="w-28 pl-8 pr-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-center text-lg font-semibold"
                                    />
                                </div>
                                <span className="text-gray-600">/ minute</span>
                            </div>
                            <p className="text-xs text-gray-500 mt-3">
                                Example: 30 min overstay = ${(lateFeePerMinute * 30).toFixed(2)}
                            </p>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4 mb-6">
                        <div className="flex flex-wrap items-center gap-4">
                            <div className="flex-1 min-w-[200px] relative">
                                <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"/>
                                <input
                                    type="text"
                                    placeholder="Search by user or description..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                            <div
                                className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-xl border border-gray-200">
                                <Filter size={16} className="text-gray-500"/>
                                <select
                                    value={filterType}
                                    onChange={(e) => setFilterType(e.target.value as any)}
                                    className="px-2 py-1 text-sm bg-transparent border-0 focus:ring-0"
                                >
                                    <option value="all">All Types</option>
                                    <option value="overstay">Overstay</option>
                                    <option value="unpaid">Unpaid</option>
                                    <option value="fraud">Fraud</option>
                                </select>
                            </div>
                            <div
                                className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-xl border border-gray-200">
                                <select
                                    value={filterStatus}
                                    onChange={(e) => setFilterStatus(e.target.value as any)}
                                    className="px-2 py-1 text-sm bg-transparent border-0 focus:ring-0"
                                >
                                    <option value="all">All Status</option>
                                    <option value="pending">Pending</option>
                                    <option value="resolved">Resolved</option>
                                </select>
                            </div>
                            {(filterType !== "all" || filterStatus !== "all" || searchQuery) && (
                                <button
                                    onClick={() => {
                                        setFilterType("all");
                                        setFilterStatus("all");
                                        setSearchQuery("");
                                    }}
                                    className="text-sm font-medium text-blue-600 hover:text-blue-800 flex items-center gap-1 bg-blue-50 px-3 py-1.5 rounded-xl border border-blue-200"
                                >
                                    <XCircle size={14}/> Clear
                                </button>
                            )}
                        </div>
                    </div>

                    {filteredViolations.length === 0 ? (
                        <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center shadow-sm">
                            <Shield size={48} className="mx-auto text-gray-300 mb-4"/>
                            <h3 className="text-lg font-semibold text-gray-800 mb-1">No violations found</h3>
                            <p className="text-gray-500">All clear! No matching violations.</p>
                        </div>
                    ) : (
                        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                            <div className="hidden lg:block overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-gray-50 border-b border-gray-200">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            User
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Type
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Description
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Penalty
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Time
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Status
                                        </th>
                                        <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Actions
                                        </th>
                                    </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                    {filteredViolations.map((violation) => (
                                        <tr key={violation.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="font-medium text-gray-900">{violation.userName}</div>
                                                <div className="text-xs text-gray-500">ID: {violation.userId}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {getTypeBadge(violation.type)}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-sm text-gray-700 max-w-xs">
                                                    {violation.description}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                          <span className="font-semibold text-gray-900">
                            ${violation.penaltyAmount.toFixed(2)}
                          </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {violation.timestamp.toLocaleString()}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {getStatusBadge(violation.status)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    {violation.status === "pending" && (
                                                        <button
                                                            onClick={() => handleResolve(violation.id)}
                                                            className="px-3 py-1.5 text-xs font-medium bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors flex items-center gap-1"
                                                        >
                                                            <CheckCircle size={14}/>
                                                            Resolve
                                                        </button>
                                                    )}
                                                    <button
                                                        onClick={() => handleBanUser(violation.userId, violation.userName)}
                                                        className="px-3 py-1.5 text-xs font-medium bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors flex items-center gap-1"
                                                    >
                                                        <UserX size={14}/>
                                                        Ban User
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </div>

                            <div className="lg:hidden divide-y divide-gray-200">
                                {filteredViolations.map((violation) => (
                                    <div key={violation.id} className="p-4 space-y-3">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <p className="font-medium text-gray-900">{violation.userName}</p>
                                                <p className="text-xs text-gray-500">{violation.userId}</p>
                                            </div>
                                            {getStatusBadge(violation.status)}
                                        </div>
                                        <div className="flex flex-wrap gap-2">
                                            {getTypeBadge(violation.type)}
                                            <span className="text-sm font-semibold text-gray-900">
                        ${violation.penaltyAmount.toFixed(2)}
                      </span>
                                        </div>
                                        <p className="text-sm text-gray-700">{violation.description}</p>
                                        <p className="text-xs text-gray-500">{violation.timestamp.toLocaleString()}</p>
                                        <div className="flex gap-2 pt-2">
                                            {violation.status === "pending" && (
                                                <button
                                                    onClick={() => handleResolve(violation.id)}
                                                    className="flex-1 px-3 py-2 text-sm font-medium bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors flex items-center justify-center gap-1"
                                                >
                                                    <CheckCircle size={14}/>
                                                    Resolve
                                                </button>
                                            )}
                                            <button
                                                onClick={() => handleBanUser(violation.userId, violation.userName)}
                                                className="flex-1 px-3 py-2 text-sm font-medium bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors flex items-center justify-center gap-1"
                                            >
                                                <UserX size={14}/>
                                                Ban User
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}