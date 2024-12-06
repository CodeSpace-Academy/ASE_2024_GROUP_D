// StepsDropdown.js
import { useState } from "react";

const StepsDropdown = ({ selectedSteps, onStepsChange }) => {
    const [steps, setSteps] = useState(selectedSteps || 0);

    const handleChange = (e) => {
        const value = Number(e.target.value);
        setSteps(value);
        onStepsChange(value); // Notify parent of the change
    };

    return (
        <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700">Number of Steps</label>
            <select
                value={steps}
                onChange={handleChange}
                className="mt-2 p-2 border border-gray-300 rounded-md"
            >
                <option value="0">All</option>
                {Array.from({ length: 100 }, (_, i) => i + 1).map((step) => (
                    <option key={step} value={step}>{step}</option>
                ))}
            </select>
        </div>
    );
};

export default StepsDropdown;
