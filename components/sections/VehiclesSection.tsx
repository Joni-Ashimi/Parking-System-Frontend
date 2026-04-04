"use client";

import {useState} from "react";
import {Bike, Car, Truck} from "lucide-react";
import VehicleCard from "@/components/UI/VehicleCard";

export default function VehiclesSection() {
    const [selected, setSelected] = useState<string | null>("Car");

    return (
        <section className="py-20 bg-gradient-to-br from-slate-900 via-slate-800 to-gray-900">
            <div className="max-w-7xl mx-auto px-6 text-center">
                <h2 className="text-3xl font-bold mb-12">
            <span className="bg-gradient-to-r from-gray-100 to-gray-300 bg-clip-text text-transparent">
              Supports Every Vehicle Type
            </span>
                </h2>


                <div className="grid md:grid-cols-3 gap-8">

                    <div onClick={() => setSelected("Bike")}>
                        <VehicleCard
                            icon={<Bike className="w-8 h-8"/>}
                            title="Motorcycles"
                            price="$2/hour"
                            highlight={selected === "Bike"}
                        />
                    </div>

                    <div onClick={() => setSelected("Car")}>
                        <VehicleCard
                            icon={<Car className="w-8 h-8"/>}
                            title="Cars"
                            price="$5/hour"
                            highlight={selected === "Car"}
                        />
                    </div>

                    <div onClick={() => setSelected("Truck")}>
                        <VehicleCard
                            icon={<Truck className="w-8 h-8"/>}
                            title="Trucks & Vans"
                            price="$10/hour"
                            highlight={selected === "Truck"}
                        />
                    </div>

                </div>

            </div>
        </section>
    );
}