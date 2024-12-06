import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export const SortControl = () => {
    const router = useRouter();
    const searchParams = useSearchParams();

    const sortValue = searchParams.get("sort") || "";
    const orderValue = searchParams.get("order") || "desc";

    const sortOptions = [
        { value: "", label: "Default" },
        { value: "published", label: "Newest" },
        { value: "prep", label: "Preparation Time" },
        { value: "cook", label: "Cooking Time" },
        { value: "instructions", label: "Instructions" },
    ];

    const orderOptions = [
        { value: "asc", label: "Ascending" },
        { value: "desc", label: "Descending" },
    ];

    const [openDropdown, setOpenDropdown] = useState(null);
    const [isMobileDropdownOpen, setIsMobileDropdownOpen] = useState(false);
    const [selectedSortOption, setSelectedSortOption] = useState(null);

    const handleSortChange = (newSortValue) => {
        const params = new URLSearchParams(searchParams);

        if (newSortValue === "") {
            params.delete("sort");
            params.delete("order");
        } else {
            params.set("sort", newSortValue);
            if (!params.has("order")) {
                params.set("order", "desc");
            }
            setOpenDropdown((prev) => (prev === newSortValue ? null : newSortValue));
        }

        params.set("page", "1");
        router.push(`?${params.toString()}`, { scroll: false });
    };

    const handleOrderChange = (newOrderValue) => {
        const params = new URLSearchParams(searchParams);

        params.set("sort", sortValue);
        params.set("order", newOrderValue);
        params.set("page", "1");

        router.push(`?${params.toString()}`, { scroll: false });

        setOpenDropdown(null); // Close the dropdown after selecting the order
        setIsMobileDropdownOpen(false); // Close the mobile dropdown after selection
    };

    const toggleMobileDropdown = () => {
        setIsMobileDropdownOpen((prev) => !prev);
    };

    const handleMobileSortChange = (newSortValue) => {
        setSelectedSortOption(newSortValue);
        handleSortChange(newSortValue);
        setIsMobileDropdownOpen(false); // Close mobile dropdown after selecting sort option
    };

    return (
        <div className="flex flex-wrap gap-4 items-center mb-6 p-4 bg-white rounded-lg shadow dark:bg-gray-950">
            {/* Desktop View: Sort options as buttons */}
            <div className="hidden sm:flex gap-4">
                {sortOptions.map((option) => (
                    <div key={option.value} className="relative">
                        <button
                            onClick={() => handleSortChange(option.value)}
                            className={`py-2 px-4 rounded-md text-sm ${
                                sortValue === option.value
                                    ? "bg-[#FCFDE2] text-[#FC9D4F]"
                                    : "bg-[#FCFDE2] text-[#FC9D4F] dark:bg-gray-800 dark:text-[#FC9D4F]"
                            } hover:bg-[#FCFDE2] hover:text-[#FF4F1A]`}
                        >
                            {option.label}
                        </button>

                        {openDropdown === option.value && option.value !== "" && (
                            <div className="absolute top-full left-0 mt-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded shadow-md z-10 max-h-32 overflow-y-auto">
                                {orderOptions.map((orderOption) => (
                                    <button
                                        key={orderOption.value}
                                        onClick={() => handleOrderChange(orderOption.value)}
                                        className={`py-2 px-4 text-sm w-full text-left ${
                                            orderValue === orderOption.value && sortValue === option.value
                                                ? "bg-[#FCFDE2] text-[#FC9D4F]"
                                                : "hover:bg-[#FCFDE2] dark:hover:bg-gray-700"
                                        }`}
                                    >
                                        {orderOption.label}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Mobile View: Sort options in a dropdown button */}
            <div className="sm:hidden w-full">
                <button
                    onClick={toggleMobileDropdown}
                    className="w-full py-2 px-4 text-sm bg-[#FCFDE2] text-[#FC9D4F] rounded-md shadow-md"
                >
                    Sort
                </button>

                {isMobileDropdownOpen && (
                    <div className="mt-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded shadow-md z-10 w-full">
                        <div className="flex flex-col">
                            {/* Sort Options */}
                            {sortOptions.map((option) => (
                                <button
                                    key={option.value}
                                    onClick={() => handleMobileSortChange(option.value)}
                                    className={`py-2 px-4 text-sm w-full text-left ${
                                        sortValue === option.value
                                            ? "bg-[#FCFDE2] text-[#FC9D4F]"
                                            : "hover:bg-[#FCFDE2] dark:hover:bg-gray-700"
                                    }`}
                                >
                                    {option.label}
                                </button>
                            ))}
                        </div>

                        {/* Only show ASC/DESC options after a sort option is selected */}
                        {selectedSortOption && (
                            <div className="mt-2">
                                {orderOptions.map((orderOption) => (
                                    <button
                                        key={orderOption.value}
                                        onClick={() => handleOrderChange(orderOption.value)}
                                        className={`py-2 px-4 text-sm w-full text-left ${
                                            orderValue === orderOption.value && sortValue === selectedSortOption
                                                ? "bg-[#FCFDE2] text-[#FC9D4F]"
                                                : "hover:bg-[#FCFDE2] dark:hover:bg-gray-700"
                                        }`}
                                    >
                                        {orderOption.label}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};
