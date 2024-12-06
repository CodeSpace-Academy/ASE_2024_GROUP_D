import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FaClock } from "react-icons/fa";

const Recipes = ({ recipes }) => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {recipes.map((recipe) => (
          <Link
            href={`/Recipe/${recipe._id}`}
            key={recipe._id}
            className="group block bg-white dark:border-gray-950 rounded-lg overflow-hidden transform transition-transform duration-300 hover:scale-105"
          >
            {/* Image Container */}
            <div className="relative w-full h-64">
              {recipe.images && recipe.images[0] && (
                <Image
                  src={recipe.images[0]}
                  alt={recipe.title}
                  fill
                  className="object-cover"
                />
              )}
              {/* New Label if needed */}
              {recipe.isNew && (
                <div className="absolute top-4 right-4 bg-[#1e455c] text-white text-sm font-bold px-3 py-1 rounded">
                  NEW
                </div>
              )}
            </div>

            {/* Content Container */}
            <div className="p-4">
              {/* Title */}
              <h2 className="text-[#1e455c] font-bold text-xl mb-2 group-hover:text-[#2b617f]">
                {recipe.title}
              </h2>

              {/* Time Information */}
              <div className="flex items-center text-gray-600">
                <FaClock className="mr-2" />
                <span>
                  {recipe.prep + recipe.cook} mins
                </span>
              </div>

              {/* Tags */}
              <div className="mt-3 flex gap-2">
                {recipe.category && (
                  <span className="inline-block bg-gray-100 text-gray-600 text-sm px-2 py-1 rounded">
                    {recipe.category}
                  </span>
                )}
                {recipe.isGlutenFree && (
                  <span className="inline-block bg-gray-100 text-gray-600 text-sm px-2 py-1 rounded">
                    GF
                  </span>
                )}
                {recipe.isDairyFree && (
                  <span className="inline-block bg-gray-100 text-gray-600 text-sm px-2 py-1 rounded">
                    DF
                  </span>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};


export default Recipes;
