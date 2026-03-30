type FeatureCardProps = {
    icon: React.ReactNode;
    title: string;
    description: string;
    delay?: number;
};

export default function FeatureCard({
                                        icon,
                                        title,
                                        description,
                                        delay = 0,
                                    }: FeatureCardProps) {
    return (
        <div
            className="group p-6 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 hover:border-blue-500/50 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-blue-500/10 animate-fade-in-up"
            style={{ animationDelay: `${delay}ms` }}
        >
            <div className="mb-4 flex justify-center transform group-hover:scale-110 transition-transform duration-300">
                {icon}
            </div>

            <h3 className="text-xl font-semibold mb-2 text-gray-200">
                {title}
            </h3>

            <p className="text-gray-400">
                {description}
            </p>
        </div>
    );
}