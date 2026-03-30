// app/page.tsx
import Link from "next/link";
import {ParkingCircle, Zap,} from "lucide-react";
import Hero from "@/components/sections/Hero";
import FeaturesSection from "@/components/sections/FeaturesSection";
import StepsSection from "@/components/sections/StepsSection";
import VehiclesSection from "@/components/sections/VehiclesSection";

export default function Home() {
    return (
        <div className="min-h-screen overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-gray-900">
            <nav className="px-6 py-4 bg-black/40 backdrop-blur-xl border-b border-white/10 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto flex justify-between items-center">
                    <div className="flex items-center gap-2 group cursor-pointer">
                        <ParkingCircle
                            className="w-8 h-8 text-blue-400 group-hover:scale-110 transition-transform duration-300"/>
                        <span
                            className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Prometrix
            </span>
                    </div>

                    <div className="flex gap-4 items-center">
                        <Link
                            href="/login"
                            className="text-gray-300 hover:text-white transition-all duration-300 hover:scale-105"
                        >
                            Login
                        </Link>
                        <Link
                            href="/register"
                            className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-blue-500/25"
                        >
                            Sign Up
                        </Link>
                    </div>
                </div>
            </nav>

            <Hero/>
            <FeaturesSection/>
            <VehiclesSection />
            <StepsSection/>

            <section className="py-20 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 blur-3xl"></div>
                <div className="max-w-4xl mx-auto px-6 text-center relative">
                    <div className="animate-fade-in-up">
                        <h2 className="text-3xl lg:text-4xl font-bold mb-4 bg-gradient-to-r from-gray-100 to-gray-300 bg-clip-text text-transparent">
                            Ready to simplify parking?
                        </h2>
                        <p className="text-gray-400 mb-8">
                            Join Prometrix and take control of your parking experience.
                        </p>

                        <Link
                            href="/register"
                            className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-blue-500/25 group"
                        >
                            Create Account
                            <Zap className="w-5 h-5 group-hover:rotate-12 transition-transform"/>
                        </Link>
                    </div>
                </div>
            </section>

            <footer className="bg-black/40 border-t border-white/10 py-10 text-center">
                <p className="text-gray-400">© {new Date().getFullYear()} Prometrix. All rights reserved.</p>
            </footer>
        </div>
    );
}