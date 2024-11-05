'use client';

import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronUp } from '@fortawesome/react-fontawesome';

function CollapsibleSection({ title, content, defaultOpen = true }) {
    const [isOpen, setIsOpen] = useState(defaultOpen);

    return (
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6 transition-all duration-300 ease-in-out">
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className={`w-full text-xl font-semibold font-serif flex items-center justify-between 
                            transition-all duration-300 
                            ${isOpen ? 'bg-gradient-to-r from-green-300 to-green-400 text-white' : 'bg-transparent text-green-800'}
                            rounded-lg px-4 py-2 hover:bg-gradient-to-r hover:from-green-200 hover:to-green-300 
                            focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2
                            shadow-md hover:shadow-lg active:shadow-sm`}
            >
                {title}
                <FontAwesomeIcon
                    icon={isOpen ? faChevronUp : faChevronDown}
                    className={`ml-2 text-green-600 transition-transform duration-300 transform ${isOpen ? 'rotate-180 scale-110' : 'scale-100'}`}
                    size="sm"
                />
            </button>
            {isOpen && (
                <div className="mt-4 text-gray-700">
                    {content}
                </div>
            )}
        </div>
    );
}

export default CollapsibleSection;
