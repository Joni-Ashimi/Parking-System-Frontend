type ColorType = "blue" | "green" | "orange";

type SpotsDistributionProps = {
    icon: React.ReactNode;
    type: string;
    occupied: number;
    total: number;
    color: ColorType;
};

const colors: Record<ColorType, string> = {
    blue: "bg-blue-600",
    green: "bg-green-600",
    orange: "bg-orange-600",
};

export default function SpotsDistribution({
                                              icon,
                                              type,
                                              occupied,
                                              total,
                                              color,
                                          }: SpotsDistributionProps) {
    const percentage = (occupied / total) * 100;


    return (
        <div>
            <div className="flex justify-between items-center mb-2">
                <div className="flex items-center gap-2">
                    <div className="text-gray-600">{icon}</div>
                    <span className="text-sm font-medium text-gray-700">{type}</span>
                </div>
                <span className="text-sm text-gray-500">
          {occupied}/{total} occupied
        </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                    className={` h-2 rounded-full transition-all ${colors[color]}`}
                    style={{width: `${percentage}%`}}
                />
            </div>
        </div>

    )
}