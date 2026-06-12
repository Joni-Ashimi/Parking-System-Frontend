import type {Metadata} from 'next';
import './globals.css';
import Providers from '@/store/Providers';
import {ToastContainer} from 'react-toastify';
import {Footer} from "antd/es/layout/layout";
import AuthGuard from "@/components/AuthGuard";
import GlobalChat from "@/components/GlobalChat";

export const metadata: Metadata = {
    title: "Prometrix App",
    description: "A web application for managing parking spots",
};

export default function RootLayout({children}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" style={{ colorScheme: 'light' }}>
        <body className="flex flex-col min-h-screen">
        <Providers>
            <AuthGuard>
                <main className="flex-grow">{children}</main>
            </AuthGuard>
            <GlobalChat/>
            <Footer/>
            <ToastContainer/>
        </Providers>
        </body>
        </html>
    );
}