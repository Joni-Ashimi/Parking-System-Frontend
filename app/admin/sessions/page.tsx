"use client";

import {useCallback, useEffect, useMemo, useState} from "react";
import {Car, DollarSign, Timer} from "lucide-react";
import type {TableColumnsType} from "antd";

import AdminSidebar from "@/components/sidebar/adminSidebar";
import DataTable from "@/app/core/components/DataTable";
import ParkingSessionService from "@/services/ParkingSessionService";
import {formatDate, handleRequestErrors} from "@/utils/functions";

interface ParkingSession {
    id: string;
    userName: string;
    vehiclePlate: string;
    spotNumber: string;
    startTime: string;
    currentCost: number;
    vehicle: any;
    user: any;
    email: any;
    name: any;
    gender: string;
    profileImageUrl: string;
    status: "active";
}

interface TableParams {
    page?: number;
    pageSize?: number;
    qs?: string;
    sortBy?: string;
    sortOrder?: "ASC" | "DESC";
}

export default function LiveSessionsPage() {
    const [sessions, setSessions] = useState<ParkingSession[]>([]);
    const [total, setTotal] = useState(0);

    const getData = useCallback(async (params: TableParams) => {
        const {
            page = 1,
            pageSize = 10,
            qs = "",
            sortBy,
            sortOrder,
        } = params;

        try {
            const res = await ParkingSessionService.getAdminActiveSessions({
                page,
                pageSize,
                qs,
                sortBy,
                sortOrder,
            });

            const {data, total: responseTotal} = res.data;
            setSessions(data);
            setTotal(responseTotal);
        } catch (err) {
            handleRequestErrors(err);
        }
    }, []);

    useEffect(() => {
        getData({});
    }, [getData]);

    const totalActive = useMemo(
        () => sessions.length,
        [sessions]
    );

    const totalRevenue = useMemo(
        () =>
            sessions.reduce(
                (sum, session) => sum + (session.currentCost ?? 0),
                0
            ),
        [sessions]
    );

    const columns: TableColumnsType<ParkingSession> = [
        {
            title: "User",
            dataIndex: "user",
            key: "user",
            sorter: true,
            render: (_, record) => (
                <div className="flex items-center gap-3">
                    <img
                        src={
                            record.user.profileImageUrl ||
                            (record.user.gender === "MALE"
                                ? "https://res.cloudinary.com/dorwowkmx/image/upload/v1778960498/male-face-avatar-icon-set-flat-design-social-media-profiles_1281173-3806_mcwkod.jpg"
                                : "https://res.cloudinary.com/dorwowkmx/image/upload/v1778960555/avatar-profile-icon-flat-style-female-user-profile-vector-illustration-isolated-background-women-profile-sign-business-concept_157943-38866_li4tqs.jpg")
                        }
                        alt={record.user?.name}
                        className="w-12 h-12 rounded-full object-cover ring-2 ring-gray-100"
                    />
                    <div className="flex flex-col leading-tight">
                        <p className="text-sm font-semibold text-gray-900 tracking-tight">
                            {record.user?.name}
                        </p>
                        <p className="text-xs text-gray-500 font-medium">
                            {record.user?.email}
                        </p>
                    </div>
                </div>
            ),
        },
        {
            title: "Spot",
            dataIndex: ["spot", "spotNumber"],
            key: "spotNumber",
            sorter: true,
        },
        {
            title: "Started",
            dataIndex: "startedAt",
            key: "startedAt",
            sorter: true,
            render: (value) => formatDate(value),
        },
        {
            title: "Status",
            dataIndex: "status",
            key: "status",
            render: () => (
                <span
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"/>
                Active
            </span>
            ),
        },
    ];

    return (
        <AdminSidebar>
            <div className="min-h-screen bg-slate-50">
                <header className="bg-white border-b border-gray-200 px-8 py-4">
                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="text-2xl font-semibold text-gray-900">
                                Live Parking Sessions
                            </h1>
                            <p className="text-sm text-gray-400 mt-0.5">
                                Monitor all active parking sessions in real time
                            </p>
                        </div>

                        <div
                            className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 border border-blue-100 rounded-lg">
                            <Timer size={14} className="text-blue-500"/>
                            <span className="text-sm text-blue-600 font-medium">
                                Live Sessions
                            </span>
                        </div>
                    </div>
                </header>

                <div className="p-8 space-y-6">
                    <div
                        className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600 via-blue-500 to-cyan-600 p-7 text-white">
                        <div className="absolute -top-8 -right-8 w-40 h-40 bg-white/10 rounded-full"/>
                        <div className="absolute top-4 right-24 w-20 h-20 bg-white/10 rounded-full"/>
                        <div className="absolute -bottom-6 right-12 w-28 h-28 bg-cyan-700/40 rounded-full"/>

                        <div className="relative z-10">
                            <p className="text-blue-100 text-sm font-medium uppercase tracking-widest mb-1">
                                Dashboard Overview
                            </p>

                            <h2 className="text-3xl font-bold mb-1">
                                Active Parking Sessions
                            </h2>

                            <p className="text-blue-100 text-sm">
                                View and monitor vehicles currently occupying
                                parking spots.
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div
                            className="bg-white rounded-2xl border border-gray-200 p-5 flex items-center gap-4 shadow-sm">
                            <div
                                className="w-11 h-11 rounded-xl bg-blue-100 flex items-center justify-center flex-shrink-0">
                                <Car
                                    size={20}
                                    className="text-blue-600"
                                />
                            </div>

                            <div>
                                <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">
                                    Active Sessions
                                </p>

                                <p className="text-2xl font-bold text-gray-900 leading-tight">
                                    {totalActive}
                                </p>
                            </div>
                        </div>

                        <div
                            className="bg-white rounded-2xl border border-gray-200 p-5 flex items-center gap-4 shadow-sm">
                            <div
                                className="w-11 h-11 rounded-xl bg-emerald-100 flex items-center justify-center flex-shrink-0">
                                <DollarSign
                                    size={20}
                                    className="text-emerald-600"
                                />
                            </div>

                            <div>
                                <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">
                                    Current Revenue
                                </p>

                                <p className="text-2xl font-bold text-emerald-600 leading-tight">
                                    ${totalRevenue.toFixed(2)}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                        <DataTable<ParkingSession>
                            title="Active Sessions"
                            columns={columns}
                            data={sessions}
                            getData={getData}
                            allowSearch
                            total={total}
                            defaultPageSize={10}
                            pageSizeOptions={[10, 20, 50]}
                            allowFilter={false}
                        />
                    </div>
                </div>
            </div>
        </AdminSidebar>
    );
}