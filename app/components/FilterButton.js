"use client";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import TagDisplay from "./TagList";
import { fetchRecipes } from "../api";
import IngDisplay from "./IngredientList";
import StepsDropdown from "./StepsDropdown";

/**
 * Modal component for filtering recipes with various search criteria.
 * 
 * @component
 * @param {Object} props - Component props
 * @param {Function} props.onClose - Callback function to close the filter modal
 * @returns {JSX.Element} Rendered filter modal
 */
export const FilterModal = ({ onClose }) => {
    const [cookTime, setCookTime] = useState(0);
    const [selectedTags, setSelectedTags] = useState([]);
    const [selectedIngs, setSelectedIngs] = useState([]);
    const [steps, setSteps] = useState(0);
    const searchParams = useSearchParams();
    const router = useRouter();

    /**
     * Converts a numeric time value to a human-readable range label.
     * 
     * @param {number} value - The time value to convert
     * @returns {string} Formatted time range label
     */
    const getRangeLabel = (value) => {
        if (value === 0) return "All";
        if (value <= 15) return "5-15 min";
        if (value <= 30) return "15-30 min";
        if (value <= 45) return "30-45 min";
        return "45-60 min";
    };

    /**
     * Snaps the input value to the nearest predefined time range.
     * 
     * @param {number} value - The input time value
     * @returns {number} Snapped time value
     */
    const snapToNearest = (value) => {
        if (value < 5) return 0;
        if (value <= 15) return 15;
        if (value <= 30) return 30;
        if (value <= 45) return 45;
        return 60;
    };

    /**
     * Creates a handler for slider change events that snaps to nearest value.
     * 
     * @param {Function} setValue - State setter function
     * @returns {Function} Event handler for slider changes
     */
    const handleSliderChange = (setValue) => (e) => {
        const value = Number(e.target.value);
        setValue(snapToNearest(value));
    };

    /**
     * Handles changes to the number of steps in a recipe.
     * 
     * @param {number} steps - Number of recipe steps
     */
    const handleStepsChange = (steps) => {
        setSteps(steps);
    };

    /**
     * Handles changes to selected tags, with logging.
     * 
     * @param {string[]} tags - Array of selected tags
     */
    const handleTagsChange = (tags) => {
        console.log("Handling tags change:", tags); // Log the selected tags
        if (JSON.stringify(tags) !== JSON.stringify(selectedTags)) {
            setSelectedTags(tags);
            console.log("Updated Selected Tags:", tags); // Log updated tags
        }
    };

    /**
     * Handles changes to selected ingredients, with logging.
     * 
     * @param {string[]} ing - Array of selected ingredients
     */
    const handleIngsChange = (ing) => {
        console.log("Handling ingredients change:", ing); // Log the selected ingredients
        if (JSON.stringify(ing) !== JSON.stringify(selectedIngs)) {
            setSelectedIngs(ing);
            console.log("Updated Selected Ingredients:", ing); // Log updated ingredients
        }
    };

    /**
     * Submits filter criteria by updating URL search parameters.
     * Resets to the first page and applies selected filters.
     */
    const handleSubmit = async () => {
        const currentQuery = Object.fromEntries(searchParams.entries());

        console.log("Current Query Params Before Submit:", currentQuery); // Log current query

        if (steps === 0) {
            setSteps(""); // Clear steps if zero
        }

        const newQuery = {
            ...currentQuery,
            page: 1, // Reset to the first page
            tags: selectedTags.join(","), // Join tags for the query string
            ingredients: selectedIngs.join(","), // Join ingredients for the query string
            instructions: steps,
        };

        const queryString = new URLSearchParams(newQuery).toString();

        // Only push if the query string is different
        if (window.location.search !== `?${queryString}`) {
            console.log("Updating URL with New Query:", queryString); // Log query string
            router.push(`?${queryString}`);
            onClose(); // Close the modal after submitting
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
            <div className="bg-white dark:bg-black w-[60%] p-6 rounded-lg shadow-lg">
                {/* Header */}
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-bold text-gray-800 dark:text-white">Filter</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 dark:text-white hover:text-gray-700 dark:hover:text-green-500 text-xl"
                    >
                        &times;
                    </button>
                </div>

                {/* Filter Fields */}
                <div className="space-y-4 mb-4">
                    {/* Tag Selection */}
                    <div className="flex flex-col">
                        <label className="text-sm font-medium text-gray-700">Ingredients</label>
                        <TagDisplay selectedTags={selectedTags} onTagsChange={handleTagsChange} /> {/* Pass selected tags and function */}
                        <IngDisplay selectedIngs={selectedIngs} onIngsChange={handleIngsChange} />
                        <StepsDropdown selectedSteps={steps} onStepsChange={handleStepsChange} />
                    </div>

                    {/* Time Slider */}
                    {/* Uncomment to enable */}
                    {/* <div className="flex flex-col">
                        <label className="text-sm font-medium text-gray-700">Time for meal</label>
                        <input
                            type="range"
                            min="0"
                            max="60"
                            value={cookTime}
                            onChange={handleSliderChange(setCookTime)}
                            className="mt-2"
                            step="5"
                        />
                        <div className="flex justify-between text-xs text-gray-600">
                            <span>{getRangeLabel(cookTime)}</span>
                            <span>60</span>
                        </div>
                    </div> */}
                </div>

                {/* Clear All Filters */}
                <div
                    onClick={() => {
                        setCookTime(0);
                        setSelectedTags([]); // Clear selected tags
                    }}
                    className="text-red-600 text-sm cursor-pointer mb-4 hover:underline"
                >
                    Clear All Filters
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end gap-2">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-white bg-red-600 border rounded-md hover:bg-gray-100"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit} // Call handleSubmit on apply
                        className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700"
                    >
                        Apply
                    </button>
                </div>
            </div>
        </div>
    );
};

/**
 * Button component to open the filter modal.
 * 
 * @component
 * @param {Object} props - Component props
 * @param {Function} props.onClick - Callback function to trigger filter modal
 * @returns {JSX.Element} Rendered filter button
 */
export const FilterButton = ({ onClick }) => {
    return (
        <button
            onClick={onClick}
            className="block text-[#020123] hover:text-[#fc9d4f] font-medium uppercase py-2"
        >
            <span className="material-icons mr-2"></span>
            Filter
        </button>
    );
};

/**
 * Parent component managing the filter modal's visibility.
 * 
 * @component
 * @returns {JSX.Element} Rendered parent component with filter button and modal
 */
const ParentComponent = () => {
    const [isFilterOpen, setIsFilterOpen] = useState(false);

    /**
     * Toggles the filter modal's open/closed state.
     */
    const toggleFilterModal = () => {
        setIsFilterOpen((prev) => !prev); // Toggle modal open/close state
    };

    return (
        <div>
            <FilterButton onClick={toggleFilterModal} />
            {isFilterOpen && <FilterModal onClose={toggleFilterModal} />}
        </div>
    );
};

export default ParentComponent;