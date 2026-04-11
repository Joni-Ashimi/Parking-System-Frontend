"use client";

import {useState} from "react";
import {Activity, Bike, Car, Clock, DollarSign, ParkingSquare, Shield, TrendingUp, Truck, Users,} from "lucide-react";
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
import SpotsDistribution from "@/components/admin/dashboard/spots";

const hourlyRevenue = [
    {hour: "00:00", revenue: 120},
    {hour: "04:00", revenue: 80},
    {hour: "08:00", revenue: 450},
    {hour: "12:00", revenue: 620},
    {hour: "16:00", revenue: 780},
    {hour: "20:00", revenue: 340},
];

const dailyRevenue = [
    {day: "Mon", revenue: 1250},
    {day: "Tue", revenue: 1400},
    {day: "Wed", revenue: 1580},
    {day: "Thu", revenue: 1720},
    {day: "Fri", revenue: 2100},
    {day: "Sat", revenue: 1950},
    {day: "Sun", revenue: 1100},
];

const peakHours = [
    {hour: "6am", occupancy: 15},
    {hour: "8am", occupancy: 42},
    {hour: "10am", occupancy: 38},
    {hour: "12pm", occupancy: 45},
    {hour: "2pm", occupancy: 40},
    {hour: "4pm", occupancy: 48},
    {hour: "6pm", occupancy: 52},
    {hour: "8pm", occupancy: 30},
    {hour: "10pm", occupancy: 18},
];

const spotTypeUsage = [
    {name: "Small", value: 35, color: "#3B82F6"},
    {name: "Medium", value: 45, color: "#10B981"},
    {name: "Large", value: 20, color: "#F59E0B"},
];

const occupancyTrend = [
    {date: "Mar 10", rate: 68},
    {date: "Mar 11", rate: 72},
    {date: "Mar 12", rate: 75},
    {date: "Mar 13", rate: 70},
    {date: "Mar 14", rate: 82},
    {date: "Mar 15", rate: 78},
    {date: "Mar 16", rate: 85},
];

export default function AdminDashboard() {
    const [revenueView, setRevenueView] = useState<"daily" | "hourly">("daily");

    return (
        <div className="min-h-screen bg-gray-50">
            <AdminSidebar/>
            <div className="ml-64">
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
                            value="1,234"
                            icon={Users}
                            change="+12%"
                            color="blue"
                        />
                        <Stats
                            label="Active Spots"
                            value="45/60"
                            icon={ParkingSquare}
                            change="+5"
                            color="green"
                        />
                        <Stats
                            label="Revenue Today"
                            value="$892"
                            icon={DollarSign}
                            change="+23%"
                            color="purple"
                        />
                        <Stats
                            label="Active Sessions"
                            value="28"
                            icon={Activity}
                            change="+3"
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
                                    <AreaChart data={dailyRevenue}>
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
                                    <BarChart data={hourlyRevenue}>
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
                            <p className="text-sm text-gray-500 mt-2 text-center">
                                Busiest hours: 6pm - 8pm (52% occupancy)
                            </p>
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
                                            data={spotTypeUsage}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={60}
                                            outerRadius={90}
                                            paddingAngle={2}
                                            dataKey="value"
                                            label={({name, percent} : any) => `${name} ${(percent * 100).toFixed(0)}%`}
                                        >
                                            {spotTypeUsage.map((entry, index) => (
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

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                        <div className="bg-white rounded-xl border border-gray-200 p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="font-semibold text-gray-800">Recent Activity</h3>
                                <Clock size={16} className="text-gray-400"/>
                            </div>
                            <div className="space-y-3">
                                <ActivityItem
                                    user="John Doe"
                                    action="parked a car"
                                    time="5 minutes ago"
                                />
                                <ActivityItem
                                    user="Sarah Smith"
                                    action="checked out"
                                    time="12 minutes ago"
                                />
                                <ActivityItem
                                    user="Mike Johnson"
                                    action="registered new vehicle"
                                    time="1 hour ago"
                                />
                                <ActivityItem
                                    user="Emma Wilson"
                                    action="made payment"
                                    time="2 hours ago"
                                />
                            </div>
                        </div>

                        <div className="bg-white rounded-xl border border-gray-200 p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="font-semibold text-gray-800">Spot Distribution</h3>
                                <TrendingUp size={16} className="text-gray-400"/>
                            </div>
                            <div className="space-y-4">
                                <SpotsDistribution
                                    icon={<Car size={20}/>}
                                    type="Cars"
                                    occupied={25}
                                    total={35}
                                    color="blue"
                                />
                                <SpotsDistribution
                                    icon={<Bike size={20}/>}
                                    type="Motorcycles"
                                    occupied={12}
                                    total={15}
                                    color="green"
                                />
                                <SpotsDistribution
                                    icon={<Truck size={20}/>}
                                    type="Trucks"
                                    occupied={5}
                                    total={10}
                                    color="orange"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function ActivityItem({user, action, time}: any) {
    return (
        <div className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
            <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                    <Users size={14} className="text-gray-600"/>
                </div>
                <div>
                    <p className="text-sm font-medium text-gray-800">
                        {user} <span className="text-gray-500">{action}</span>
                    </p>
                </div>
            </div>
            <span className="text-xs text-gray-400">{time}</span>
        </div>
    );
}

function QuickActionCard({title, description, icon}: any) {
    return (
        <div
            className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-all hover:border-blue-200 cursor-pointer">
            <div className="flex items-start justify-between mb-4">
                <div className="p-2 bg-blue-50 rounded-lg text-blue-600">{icon}</div>
            </div>
            <h3 className="font-semibold text-gray-800 mb-1">{title}</h3>
            <p className="text-sm text-gray-500">{description}</p>
        </div>
    );
}