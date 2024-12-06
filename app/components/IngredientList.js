'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function IngDisplay({ selectedIngs = [], onIngsChange = () => {} }) {
  const [ings, setIngs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString);
    params.set('tags', selectedIngs.join(','));
    router.push(`?${params.toString()}`);
  }, [selectedIngs, searchParams]);

  useEffect(() => {
    const fetchIngs = async () => {
      try {
        const response = await fetch('/api/recipes/ingredients');
        if (!response.ok) {
          throw new Error('Failed to fetch ingredients');
        }
        const data = await response.json();
        setIngs(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchIngs();
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(searchParams);
    params.set('ingredients', selectedIngs.join(','));
  }, [selectedIngs, searchParams]);

  if (!loading && ings.length === 0) {
    return <div className="text-center py-4">No ingredients found</div>;
  }

  if (error) {
    return <div className="text-red-500 text-center py-4">Error: {error}</div>;
  }

  const handleIngSelect = (ing) => {
    if (!selectedIngs.includes(ing)) {
      onIngsChange([...selectedIngs, ing]);
    } else {
      onIngsChange(selectedIngs.filter((t) => t !== ing));
    }
  };

  const filteredIngs = ings.filter((ing) =>
    ing.toLowerCase().includes(searchTerm.toLowerCase())
);
 
const clearAll = () => {
  onTagsChange([]); // Clear selected tags
  router.push('/'); // Navigate back to the home page
};


  return (
    <div className="p-6 bg-white dark:bg-gray-950 shadow-md rounded-lg">
      <h2 className="text-2xl font-semibold mb-4">Select Ingredients</h2>
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="bg-green-600 text-white px-4 py-2 rounded-md shadow hover:bg-green-500 transition duration-200"
      >
        {isOpen ? 'Hide Ingredients' : 'Select Ingredient'}
      </button>
      {isOpen && (
        <div>
          <input
            type="text"
            placeholder="Search ingredients..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="mt-4 p-2 border border-gray-300 rounded-md w-full"
          />
          <div className="mt-2 max-h-60 overflow-y-auto border border-gray-300 rounded-md">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 p-2">
              {filteredIngs.map((ing, index) => (
                <button
                  key={index}
                  className={`p-2 border border-gray-300 rounded-md transition duration-200 ${
                    selectedIngs.includes(ing) ? 'bg-blue-300' : 'bg-gray-200 hover:bg-gray-300'
                  }`}
                  onClick={() => handleIngSelect(ing)}
                >
                  {ing}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
      <div className="mt-6">
        <h3 className="text-xl font-semibold mb-2">Selected Ingredients:</h3>
        <div className="flex flex-wrap gap-2">
          {selectedIngs.map((ing, index) => (
            <span
              key={index}
              onClick={() => handleIngSelect(ing)}
              className="bg-blue-200 text-blue-800 px-3 py-1 rounded-md shadow cursor-pointer hover:bg-blue-300 transition duration-200"
            >
              {ing}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}