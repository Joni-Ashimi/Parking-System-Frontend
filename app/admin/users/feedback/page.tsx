// app/admin/feedbacks/page.tsx
"use client";

import React, {useCallback, useState} from "react";
import {CheckCircle2, Clock, Eye, Shield} from "lucide-react";
import type {TableColumnsType} from "antd";
import AdminSidebar from "@/components/sidebar/adminSidebar";
import DataTable from "@/app/core/components/DataTable";
import FeedBackService from "@/services/FeedbackService";
import {formatDate, handleRequestErrors} from "@/utils/functions";
import FeedbackViewModal, {FeedbackRecord} from "@/components/admin/FeedbackViewModal";

interface TableParams {
    page?: number;
    pageSize?: number;
    qs?: string;
    sortBy?: string;
    sortOrder?: "ASC" | "DESC";
}

export default function AdminFeedbacksPage() {
    const [feedbacks, setFeedbacks] = useState<FeedbackRecord[]>([]);
    const [total, setTotal] = useState<number>(0);
    const [targetFeedback, setTargetFeedback] = useState<FeedbackRecord | null>(null);
    const [isViewOpen, setIsViewOpen] = useState<boolean>(false);

    const getData = useCallback(async (params: TableParams) => {
        const {page = 1, pageSize = 5, qs = "", sortBy, sortOrder} = params;
        try {
            const res = await FeedBackService.getAll({page, pageSize, qs, sortBy, sortOrder} as any);

            let finalData: FeedbackRecord[] = [];
            let finalTotal: number = 0;

            if (res && res.data) {
                if (res.data.data && Array.isArray(res.data.data)) {
                    finalData = res.data.data;
                    finalTotal = typeof res.data.total === 'number' ? res.data.total : res.data.data.length;
                } else if (Array.isArray(res.data)) {
                    finalData = res.data;
                    finalTotal = res.data.length;
                }
            }

            setFeedbacks(Array.isArray(finalData) ? finalData : []);
            setTotal(finalTotal);
        } catch (err) {
            handleRequestErrors(err);
            setFeedbacks([]);
        }
    }, []);

    // New action to update status to "responded" directly in state
    const handleMarkAsResponded = async (id: string) => {
        try {
            await FeedBackService.updateStatus(id, "responded");

            // Instantly mutate target row status local state configuration without dropping records
            setFeedbacks((prev) =>
                prev.map((item) => (item.id === id ? {...item, status: "responded"} : item))
            );
        } catch (err) {
            handleRequestErrors(err);
        }
    };

    const handleOpenViewModal = (record: FeedbackRecord) => {
        setTargetFeedback(record);
        setIsViewOpen(true);
    };

    const handleCloseViewModal = () => {
        setTargetFeedback(null);
        setIsViewOpen(false);
    };

    const columns: TableColumnsType<FeedbackRecord> = [
        {
            title: "User Info",
            dataIndex: ["user", "name"],
            key: "user",
            sorter: true,
            render: (_, record) => (
                <div className="flex items-center gap-3">
                    <img
                        src={
                            record.user?.profileImageUrl && record.user.profileImageUrl !== "null"
                                ? record.user.profileImageUrl
                                : (record.user?.gender === "MALE"
                                    ? "https://res.cloudinary.com/dorwowkmx/image/upload/v1778960498/male-face-avatar-icon-set-flat-design-social-media-profiles_1281173-3806_mcwkod.jpg"
                                    : "https://res.cloudinary.com/dorwowkmx/image/upload/v1778960555/avatar-profile-icon-flat-style-female-user-profile-vector-illustration-isolated-background-women-profile-sign-business-concept_157943-38866_li4tqs.jpg")
                        }
                        alt={record.user?.name || "User"}
                        className="w-10 h-10 rounded-full object-cover ring-2 ring-gray-100"
                    />
                    <div className="flex flex-col leading-tight">
                        <p className="text-sm font-semibold text-gray-900 tracking-tight">
                            {record.user?.name || "Deleted User"}
                        </p>
                        <p className="text-xs text-gray-400 font-medium mt-0.5">
                            {record.user?.email || "N/A"}
                        </p>
                    </div>
                </div>
            ),
        },
        {
            title: "Category",
            dataIndex: "category",
            key: "category",
            sorter: true,
            width: 140,
            render: (category: string) => (
                <span
                    className="inline-flex px-2.5 py-0.5 text-xs font-medium rounded-full bg-slate-100 text-slate-800 border border-slate-200">
                    {category}
                </span>
            ),
        },
        {
            title: "Subject",
            dataIndex: "subject",
            key: "subject",
            sorter: true,
            render: (subject: string) => (
                <span className="font-medium text-gray-800 text-sm">{subject}</span>
            ),
        },
        {
            title: "Status",
            dataIndex: "status",
            key: "status",
            render: (status: string) => {
                if (status === "responded") {
                    return (
                        <span
                            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            <Clock size={12}/>
                            Responded
                        </span>
                    );
                }
                return (
                    <span
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"/>
                        Pending
                    </span>
                );
            }
        },
        {
            title: "Submitted At",
            dataIndex: "createdAt",
            key: "createdAt",
            sorter: true,
            render: (value: string) => formatDate(value),
        },
        {
            title: "Action",
            key: "action",
            align: "right",
            render: (_, record) => (
                <div className="flex items-center justify-end gap-2" onClick={(e) => e.stopPropagation()}>
                    <button
                        type="button"
                        onClick={() => handleOpenViewModal(record)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-indigo-200 text-indigo-600 hover:bg-indigo-50 hover:border-indigo-400 transition-all"
                    >
                        <Eye size={13}/>
                        Inspect
                    </button>

                    {/* Only render action button option if the status configuration is pending */}
                    {record.status !== "responded" && (
                        <button
                            type="button"
                            onClick={() => handleMarkAsResponded(record.id)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-emerald-200 text-emerald-600 hover:bg-emerald-50 hover:border-emerald-400 transition-all"
                        >
                            <CheckCircle2 size={13}/>
                            Mark Responded
                        </button>
                    )}
                </div>
            ),
        },
    ];

    return (
        <AdminSidebar>
            <div className="min-h-screen bg-slate-50">
                <header className="bg-white border-b border-gray-200 px-8 py-4">
                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="text-2xl font-semibold text-gray-900">User Feedbacks</h1>
                            <p className="text-sm text-gray-400 mt-0.5">Review issues reported by clients</p>
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
                        className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-700 via-indigo-600 to-violet-700 p-7 text-white">
                        <div className="absolute -top-8 -right-8 w-40 h-40 bg-white/10 rounded-full"/>
                        <div className="absolute top-4 right-24 w-20 h-20 bg-white/10 rounded-full"/>
                        <div className="relative z-10">
                            <p className="text-indigo-200 text-sm font-medium uppercase tracking-widest mb-1">
                                Service Quality Desk
                            </p>
                            <h2 className="text-3xl font-bold mb-1">Feedback Tracking</h2>
                            <p className="text-indigo-200 text-sm">
                                View app bugs, platform performance feedback, and client tickets.
                            </p>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                        <DataTable<FeedbackRecord>
                            title="Submitted Records"
                            columns={columns}
                            data={feedbacks}
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

            {isViewOpen && targetFeedback && (
                <FeedbackViewModal
                    isOpen={isViewOpen}
                    onClose={handleCloseViewModal}
                    feedback={targetFeedback}
                />
            )}
        </AdminSidebar>
    );
}