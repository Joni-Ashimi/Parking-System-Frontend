"use client";

import React from "react";
import {ChevronLeft, ChevronRight} from "lucide-react";

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    pageSize: number;
    onPageChange: (page: number) => void;
}

export default function Pagination({
                                       currentPage,
                                       totalPages,
                                       totalItems,
                                       pageSize,
                                       onPageChange,
                                   }: PaginationProps) {
    if (totalPages <= 1) return null;

    const getPageNumbers = () => {
        const pages: number[] = [];
        const maxVisiblePages = 3;
        let startPage = Math.max(1, currentPage - 1);
        let endPage = Math.min(totalPages, currentPage + 1);

        // Adjust boundaries if hitting thresholds
        if (currentPage === 1) {
            endPage = Math.min(totalPages, maxVisiblePages);
        } else if (currentPage === totalPages) {
            startPage = Math.max(1, totalPages - maxVisiblePages + 1);
        }

        for (let i = startPage; i <= endPage; i++) {
            pages.push(i);
        }
        return pages;
    };

    return (
        <div
            className="flex items-center justify-between border-t border-gray-200 bg-white px-6 py-4 rounded-2xl shadow-sm mt-8">
            <div className="flex flex-1 justify-between sm:hidden">
                <button
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center rounded-xl border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 transition-colors"
                >
                    Previous
                </button>
                <button
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="relative ml-3 inline-flex items-center rounded-xl border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 transition-colors"
                >
                    Next
                </button>
            </div>

            <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                <div>
                    <p className="text-sm text-gray-700">
                        Showing page <span className="font-semibold">{currentPage}</span> of{" "}
                        <span className="font-semibold">{totalPages}</span> pages ({totalItems} total spots)
                    </p>
                </div>
                <div>
                    <nav className="isolate inline-flex -space-x-px rounded-xl gap-1.5" aria-label="Pagination">
                        <button
                            onClick={() => onPageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                            className="relative inline-flex items-center rounded-xl p-2 text-gray-400 hover:bg-gray-100 focus:z-20 disabled:opacity-40 transition-colors"
                        >
                            <ChevronLeft size={20}/>
                        </button>

                        {getPageNumbers().map((pageNum) => (
                            <button
                                key={pageNum}
                                onClick={() => onPageChange(pageNum)}
                                className={`relative inline-flex items-center px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                                    currentPage === pageNum
                                        ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-sm"
                                        : "text-gray-900 hover:bg-gray-100"
                                }`}
                            >
                                {pageNum}
                            </button>
                        ))}

                        <button
                            onClick={() => onPageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className="relative inline-flex items-center rounded-xl p-2 text-gray-400 hover:bg-gray-100 focus:z-20 disabled:opacity-40 transition-colors"
                        >
                            <ChevronRight size={20}/>
                        </button>
                    </nav>
                </div>
            </div>
        </div>
    );
}