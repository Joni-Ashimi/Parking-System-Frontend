"use client";

import React, {useState} from "react";
import {ArrowLeft, Car, Clock, ParkingSquare, Shield,} from "lucide-react";
import Link from "next/link";
import {useRouter} from "next/navigation";
import GradientButton from "@/components/core/buttons/GradientButton";
import CEmailInput from "@/components/core/inputs/CEmailInput";
import CPasswordInput from "@/components/core/inputs/CPasswordInput";
import {handleRequestErrors, showSuccess} from '@/utils/functions';
import {hideLoader, showLoader} from "@/store/loadingSlice";
import {loginSucces} from "@/store/auth/authSlice";
import {AppDispatch, RootState} from "@/store/store";
import { useDispatch, useSelector } from 'react-redux';
import AuthService from "@/services/AuthService";

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const dispatch = useDispatch<AppDispatch>();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        dispatch(showLoader("Logging in..."));
        try {
            const response = await AuthService.login(email, password);
            const { user, accessToken, refreshToken } = response.data;
            dispatch(loginSucces({ user, accessToken, refreshToken }));
            showSuccess(`Welcome back, ${user.name}!`);
            router.push("/user/dashboard");
        } catch (err) {
            handleRequestErrors(err);
        } finally {
            dispatch(hideLoader());
        }
    };

    return (
        <div className="flex min-h-screen">
            <Link
                href="/"
                className="absolute top-6 left-6 z-20 flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors bg-white/80 backdrop-blur-sm px-3 py-2 rounded-full shadow-sm"
            >
                <ArrowLeft size={16}/>
                <span className="text-sm font-medium">Back to Home</span>
            </Link>

            <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-12 bg-white">
                <div className="w-full max-w-md">
                    <div className="mb-10">
                        <div className="flex items-center gap-2 mb-3">
                            <div className="p-2 bg-blue-600 rounded-xl">
                                <Car size={22} className="text-white"/>
                            </div>
                            <span className="text-2xl font-bold text-gray-800">ParkEasy</span>
                        </div>
                        <h1 className="text-3xl font-bold text-gray-900">Welcome back</h1>
                        <p className="text-gray-500 mt-2">Sign in to your account to continue</p>
                    </div>

                    <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                        <div className="space-y-4">
                            <CEmailInput
                                label="Email Address"
                                placeholder="email@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            <CPasswordInput
                                label="Password"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <input
                                    id="remember-me"
                                    name="remember-me"
                                    type="checkbox"
                                    className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                                />
                                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                                    Remember me
                                </label>
                            </div>

                            <div className="text-sm">
                                <a href="#" className="font-medium text-purple-600 hover:text-purple-500">
                                    Forgot your password?
                                </a>
                            </div>
                        </div>
                        <GradientButton label="Sign in" type="submit" />
                        <div className="text-center">
              <span className="text-sm text-gray-600">
                Don't have an account?{' '}
                  <Link href="/register" className="font-medium text-purple-600 hover:text-purple-500">
                  Sign up
                </Link>
              </span>
                        </div>
                    </form>
                </div>
            </div>

            <div
                className="hidden lg:flex w-1/2 relative bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white flex-col justify-between p-12">
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-20 left-10 w-40 h-40 bg-white rounded-full"/>
                    <div className="absolute bottom-20 right-10 w-60 h-60 bg-white rounded-full"/>
                    <div
                        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 border-8 border-white/10 rounded-full"/>
                </div>

                <div className="relative z-10">
                    <div
                        className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-5 py-2.5 rounded-full border border-white/20">
                        <ParkingSquare size={24}/>
                        <span className="font-semibold">Smart Parking Solution</span>
                    </div>
                </div>

                <div className="relative z-10 max-w-lg">
                    <h2 className="text-4xl lg:text-5xl font-bold mb-6 leading-tight">
                        Park Smarter,
                        <br/>
                        Not Harder
                    </h2>
                    <p className="text-blue-100 text-xl mb-10">
                        Reserve your spot in seconds. Pay online. Skip the hassle.
                    </p>

                    <div className="space-y-4">
                        <div
                            className="flex items-center gap-4 bg-white/5 backdrop-blur-sm px-5 py-4 rounded-2xl border border-white/10">
                            <Clock size={24} className="text-blue-200"/>
                            <div>
                                <p className="font-semibold">Real‑time availability</p>
                                <p className="text-sm text-blue-100">See open spots before you arrive</p>
                            </div>
                        </div>
                        <div
                            className="flex items-center gap-4 bg-white/5 backdrop-blur-sm px-5 py-4 rounded-2xl border border-white/10">
                            <Shield size={24} className="text-blue-200"/>
                            <div>
                                <p className="font-semibold">Secure payments</p>
                                <p className="text-sm text-blue-100">Pay with Visa, Mastercard, or PayPal</p>
                            </div>
                        </div>
                        <div
                            className="flex items-center gap-4 bg-white/5 backdrop-blur-sm px-5 py-4 rounded-2xl border border-white/10">
                            <Car size={24} className="text-blue-200"/>
                            <div>
                                <p className="font-semibold">Multiple vehicles</p>
                                <p className="text-sm text-blue-100">Manage cars, bikes, and trucks</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="relative z-10 text-blue-200 text-sm border-t border-white/20 pt-8">
                    <p className="italic text-lg">"Best parking experience in the city"</p>
                    <p className="mt-2">— Trusted by over 10,000 drivers</p>
                </div>
            </div>
        </div>
    );
}