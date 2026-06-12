import {Bike, Car, Check, DollarSign, Edit, ShieldAlert, Trash2, Truck, Wrench} from "lucide-react";
import {ParkingSpot} from "@/app/admin/parkingSpots/page";

interface SpotCardProps {
    spot: ParkingSpot;
    onEdit: (spot: ParkingSpot) => void;
    onDelete: (spot: ParkingSpot) => void;
    onToggleMaintenance: (id: string) => void;
}

const statusConfig = {
    available: {
        label: "Available",
        icon: Check,
        gradient: "from-emerald-400 to-green-500",
        bg: "bg-gradient-to-br from-emerald-50 to-green-50",
        border: "border-emerald-200",
        text: "text-emerald-700",
        badge: "bg-emerald-100 text-emerald-800 border-emerald-200",
        shadow: "hover:shadow-emerald-100",
    },
    occupied: {
        label: "Occupied",
        icon: Car,
        gradient: "from-red-400 to-rose-500",
        bg: "bg-gradient-to-br from-red-50 to-rose-50",
        border: "border-red-200",
        text: "text-red-700",
        badge: "bg-red-100 text-red-800 border-red-200",
        shadow: "hover:shadow-red-100",
    },
    maintenance: {
        label: "Maintenance",
        icon: Wrench,
        gradient: "from-orange-500 to-amber-600",
        bg: "bg-gradient-to-br from-orange-50 to-amber-50",
        border: "border-orange-300",
        text: "text-orange-800",
        badge: "bg-orange-100 text-orange-900 border-orange-300",
        shadow: "hover:shadow-orange-200",
    },
    reserved: {
        label: "Reserved",
        icon: ShieldAlert,
        gradient: "from-purple-400 to-fuchsia-500",
        bg: "bg-gradient-to-br from-purple-50 to-fuchsia-50",
        border: "border-purple-200",
        text: "text-purple-700",
        badge: "bg-purple-100 text-purple-800 border-purple-200",
        shadow: "hover:shadow-purple-100",
    },
};

export default function SpotCard({spot, onEdit, onDelete, onToggleMaintenance}: SpotCardProps) {
    const config = statusConfig[spot.status];
    const StatusIcon = config.icon;

    const sizeIcons = {
        small: Bike,
        medium: Car,
        large: Truck,
    };
    const spotSize = spot?.type?.size?.toLowerCase() as keyof typeof sizeIcons || "medium";
    const SizeIcon = sizeIcons[spotSize] || Car;
    const hourlyRate = Number(spot?.type?.effectiveHourlyRate || 0);
    return (
        <div
            className={`
        group relative overflow-hidden rounded-2xl border-2 transition-all duration-300
        ${config.bg} ${config.border} ${config.shadow}
        hover:scale-[1.02] hover:shadow-xl
      `}
        >
            <div className={`h-1.5 w-full bg-gradient-to-r ${config.gradient}`}/>

            <div className="p-5">
                <div className="flex items-start justify-between mb-3">
                    <div>
                        <h3 className="text-2xl font-bold tracking-tight text-gray-800">
                            {spot.spotNumber}
                        </h3>
                        <div className="mt-1.5">
              <span
                  className={`
                  inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold
                  border ${config.badge} shadow-sm
                `}
              >
                <StatusIcon size={12}/>
                  {config.label}
              </span>
                        </div>
                    </div>

                    <div
                        className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <button
                            onClick={() => onToggleMaintenance(spot.id)}
                            className="p-2 text-gray-500 hover:text-orange-600 hover:bg-orange-100 rounded-xl transition-all duration-200 hover:scale-110"
                            title="Toggle maintenance"
                        >
                            <Wrench size={16}/>
                        </button>
                        <button
                            onClick={() => onEdit(spot)}
                            className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-100 rounded-xl transition-all duration-200 hover:scale-110"
                            title="Edit spot"
                        >
                            <Edit size={16}/>
                        </button>
                        <button
                            onClick={() => onDelete(spot)}
                            className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-100 rounded-xl transition-all duration-200 hover:scale-110"
                            title="Delete spot"
                        >
                            <Trash2 size={16}/>
                        </button>
                    </div>
                </div>

                <div className="space-y-2.5">
                    <div className="flex items-center gap-3 text-sm">
                        <div
                            className="flex items-center gap-1.5 bg-white/60 backdrop-blur-sm px-2.5 py-1 rounded-lg shadow-sm">
                            <SizeIcon size={16} className="text-gray-600"/>
                            <span className="font-medium text-gray-700 capitalize">
                                {spot.type?.size || 'Standard'}
                            </span>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-3">
                            <div
                                className="flex items-center gap-1.5 bg-white/60 backdrop-blur-sm px-2.5 py-1 rounded-lg shadow-sm">
                                <DollarSign size={16} className="text-emerald-600"/>
                                <span className="font-semibold text-gray-800">${hourlyRate.toFixed(2)}</span>
                                <span className="text-xs text-gray-500">/ hour</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
