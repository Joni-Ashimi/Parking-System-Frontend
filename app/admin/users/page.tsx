"use client";
import {useCallback, useEffect, useState} from "react";
import {Eye, Shield, Trash2, TrendingUp, UserCheck, Users, UserX,} from "lucide-react";
import type {TableColumnsType} from "antd";
import AdminSidebar from "@/components/sidebar/adminSidebar";
import DataTable from "@/app/core/components/DataTable";
import UserService from "@/services/UserService";
import {formatDate, handleRequestErrors, safePercent} from "@/utils/functions";
import AdminActionModal from "@/app/admin/AdminActionModal";
import AdminUserViewModal, {User} from "@/components/admin/UserViewModal";

interface TableParams {
    page?: number;
    pageSize?: number;
    qs?: string;
    sortBy?: string;
    sortOrder?: "ASC" | "DESC"
}

interface GlobalStats {
    total: number;
    verified: number;
    pending: number;
    banned: number;
}

function ActionMenu({
                        user,
                        onInitiateAction,
                        onViewProfile,
                    }: {
    user: User;
    onInitiateAction: (user: User, actionType: "verified" | "banned" | "delete") => void;
    onViewProfile: (user: User) => void;
}) {
    return (
        <div className="flex items-center justify-end gap-2" onClick={(e) => e.stopPropagation()}>
            <button
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-indigo-200 text-indigo-600 hover:bg-indigo-50 hover:border-indigo-400 transition-all"
                onClick={() => onViewProfile(user)}
            >
                <Eye size={13}/>
                View
            </button>

            {user.verificationStatus === "verified" ? (
                <button
                    onClick={() => onInitiateAction(user, "banned")}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-rose-200 text-rose-500 hover:bg-rose-50 hover:border-rose-400 transition-all"
                >
                    <UserX size={13}/>
                    Ban
                </button>
            ) : (
                <button
                    onClick={() => onInitiateAction(user, "verified")}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-emerald-200 text-emerald-600 hover:bg-emerald-50 hover:border-emerald-400 transition-all"
                >
                    <UserCheck size={13}/>
                    Activate
                </button>
            )}
            <button
                type="button"
                onClick={() => onInitiateAction(user, "delete")}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-all"
                title="Soft Delete User"
            >
                <Trash2 size={13}/>
                Delete
            </button>
        </div>
    );
}

export default function AdminUsersPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [total, setTotal] = useState(0);
    const [globalStats, setGlobalStats] = useState<GlobalStats>({total: 0, verified: 0, pending: 0, banned: 0});

    const [targetUser, setTargetUser] = useState<User | null>(null);
    const [activeModal, setActiveModal] = useState<"view" | "action" | null>(null);
    const [pendingAction, setPendingAction] = useState<"verified" | "banned" | "delete" | null>(null);

    const fetchStats = useCallback(async () => {
        try {
            const stats = await UserService.getUsersStats();
            setGlobalStats(stats.data);
        } catch (err) {
            handleRequestErrors(err);
        }
    }, []);

    const getData = useCallback(async (params: TableParams) => {
        const {page = 1, pageSize = 10, qs = "", sortBy, sortOrder} = params;
        try {
            const res = await UserService.getAll({page, pageSize, qs, sortBy, sortOrder} as any);
            const {data, total: responseTotal} = res.data;
            setUsers(data);
            setTotal(responseTotal);
        } catch (err) {
            handleRequestErrors(err);
        }
    }, []);

    useEffect(() => {
        fetchStats();
    }, [fetchStats]);

    const handleOpenActionModal = (user: User, actionType: "verified" | "banned" | "delete") => {
        setTargetUser(user);
        setPendingAction(actionType);
        setActiveModal("action");
    };

    const handleOpenViewModal = (user: User) => {
        setTargetUser(user);
        setActiveModal("view");
    };

    const handleCloseActionModal = () => {
        setTargetUser(null);
        setPendingAction(null);
    };

    const handleCloseModals = () => {
        setActiveModal(null);
        setTargetUser(null);
        setPendingAction(null);
    };

    const handleConfirmStatusChange = async () => {
        if (!targetUser || !pendingAction) return;

        try {
            if (pendingAction === "verified") {
                await UserService.activateUser(targetUser.id);
            } else if (pendingAction === "banned") {
                await UserService.banUser(targetUser.id);
            } else if (pendingAction === "delete") {
                await UserService.deleteUser(targetUser.id);
                setUsers((prev) => prev.filter((u) => u.id !== targetUser.id));
            }
            setUsers((prev) =>
                prev.map((u) => (u.id === targetUser.id ? {...u, verificationStatus: pendingAction} : u))
            );
            await fetchStats();
            handleCloseModals();
        } catch (err) {
            handleRequestErrors(err);
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
                        src={
                            record?.profileImageUrl ||
                            (record?.gender === "MALE"
                                ? "https://res.cloudinary.com/dorwowkmx/image/upload/v1778960498/male-face-avatar-icon-set-flat-design-social-media-profiles_1281173-3806_mcwkod.jpg"
                                : "https://res.cloudinary.com/dorwowkmx/image/upload/v1778960555/avatar-profile-icon-flat-style-female-user-profile-vector-illustration-isolated-background-women-profile-sign-business-concept_157943-38866_li4tqs.jpg")
                        }
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
                <ActionMenu
                    user={record}
                    onInitiateAction={handleOpenActionModal}
                    onViewProfile={handleOpenViewModal}
                />
            ),
        },
    ];

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
                                <p className="text-2xl font-bold text-gray-900 leading-tight">{globalStats.total}</p>
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
                                    <p className="text-2xl font-bold text-emerald-600 leading-tight">{globalStats.verified}</p>
                                    <span className="text-xs text-emerald-500 font-medium mb-0.5">
                                        {globalStats.total > 0 ? safePercent(globalStats.total, globalStats.verified) : 0}%
                                    </span>
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
                                    <p className="text-2xl font-bold text-amber-600 leading-tight">{globalStats.pending}</p>
                                    <span className="text-xs text-amber-700 font-medium mb-0.5">
                                        {safePercent(globalStats.total, globalStats.pending)}%
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div
                            className="bg-white rounded-2xl border border-gray-200 p-5 flex items-center gap-4 shadow-sm">
                            <div className="flex-1">
                                <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Banned
                                    Users</p>
                                <div className="flex items-end gap-2">
                                    <p className="text-2xl font-bold text-rose-600 leading-tight">{globalStats.banned}</p>
                                    <span className="text-xs text-rose-700 font-medium mb-0.5">
                                        {safePercent(globalStats.total, globalStats.banned)}%
                                    </span>
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

            {activeModal === 'action' && targetUser && pendingAction && (
                <AdminActionModal
                    isOpen={activeModal === 'action'}
                    onClose={handleCloseActionModal}
                    onConfirm={handleConfirmStatusChange}
                    variant={pendingAction === "verified" ? "success" : "danger"}
                    title={
                        pendingAction === "delete"
                            ? "Delete Account"
                            : pendingAction === "banned"
                                ? "Ban User Account"
                                : "Activate User Account"
                    }
                    confirmLabel={
                        pendingAction === "delete"
                            ? "Confirm Delete"
                            : pendingAction === "banned"
                                ? "Confirm Ban"
                                : "Activate Account"
                    }
                    description={
                        pendingAction === "delete" ? (
                            <span>
                    Are you absolutely sure you want to delete the account record for{" "}
                                <span
                                    className="font-semibold text-gray-800">{targetUser.name}</span> ({targetUser.email})?
                    Its access rights will be suspended, but references can be recovered by system engineering.
                </span>
                        ) : (
                            <span>
                    Are you sure you want to change the access permissions for{" "}
                                <span
                                    className="font-semibold text-gray-800">{targetUser.name}</span> ({targetUser.email})?
                    This changes platform security credentials instantly.
                </span>
                        )
                    }
                />
            )}

            {activeModal === "view" && targetUser && (
                <AdminUserViewModal
                    isOpen={activeModal === "view"}
                    onClose={handleCloseModals}
                    user={targetUser}
                />
            )}
        </AdminSidebar>
    );
}