import { MapPin, CreditCard, Shield } from "lucide-react";
import FeatureCard from "@/components/UI/FeatureCard";

export default function FeaturesSection() {
    return (
        <section className="py-20 relative">
            <div className="max-w-7xl mx-auto px-6 text-center">

                <div className="animate-fade-in-up">
                    <h2 className="text-3xl lg:text-4xl font-bold mb-4">
            <span className="bg-gradient-to-r from-gray-100 to-gray-300 bg-clip-text text-transparent">
              Built for Real Parking Problems
            </span>
                    </h2>

                    <p className="text-gray-400 mb-12">
                        Not just a UI — a complete parking management system
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    <FeatureCard
                        icon={<MapPin className="w-8 h-8 text-blue-400" />}
                        title="Live Spot Tracking"
                        description="Instantly see which parking spots are free or occupied."
                        delay={0}
                    />

                    <FeatureCard
                        icon={<CreditCard className="w-8 h-8 text-green-400" />}
                        title="Online Payments"
                        description="Pay securely and track your parking sessions."
                        delay={100}
                    />

                    <FeatureCard
                        icon={<Shield className="w-8 h-8 text-purple-400" />}
                        title="Admin Control"
                        description="Admins can manage users, pricing, and system activity."
                        delay={200}
                    />
                </div>

            </div>
        </section>
    );
}