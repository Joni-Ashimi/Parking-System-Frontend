"use client";
import React from 'react';
import { Lock, Mail, ArrowRight } from "lucide-react";

type LoginFormProps = {
    delay?: number;
};

export default function LoginForm({ delay = 0 }: LoginFormProps) {
    return (
        <div
            className="relative w-full max-w-md p-8 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 shadow-2xl animate-fade-in-up"
            style={{ animationDelay: `${delay}ms` }}
        >
            <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                {/* Email Field */}
                <div className="space-y-2 text-left">
                    <label className="text-sm font-medium text-gray-300 ml-1">Email</label>
                    <div className="relative group">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-blue-400 transition-colors" />
                        <input
                            type="email"
                            placeholder="you@example.com"
                            className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-gray-200 focus:outline-none focus:border-blue-500/50 transition-all"
                        />
                    </div>
                </div>

                {/* Password Field */}
                <div className="space-y-2 text-left">
                    <label className="text-sm font-medium text-gray-300 ml-1">Password</label>
                    <div className="relative group">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-purple-400 transition-colors" />
                        <input
                            type="password"
                            placeholder="••••••••"
                            className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-gray-200 focus:outline-none focus:border-purple-500/50 transition-all"
                        />
                    </div>
                </div>

                {/* Submit Button */}
                <button className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-[1.02] shadow-lg shadow-blue-500/20 font-semibold group">
                    Sign In
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
            </form>
        </div>
    );
}