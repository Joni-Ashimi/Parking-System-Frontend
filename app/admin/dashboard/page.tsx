"use client";

import {useEffect, useState} from "react";
import {Activity, Car, Clock, DollarSign, ParkingSquare, Shield, TrendingUp, Users,} from "lucide-react";
import {
    Area,
    AreaChart,
    Bar,
    BarChart,
    CartesianGrid,
    Cell,
    Line,
    LineChart,
    Pie,
    PieChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";
import AdminSidebar from "@/components/sidebar/adminSidebar";
import Stats from "@/components/admin/dashboard/stats";
import {handleRequestErrors} from "@/utils/functions";
import DashboardService from "@/services/DashboardService";

const spotTypeUsage = [
    {name: "Small", value: 35, color: "#3B82F6"},
    {name: "Medium", value: 45, color: "#10B981"},
    {name: "Large", value: 20, color: "#F59E0B"},
];

interface PeakHourData {
    hour: string;
    occupancy: number;
}

interface SpotUsageData {
    name: string;
    value: number;
    color: string;
}

interface OccupancyTrend {
    date: string;
    rate: number;
}

export default function AdminDashboard() {
    const [revenueView, setRevenueView] = useState<"daily" | "hourly">("daily");
    const [stats, setStats] = useState({
        totalUsers: 0,
        activeSessions: 0,
        totalSpots: 0,
        revenueToday: 0
    });
    const [revenueData, setRevenueData] = useState([]);
    const [peakHours, setPeakHours] = useState<PeakHourData[]>([]);
    const [spotUsage, setSpotUsage] = useState<SpotUsageData[]>([]);
    const [occupancyTrend, setOccupancyTrend] = useState<OccupancyTrend[]>([]);

    const loadStats = async () => {
        try {
            const {data} = await DashboardService.getDashboardStats();
            setStats(data);
        } catch (err) {
            handleRequestErrors(err);
        }
    };
    useEffect(() => {
        loadStats();
        DashboardService.getPeakHours().then(res => setPeakHours(res.data));
        DashboardService.getSpotUsage().then(res => {
            const colorMap: { [key: string]: string } = {
                "Car": "#3B82F6",
                "Motorcycle": "#10B981",
                "Truck": "#F59E0B"
            };

            const formattedData = res.data.map((item: any) => ({
                name: item.name,
                value: Number(item.value),
                color: colorMap[item.name] || "#94A3B8"
            }));

            setSpotUsage(formattedData);
        });
        DashboardService.getOccupancyTrend().then(res => setOccupancyTrend(res.data));
    }, []);

    useEffect(() => {
        DashboardService.getRevenue(revenueView).then(res => setRevenueData(res.data));
    }, [revenueView]);

    return (
        <AdminSidebar>
            <div className="min-h-screen bg-gray-50">
                <header className="bg-white border-b border-gray-200 px-8 py-4">
                    <div className="flex justify-between items-center">
                        <h1 className="text-2xl font-semibold text-gray-800">
                            Analytics Dashboard
                        </h1>
                        <div className="flex items-center gap-3">
                            <div className="flex items-center gap-2 px-3 py-1 bg-gray-100 rounded-lg">
                                <Shield size={16} className="text-green-600"/>
                                <span className="text-sm text-gray-600">Admin Access</span>
                            </div>
                        </div>
                    </div>
                </header>

                <div className="p-8">
                    <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-6 mb-8 text-white">
                        <h2 className="text-2xl font-semibold mb-2">Welcome back, Admin!</h2>
                        <p className="text-blue-100">
                            Here's what's happening with your parking system today.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        <Stats
                            label="Total Users"
                            value={stats.totalUsers?.toString() || "0"}
                            icon={Users}
                            change=""
                            color="blue"
                        />
                        <Stats
                            label="Active Spots"
                            value={`${stats.activeSessions || 0}/${stats.totalSpots || 0}`}
                            icon={ParkingSquare}
                            change=""
                            color="green"
                        />
                        <Stats
                            label="Revenue Today"
                            // Use ?. and || 0 to prevent the undefined crash
                            value={`$${(stats.revenueToday || 0).toFixed(2)}`}
                            icon={DollarSign}
                            change=""
                            color="purple"
                        />
                        <Stats
                            label="Active Sessions"
                            value={stats.activeSessions?.toString() || "0"}
                            icon={Activity}
                            change=""
                            color="orange"
                        />
                    </div>

                    <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                                <DollarSign size={20} className="text-blue-600"/>
                                Revenue Overview
                            </h3>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setRevenueView("daily")}
                                    className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                                        revenueView === "daily"
                                            ? "bg-blue-600 text-white"
                                            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                    }`}
                                >
                                    Daily
                                </button>
                                <button
                                    onClick={() => setRevenueView("hourly")}
                                    className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                                        revenueView === "hourly"
                                            ? "bg-blue-600 text-white"
                                            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                    }`}
                                >
                                    Hourly
                                </button>
                            </div>
                        </div>
                        <div className="h-80">
                            <ResponsiveContainer width="100%" height="100%">
                                {revenueView === "daily" ? (
                                    <AreaChart data={revenueData}>
                                        <defs>
                                            <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                                                <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB"/>
                                        <XAxis dataKey="day" tick={{fill: "#6B7280", fontSize: 12}}/>
                                        <YAxis
                                            tick={{fill: "#6B7280", fontSize: 12}}
                                            tickFormatter={(value) => `$${value}`}
                                        />
                                        <Tooltip
                                            formatter={(value: any) => [`$${value}`, "Revenue"]}
                                            contentStyle={{
                                                backgroundColor: "#FFF",
                                                border: "1px solid #E5E7EB",
                                                borderRadius: "8px",
                                            }}
                                        />
                                        <Area
                                            type="monotone"
                                            dataKey="revenue"
                                            stroke="#3B82F6"
                                            strokeWidth={2}
                                            fill="url(#revenueGradient)"
                                        />
                                    </AreaChart>
                                ) : (
                                    <BarChart data={revenueData}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB"/>
                                        <XAxis dataKey="hour" tick={{fill: "#6B7280", fontSize: 12}}/>
                                        <YAxis
                                            tick={{fill: "#6B7280", fontSize: 12}}
                                            tickFormatter={(value) => `$${value}`}
                                        />
                                        <Tooltip
                                            formatter={(value: any) => [`$${value}`, "Revenue"]}
                                            contentStyle={{
                                                backgroundColor: "#FFF",
                                                border: "1px solid #E5E7EB",
                                                borderRadius: "8px",
                                            }}
                                        />
                                        <Bar dataKey="revenue" fill="#3B82F6" radius={[4, 4, 0, 0]}/>
                                    </BarChart>
                                )}
                            </ResponsiveContainer>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                        <div className="bg-white rounded-xl border border-gray-200 p-6">
                            <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                                <Clock size={20} className="text-orange-600"/>
                                Peak Hours (Occupancy)
                            </h3>
                            <div className="h-64">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={peakHours}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB"/>
                                        <XAxis dataKey="hour" tick={{fill: "#6B7280", fontSize: 12}}/>
                                        <YAxis
                                            tick={{fill: "#6B7280", fontSize: 12}}
                                            tickFormatter={(value) => `${value}%`}
                                        />
                                        <Tooltip
                                            formatter={(value: any) => [`${value}%`, "Occupancy"]}
                                            contentStyle={{
                                                backgroundColor: "#FFF",
                                                border: "1px solid #E5E7EB",
                                                borderRadius: "8px",
                                            }}
                                        />
                                        <Bar dataKey="occupancy" fill="#F59E0B" radius={[4, 4, 0, 0]}/>
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                            {peakHours.length > 0 && (
                                <p className="text-sm text-gray-500 mt-2 text-center">
                                    {(() => {
                                        // Sort by occupancy (coerced to a number for safety)
                                        const busiest = [...peakHours].sort((a, b) =>
                                            Number(b.occupancy) - Number(a.occupancy)
                                        )[0];
                                        return `Busiest hour: ${busiest.hour} (${Number(busiest.occupancy).toFixed(0)}% occupancy)`;
                                    })()}
                                </p>
                            )}
                        </div>

                        <div className="bg-white rounded-xl border border-gray-200 p-6">
                            <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                                <Car size={20} className="text-green-600"/>
                                Spot Type Usage
                            </h3>
                            <div className="h-64 flex items-center justify-center">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={spotUsage}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={60}
                                            outerRadius={90}
                                            paddingAngle={2}
                                            dataKey="value"
                                            label={({name, percent}: any) => `${name} ${(percent * 100).toFixed(0)}%`}
                                        >
                                            {spotUsage.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color}/>
                                            ))}
                                        </Pie>
                                        <Tooltip
                                            formatter={(value: any) => [`${value} sessions`, "Usage"]}
                                            contentStyle={{
                                                backgroundColor: "#FFF",
                                                border: "1px solid #E5E7EB",
                                                borderRadius: "8px",
                                            }}
                                        />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                            <div className="flex justify-center gap-6 mt-2">
                                {spotTypeUsage.map((type) => (
                                    <div key={type.name} className="flex items-center gap-2">
                                        <div
                                            className="w-3 h-3 rounded-full"
                                            style={{backgroundColor: type.color}}
                                        />
                                        <span className="text-sm text-gray-600">{type.name}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
                        <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                            <TrendingUp size={20} className="text-purple-600"/>
                            Occupancy Rate (Last 7 Days)
                        </h3>
                        <div className="h-72">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={occupancyTrend}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB"/>
                                    <XAxis dataKey="date" tick={{fill: "#6B7280", fontSize: 12}}/>
                                    <YAxis
                                        tick={{fill: "#6B7280", fontSize: 12}}
                                        domain={[0, 100]}
                                        tickFormatter={(value) => `${Math.round(value)}%`}
                                    />
                                    <Tooltip
                                        formatter={(value: any) => [`${Number(value).toFixed(1)}%`, "Occupancy"]}
                                        contentStyle={{
                                            backgroundColor: "#FFF",
                                            border: "1px solid #E5E7EB",
                                            borderRadius: "8px",
                                        }}
                                    />
                                    <Line
                                        type="monotone"
                                        dataKey="rate"
                                        stroke="#8B5CF6"
                                        strokeWidth={3}
                                        dot={{fill: "#8B5CF6", strokeWidth: 2, r: 4}}
                                        activeDot={{r: 6}}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            </div>
        </AdminSidebar>
    );
}
