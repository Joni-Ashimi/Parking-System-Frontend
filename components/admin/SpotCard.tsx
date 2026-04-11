import {Check, Car, Wrench, Edit, Trash2, Bike, DollarSign, Clock, Truck} from "lucide-react";
import {ParkingSpot} from "@/app/admin/parkingSpots/page";

interface SpotCardProps {
    spot: ParkingSpot;
    onEdit: (spot: ParkingSpot) => void;
    onDelete: (id: string) => void;
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
        gradient: "from-blue-400 to-indigo-500",
        bg: "bg-gradient-to-br from-blue-50 to-indigo-50",
        border: "border-blue-200",
        text: "text-blue-700",
        badge: "bg-blue-100 text-blue-800 border-blue-200",
        shadow: "hover:shadow-blue-100",
    },
    maintenance: {
        label: "Maintenance",
        icon: Wrench,
        gradient: "from-amber-400 to-orange-500",
        bg: "bg-gradient-to-br from-amber-50 to-orange-50",
        border: "border-orange-200",
        text: "text-orange-700",
        badge: "bg-orange-100 text-orange-800 border-orange-200",
        shadow: "hover:shadow-orange-100",
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
    const SizeIcon = sizeIcons[spot.size];
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
                            onClick={() => onDelete(spot.id)}
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
                            <span className="font-medium text-gray-700 capitalize">{spot.size}</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <div
                            className="flex items-center gap-1.5 bg-white/60 backdrop-blur-sm px-2.5 py-1 rounded-lg shadow-sm">
                            <DollarSign size={16} className="text-emerald-600"/>
                            <span className="font-semibold text-gray-800">
                ${spot.pricePerHour.toFixed(2)}
              </span>
                            <span className="text-xs text-gray-500">/ hour</span>
                        </div>
                    </div>
                </div>

                {spot.status === "occupied" && (
                    <div
                        className="mt-4 pt-3 border-t border-gray-200/60 flex items-center gap-2 text-xs text-gray-600">
                        <Clock size={12}/>
                        <span>Occupied since 10:30 AM</span>
                    </div>
                )}
            </div>
        </div>
    );
}
