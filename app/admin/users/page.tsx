"use client";
import {useCallback, useState} from "react";
import {Eye, Shield, TrendingUp, UserCheck, Users, UserX,} from "lucide-react";
import type {TableColumnsType} from "antd";
import AdminSidebar from "@/components/sidebar/adminSidebar";
import DataTable from "@/app/core/components/DataTable";
import API from "@/utils/API/API";
import UserService from "@/services/UserService";
import {formatDate, safePercent} from "@/utils/functions";

interface User {
    id: string;
    name: string;
    email: string;
    phone: string;
    profileImageUrl: string;
    lastLoginAt: string;
    verificationStatus: string;
}

interface TableParams {
    page: number;
    pageSize: number;
    qs: string;
}

function ActionMenu({
                        user,
                        onStatusChange,
                    }: {
    user: User;
    onStatusChange: (id: string, status: "verified" | "banned" | 'pending') => void;
}) {
    return (
        <div className="flex items-center justify-end gap-2" onClick={(e) => e.stopPropagation()}>

            <button
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-indigo-200 text-indigo-600 hover:bg-indigo-50 hover:border-indigo-400 transition-all">
                <Eye size={13}/>
                View
            </button>

            {user.verificationStatus === "verified" ? (
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
                        if (confirm("Activate this user?")) onStatusChange(user.id, "verified");
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
    const [users, setUsers] = useState<User[]>([]);
    const [total, setTotal] = useState(0);

    const getData = useCallback(async (params: TableParams) => {
        const {page = 1, pageSize = 10, qs = ""} = params;

        try {
            const res = await API.get("/users", {
                params: {
                    page,
                    pageSize,
                    qs,
                },
            });

            const {data, total} = res.data;
            setUsers(data);
            setTotal(total);
        } catch (err) {
            console.error("Failed to fetch users:", err);
        }
    }, []);

    const handleStatusChange = async (
        userId: string,
        newStatus: "verified" | "banned" | 'pending'
    ) => {
        try {
            if (newStatus === "verified") {
                await UserService.activateUser(userId);
            } else {
                await UserService.banUser(userId);
            }
            setUsers((prev) =>
                prev.map((u) =>
                    u.id === userId ? {...u, verificationStatus: newStatus} : u
                )
            );
        } catch (err) {
            console.error(err);
        }
    };

    const columns: TableColumnsType<User> = [
        {
            title: "User",
            dataIndex: "name",
            key: "name",
            sorter: true,
            render: (_, record) => (
                <div className="flex items-center gap-3">
                    <img
                        src={record?.profileImageUrl}
                        alt={record.name}
                        className="w-12 h-12 rounded-full object-cover ring-2 ring-gray-100"
                    />
                    <div className="flex flex-col leading-tight">
                        <p className="text-sm font-semibold text-gray-900 tracking-tight">
                            {record.name}
                        </p>
                        <p className="text-xs text-gray-500 font-medium">
                            {record.email}
                        </p>
                    </div>
                </div>
            ),
        },
        {
            title: "Phone",
            dataIndex: "phoneNumber",
            key: "phoneNumber",
            sorter: true,
        },
        {
            title: "Last Login",
            dataIndex: "lastLoginAt",
            key: "lastLoginAt",
            sorter: true,
            render: (value: string) => formatDate(value),
        },
        {
            title: "Status",
            dataIndex: "verificationStatus",
            key: "verificationStatus",
            filters: [
                {text: "Verified", value: "verified"},
                {text: "Banned", value: "banned"},
                {text: "Pending", value: "pending"},
            ],
            onFilter: (value, record) => record.verificationStatus === value,
            render: (status: User["verificationStatus"]) => {
                switch (status) {
                    case "verified":
                        return (
                            <span
                                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"/>
                    Verified
                </span>
                        );

                    case "pending":
                        return (
                            <span
                                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"/>
                    Pending
                </span>
                        );

                    case "banned":
                    default:
                        return (
                            <span
                                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-600 border border-rose-200">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500"/>
                    Banned
                </span>
                        );
                }
            },
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

    const activeCount = users.filter(u => u?.verificationStatus === "verified").length;
    const bannedCount = users.filter(u => u?.verificationStatus === "banned").length;
    const pendingCount = users.filter(u => u?.verificationStatus === "pending").length;

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
                    <div className="grid grid-cols-4 gap-4">
                        <div
                            className="bg-white rounded-2xl border border-gray-200 p-5 flex items-center gap-4 shadow-sm">
                            <div
                                className="w-11 h-11 rounded-xl bg-indigo-100 flex items-center justify-center flex-shrink-0">
                                <Users size={20} className="text-indigo-600"/>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Total Users</p>
                                <p className="text-2xl font-bold text-gray-900 leading-tight">{users?.length}</p>
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
                                    <span
                                        className="text-xs text-emerald-500 font-medium mb-0.5">{safePercent(users, activeCount)}%</span>
                                </div>
                            </div>
                        </div>
                        <div
                            className="bg-white rounded-2xl border border-gray-200 p-5 flex items-center gap-4 shadow-sm">
                            <div
                                className="w-11 h-11 rounded-xl bg-amber-100 flex items-center justify-center flex-shrink-0">
                                <UserCheck size={20} className="text-amber-600"/>
                            </div>
                            <div className="flex-1">
                                <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Pending
                                    Users</p>
                                <div className="flex items-end gap-2">
                                    <p className="text-2xl font-bold text-amber-600 leading-tight">{pendingCount}</p>
                                    <span
                                        className="text-xs text-amber-700 font-medium mb-0.5">{safePercent(users, pendingCount)}%</span>
                                </div>
                            </div>
                        </div>

                        <div
                            className="bg-white rounded-2xl border border-gray-200 p-5 flex items-center gap-4 shadow-sm">
                            <div className="flex-1">
                                <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Banned
                                    Users</p>
                                <div className="flex items-end gap-2">
                                    <p className="text-2xl font-bold text-rose-600 leading-tight">{bannedCount}</p>
                                    <span
                                        className="text-xs text-rose-700 font-medium mb-0.5">{safePercent(users, bannedCount)}%</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                        <DataTable<User>
                            title="All Accounts"
                            columns={columns}
                            data={users}
                            getData={getData}
                            allowSearch={true}
                            total={total}
                            defaultPageSize={5}
                            pageSizeOptions={[5, 10, 20]}
                            allowFilter={true}
                        />
                    </div>
                </div>
            </div>
        </AdminSidebar>
    );
}