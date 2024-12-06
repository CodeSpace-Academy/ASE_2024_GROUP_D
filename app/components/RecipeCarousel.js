"use client";

import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { FaClock, FaUtensils } from "react-icons/fa";

const RecipeCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [topRecipes, setTopRecipes] = useState([]);

  useEffect(() => {
    // Fetch recommended recipes from API
    const fetchTopRecipes = async () => {
      try {
        const response = await fetch("/api/recipes/recommendations?limit=10");
        if (!response.ok) throw new Error("Failed to fetch recipes");

        const recipes = await response.json();
        // Sort recipes by rating in descending order
        const sortedRecipes = recipes.sort((a, b) => b.averageRating - a.averageRating);
        setTopRecipes(sortedRecipes);
      } catch (error) {
        console.error("Error fetching top recipes:", error);
      }
    };

    fetchTopRecipes();
  }, []);

  const visibleRecipes = 3;
  const maxIndex = Math.max(0, topRecipes.length - visibleRecipes);

  const nextSlide = () => setCurrentIndex((prev) => Math.min(prev + 1, maxIndex));
  const prevSlide = () => setCurrentIndex((prev) => Math.max(prev - 1, 0));

  // Render star rating
  const StarRating = ({ rating }) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    return (
      <div className="flex items-center gap-1">
        {[...Array(5)].map((_, index) => (
          <Star
            key={index}
            className={`w-4 h-4 ${
              index < fullStars
                ? "fill-yellow-400 text-yellow-400"
                : index === fullStars && hasHalfStar
                ? "fill-yellow-400 text-yellow-400"
                : "fill-gray-200 text-gray-200"
            }`}
          />
        ))}
        <span className="text-sm text-gray-600 ml-1">({rating.toFixed(1)})</span>
      </div>
    );
  };

  return (
    <div className="container mx-auto p-4 pt-8 md:p-8 lg:p-16 bg-[#fcfde2] dark:bg-[#1b1c02] relative">
      <div className="relative mb-8">
        <h2 className="text-3xl font-bold text-[#ff4f1a] dark:text-[#e63600] tracking-tight">
          Top Rated Recipes
          <div className="h-1 w-20 bg-[#fc9d4f] dark:bg-[#b05103] mt-2 rounded-full" />
        </h2>
        {/* Left Button */}
        <button
          onClick={prevSlide}
          disabled={currentIndex === 0}
          className="absolute left-0 top-1/2 transform -translate-y-1/2 p-2 rounded-full border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Previous recipes"
        >
          <ChevronLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
        </button>
        {/* Right Button */}
        <button
          onClick={nextSlide}
          disabled={currentIndex === maxIndex}
          className="absolute right-0 top-1/2 transform -translate-y-1/2 p-2 rounded-full border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Next recipes"
        >
          <ChevronRight className="w-5 h-5 text-gray-600 dark:text-gray-400" />
        </button>
      </div>

      <div className="relative">
        <div className="overflow-hidden rounded-xl">
          <div
            className="flex gap-6 transition-transform duration-500 ease-out"
            style={{
              transform: `translateX(-${currentIndex * (100 / visibleRecipes)}%)`,
            }}
          >
            {topRecipes.map((recipe) => (
              <div
                key={recipe._id}
                className="flex-none w-1/3 group cursor-pointer"
              >
                <Link href={`/Recipe/${recipe._id}`}>
                  <div className="bg-[#fcfde2] dark:bg-[#1c1d02] rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                    <div className="relative pt-[70%]">
                      <Image
                        src={
                          recipe.images && recipe.images.length > 0
                            ? recipe.images[0]
                            : "/fallback-placeholder.jpg"
                        }
                        alt={recipe.title}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <div className="p-6">
                      <h3 className="font-semibold text-xl text-[#fc9d4f] dark:text-[#b05103] mb-3 line-clamp-2">
                        {recipe.title}
                      </h3>
                      <div className="flex items-center gap-4 text-[#020123] dark:text-[#dddcfe]">
                        <StarRating rating={recipe.averageRating || 0} />
                        <div className="flex items-center gap-1.5">
                          <FaClock className="w-4 h-4" />
                          <span className="text-sm">
                            {recipe.cookTime || "30 mins"}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <FaUtensils className="w-4 h-4" />
                          <span className="text-sm">
                            serves {recipe.servings || "4"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecipeCarousel;

