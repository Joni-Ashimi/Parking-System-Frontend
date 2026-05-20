"use client";
import {useEffect, useState} from "react";
import {usePathname, useRouter} from "next/navigation";
import {useSelector} from "react-redux";
import {RootState} from "@/store/store";

export default function AuthGuard({children}: { children: React.ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();

    const {user, accessToken} = useSelector((state: RootState) => state.auth);
    const isHydrated = useSelector((state: any) => state._persist?.rehydrated ?? false);
    const [isAuthorized, setIsAuthorized] = useState(false);

    useEffect(() => {
        if (!isHydrated) return;

        const checkAuthorization = () => {
            const isAdminRoute = pathname.startsWith("/admin");
            const isGuestRoute = pathname.startsWith("/login") || pathname.startsWith("/register");

            // 1. Not logged in -> kick out of private pages
            if (!accessToken || !user) {
                if (!isGuestRoute) {
                    setIsAuthorized(false); // Instantly hide layout content
                    router.replace("/login");
                    return;
                }
                setIsAuthorized(true);
                return;
            }

            // Standardize string comparison to catch any case mismatch issues ('Admin' vs 'admin')
            const userRole = user.type?.toString().toLowerCase();
            const isAdmin = userRole === "admin";
            console.log('isAdmin: ', isAdmin);

            // 2. Logged in as non-admin, trying to access an admin route
            if (isAdminRoute && !isAdmin) {
                setIsAuthorized(false); // Hard lockdown of the screen elements
                router.replace("/user/dashboard");
                return;
            }
            setIsAuthorized(true);
        };

        checkAuthorization();
    }, [user, accessToken, pathname, router, isHydrated]);

    // Force blank loading screen if hydration isn't ready or if user authorization fails
    if (!isHydrated || !isAuthorized) {
        return (
            <div className="flex h-screen w-screen items-center justify-center bg-gray-50">
                <p className="text-gray-500 font-medium">Checking authorization...</p>
            </div>
        );
    }

    return <>{children}</>;
}