"use client";

import {useEffect, useState} from "react";
import {
    AlertTriangle,
    Car,
    CheckCircle,
    Clock,
    Filter,
    MoreVertical,
    Search,
    Timer,
    Users,
    UserX,
    XCircle,
} from "lucide-react";
import AdminSidebar from "@/components/sidebar/adminSidebar";

interface ParkingSession {
    id: string;
    userId: string;
    userName: string;
    vehiclePlate: string;
    spotNumber: string;
    startTime: Date;
    ratePerHour: number;
    status: "active" | "overdue" | "unpaid";
    duration: number; // in hours (calculated)
    currentCost: number;
}

const mockSessions: ParkingSession[] = [
    {
        id: "s1",
        userId: "u1",
        userName: "John Doe",
        vehiclePlate: "ABC-1234",
        spotNumber: "A01",
        startTime: new Date(Date.now() - 35 * 60 * 1000), // 35 mins ago
        ratePerHour: 5,
        status: "active",
        duration: 0,
        currentCost: 0,
    },
    {
        id: "s2",
        userId: "u2",
        userName: "Sarah Smith",
        vehiclePlate: "XYZ-5678",
        spotNumber: "B02",
        startTime: new Date(Date.now() - 3 * 60 * 60 * 1000), // 3 hours ago
        ratePerHour: 8,
        status: "active",
        duration: 0,
        currentCost: 0,
    },
    {
        id: "s3",
        userId: "u3",
        userName: "Mike Johnson",
        vehiclePlate: "DEF-9012",
        spotNumber: "C01",
        startTime: new Date(Date.now() - 6 * 60 * 60 * 1000 + 15 * 60 * 1000), // 5h45m ago
        ratePerHour: 12,
        status: "overdue",
        duration: 0,
        currentCost: 0,
    },
    {
        id: "s4",
        userId: "u4",
        userName: "Emma Wilson",
        vehiclePlate: "GHI-3456",
        spotNumber: "A03",
        startTime: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
        ratePerHour: 5,
        status: "unpaid",
        duration: 0,
        currentCost: 0,
    },
];

export default function LiveSessionsPage() {
    const [sessions, setSessions] = useState<ParkingSession[]>(mockSessions);
    const [filterStatus, setFilterStatus] = useState<string>("all");
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedSessions, setSelectedSessions] = useState<string[]>([]);
    const [showActionsMenu, setShowActionsMenu] = useState<string | null>(null);

    useEffect(() => {
        const updateCalculatedFields = () => {
            setSessions((prev) =>
                prev.map((session) => {
                    const now = new Date();
                    const diffMs = now.getTime() - session.startTime.getTime();
                    const durationHours = diffMs / (1000 * 60 * 60);
                    const cost = durationHours * session.ratePerHour;
                    return {
                        ...session,
                        duration: durationHours,
                        currentCost: cost,
                    };
                })
            );
        };

        updateCalculatedFields();
        const interval = setInterval(updateCalculatedFields, 1000);
        return () => clearInterval(interval);
    }, []);

    const filteredSessions = sessions.filter((session) => {
        const matchesStatus = filterStatus === "all" || session.status === filterStatus;
        const matchesSearch =
            searchQuery === "" ||
            session.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            session.vehiclePlate.toLowerCase().includes(searchQuery.toLowerCase()) ||
            session.spotNumber.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesStatus && matchesSearch;
    });

    const totalActive = sessions.filter((s) => s.status === "active").length;
    const totalOverdue = sessions.filter((s) => s.status === "overdue").length;
    const totalUnpaid = sessions.filter((s) => s.status === "unpaid").length;
    const totalRevenue = sessions.reduce((sum, s) => sum + s.currentCost, 0);

    const formatDuration = (hours: number) => {
        const totalMinutes = Math.floor(hours * 60);
        const h = Math.floor(totalMinutes / 60);
        const m = totalMinutes % 60;
        return `${h}h ${m}m`;
    };

    const handleForceEnd = (sessionId: string) => {
        if (confirm("Force end this session? The user will be charged for current duration.")) {
            setSessions((prev) => prev.filter((s) => s.id !== sessionId));
            // In real app: call API, then update state
        }
        setShowActionsMenu(null);
    };

    const handleMarkAsPaid = (sessionId: string) => {
        setSessions((prev) =>
            prev.map((s) => (s.id === sessionId ? {...s, status: "active"} : s))
        );
        setShowActionsMenu(null);
    };

    const handleApplyPenalty = (sessionId: string) => {
        const penaltyAmount = 10; // could be configurable
        alert(`Penalty of $${penaltyAmount} applied to session ${sessionId}`);
        setShowActionsMenu(null);
    };

    const handleBanUser = (userId: string, userName: string) => {
        if (confirm(`Ban user ${userName}? They will not be able to park again.`)) {
            alert(`User ${userName} has been banned.`);
            setSessions((prev) => prev.filter((s) => s.userId !== userId));
        }
        setShowActionsMenu(null);
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "active":
                return (
                    <span
                        className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200">
            <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"/>
            Active
          </span>
                );
            case "overdue":
                return (
                    <span
                        className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800 border border-orange-200">
            <AlertTriangle size={12}/>
            Overdue
          </span>
                );
            case "unpaid":
                return (
                    <span
                        className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 border border-red-200">
            <XCircle size={12}/>
            Unpaid
          </span>
                );
            default:
                return null;
        }
    };

    return (
        <AdminSidebar>
            <div className="min-h-screen bg-gray-50">
                <header className="bg-white border-b border-gray-200 px-8 py-4">
                    <div className="flex justify-between items-center flex-wrap gap-4">
                        <div>
                            <h1 className="text-2xl font-semibold text-gray-800">Live Parking Sessions</h1>
                            <p className="text-sm text-gray-500 mt-1">
                                Monitor active parking, manage payments, and enforce policies
                            </p>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 rounded-lg">
                                <Timer size={16} className="text-blue-600"/>
                                <span className="text-sm text-blue-700 font-medium">Live Updates</span>
                            </div>
                        </div>
                    </div>
                </header>

                <div className="p-8">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                        <div className="bg-white rounded-xl border border-gray-200 p-5">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-blue-50 rounded-lg">
                                    <Car size={20} className="text-blue-600"/>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Active Sessions</p>
                                    <p className="text-2xl font-semibold text-gray-800">{totalActive}</p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white rounded-xl border border-gray-200 p-5">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-orange-50 rounded-lg">
                                    <AlertTriangle size={20} className="text-orange-600"/>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Overdue</p>
                                    <p className="text-2xl font-semibold text-gray-800">{totalOverdue}</p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white rounded-xl border border-gray-200 p-5">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-red-50 rounded-lg">
                                    <XCircle size={20} className="text-red-600"/>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Unpaid</p>
                                    <p className="text-2xl font-semibold text-gray-800">{totalUnpaid}</p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white rounded-xl border border-gray-200 p-5">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-purple-50 rounded-lg">
                                    <DollarSign size={20} className="text-purple-600"/>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Current Revenue</p>
                                    <p className="text-2xl font-semibold text-gray-800">
                                        ${totalRevenue.toFixed(2)}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Filters and Search */}
                    <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
                        <div className="flex flex-wrap items-center gap-4">
                            <div className="flex-1 min-w-[200px] relative">
                                <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"/>
                                <input
                                    type="text"
                                    placeholder="Search by name, plate, or spot..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                            <div className="flex items-center gap-2">
                                <Filter size={16} className="text-gray-500"/>
                                <select
                                    value={filterStatus}
                                    onChange={(e) => setFilterStatus(e.target.value)}
                                    className="px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white min-w-[130px]"
                                >
                                    <option value="all">All Status</option>
                                    <option value="active">Active</option>
                                    <option value="overdue">Overdue</option>
                                    <option value="unpaid">Unpaid</option>
                                </select>
                            </div>
                            {(filterStatus !== "all" || searchQuery) && (
                                <button
                                    onClick={() => {
                                        setFilterStatus("all");
                                        setSearchQuery("");
                                    }}
                                    className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1"
                                >
                                    <XCircle size={14}/> Clear
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Sessions Table / Card List */}
                    {filteredSessions.length === 0 ? (
                        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
                            <Car size={48} className="mx-auto text-gray-300 mb-4"/>
                            <h3 className="text-lg font-medium text-gray-800 mb-1">No active sessions</h3>
                            <p className="text-gray-500">All parking spots are currently free.</p>
                        </div>
                    ) : (
                        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                            {/* Desktop Table */}
                            <div className="hidden lg:block overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-gray-50 border-b border-gray-200">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            User / Vehicle
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Spot
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Started
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Duration
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Cost
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
                                    {filteredSessions.map((session) => (
                                        <tr key={session.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div
                                                        className="flex-shrink-0 h-10 w-10 bg-gray-100 rounded-full flex items-center justify-center">
                                                        <Users size={18} className="text-gray-600"/>
                                                    </div>
                                                    <div className="ml-4">
                                                        <div className="text-sm font-medium text-gray-900">
                                                            {session.userName}
                                                        </div>
                                                        <div
                                                            className="text-sm text-gray-500">{session.vehiclePlate}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                          <span
                              className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {session.spotNumber}
                          </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {session.startTime.toLocaleTimeString([], {
                                                    hour: "2-digit",
                                                    minute: "2-digit",
                                                })}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center gap-1 text-sm">
                                                    <Clock size={14} className="text-gray-400"/>
                                                    <span
                                                        className="font-mono">{formatDuration(session.duration)}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                ${session.currentCost.toFixed(2)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {getStatusBadge(session.status)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <div className="relative">
                                                    <button
                                                        onClick={() =>
                                                            setShowActionsMenu(
                                                                showActionsMenu === session.id ? null : session.id
                                                            )
                                                        }
                                                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                                    >
                                                        <MoreVertical size={18} className="text-gray-600"/>
                                                    </button>
                                                    {showActionsMenu === session.id && (
                                                        <div
                                                            className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10">
                                                            <button
                                                                onClick={() => handleForceEnd(session.id)}
                                                                className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                                                            >
                                                                <XCircle size={16} className="text-orange-600"/>
                                                                Force End Session
                                                            </button>
                                                            {(session.status === "overdue" || session.status === "unpaid") && (
                                                                <button
                                                                    onClick={() => handleMarkAsPaid(session.id)}
                                                                    className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                                                                >
                                                                    <CheckCircle size={16} className="text-green-600"/>
                                                                    Mark as Paid
                                                                </button>
                                                            )}
                                                            <button
                                                                onClick={() => handleApplyPenalty(session.id)}
                                                                className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                                                            >
                                                                <DollarSign size={16} className="text-yellow-600"/>
                                                                Apply Penalty
                                                            </button>
                                                            <div className="border-t border-gray-100 my-1"></div>
                                                            <button
                                                                onClick={() => handleBanUser(session.userId, session.userName)}
                                                                className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                                                            >
                                                                <UserX size={16}/>
                                                                Ban User
                                                            </button>
                                                        </div>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Mobile Card List */}
                            <div className="lg:hidden divide-y divide-gray-200">
                                {filteredSessions.map((session) => (
                                    <div key={session.id} className="p-4 space-y-3">
                                        <div className="flex justify-between items-start">
                                            <div className="flex items-center gap-3">
                                                <div
                                                    className="h-10 w-10 bg-gray-100 rounded-full flex items-center justify-center">
                                                    <Users size={18} className="text-gray-600"/>
                                                </div>
                                                <div>
                                                    <p className="font-medium text-gray-900">{session.userName}</p>
                                                    <p className="text-sm text-gray-500">{session.vehiclePlate}</p>
                                                </div>
                                            </div>
                                            {getStatusBadge(session.status)}
                                        </div>
                                        <div className="grid grid-cols-2 gap-2 text-sm">
                                            <div>
                                                <span className="text-gray-500">Spot:</span>{" "}
                                                <span className="font-medium">{session.spotNumber}</span>
                                            </div>
                                            <div>
                                                <span className="text-gray-500">Started:</span>{" "}
                                                <span>
                          {session.startTime.toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                          })}
                        </span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <Clock size={14} className="text-gray-400"/>
                                                <span className="font-mono">{formatDuration(session.duration)}</span>
                                            </div>
                                            <div>
                                                <span className="text-gray-500">Cost:</span>{" "}
                                                <span className="font-medium">${session.currentCost.toFixed(2)}</span>
                                            </div>
                                        </div>
                                        <div className="flex justify-end gap-2 pt-2 border-t border-gray-100">
                                            <button
                                                onClick={() => handleForceEnd(session.id)}
                                                className="px-3 py-1.5 text-xs bg-gray-100 hover:bg-gray-200 rounded-lg flex items-center gap-1"
                                            >
                                                <XCircle size={14}/> End
                                            </button>
                                            {(session.status === "overdue" || session.status === "unpaid") && (
                                                <button
                                                    onClick={() => handleMarkAsPaid(session.id)}
                                                    className="px-3 py-1.5 text-xs bg-green-50 text-green-700 hover:bg-green-100 rounded-lg flex items-center gap-1"
                                                >
                                                    <CheckCircle size={14}/> Paid
                                                </button>
                                            )}
                                            <button
                                                onClick={() => handleApplyPenalty(session.id)}
                                                className="px-3 py-1.5 text-xs bg-yellow-50 text-yellow-700 hover:bg-yellow-100 rounded-lg flex items-center gap-1"
                                            >
                                                <DollarSign size={14}/> Penalty
                                            </button>
                                            <button
                                                onClick={() => handleBanUser(session.userId, session.userName)}
                                                className="px-3 py-1.5 text-xs bg-red-50 text-red-700 hover:bg-red-100 rounded-lg flex items-center gap-1"
                                            >
                                                <UserX size={14}/> Ban
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AdminSidebar>
    );
}

function DollarSign({size, className}: any) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
        >
            <line x1="12" y1="1" x2="12" y2="23"/>
            <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
        </svg>
    );
}