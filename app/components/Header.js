'use client';
import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect, Suspense } from 'react';
import { FaUser, FaShoppingBag, FaHeart, FaSearch } from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import CategoryList from './ui/CategoryList.js';
import { FilterButton } from '../components/FilterButton.js'
import ThemeButton from './ui/ThemeButton';
import RecipeSearchBar from './ui/searchBar.js';
import UserModal from './UserModal.js';
import { FilterModal } from '../components/FilterButton.js'
import Loading from '../loading.js';

/**
 * Header component renders the navigation bar, including the logo, links,
 * category list, user modal, shopping bag, and theme button.
 * It also handles user authentication and dropdown menu visibility.
 *
 * @param {Object} props - Component props
 * @param {boolean} props.isAuthenticated - Flag to indicate if the user is authenticated
 * @param {function} props.onLogout - Callback to handle user logout
 *
 * @returns {JSX.Element} The header component
 *
 * @component
 * @example
 * // Usage:
 * <Header isAuthenticated={true} onLogout={handleLogout} />
 */
const Header = ({ isAuthenticated, onLogout }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [totalRecipes, setTotalRecipes] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [shoppingListCount, setShoppingListCount] = useState(0); // State for shopping list count
  const [favoritesCount, setFavoritesCount] = useState(0);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchFavorites = async () => {
      const loggedInEmail = localStorage.getItem('loggedInUserEmail');
      if (!loggedInEmail) {
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
        setFavoritesCount(data.favorites.length);
      } catch (err) {
        setError('Failed to load favorites.');
        console.error('Error fetching favorites:', err);
      }
    };

    // Fetch favorites initially
    fetchFavorites();

    // Add event listener for favorites updates
    const handleFavoritesUpdate = () => {
      fetchFavorites();
    };

    window.addEventListener('favorites-updated', handleFavoritesUpdate);

    // Cleanup listener
    return () => {
      window.removeEventListener('favorites-updated', handleFavoritesUpdate);
    };
  }, []);

  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);
  const toggleFilterModal = () => setIsFilterOpen((prev) => !prev);
  const toggleModal = () => setShowModal((prev) => !prev);

  /**
   * Fetches the shopping list items from the API and updates the shopping list count state.
   * @async
   */
  useEffect(() => {
    const fetchShoppingList = async () => {
      try {
        const response = await fetch('/api/shopping_lists');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        if (data.success) {
          setShoppingListCount(data.data.length); // Update the shopping list count
        } else {
          throw new Error('Failed to fetch shopping list');
        }
      } catch (error) {
        console.error('Error fetching shopping list:', error);
      }
    };

    fetchShoppingList();
  }, []);

  const toggleSearch = () => setIsSearchOpen((prev) => !prev);

  return (
    <header className="sticky top-0 bg-[#f9efd2] dark:bg-gray-950 z-50 shadow-md">
      <div className="container mx-auto px-4">
        <nav className="flex items-center justify-between h-16">
          <div className="hidden md:flex space-x-8">
            <Link
              href="/"
              className="block text-[ #020123] hover:text-[#fc9d4f] font-medium py-2 uppercase "
            >
              Recipes
            </Link>
            <Link
              href="/favorites"
              className="block text-[ #020123] hover:text-[#fc9d4f] font-medium py-2 uppercase flex items-center"
            >
              Favourite
              {favoritesCount > 0 && (
                <span className="ml-2 bg-[#fc9d4f] text-white text-xs rounded-full px-2 py-1">
                  {favoritesCount}
                </span>
              )}
            </Link>
            <Suspense fallback={<Loading />}>
              <CategoryList
                totalRecipes={totalRecipes}
                onCategoryChange={() => { }}
              />
              <FilterButton onClick={toggleFilterModal} />
            </Suspense>
          </div>

           <Link href="/" className="flex items-center">
            <Image
              src="/0.png"
              alt="Logo"
              width={150}
              height={100}
              className="h-20 w- "
            />
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            <button onClick={toggleSearch}>
              <FaSearch className="w-5 h-5" />
            </button>

            <button
              onClick={toggleModal}
              className="text-[#020123] dark:text-white hover:text-[#fc9d4f]"
            >
              <FaUser className="w-5 h-5" />
            </button>

            <Suspense fallback={<Loading />}></Suspense>
            
            <UserModal show={showModal} onClose={toggleModal} />

            <ThemeButton />

            <Link href="/shopping_lists" className="relative">
              <FaShoppingBag className="w-5 h-5 text-[#020123] dark:text-white hover:text-[#fc9d4f]" />
              {shoppingListCount > 0 && (
                <span className="absolute -top-1 -right-2 bg-red-500 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center">
                  {shoppingListCount}
                </span>
              )}
            </Link>
          </div>
          <button
            className="md:hidden text-gray-600 dark:text-white"
            onClick={toggleDropdown}
            aria-label="Menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M4 6h16M4 12h16M4 18h16"></path>
            </svg>
          </button>
        </nav>
      </div>

      <div
        className={`md:hidden bg-white border-t transition-all duration-300 ${isDropdownOpen ? "max-h-screen py-4" : "max-h-0 overflow-hidden"
          }`}
      >
        <div className="container mx-auto px-4 space-y-4">
          <Link
            href="/recipes"
            className="block text-[ #020123] hover:text-[#fc9d4f] font-medium py-2"
          >
            Recipes
          </Link>
          <Link
            href="/Favourite"
            className=" text-[#020123] hover:text-[#fc9d4f] font-medium py-2 flex items-center"
          >
            Favourites
            {favoritesCount > 0 && (
              <span className="ml-2 bg-[#fc9d4f] text-white text-xs rounded-full px-2 py-1">
                {favoritesCount}
              </span>
            )}
          </Link>
          <Suspense fallback={<Loading />}>
            <CategoryList
              totalRecipes={totalRecipes}
              onCategoryChange={() => { }}
            />
            <div className="py-2">
              <FilterButton onClick={() => setIsFilterOpen(!isFilterOpen)} />
            </div>
          </Suspense>
        </div>
      </div>
      {/* Modals */}
      {isFilterOpen && <FilterModal onClose={() => setIsFilterOpen(false)} />}
      <UserModal show={showModal} onClose={() => setShowModal(false)} />

      {/* Search Bar Conditionally Rendered */}
      {isSearchOpen && (
        <div className="absolute top-full left-0 w-full z-50">
          <RecipeSearchBar />
        </div>
      )}
    </header>
  );
};

export default Header;