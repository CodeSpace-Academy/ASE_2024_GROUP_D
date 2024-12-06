'use client'

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

export default function Pagination({ currentPage, totalPages }) {
    // Initialize 'page' state with the current page value passed as a prop
    const [page, setPage] = useState(currentPage);

    // Get the Next.js router instance to navigate programmatically
    const router = useRouter();
    // Retrieve current search parameters from the URL
    const searchParams = useSearchParams();

    useEffect(() => {
        // Update the page with the currentPage value in order to fix the issue of Navigating back to home page and the page number not changing.
        setPage(currentPage)
    }, [currentPage]);


    // Function to handle page changes
    const onPageChange = (newPage) => {
        // Ensure the new page number is within the valid range
        if (newPage >= 1 && newPage <= totalPages) {
            setPage(newPage); // Update the page state

            // Convert the current URL search parameters to an object
            const currentQuery = Object.fromEntries(searchParams.entries());

            // Update the query object with the new page number
            const newQuery = {
                ...currentQuery,
                page: newPage,
            };

            // Create a query string from the updated query object
            const currentQueryString = new URLSearchParams(newQuery).toString();

            // Push the new query string to the URL (causing the page to reload with new params)
            router.push(`?${currentQueryString}`);
        }
    };

    // Function to render the page numbers with navigation controls
    const renderPageNumbers = () => {
        const pageNumbers = []; // Array to store rendered page buttons
        const maxPagesToShow = 5; // Maximum number of pages to show in the pagination component

        // Always render the first page button if the current page is greater than 1
        if (page > 1) {
            pageNumbers.push(
                <button
                    key={1}
                    // Navigate to the first page
                    onClick={() => onPageChange(1)}
                    className={`items-center justify-center w-8 h-8 text-sm  shadow-md ${page === 1
                        ? "bg-white text-[#020123] font-semibold" // Active page styling
                        : "bg-white text-[#020123] border-[#fc9d4f] hover:bg-[#edd282]" // Default button styling
                        }`}
                >
                    
                </button>
            );
        }

        // Show ellipsis if there are pages between the first page and the visible page window
        if (page > maxPagesToShow) {
            pageNumbers.push(<span key="dots-start" className="px-2">...</span>);
        }

        // Render a few pages around the current page (for context)
        for (
            let i = Math.max(2, page - 2); // Start rendering from the second page or (current page - 2)
            i <= Math.min(totalPages - 1, page + 2); // End rendering at (current page + 2) or second last page
            i++
        ) {
            pageNumbers.push(
                <button
                    key={i}
                    onClick={() => onPageChange(i)} // Navigate to the clicked page
                    className={`items-center justify-center w-8 h-8 text-sm   shadow-md ${page === i
                        ? "bg-[#edd282] text-[#020123] font-semibold" // Active page styling
                        : "bg-[#fc8f36] text-[#020123] border-[#ff4f1a] hover:bg-[#edd282]" // Default button styling
                        }`}
                >
                    {i}
                </button>
            );
        }

        // Show ellipsis if there are pages between the current window and the last page
        if (page < totalPages - maxPagesToShow) {
            pageNumbers.push(<span key="dots-end" className="px-2">...</span>);
        }

        // Always render the last page button if the current page is not the last
        if (page < totalPages) {
            pageNumbers.push(
                <button
                    key={totalPages}
                    onClick={() => onPageChange(totalPages)} // Navigate to the last page
                    className={`items-center justify-center w-8 h-8 text-sm  shadow-md ${page === totalPages
                        ? "bg-white text-[#020123] font-semibold" // Active page styling
                        : "bg-white text-[#020123] border-[#ff4f1a] hover:bg-[#edd282]" // Default button styling
                        }`}
                >
                    {totalPages}
                </button>
            );
        }

        return pageNumbers; // Return the rendered page buttons
    };

    return (
        <div className="flex justify-center items-center space-x-2 py-4">
            {/* Previous page button */}
            <button
                title="previous"
                type="button"
                disabled={page === 1} // Disable if on the first page
                onClick={() => onPageChange(page - 1)} // Navigate to the previous page
                className={`inline-flex items-center justify-center w-8 h-8  shadow-md ${page === 1
                    ? "bg-gray-200 text-gray-400 cursor-not-allowed" // Disabled button styling
                    : "bg-white text-[#020123] border-[#ff4f1a] hover:bg-[#edd282]" // Enabled button styling
                    }`}
            >
                {/* Icon for previous arrow */}
                <svg
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="w-4"
                >
                    <polyline points="15 18 9 12 15 6"></polyline>
                </svg>
            </button>

            {/* Render the page numbers */}
            {renderPageNumbers()}

            {/* Next page button */}
            <button
                title="next"
                type="button"
                disabled={page === totalPages} // Disable if on the last page
                onClick={() => onPageChange(page + 1)} // Navigate to the next page
                className={`inline-flex items-center justify-center w-8 h-8  shadow-md ${page === totalPages
                    ? "bg-gray-200 text-gray-400 cursor-not-allowed" // Disabled button styling
                    : "bg-white text-[#020123] border-[#ff4f1a] hover:bg-[#edd282]" // Enabled button styling
                    }`}
            >
                {/* Icon for next arrow */}
                <svg
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="w-4"
                >
                    <polyline points="9 18 15 12 9 6"></polyline>
                </svg>
            </button>
        </div>
    );
}