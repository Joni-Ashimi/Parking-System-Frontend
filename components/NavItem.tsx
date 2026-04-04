"use client";

import { useRouter, usePathname } from "next/navigation";

type NavItemProps = {
    icon: React.ReactNode;
    label: string;
    href: string;
    isOpen: boolean;
};

export default function NavItem({ icon, label, href, isOpen }: NavItemProps) {
    const router = useRouter();
    const pathname = usePathname();

    const isActive = pathname === href;

    return (
        <div className="relative group">
            <button
                onClick={() => router.push(href)}
                className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg transition-all ${
                    isActive
                        ? "bg-blue-50 text-blue-600"
                        : "text-gray-600 hover:bg-gray-50"
                }`}
            >
                {icon}

                <span
                    className={`text-sm font-medium transition-all duration-300 overflow-hidden whitespace-nowrap ${
                        isOpen ? "opacity-100 max-w-[200px]" : "opacity-0 max-w-0"
                    }`}
                >
                    {label}
                </span>
            </button>

            {/* Tooltip when collapsed */}
            {!isOpen && (
                <span className="absolute left-full ml-2 top-1/2 -translate-y-1/2 px-2 py-1 text-xs bg-gray-800 text-white rounded opacity-0 group-hover:opacity-100 transition pointer-events-none whitespace-nowrap">
                    {label}
                </span>
            )}
        </div>
    );
}