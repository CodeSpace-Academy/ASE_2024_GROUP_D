'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

const CategoryList = ({ onCategoryChange, totalRecipes }) => {
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [totalRecipesState, setTotalRecipes] = useState(0);
  
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Ref to hold a reference to the modal element for away click detection
  const modalRef = useRef(null); // Added reference for modal

  useEffect(() => {
    console.log('Total recipes:', totalRecipes);
    setTotalRecipes(totalRecipes);
  }, [totalRecipes]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/recipes/categories');
        if (!response.ok) throw new Error('Failed to fetch categories');
        const data = await response.json();
        setCategories(data);
        setFilteredCategories(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  // Handle clicks outside of the modal to close it
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Check if the click is outside the modal
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setIsOpen(false); // Close modal on outside click
      }
    };

    // Attach event listener when modal is open
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    // Cleanup event listener on close or component unmount
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]); // Dependencies include isOpen to trigger on open/close

  const handleSearch = (event) => {
    event.preventDefault();
    if (!searchTerm) {
      setFilteredCategories(categories);
      return;
    }
    const matches = categories.filter(category =>
      category.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredCategories(matches);
  };

  const handleCategorySelect = async (category) => {
    setIsOpen(false);
    const currentQuery = Object.fromEntries(searchParams.entries());
    const newQuery = {
      ...currentQuery,
      page: 1,
      category: category,
    };
    const queryString = new URLSearchParams(newQuery).toString();
    router.push(`?${queryString}`);
  };

  const clearCategory = () => {
    const currentQuery = Object.fromEntries(searchParams.entries());
    const { category, ...updatedQuery } = currentQuery;
    const queryString = new URLSearchParams(updatedQuery).toString();
    router.push(`?${queryString}`);
  };

  if (loading) return <div className="text-gray-500"></div>;
  if (error) return <div className="text-red-500">Error: {error}</div>;

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="block text-[#020123] hover:text-[#fc9d4f] font-medium uppercase py-2"
      >
        {isOpen ? 'Close' : 'Categories'}
      </button>

      {isOpen && (
        <div
          ref={modalRef} // Attach the modal ref to the dropdown div
          className="absolute left-0 w-64 mt-2 dark:bg-gray-950 bg-white shadow-lg rounded-lg overflow-hidden z-50"
        >
          <div className="p-4 border-b border-gray-100 dark:border-gray-850">
            <form onSubmit={handleSearch} className="space-y-2">
              <input
                type="text"
                placeholder="Search categories"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:border-[#fcf7e9]"
              />
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="flex-1 bg-[#ff4f1a] text-white px-4 py-2 rounded-md text-sm hover:bg-[#fc9d4f] transition duration-200"
                >
                  Search
                </button>
                <button
                  onClick={clearCategory}
                  type="button"
                  className="flex-1 bg-gray-100 text-gray-700 px-4 py-2 rounded-md text-sm hover:bg-[#fcf7e9] transition duration-200"
                >
                  Clear
                </button>
              </div>
            </form>
          </div>

          {filteredCategories.length > 0 ? (
            <ul className="max-h-96 overflow-y-auto">
              {filteredCategories.map((category, index) => (
                <li
                  key={index}
                  onClick={() => handleCategorySelect(category)}
                  className="px-4 py-3 hover:bg-gray-50 cursor-pointer flex items-center text-gray-700 text-sm border-b border-gray-100 last:border-0"
                >
                  {category}
                </li>
              ))}
            </ul>
          ) : (
            <p className="p-4 text-gray-500 text-sm">No categories found</p>
          )}
        </div>
      )}
    </div>
  );
};

export default CategoryList;
