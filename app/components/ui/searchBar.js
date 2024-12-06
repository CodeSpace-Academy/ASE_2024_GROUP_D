"use client";

import { useState, useEffect } from 'react';
import { FaSearch } from 'react-icons/fa';
import { XCircle, Timer, Coffee, Utensils } from 'lucide-react';
import { useRouter } from 'next/navigation';

/**
 * Highlights matching parts of the text based on search terms.
 * @param {Object} props - Component props.
 * @param {string} text - The text to highlight parts of.
 * @param {string[]} searchTerms - The search terms to highlight in the text.
 * @returns {JSX.Element} A span element with highlighted matching text.
 */
const HighlightedText = ({ text, searchTerms }) => {
    if (!searchTerms || searchTerms.length === 0) return text;

    const pattern = searchTerms
        .filter(term => term.length > 0)
        .map(term => term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
        .join('|');

    if (!pattern) return text;

    const regex = new RegExp(`(${pattern})`, 'gi');
    const parts = text.split(regex);

    return (
        <span>
            {parts.map((part, i) =>
                regex.test(part) ? (
                    <span key={i} className="bg-teal-100 text-teal-800 font-medium">{part}</span>
                ) : (
                    <span key={i}>{part}</span>
                )
            )}
        </span>
    );
};

/**
 * Recipe search bar component that handles search input, suggestions, and routing.
 * @param {object} props - The component props.
 * @param {string} props.currentSearch - The current search query to initialize the input field.
 * @param {function} [props.onSearch] - Callback function to handle the search query.
 * @param {number} [props.minCharacters=2] - Minimum characters before search is triggered.
 * @returns {JSX.Element} The rendered search bar component.
 */
const RecipeSearchBar = ({
    currentSearch = '',
    onSearch,
    minCharacters = 2,
}) => {
    const [search, setSearch] = useState(currentSearch);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [suggestions, setSuggestions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [recentSearches, setRecentSearches] = useState([]);
    const [selectedRecipe, setSelectedRecipe] = useState(null);
    const [debouncedSearch, setDebouncedSearch] = useState(search);
    const router = useRouter();

    /**
     * Updates the search input value based on the current search query.
     */
    useEffect(() => {
        setSearch(currentSearch);
    }, [currentSearch]);

    /**
     * Splits the search text into individual terms for highlighting matches.
     * @param {string} searchText - The text to split into search terms.
     * @returns {string[]} An array of search terms.
     */
    const getSearchTerms = (searchText) => {
        return searchText
            .toLowerCase()
            .split(' ')
            .filter(term => term.length >= minCharacters);
    };

    /**
     * Saves a recent search term to localStorage and updates the recent searches state.
     * @param {string} searchTerm - The search term to save.
     */
    const saveRecentSearch = (searchTerm) => {
        const updatedSearches = [
            searchTerm,
            ...recentSearches.filter(term => term !== searchTerm)
        ].slice(0, 5);

        setRecentSearches(updatedSearches);
        localStorage.setItem('recentRecipeSearches', JSON.stringify(updatedSearches));
    };

    /**
     * Fetches recipe suggestions from the API based on the current search input.
     * The API is queried after a debounce period, and the results are saved to the suggestions state.
     */
    useEffect(() => {
        const fetchSuggestions = async () => {
            if (search.length < minCharacters) {
                setSuggestions([]);
                return;
            }
        
            try {
                setLoading(true);

                const exactMatchResponse = await fetch(`/api/recipes?exactTitle=${encodeURIComponent(search)}`);
                if (!exactMatchResponse.ok) throw new Error('Failed to check for exact match');
                const exactMatchData = await exactMatchResponse.json();
        
                if (exactMatchData.recipes && exactMatchData.recipes.length > 0) {
                    setSelectedRecipe(exactMatchData.recipes[0]);
                    setShowSuggestions(false);
                    return;
                }

                const params = new URLSearchParams({
                    search,
                    limit: '10',
                    page: '1',
                });
        
                const response = await fetch(`/api/recipes?${params}`);
                if (!response.ok) throw new Error('Failed to fetch suggestions');
        
                const data = await response.json();
                setSuggestions(data.recipes);
            } catch (error) {
                console.error('Error fetching suggestions:', error);
                setSuggestions([]);
            } finally {
                setLoading(false);
            }
        };

        const timeoutId = setTimeout(fetchSuggestions, 100);
        return () => clearTimeout(timeoutId);
    }, [search, minCharacters]);

    /**
     * Debounces the search input to avoid triggering the search on every keystroke.
     */
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(search.trim());
        }, 1000);

        return () => clearTimeout(timer);
    }, [search]);

    /**
     * Handles the search logic when the debounced search term changes.
     * It updates the URL and calls the provided `onSearch` callback.
     */
    useEffect(() => {
        if (debouncedSearch) {
            saveRecentSearch(debouncedSearch);
            setShowSuggestions(true);
            setSelectedRecipe(null);

            router.push(`/?search=${encodeURIComponent(debouncedSearch)}`);

            if (onSearch) {
                onSearch(debouncedSearch);
            }
            
        }
    }, [debouncedSearch, router, onSearch]);

    /**
     * Fetches details of a specific recipe by ID.
     *
     * @param {string} recipeId - The ID of the recipe to fetch.
     */
    const fetchRecipeDetails = async (recipeId) => {
        try {
            const response = await fetch(`/api/recipes/${recipeId}`);
            if (!response.ok) throw new Error('Failed to fetch recipe details');
            
            const data = await response.json();
            setSelectedRecipe(data.recipe);
        } catch (error) {
            console.error('Error fetching recipe details:', error);
        }
    };

    /**
     * Handles the click event on a suggestion to populate the search input.
     * @param {object} suggestion - The suggestion object containing the recipe data.
     */
    const handleSuggestionClick = (suggestion) => {
        setSearch(suggestion.title);
        saveRecentSearch(suggestion.title);
        setShowSuggestions(false);
        setSelectedRecipe(null);
        fetchRecipeDetails(suggestion._id);
    };

    /**
     * Clears the search input and resets the state related to suggestions and selected recipe.
     */
    const clearSearch = () => {
        setSearch('');
        setShowSuggestions(false);
        setSuggestions([]);
        setSelectedRecipe(null); 
        if (onSearch) {
            onSearch('');
        }
    };

    /**
     * Clears the list of recent searches and removes them from localStorage.
     */
    const clearRecentSearches = () => {
        setRecentSearches([]);
        localStorage.removeItem('recentRecipeSearches');
    };

    useEffect(() => {
        const handleFocusIn = (e) => {
            if (e.target.closest(".search-container")) {
                setShowSuggestions(true);
            }
        };
    
        const handleFocusOut = (e) => {
            if (!e.relatedTarget || !e.relatedTarget.closest(".search-container")) {
                setShowSuggestions(false);
            }
        };
    
        document.addEventListener("focusin", handleFocusIn);
        document.addEventListener("focusout", handleFocusOut);
    
        return () => {
            document.removeEventListener("focusin", handleFocusIn);
            document.removeEventListener("focusout", handleFocusOut);
        };
    }, []);

    const searchTerms = getSearchTerms(search);

    return (
        <div className="search-container max-w-3xl mx-auto">
            <div className="relative">
                <div className="relative flex items-center">
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#ff4f1a]"> 
                        <FaSearch className="h-4 w-4" />
                        </div>
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => {
                            setSearch(e.target.value);
                            setShowSuggestions(true);
                        }}
                        onFocus={() => setShowSuggestions(true)}
                        placeholder="Search for recipes by title, ingredient, or category..."
                        className="w-full pl-12 pr-12 py-4 bg-white border-2 dark:bg-black dark:border-gray-950 border-gray-100 rounded-xl focus:outline-none focus:border-teal-500 focus:ring-0 text-gray-700 placeholder-gray-400 transition-all duration-200"
                        aria-label="Search recipes"
                    />
                    <div className="absolute right-0 flex items-center space-x-1 mr-2">
                        {search && (
                            <button
                                type="button"
                                onClick={clearSearch}
                                className="absolute right-4 p-2 text-gray-400 hover:text-teal-500 transition-colors duration-200"
                                aria-label="Clear search"
                            >
                                <XCircle className="h-5 w-5" />
                            </button>
                        )}
                    </div>
                </div>
    
                {showSuggestions && (
                    <div className="absolute z-10 w-full mt-2 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden" onMouseDown={(e) => e.preventDefault()}>
                        {loading ? (
                            <div className="p-6 text-gray-600 flex items-center justify-center">
                                <Coffee className="animate-spin mr-2 text-teal-500" />
                                <span className="font-medium">Finding recipes...</span>
                            </div>
                        ) : suggestions.length > 0 ? (
                            <ul className="divide-y divide-gray-100">
                                {suggestions.map((suggestion, index) => (
                                    <li 
                                        key={suggestion._id || index}
                                        className="hover:bg-gray-50 transition-colors cursor-pointer"
                                        onClick={() => handleSuggestionClick(suggestion)}
                                    >
                                        <div className="p-4">
                                            <HighlightedText
                                                text={suggestion.title}
                                                searchTerms={searchTerms}
                                            />
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <div className="p-6 text-center text-gray-600">No suggestions found</div>
                        )}

                        {recentSearches.length > 0 && !loading && (
                            <div>
                                <div className="p-4 bg-gray-50 text-gray-800 font-semibold">
                                    Recent Searches
                                </div>
                                <ul className="divide-y divide-gray-100">
                                    {recentSearches.map((term, index) => (
                                        <li 
                                            key={index}
                                            className="hover:bg-gray-50 transition-colors cursor-pointer"
                                            onClick={() => {
                                                setSearch(term);
                                                saveRecentSearch(term);
                                            }}
                                        >
                                            <div className="p-4">
                                                <span className="text-sm text-gray-600">{term}</span>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                )}
            </div>
            {selectedRecipe && (
                <div className="mt-8 p-6 bg-white rounded-xl shadow-md border border-gray-100">
                    <h2 className="text-2xl font-bold text-gray-800 mb-3">{selectedRecipe.title}</h2>
                    <p className="text-gray-600 mb-4 leading-relaxed">{selectedRecipe.description}</p>
                    <div className="flex items-center text-sm text-gray-500">
                        <Timer className="h-4 w-4 mr-2 text-teal-500" />
                        <span>{selectedRecipe.cookTime} mins</span>
                    </div>
                </div>
            )}
        </div>
    );
};

export default RecipeSearchBar;