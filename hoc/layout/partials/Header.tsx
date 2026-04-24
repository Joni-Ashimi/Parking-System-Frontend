'use client';
import Link from 'next/link';
import { FaSearch, FaGavel, FaUser } from 'react-icons/fa';
import { usePathname, useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { logOut } from '@/store/auth/authSlice';
import { showLoader } from '@/store/loadingSlice';
import GradientButton from "@/components/core/buttons/GradientButton";

export default function Header() {
    const router = useRouter();
    const pathname = usePathname();
    const dispatch = useDispatch();
    const user = useSelector((state: RootState) => state.auth.user);
    const accessToken = useSelector((state: RootState) => state.auth.accessToken);
    const isLoggedIn = !!accessToken && !!user;

    const handleLogOut = () => {
        dispatch(logOut());
        router.push('/');
    };

    const handleLoginClick = async (e: React.MouseEvent) => {
        e.preventDefault();
        if (pathname !== "/login") {
            dispatch(showLoader("Loading Login Page..."));
            router.push("/login")}
    };

    const handleSignUpClick = async (e: React.MouseEvent) => {
        e.preventDefault();
        if (pathname !== "/register") {
            dispatch(showLoader("Loading Signup Page..."));
            router.push("/register")
        }
    }

    const getAuctionsClick = async (e: React.MouseEvent) => {
        e.preventDefault();
        if (pathname !== "/auctions") {
            dispatch(showLoader("Loading Auctions Page..."));
            router.push("/auctions")
        }
    }

    const sellClick = async (e: React.MouseEvent) => {
        e.preventDefault();
        if (pathname !== "/sell") {
            dispatch(showLoader("Loading Sell Page..."));
            router.push("/sell")
        }
    }

    return (
        <header className="bg-white shadow-md">
            <div className="container mx-auto px-4 py-3">
                <div className="flex items-center justify-between">
                    <Link href="/" className="flex items-center space-x-2">
                        <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-blue-500 rounded-lg flex items-center justify-center">
                            <FaGavel className="text-white text-lg" />
                        </div>
                        <span className="text-xl font-bold text-gray-800">Auction</span>
                    </Link>

                    <nav className="hidden md:flex space-x-6">
                        <Link href="/auctions" className="text-gray-600 hover:text-purple-600 font-medium" onClick={getAuctionsClick}>
                            Auctions
                        </Link>
                        <Link href="/sell" className="text-gray-600 hover:text-purple-600 font-medium" onClick={sellClick}>
                            Sell
                        </Link>
                    </nav>



                    <div className="flex items-center space-x-4">
                        {!isLoggedIn ? (
                            <>
                                <Link
                                    href="#"
                                    onClick={handleSignUpClick}
                                    className="bg-gradient-to-r from-purple-600 to-blue-500 text-white px-4 py-2 rounded-lg font-medium flex items-center space-x-2">
                                    <FaUser className="text-sm" />
                                    <span>Sign Up</span>
                                </Link>

                                <Link
                                    href="#"
                                    onClick={handleLoginClick}
                                    className="bg-gradient-to-r from-purple-600 to-blue-500 text-white px-4 py-2 rounded-lg font-medium flex items-center space-x-2"
                                >
                                    <FaUser className="text-sm" />
                                    <span>Log In</span>
                                </Link>

                            </>
                        ) : (
                            <GradientButton
                                onClick={handleLogOut}
                                fromColor="from-purple-600"
                                toColor="to-blue-500"
                                hoverFromColor="hover:from-purple-700"
                                hoverToColor="hover:to-blue-600"
                                className="text-white px-4 py-2 rounded-lg font-medium flex items-center space-x-2"
                                label={
                                    <span className="flex items-center space-x-2">
                    <FaUser className="text-sm" />
                    <span>Log Out</span>
                  </span>
                                }
                            />
                        )}
                    </div>
                </div>

                <div className="mt-4 md:hidden">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search auctions..."
                            className="w-full py-2 px-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                        <FaSearch className="absolute right-3 top-3 text-gray-400" />
                    </div>
                </div>
            </div>
        </header>
    );
}