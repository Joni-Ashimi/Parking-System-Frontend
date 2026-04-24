"use client";

import { useState } from "react";
import NavItem from "@/components/NavItem";
import {
    LayoutDashboard,
    Car,
    Map,
    Menu,
    ParkingSquare,
} from "lucide-react";

export default function UserSidebar({ children} : { children: React.ReactNode}) {
    const [isOpen, setIsOpen] = useState(true);

    return (
        <>
            {/* Sidebar */}
            <div
                className={`fixed left-0 top-0 h-full z-50 bg-white border-r border-gray-200 transition-all duration-300 ${
                    isOpen ? "w-64" : "w-24"
                }`}
            >
                <div className="p-4">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center overflow-hidden">
                            <ParkingSquare className="w-6 h-6 text-blue-600 flex-shrink-0" />

                            <span
                                className={`ml-2 font-semibold text-gray-800 whitespace-nowrap overflow-hidden transition-all duration-300 ${
                                    isOpen ? "opacity-100 max-w-[200px]" : "opacity-0 max-w-0 ml-0"
                                }`}
                            >
                            Prometrix
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

                    {/* Navigation */}
                    <nav className="space-y-1">
                        <NavItem icon={<LayoutDashboard size={18} />} label="Dashboard" href="/user/dashboard" isOpen={isOpen} />
                        <NavItem icon={<Car size={18} />} label="My Vehicles" href="/user/my-vehicles" isOpen={isOpen} />
                        <NavItem icon={<ParkingSquare size={18} />} label="My Parking" href="/user/parking" isOpen={isOpen} />
                    </nav>
                </div>
            </div>

            {/* CONTENT */}
            <div className={`transition-all duration-300 ${isOpen ? "ml-64" : "ml-20"}`}>
                {children}
            </div>
        </>
    );
}