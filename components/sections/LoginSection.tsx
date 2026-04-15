import LoginForm from "@/components/UI/Login";

export default function LoginSection() {
    return (
        <section className="py-20 relative overflow-hidden min-h-[80vh] flex items-center">
            {/* Background Decorative Glows */}
            <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500 rounded-full blur-3xl opacity-10 animate-pulse"></div>
            <div className="absolute bottom-20 right-10 w-72 h-72 bg-purple-500 rounded-full blur-3xl opacity-10 animate-pulse"></div>

            <div className="max-w-7xl mx-auto px-6 text-center w-full flex flex-col items-center">

                <div className="animate-fade-in-up mb-10">
                    <h2 className="text-3xl lg:text-4xl font-bold mb-4">
                        <span className="bg-gradient-to-r from-gray-100 to-gray-300 bg-clip-text text-transparent">
                            Welcome Back
                        </span>
                    </h2>
                    <p className="text-gray-400">
                        Access your parking dashboard and manage your spots.
                    </p>
                </div>

                {/* Rendering the "Brick" with a slight delay */}
                <LoginForm delay={150} />

            </div>
        </section>
    );
}