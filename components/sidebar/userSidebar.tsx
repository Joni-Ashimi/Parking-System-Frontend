"use client";

import {useState} from "react";
import NavItem from "@/components/NavItem";
import {Car, History, LayoutDashboard, Map, Menu, MessageSquare, ParkingSquare, User, X} from "lucide-react";
import Header from "@/hoc/layout/partials/Header";

export default function UserSidebar({children}: { children: React.ReactNode }) {
    const [isOpen, setIsOpen] = useState(true);
    const [mobileOpen, setMobileOpen] = useState(false);

    return (
        <>
            {/* Mobile overlay backdrop */}
            {mobileOpen && (
                <div
                    className="fixed inset-0 bg-black/40 z-40 lg:hidden"
                    onClick={() => setMobileOpen(false)}
                />
            )}

            {/* Sidebar */}
            <div
                className={`fixed left-0 top-0 h-full z-50 bg-white border-r border-gray-200 transition-all duration-300
                    ${mobileOpen ? "translate-x-0" : "-translate-x-full"}
                    lg:translate-x-0
                    ${isOpen ? "w-64" : "lg:w-24"}
                    w-64
                `}
            >
                <div className="p-4">
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center overflow-hidden">
                            <ParkingSquare className="w-6 h-6 text-blue-600 flex-shrink-0"/>
                            <span
                                className={`ml-2 font-semibold text-gray-800 whitespace-nowrap overflow-hidden transition-all duration-300 ${
                                    isOpen ? "opacity-100 max-w-[200px]" : "opacity-0 max-w-0 ml-0 lg:block"
                                }`}
                            >
                                Prometrix
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
                        <NavItem icon={<LayoutDashboard size={18}/>} label="Dashboard" href="/user/dashboard" isOpen={isOpen}/>
                        <NavItem icon={<Car size={18}/>} label="My Garage" href="/user/my-vehicles" isOpen={isOpen}/>
                        <NavItem icon={<Map size={18}/>} label="Spots Map" href="/user/park" isOpen={isOpen}/>
                        <NavItem icon={<ParkingSquare size={18}/>} label="Checkout Live Session" href="/user/parking" isOpen={isOpen}/>
                        <NavItem icon={<History size={18}/>} label="My Sessions" href="/user/sessions" isOpen={isOpen}/>
                        <NavItem icon={<MessageSquare size={18}/>} label="Feedback" href="/user/feedback" isOpen={isOpen}/>
                        <NavItem icon={<User size={18}/>} label="Profile" href="/user/me" isOpen={isOpen}/>
                    </nav>
                </div>
            </div>

            {/* Content */}
            <div className={`transition-all duration-300 flex flex-col min-h-screen ${isOpen ? "lg:ml-64" : "lg:ml-24"}`}>
                <Header onMenuClick={() => setMobileOpen(true)}/>
                <main className="flex-1">
                    {children}
                </main>
            </div>
        </>
    );
}