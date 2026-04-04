import {LucideIcon} from "lucide-react";

type ColorType = "blue" | "green" | "purple" | "orange";
const colors: Record<ColorType, string> = {
    blue: "bg-blue-50 text-blue-600",
    green: "bg-green-50 text-green-600",
    purple: "bg-purple-50 text-purple-600",
    orange: "bg-orange-50 text-orange-600",
};

type StatsProps = {
    label: string;
    value: string;
    change: string;
    icon: LucideIcon;
    color: ColorType;
};


export default function Stats({
                                  label,
                                  value,
                                  change,
                                  icon: Icon,
                                  color,
                              }: StatsProps) {
    return (
        <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start">
                <div>
                    <p className="text-sm text-gray-500 mb-1">{label}</p>
                    <p className="text-2xl font-semibold text-gray-800">{value}</p>
                    <p className="text-xs text-green-600 mt-2">
                        {change} from yesterday
                    </p>
                </div>

                <div className={`p-3 rounded-lg ${colors[color]}`}>
                    <Icon size={20}/>
                </div>
            </div>
        </div>
    );
}