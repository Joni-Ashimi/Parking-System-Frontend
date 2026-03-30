type StepProps = {
    delay?: number;
    number: string;
    title: string;
    description: string;
};

export default function Step({delay, number, title, description} : StepProps) {
    return (
        <div
            className="group animate-fade-in-up"
            style={{animationDelay: `${delay}ms`}}
        >
            <div
                className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 font-bold text-lg group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-blue-500/25">
                {number}
            </div>
            <h3 className="font-semibold mb-2 text-gray-200">{title}</h3>
            <p className="text-gray-400 text-sm">{description}</p>
        </div>

    )
}