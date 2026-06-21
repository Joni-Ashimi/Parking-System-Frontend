"use client";

import {useState} from "react";
import NavItem from "@/components/NavItem";
import {Activity, Ban, DollarSign, Menu, MessageSquareText, ParkingSquare, Radio, Users, X} from "lucide-react";
import Header from "@/hoc/layout/partials/Header";

export default function AdminSidebar({children}: { children: React.ReactNode }) {
    const [isOpen, setIsOpen] = useState(true);
    const [mobileOpen, setMobileOpen] = useState(false);

    return (
        <div className="flex h-screen bg-gray-50 overflow-hidden">

            {/* Mobile backdrop */}
            {mobileOpen && (
                <div
                    className="fixed inset-0 bg-black/40 z-40 lg:hidden"
                    onClick={() => setMobileOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`fixed lg:relative h-full bg-white border-r border-gray-200 flex flex-col z-50
                    transition-all duration-300 ease-in-out
                    ${mobileOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0
                    ${isOpen ? "w-64" : "lg:w-24"} w-64`}
            >
                <div className="p-4">
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center overflow-hidden">
                            <ParkingSquare className="w-6 h-6 text-blue-600 flex-shrink-0"/>
                            <span
                                className={`ml-2 font-semibold text-gray-800 whitespace-nowrap transition-all duration-200
                                    ${isOpen ? "opacity-100" : "opacity-0 w-0"}`}
                            >
                                Prometrix Admin
                            </span>
                        </div>

                        {/* Desktop collapse toggle */}
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="p-2 rounded-lg hover:bg-gray-100 transition hidden lg:flex"
                        >
                            <Menu
                                size={20}
                                className={`transition-transform duration-300 ${isOpen ? "rotate-0" : "rotate-180"}`}
                            />
                        </button>

                        {/* Mobile close button */}
                        <button
                            onClick={() => setMobileOpen(false)}
                            className="p-2 rounded-lg hover:bg-gray-100 transition lg:hidden"
                        >
                            <X size={20}/>
                        </button>
                    </div>

                    <nav className="space-y-1">
                        <NavItem icon={<Activity size={18}/>} label="Dashboard" href="/admin/dashboard"
                                 isOpen={isOpen}/>
                        <NavItem icon={<Users size={18}/>} label="Users" href="/admin/users" isOpen={isOpen}/>
                        <NavItem icon={<ParkingSquare size={18}/>} label="Manage Spots" href="/admin/parkingSpots"
                                 isOpen={isOpen}/>
                        <NavItem icon={<DollarSign size={18}/>} label="Manage Price" href="/admin/pricing"
                                 isOpen={isOpen}/>
                        <NavItem icon={<Radio size={18}/>} label="Live Sessions" href="/admin/sessions"
                                 isOpen={isOpen}/>
                        <NavItem icon={<Ban size={18}/>} label="Violations" href="/admin/violation" isOpen={isOpen}/>
                        <NavItem icon={<MessageSquareText size={18}/>} label="User Feedback"
                                 href="/admin/users/feedback" isOpen={isOpen}/>
                    </nav>
                </div>
            </aside>

            {/* Content */}
            <main className="flex-1 min-w-0 overflow-auto flex flex-col">
                <Header onMenuClick={() => setMobileOpen(true)}/>
                <div className="flex-1">
                    {children}
                </div>
            </main>
        </div>
    );
}