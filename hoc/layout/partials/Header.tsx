"use client";

import React from "react";
import {usePathname, useRouter} from "next/navigation";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "@/store/store";
import {logOut} from "@/store/auth/authSlice";
import {LogIn, LogOut, ParkingSquare, User, UserPlus} from "lucide-react";
import Link from "next/link";

export default function Header() {
    const pathname = usePathname();
    const router = useRouter();
    const dispatch = useDispatch();
    const {user} = useSelector((state: RootState) => state.auth);

    const handleLogoutClick = () => {
        dispatch(logOut());
        router.push("/login");
    };

    const isAdmin = pathname.startsWith("/admin");
    const isHome = pathname === "/";

    return (
        <header
            className={`w-full bg-white border-b border-gray-200 px-8 flex items-center sticky top-0 z-50 shadow-sm ${
                isHome ? "justify-between" : "justify-end"
            }`}
            style={{
                height: isAdmin ? "80px" : "64px",
                minHeight: isAdmin ? "80px" : "64px"
            }}
        >
            {isHome && (
                <Link href="/" className="flex items-center gap-2 hover:opacity-90 transition-opacity">
                    <ParkingSquare className="w-6 h-6 text-blue-600 flex-shrink-0"/>
                    <span className="font-semibold text-gray-800 tracking-tight">
                        Prometrix
                    </span>
                </Link>
            )}
            <div className="flex items-center gap-4">
                {user ? (
                    <>
                        <div
                            className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
                            <div
                                className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-xs font-bold uppercase">
                                {user.name?.charAt(0) || <User size={12}/>}
                            </div>
                            <span className="text-sm font-medium text-slate-700 max-w-[120px] truncate">
                        {user.name}
                    </span>
                        </div>

                        <button
                            type="button"
                            onClick={handleLogoutClick}
                            className="inline-flex items-center gap-2 px-3.5 py-2 text-sm font-medium text-rose-600 bg-rose-50 hover:bg-rose-100 border border-rose-100 rounded-lg transition-all"
                        >
                            <LogOut size={15}/>
                            <span className="hidden sm:inline">Log Out</span>
                        </button>
                    </>
                ) : (
                    isHome && (
                        <div className="flex items-center gap-2">
                            <Link
                                href="/login"
                                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 border border-transparent rounded-lg transition-colors"
                            >
                                <LogIn size={15} className="text-slate-500"/>
                                Sign In
                            </Link>
                            <Link
                                href="/register"
                                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 shadow-sm rounded-lg transition-colors"
                            >
                                <UserPlus size={15}/>
                                Sign Up
                            </Link>
                        </div>
                    )
                )}
            </div>
        </header>
    );
}