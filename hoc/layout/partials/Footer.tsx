import Link from 'next/link';
import { FaFacebook, FaGavel, FaInstagram, FaTwitter } from 'react-icons/fa';
import GradientButton from "@/components/core/buttons/GradientButton";

export default function Footer() {
    return (
        <footer className="bg-gray-900 text-white pt-8 md:pt-10 pb-6 w-full overflow-hidden">
            <div className="w-full max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
                    {/* Brand & Social */}
                    <div className="sm:col-span-2 lg:col-span-1">
                        <Link href="/" className="flex items-center space-x-2 mb-4">
                            <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-blue-500 rounded-lg flex items-center justify-center">
                                <FaGavel className="text-white text-lg" />
                            </div>
                            <span className="text-xl font-bold">Auction</span>
                        </Link>
                        <p className="text-gray-400 mb-4 text-sm md:text-base">
                            The premier online auction platform for unique items and collectibles.
                        </p>
                        <div className="flex space-x-4">
                            <a href="#" className="text-gray-400 hover:text-white" aria-label="Facebook">
                                <FaFacebook className="text-lg md:text-xl" />
                            </a>
                            <a href="#" className="text-gray-400 hover:text-white" aria-label="Twitter">
                                <FaTwitter className="text-lg md:text-xl" />
                            </a>
                            <a href="#" className="text-gray-400 hover:text-white" aria-label="Instagram">
                                <FaInstagram className="text-lg md:text-xl" />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-base md:text-lg font-semibold mb-3 md:mb-4">Quick Links</h3>
                        <ul className="space-y-2">
                            <li>
                                <Link
                                    href="/auctions?status=active"
                                    className="text-gray-400 hover:text-white text-sm md:text-base">
                                    Live Auctions
                                </Link>
                            </li>
                            <li>
                                <Link href="/sell" className="text-gray-400 hover:text-white text-sm md:text-base">
                                    Sell an Item
                                </Link>
                            </li>
                            <li>
                                <Link href="/about" className="text-gray-400 hover:text-white text-sm md:text-base">
                                    About Us
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Support */}
                    <div>
                        <h3 className="text-base md:text-lg font-semibold mb-3 md:mb-4">Support</h3>
                        <ul className="space-y-2">
                            <li>
                                <Link href="" className="text-gray-400 hover:text-white text-sm md:text-base">
                                    Help Center
                                </Link>
                            </li>
                            <li>
                                <Link href="" className="text-gray-400 hover:text-white text-sm md:text-base">
                                    FAQ
                                </Link>
                            </li>
                            <li>
                                <Link href="" className="text-gray-400 hover:text-white text-sm md:text-base">
                                    Contact Us
                                </Link>
                            </li>
                            <li>
                                <Link href="" className="text-gray-400 hover:text-white text-sm md:text-base">
                                    Terms of Service
                                </Link>
                            </li>
                        </ul>
                    </div>

                    <div className="sm:col-span-2 lg:col-span-1">
                        <h3 className="text-base md:text-lg font-semibold mb-3 md:mb-4">Newsletter</h3>
                        <p className="text-gray-400 mb-4 text-sm md:text-base">
                            Subscribe to get updates on new auctions and featured items.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-2">
                            <input
                                type="email"
                                placeholder="Your email"
                                className="bg-gray-800 text-white py-2 px-4 rounded-lg sm:rounded-l-lg sm:rounded-r-none focus:outline-none focus:ring-2 focus:ring-purple-500 w-full text-sm md:text-base"
                            />
                            <GradientButton
                                type="submit"
                                label="Subscribe"
                                className="w-full sm:w-auto rounded-lg sm:rounded-r-lg sm:rounded-l-none py-2 text-sm md:text-base"
                            />
                        </div>
                    </div>
                </div>

                {/* Copyright */}
                <div className="border-t border-gray-800 mt-6 md:mt-8 pt-4 md:pt-6 text-center text-gray-400 text-sm md:text-base">
                    <p>© {new Date().getFullYear()} Auctio. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
}