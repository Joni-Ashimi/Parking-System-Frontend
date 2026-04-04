"use client";

import { useState } from "react";
import NavItem from "@/components/NavItem";
import { Activity, DollarSign, Menu, ParkingSquare, Users } from "lucide-react";

export default function AdminSidebar() {
    const [isOpen, setIsOpen] = useState(true);

    return (
        <div
            className={`fixed left-0 top-0 h-full bg-white border-r border-gray-200 transition-all duration-300 ${
                isOpen ? "w-64" : "w-24"
            }`}
        >
            <div className="p-4">
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center overflow-hidden">
                        <ParkingSquare className="w-6 h-6 text-blue-600 flex-shrink-0" />

                        <span
                            className={`ml-2 font-semibold text-gray-800 whitespace-nowrap overflow-hidden transition-all duration-300 ${
                                isOpen ? "opacity-100 max-w-[200px]" : "opacity-0 max-w-0 ml-0"
                            }`}
                        >
                            Prometrix Admin
                        </span>
                    </div>

                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="p-2 rounded-lg hover:bg-gray-100 transition"
                    >
                        <Menu
                            size={20}
                            className={`transition-transform duration-300 ${
                                isOpen ? "rotate-0" : "rotate-180"
                            }`}
                        />
                    </button>
                </div>

                <nav className="space-y-1">
                    <NavItem icon={<Activity size={18} />} label="Dashboard" href="/admin/dashboard" isOpen={isOpen} />
                    <NavItem icon={<Users size={18} />} label="Users" href="/admin/users" isOpen={isOpen} />
                    <NavItem icon={<ParkingSquare size={18} />} label="Parking Spots" href="/admin/parking" isOpen={isOpen} />
                    <NavItem icon={<DollarSign size={18} />} label="Pricing" href="/admin/pricing" isOpen={isOpen} />
                </nav>
            </div>
        </div>
    );
}