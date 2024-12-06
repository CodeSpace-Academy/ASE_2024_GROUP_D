'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function TagDisplay({ selectedTags, onTagsChange }) {
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState(''); // State for search term

  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('tags', selectedTags.join(','));
    router.push(`?${params.toString()}`);
  }, [selectedTags, searchParams]);
  
  useEffect(() => {
    const fetchTags = async () => {
      try {
        const response = await fetch('/api/recipes/tags');
        if (!response.ok) {
          throw new Error('Failed to fetch tags');
        }
        const data = await response.json();
        setTags(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTags();
  }, []);

  useEffect(() => {
    // Update URL with selected tags as query parameters
    const params = new URLSearchParams(searchParams);
    params.set('tags', selectedTags.join(','));
  }, [selectedTags, searchParams]);

  if (!loading && tags.length === 0) {
    return <div className="text-center py-4">No tags found.</div>;
  }

  if (error) {
    return <div className="text-red-500 text-center py-4">Error: {error}</div>;
  }

  const handleTagSelect = (tag) => {
    if (!selectedTags.includes(tag)) {
      onTagsChange([...selectedTags, tag]);
    } else {
      onTagsChange(selectedTags.filter((t) => t !== tag));
    }
  };

  const filteredTags = tags.filter(tag =>
    typeof tag === 'string' && tag.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const clearSelectedTags = () => {
    onTagsChange([]);
  };

  return (
    <div className="p-6 bg-white dark:bg-gray-950 shadow-md rounded-lg">
      <h2 className="text-2xl font-semibold mb-4">Select Tags</h2>
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="bg-green-600 text-white px-4 py-2 rounded-md shadow hover:bg-green-500 transition duration-200"
      >
        {isOpen ? 'Hide Tags' : 'Select Tag'}
      </button>
      {isOpen && (
        <div>
          <input
            type="text"
            placeholder="Search tags..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="mt-4 p-2 border border-gray-300 rounded-md w-full"
          />
          <div className="mt-2 max-h-60 overflow-y-auto border border-gray-300 rounded-md">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 p-2">
              {filteredTags.map((tag, index) => (
                <button
                  key={index}
                  className={`p-2 border border-gray-300 rounded-md transition duration-200 ${
                    selectedTags.includes(tag) ? 'bg-blue-300' : 'bg-gray-200 hover:bg-gray-300'
                  }`}
                  onClick={() => handleTagSelect(tag)}
                >
                  {tag}
                </button>
                
              ))}
            </div>
          </div>
        </div>
      )}
      <div className="mt-6">
        <h3 className="text-xl font-semibold mb-2">Selected Tags:</h3>
        <div className="flex flex-wrap gap-2">
          {selectedTags.map((tag, index) => (
            <span
              key={index}
              onClick={() => handleTagSelect(tag)}
              className="bg-blue-200 text-blue-800 px-3 py-1 rounded-md shadow cursor-pointer hover:bg-blue-300 transition duration-200"
            >
              {tag}
            </span>
          ))}
          <button
  onClick={clearSelectedTags}
  className="mt-4 bg-red-500 text-white px-4 py-2 rounded"
>
  Clear All
</button>
        </div>
      </div>
    </div>
  );
}
