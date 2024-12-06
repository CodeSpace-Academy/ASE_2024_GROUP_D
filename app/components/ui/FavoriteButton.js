// app/components/FavoriteButton.js
'use client';
import { useState, useEffect } from 'react';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import { useRouter } from 'next/navigation';

export const FavoriteButton = ({ recipeId }) => {
  const [isFavorited, setIsFavorited] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Check if recipe is in favorites
  useEffect(() => {
    const checkFavoriteStatus = async () => {
      try {
        const response = await fetch(`/api/favorites/check/${recipeId}`);
        if (response.ok) {
          const data = await response.json();
          setIsFavorited(data.isFavorited);
        }
      } catch (error) {
        console.error('Error checking favorite status:', error);
      }
      setIsLoading(false);
    };

    checkFavoriteStatus();
  }, [recipeId]);

  const handleFavoriteClick = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      if (isFavorited) {
        // Remove from favorites
        const response = await fetch(`/api/favorites/${recipeId}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          setIsFavorited(false);
        } else if (response.status === 401) {
          router.push('/login');
          return;
        }
      } else {
        // Add to favorites
        const response = await fetch('/api/favorites', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ recipeId }),
        });

        if (response.ok) {
          setIsFavorited(true);
        } else if (response.status === 401) {
          router.push('/login');
          return;
        }
      }
    } catch (error) {
      console.error('Error updating favorite:', error);
    }
  };

  if (isLoading) {
    return <div className="absolute top-2 right-2 z-10 animate-pulse w-6 h-6 bg-gray-200  dark:bg-gray-950 rounded-full"></div>;
  }

  return (
    <button
      onClick={handleFavoriteClick}
      className="absolute top-2 right-2 z-10 p-2 bg-white dark:bg-gray-950 rounded-full shadow-md hover:bg-gray-100 transition-colors"
      aria-label={isFavorited ? 'Remove from favorites' : 'Add to favorites'}
    >
      {isFavorited ? (
        <FaHeart className="text-red-500 w-5 h-5" />
      ) : (
        <FaRegHeart className="text-gray-600 dark:text-white w-5 h-5" />
      )}
    </button>
  );
};