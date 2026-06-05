"use client";

import { useEffect, useState } from "react";

export default function POKWrapper({ children }: { children: React.ReactNode }) {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) return <div className="animate-pulse">Loading secure payment gate...</div>;

    return <>{children}</>;
}