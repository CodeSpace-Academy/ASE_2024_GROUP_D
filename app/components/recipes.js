
"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  FaClock,
  FaUtensils,
  FaCaretDown
} from "react-icons/fa";
import { PiCookingPotDuotone, PiHeart } from "react-icons/pi";
import Carousel from "./ui/Carousel";
import { SortControl } from "./SortControl";
import { useSearchParams } from "next/navigation";

/**
 * Recipes component displays a list of recipes, allows the user to favorite recipes,
 * and adds ingredients to the shopping list.
 * 
 * @param {Object} props The component's props.
 * @param {Array} props.recipes The initial list of recipes.
 * @returns {JSX.Element} The component JSX element.
 */
const Recipes = ({ recipes: initialRecipes }) => {
  const [recipes, setRecipes] = useState(initialRecipes);
  const [favoritedRecipes, setFavoritedRecipes] = useState(new Set());
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const searchParams = useSearchParams();


  console.log("received recipes is :", recipes)
  /**
   * Fetches the user's favorite recipes when the component mounts.
   */
  useEffect(() => {
    const fetchFavorites = async () => {
      const loggedInEmail = localStorage.getItem('loggedInUserEmail');
      if (!loggedInEmail) {
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch(`/api/favorites?email=${encodeURIComponent(loggedInEmail)}`, {
          credentials: 'include',
        });

        if (!response.ok) {
          throw new Error('Failed to fetch favorites');
        }

        const data = await response.json();
        const favoriteIds = new Set(data.favorites.map((recipe) => recipe._id));
        setFavoritedRecipes(favoriteIds);
      } catch (err) {
        setError('Failed to load favorites. Please try again later.');
        console.error('Error fetching favorites:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFavorites();
  }, []);

  useEffect(() => {
    setRecipes(initialRecipes);
  }, [initialRecipes, searchParams]);

  /**
   * Toggles a recipe's favorite status and updates the favorites list.
   * 
   * @param {string} recipeId The ID of the recipe to toggle favorite status for.
   */
  const toggleFavorite = async (recipeId) => {
    const loggedInEmail = localStorage.getItem('loggedInUserEmail');
    if (!loggedInEmail) {
      setError('Please log in to manage favorites');
      return;
    }

    const isFavorited = favoritedRecipes.has(recipeId);
    const recipe = recipes.find((r) => r._id === recipeId);

    try {
      // Optimistically update the local state
      setFavoritedRecipes((prev) => {
        const updated = new Set(prev);
        if (isFavorited) {
          updated.delete(recipeId);
        } else {
          updated.add(recipeId);
        }
        return updated;
      });

      // Send request to backend
      const response = await fetch('/api/favorites', {
        method: isFavorited ? 'DELETE' : 'POST',
        body: JSON.stringify({ recipeId, email: loggedInEmail }),
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to update favorites');
      }

      // Dispatch a custom event to update favorites count in Header
      window.dispatchEvent(new Event('favorites-updated'));

    } catch (err) {
      // Revert the local state if the request fails
      setFavoritedRecipes((prev) => {
        const reverted = new Set(prev);
        if (isFavorited) {
          reverted.add(recipeId);
        } else {
          reverted.delete(recipeId);
        }
        return reverted;
      });

      setError('Failed to update favorites. Please try again.');
      console.error('Error updating favorites:', err);
    }
  };

  console.log("received recipes is :", recipes)



  return (
    <>
      <div className="container mx-auto p-4 pt-6 md:p-6 lg:p-12">
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
            <strong className="font-bold">Error!</strong>
            <span className="block sm:inline"> {error}</span>
          </div>
        )}

        <SortControl />

        <div className="mb-4 relative">
          <button
            onClick={() => setDropdownVisible(!dropdownVisible)}
            className="flex items-center text-gray-800 font-roboto"
          >
            <PiHeart className="mr-2" size={20} />
            <span>Favorites ({favoritedRecipes.size})</span>
            <FaCaretDown
              className={`ml-2 ${dropdownVisible ? "transform rotate-180" : ""
                }`}
            />
          </button>

          {dropdownVisible && (
            <div className="mt-2 absolute bg-white border border-gray-200 rounded-lg shadow-lg w-60 z-10">
              {favoriteDetails.length === 0 ? (
                <p className="p-4 text-gray-500">No favorites yet</p>
              ) : (
                <ul className="max-h-60 overflow-y-auto p-2">
                  {favoriteDetails.map((recipe) => (
                    <li key={recipe._id} className="p-2 hover:bg-gray-100">
                      <Link href={`/Recipe/${recipe._id}`} className="block text-sm text-gray-800">
                        {recipe.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {recipes.map((recipe) => (
            <Link
              href={`/Recipe/${recipe._id}`}
              key={recipe._id}
              className="block p-4 bg-[#fcfde2] dark:bg-black dark:border-gray-950 border border-gray-200 rounded-lg shadow-lg hover:shadow-2xl transition-transform transform hover:scale-105 duration-300 ease-in-out"
            >
              <div className="relative w-full h-64">
                {recipe.images?.length > 1 ? (
                  <Carousel images={recipe.images} />
                ) : (
                  <div className="relative w-full h-full">
                    <Image src={recipe.images[0]} alt={recipe.title} fill className="object-cover" />
                  </div>
                )}
              </div>

              <div className="p-4 flex justify-between items-center">
                <h2 className="text-[#fc9d4f] font-bold text-xl mb-3 font-montserrat group-hover:text-[#2b617f]">
                  {recipe.title}
                </h2>
                <button
                  className={`ml-2 ${favoritedRecipes.has(recipe._id)
                    ? "text-red-500"
                    : "text-gray-400"
                    } hover:text-red-500 transition-colors duration-200`}
                  onClick={(e) => {
                    e.preventDefault();
                    toggleFavorite(recipe._id);
                  }}
                >
                  <PiHeart size={24} />
                </button>
              </div>

              <div className="space-y-2">
                <p className="text-sm text-gray-600 flex items-center">
                  <FaClock className="text-[#020123] mr-2" />
                  {recipe.prep} mins
                </p>
                <p className="text-sm text-gray-600 flex items-center">
                  <PiCookingPotDuotone className="text-[#020123] dark:text-[#dddcfe] mr-2" />
                  {recipe.cook} mins
                </p>
                <p className="text-sm text-gray-600 flex items-center">
                  <FaUtensils className="text-[#020123] dark:text-[#dddcfe mr-2" />
                  Serves {recipe.servings}
                </p>
              </div>
              <div className="flex flex-wrap gap-2 mt-3">
                {recipe.category && (
                  <span className="inline-block bg-[#f9efd2] dark:bg-[#1c1d02] dark:text-[#dddcfe] text-[#020123] text-sm px-2 py-1 rounded">
                    {recipe.category}
                  </span>
                )}
                <span className="inline-block bg-[#f9efd2] text-[#020123]  dark:bg-[#1c1d02] dark:text-[#dddcfe] text-sm px-2 py-1 rounded">
                  {recipe.instructions.length} steps
                </span>
                <span className="inline-block bg-[#f9efd2] text-[#020123]  dark:bg-[#1c1d02] dark:text-[#dddcfe] text-sm px-2 py-1 rounded">
                  {new Date(recipe.published).toDateString()}
                </span>

              </div>
            </Link>
          ))}
        </div>
      </div>


    </>
  );
};

export default Recipes;