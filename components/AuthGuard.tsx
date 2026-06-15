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
            const isUserRoute = pathname.startsWith("/user");
            const isGuestRoute = pathname.startsWith("/login") || pathname.startsWith("/register");

            if (!accessToken || !user) {
                if (!isGuestRoute) {
                    setIsAuthorized(false);
                    router.replace("/login");
                    return;
                }
                setIsAuthorized(true);
                return;
            }

            const userRole = user.type?.toString().toLowerCase();
            const isAdmin = userRole === "admin";

            if (isAdminRoute && !isAdmin) {
                setIsAuthorized(false);
                router.replace("/user/dashboard");
                return;
            }

            if (isUserRoute && isAdmin) {
                setIsAuthorized(false);
                router.replace("/admin/dashboard");
                return;
            }

            setIsAuthorized(true);
        };

        checkAuthorization();
    }, [user, accessToken, pathname, router, isHydrated]);

    if (!isHydrated || !isAuthorized) {
        return (
            <div className="flex h-screen w-screen items-center justify-center bg-gray-50">
                <p className="text-gray-500 font-medium">Checking authorization...</p>
            </div>
        );
    }

    return <>{children}</>;
}