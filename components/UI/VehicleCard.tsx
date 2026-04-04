type Props = {
    icon : React.ReactNode;
    title: string;
    highlight?: boolean;
    price: string;
    delay?: number;
}

export default function VehicleCard({ icon, title, highlight = false, price, delay} : Props) {
    return (
        <div
            className={`group p-6 rounded-2xl bg-white/5 backdrop-blur-sm border transition-all duration-300 hover:scale-105 hover:shadow-xl animate-fade-in-up ${
                highlight
                    ? "border-blue-500 shadow-lg shadow-blue-500/20 bg-gradient-to-br from-blue-500/10 to-purple-500/10"
                    : "border-white/10 hover:border-blue-500/50"
            }`}
            style={{animationDelay: `${delay ?? 0}ms`}}
        >
            <div
                className="w-16 h-16 mx-auto mb-4 flex items-center justify-center bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full group-hover:scale-110 transition-transform duration-300">
                <div className="text-blue-400">
                    {icon}
                </div>
            </div>
            <h3 className="text-lg font-semibold text-gray-200 mb-2">{title}</h3>
            <p className="text-sm text-blue-400 font-medium">{price}</p>
        </div>

    )
}