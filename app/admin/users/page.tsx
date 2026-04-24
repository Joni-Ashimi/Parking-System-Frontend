"use client";

import {useCallback, useState} from "react";
import {AlertOctagon, Eye, Shield, TrendingUp, UserCheck, Users, UserX,} from "lucide-react";
import type {TableColumnsType} from "antd";
import AdminSidebar from "@/components/sidebar/adminSidebar";
import DataTable from "@/app/core/components/DataTable";

interface User {
    id: number;
    name: string;
    email: string;
    phone: string;
    avatar: string;
    lastLogin: string;
    status: "active" | "banned";
}

interface TableParams {
    page: number;
    pageSize: number;
    qs: string;
}

const MOCK_USERS: User[] = [
    {
        id: 1,
        name: "Alex Morgan",
        email: "alex.m@example.com",
        phone: "+1 (555) 123-4567",
        avatar: "https://i.pravatar.cc/150?img=1",
        lastLogin: "2026-04-11 09:23 AM",
        status: "active"
    },
    {
        id: 2,
        name: "Jamie Lee",
        email: "jamie.lee@example.com",
        phone: "+1 (555) 987-6543",
        avatar: "https://i.pravatar.cc/150?img=2",
        lastLogin: "2026-04-10 03:47 PM",
        status: "active"
    },
    {
        id: 3,
        name: "Taylor Smith",
        email: "taylor.s@example.com",
        phone: "+1 (555) 456-7890",
        avatar: "https://i.pravatar.cc/150?img=3",
        lastLogin: "2026-04-09 11:12 AM",
        status: "banned"
    },
    {
        id: 4,
        name: "Jordan Rivera",
        email: "jordan.r@example.com",
        phone: "+1 (555) 321-0987",
        avatar: "https://i.pravatar.cc/150?img=4",
        lastLogin: "2026-04-11 08:05 AM",
        status: "active"
    },
    {
        id: 5,
        name: "Casey Kim",
        email: "casey.k@example.com",
        phone: "+1 (555) 654-3210",
        avatar: "https://i.pravatar.cc/150?img=5",
        lastLogin: "2026-04-08 02:30 PM",
        status: "active"
    },
    {
        id: 6,
        name: "Riley Chen",
        email: "riley.c@example.com",
        phone: "+1 (555) 789-0123",
        avatar: "https://i.pravatar.cc/150?img=6",
        lastLogin: "2026-04-07 10:18 AM",
        status: "banned"
    },
    {
        id: 7,
        name: "Morgan Webb",
        email: "morgan.w@example.com",
        phone: "+1 (555) 234-5678",
        avatar: "https://i.pravatar.cc/150?img=7",
        lastLogin: "2026-04-11 07:52 AM",
        status: "active"
    },
];

function ActionMenu({
                        user,
                        onStatusChange,
                    }: {
    user: User;
    onStatusChange: (id: number, status: "active" | "banned") => void;
}) {
    return (
        <div className="flex items-center justify-end gap-2" onClick={(e) => e.stopPropagation()}>

            <button
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-indigo-200 text-indigo-600 hover:bg-indigo-50 hover:border-indigo-400 transition-all">
                <Eye size={13}/>
                View
            </button>

            {user.status === "active" ? (
                <button
                    onClick={() => {
                        if (confirm("Ban this user?")) onStatusChange(user.id, "banned");
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-rose-200 text-rose-500 hover:bg-rose-50 hover:border-rose-400 transition-all"
                >
                    <UserX size={13}/>
                    Ban
                </button>
            ) : (
                <button
                    onClick={() => {
                        if (confirm("Activate this user?")) onStatusChange(user.id, "active");
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-emerald-200 text-emerald-600 hover:bg-emerald-50 hover:border-emerald-400 transition-all"
                >
                    <UserCheck size={13}/>
                    Activate
                </button>
            )}
        </div>
    );
}

export default function AdminUsersPage() {
    const [users, setUsers] = useState<User[]>(MOCK_USERS);
    const [total, setTotal] = useState(MOCK_USERS.length);

    const handleStatusChange = (userId: number, newStatus: "active" | "banned") => {
        setUsers((prev) =>
            prev.map((u) => (u.id === userId ? {...u, status: newStatus} : u))
        );
    };

    const getData = useCallback((params: TableParams) => {
        const {page = 1, pageSize = 10, qs = ""} = params;
        const filtered = MOCK_USERS.filter(
            (u) =>
                u.name.toLowerCase().includes(qs.toLowerCase()) ||
                u.email.toLowerCase().includes(qs.toLowerCase())
        );
        setTotal(filtered.length);
        setUsers(filtered.slice((page - 1) * pageSize, page * pageSize));
    }, []);

    const columns: TableColumnsType<User> = [
        {
            title: "User",
            dataIndex: "name",
            key: "name",
            sorter: true,
            render: (_, record) => (
                <div className="flex items-center gap-3">
                    <img
                        src={record.avatar}
                        alt={record.name}
                        className="w-8 h-8 rounded-full object-cover ring-2 ring-gray-100"
                    />
                    <div>
                        <p className="text-sm font-semibold text-gray-800">{record.name}</p>
                        <p className="text-xs text-gray-400">{record.email}</p>
                    </div>
                </div>
            ),
        },
        {
            title: "Phone",
            dataIndex: "phone",
            key: "phone",
        },
        {
            title: "Last Login",
            dataIndex: "lastLogin",
            key: "lastLogin",
            sorter: true,
        },
        {
            title: "Status",
            dataIndex: "status",
            key: "status",
            filters: [
                {text: "Active", value: "active"},
                {text: "Banned", value: "banned"},
            ],
            onFilter: (value, record) => record.status === value,
            render: (status: User["status"]) =>
                status === "active" ? (
                    <span
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"/>
                        Active
                    </span>
                ) : (
                    <span
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-600 border border-rose-200">
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-500"/>
                        Banned
                    </span>
                ),
        },
        {
            title: "Actions",
            key: "actions",
            align: "right",
            render: (_, record) => (
                <ActionMenu user={record} onStatusChange={handleStatusChange}/>
            ),
        },
    ];

    const activeCount = MOCK_USERS.filter((u) => u.status === "active").length;
    const bannedCount = MOCK_USERS.filter((u) => u.status === "banned").length;
    const activeRate = Math.round((activeCount / MOCK_USERS.length) * 100);

    return (
        <AdminSidebar>
            <div className="min-h-screen bg-slate-50">
                <header className="bg-white border-b border-gray-200 px-8 py-4">
                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="text-2xl font-semibold text-gray-900">User Management</h1>
                            <p className="text-sm text-gray-400 mt-0.5">Monitor and control user access</p>
                        </div>
                        <div
                            className="flex items-center gap-2 px-3 py-1.5 bg-indigo-50 border border-indigo-100 rounded-lg">
                            <Shield size={14} className="text-indigo-500"/>
                            <span className="text-sm text-indigo-600 font-medium">Admin Access</span>
                        </div>
                    </div>
                </header>

                <div className="p-8 space-y-6">
                    <div
                        className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-600 via-indigo-500 to-violet-600 p-7 text-white">
                        <div className="absolute -top-8 -right-8 w-40 h-40 bg-white/10 rounded-full"/>
                        <div className="absolute top-4 right-24 w-20 h-20 bg-white/10 rounded-full"/>
                        <div className="absolute -bottom-6 right-12 w-28 h-28 bg-violet-700/40 rounded-full"/>
                        <div className="relative z-10">
                            <p className="text-indigo-200 text-sm font-medium uppercase tracking-widest mb-1">Dashboard
                                Overview</p>
                            <h2 className="text-3xl font-bold mb-1">Manage your users</h2>
                            <p className="text-indigo-200 text-sm">Monitor activity and control access to the parking
                                system.</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                        <div
                            className="bg-white rounded-2xl border border-gray-200 p-5 flex items-center gap-4 shadow-sm">
                            <div
                                className="w-11 h-11 rounded-xl bg-indigo-100 flex items-center justify-center flex-shrink-0">
                                <Users size={20} className="text-indigo-600"/>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Total Users</p>
                                <p className="text-2xl font-bold text-gray-900 leading-tight">{MOCK_USERS.length}</p>
                            </div>
                        </div>
                        <div
                            className="bg-white rounded-2xl border border-gray-200 p-5 flex items-center gap-4 shadow-sm">
                            <div
                                className="w-11 h-11 rounded-xl bg-emerald-100 flex items-center justify-center flex-shrink-0">
                                <TrendingUp size={20} className="text-emerald-600"/>
                            </div>
                            <div className="flex-1">
                                <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Active
                                    Users</p>
                                <div className="flex items-end gap-2">
                                    <p className="text-2xl font-bold text-emerald-600 leading-tight">{activeCount}</p>
                                    <span className="text-xs text-emerald-500 font-medium mb-0.5">{activeRate}%</span>
                                </div>
                            </div>
                        </div>
                        <div
                            className="bg-white rounded-2xl border border-gray-200 p-5 flex items-center gap-4 shadow-sm">
                            <div
                                className="w-11 h-11 rounded-xl bg-rose-100 flex items-center justify-center flex-shrink-0">
                                <AlertOctagon size={20} className="text-rose-500"/>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Banned
                                    Users</p>
                                <p className="text-2xl font-bold text-rose-500 leading-tight">{bannedCount}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                        <DataTable<User>
                            title="All Accounts"
                            columns={columns}
                            data={users}
                            getData={getData}
                            total={total}
                            defaultPageSize={5}
                            pageSizeOptions={[5, 10, 20]}
                            allowSearch={false}
                            allowFilter={false}
                        />
                    </div>
                </div>
            </div>
        </AdminSidebar>
    );
}