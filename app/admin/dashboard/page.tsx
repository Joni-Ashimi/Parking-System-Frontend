"use client";

import {
    Users,
    ParkingSquare,
    DollarSign,
    Activity,
    Shield,
    Clock,
    Car,
    Bike,
    Truck,
    TrendingUp,
} from "lucide-react";
import AdminSidebar from "@/components/sidebar/adminSidebar";
import Stats from "@/components/admin/dashboard/stats";
import SpotsDistribution from "@/components/admin/dashboard/spots";

export default function AdminDashboard() {
    return (
        <div className="min-h-screen bg-gray-50">
            <AdminSidebar />
            <div className="ml-64">
                <header className="bg-white border-b border-gray-200 px-8 py-4">
                    <div className="flex justify-between items-center">
                        <h1 className="text-2xl font-semibold text-gray-800">
                            Dashboard Overview
                        </h1>
                        <div className="flex items-center gap-3">
                            <div className="flex items-center gap-2 px-3 py-1 bg-gray-100 rounded-lg">
                                <Shield size={16} className="text-green-600" />
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

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <div className="bg-white rounded-xl border border-gray-200 p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="font-semibold text-gray-800">Recent Activity</h3>
                                <Clock size={16} className="text-gray-400" />
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
                                <TrendingUp size={16} className="text-gray-400" />
                            </div>
                            <div className="space-y-4">
                                <SpotsDistribution
                                    icon={<Car size={20} />}
                                    type="Cars"
                                    occupied={25}
                                    total={35}
                                    color="blue"
                                />
                                <SpotsDistribution
                                    icon={<Bike size={20} />}
                                    type="Motorcycles"
                                    occupied={12}
                                    total={15}
                                    color="green"
                                />
                                <SpotsDistribution
                                    icon={<Truck size={20} />}
                                    type="Trucks"
                                    occupied={5}
                                    total={10}
                                    color="orange"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="mt-8">
                        <h3 className="font-semibold text-gray-800 mb-4">Quick Actions</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <QuickActionCard
                                title="Manage Users"
                                description="View, activate or ban user accounts"
                                icon={<Users size={20} />}
                            />
                            <QuickActionCard
                                title="Configure Spots"
                                description="Add or modify parking spots"
                                icon={<ParkingSquare size={20} />}
                            />
                            <QuickActionCard
                                title="Update Pricing"
                                description="Adjust rates for vehicle sizes"
                                icon={<DollarSign size={20} />}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function ActivityItem({ user, action, time }: any) {
    return (
        <div className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                        <Users size={14} className="text-gray-600" />
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

function QuickActionCard({ title, description, icon }: any) {
    return (
        <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-all hover:border-blue-200 cursor-pointer">
            <div className="flex items-start justify-between mb-4">
                <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                    {icon}
                </div>
            </div>
            <h3 className="font-semibold text-gray-800 mb-1">{title}</h3>
            <p className="text-sm text-gray-500">{description}</p>
        </div>
    );
}