import Step from "@/components/UI/Step";

export default function StepsSection() {
    return (
        <section className="py-15">
            <div className="max-w-5xl mx-auto px-6 text-center">

                <div className="animate-fade-in-up">
                    <h2 className="text-3xl font-bold mb-12">
            <span className="bg-gradient-to-r from-gray-100 to-gray-300 bg-clip-text text-transparent">
              How Prometrix Works
            </span>
                    </h2>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    <Step
                        number="1"
                        title="Check Availability"
                        description="Find free spots instantly with real-time updates."
                        delay={0}
                    />

                    <Step
                        number="2"
                        title="Park Vehicle"
                        description="System tracks your session automatically."
                        delay={100}
                    />

                    <Step
                        number="3"
                        title="Pay Online"
                        description="Quick and secure checkout with multiple options."
                        delay={200}
                    />
                </div>

            </div>
        </section>
    );
}