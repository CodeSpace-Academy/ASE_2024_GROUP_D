// Base URL for the API requests related to recipes
const API_BASE_URL = process.env.API_BASE_URL;

/**
 * Fetches a paginated list of recipes from the API.
 *
 * @param {number} limit - The maximum number of recipes to fetch (default is 20).
 * @param {number} [page] - The current page number (optional).
 * @returns {Promise<Object>} - Returns a promise that resolves with the recipe data, or throws an error if the request fails.
 */
export async function fetchRecipes(limit = 20, page, search, tags, category, ingredients, instructions, sort, order) {
    if (instructions == 0) {
        instructions = '';
    }

    // Construct query string with limit and page parameters
    const query = new URLSearchParams({
        limit, // Set the limit of items per page
        ...(page && { page }), // Conditionally add 'page' to the query if it's provided
        ...(search && { search }),
        ...(tags && { tags }), // Conditionally add 'tags' to the query if it
        ...(category && { category }), // Conditionally add 'category' to the query if it's provided
        ...(ingredients && { ingredients }), // Conditionally add 'ingredients' to the query if it's provided
        ...(instructions && { instructions }), // Conditionally add 'instructions' to the query if it's provided
        ...(order && {order}),
        ...(sort && {sort})
    }).toString();

    try {
        // Make a GET request to the API with the constructed query string
        const response = await fetch(`${API_BASE_URL}/api/recipes?${query}`);

        // Check if the response is successful (HTTP status code 200-299)
        if (!response.ok) {
            throw new Error('Failed to fetch recipes'); // Throw an error if the response status is not ok
        }

        // Parse the response data as JSON
        const data = await response.json();
        return data; // Return the fetched recipe data

    } catch (error) {
        throw error; // Throw the error if the request fails
    }
}

/**
 * Fetches a specific recipe by its ID from the API.
 *
 * @param {string} id - The unique ID of the recipe to fetch.
 * @returns {Promise<Object>} - Returns a promise that resolves with the recipe data for the given ID, or throws an error if the request fails.
 */
export async function fetchRecipeById(id) {
    try {
        // Make a GET request to the API to fetch a specific recipe by its ID
        const response = await fetch(`${API_BASE_URL}/api/recipes/${id}`);

        // Check if the response is successful
        if (!response.ok) {
            throw new Error('Failed to fetch recipe'); // Throw an error if the response is not ok
        }

        // Parse the response data as JSON
        const data = await response.json();
        return data; // Return the fetched recipe data

    } catch (error) {
        throw error; // Throw the error if the request fails
    }
}

/**
 * Fetches all reviews for a specific recipe.
 *
 * @param {string} recipeId - The unique ID of the recipe to fetch reviews for.
 * @param {Object} [sortOptions] - Sorting options (e.g., { sortBy: 'rating', order: 'asc' }).
 * @returns {Promise<Object[]>} - Returns a promise that resolves with an array of reviews.
 */
export async function fetchReviewsForRecipe(recipeId, sortOptions = { sortBy: 'createdAt', order: 'desc' }) {
    const query = new URLSearchParams({
        sortBy: sortOptions.sortBy,
        order: sortOptions.order,
    }).toString();

    try {
        // Make a GET request to fetch reviews for a specific recipe
        const response = await fetch(`${API_BASE_URL}/api/recipes/${recipeId}/reviews?${query}`);

        // Check if the response is successful
        if (!response.ok) {
            throw new Error('Failed to fetch reviews');
        }

        const data = await response.json();
        return data; // Return the reviews data

    } catch (error) {
        throw error;
    }
}

/**
 * Creates a new review for a specific recipe.
 *
 * @param {string} recipeId - The ID of the recipe the review is for.
 * @param {Object} reviewData - The review data (e.g., { rating, comment, userId }).
 * @returns {Promise<Object>} - Returns a promise that resolves with the newly created review.
 */
export async function createReview(recipeId, reviewData) {
    try {
        const response = await fetch(`${API_BASE_URL}/api/recipes/${recipeId}/reviews`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(reviewData),
        });

        if (!response.ok) {
            throw new Error('Failed to create review');
        }

        const data = await response.json();
        return data; // Return the created review

    } catch (error) {
        throw error;
    }
}

/**
 * Updates an existing review for a specific recipe.
 *
 * @param {string} recipeId - The ID of the recipe the review is for.
 * @param {string} reviewId - The ID of the review to update.
 * @param {Object} updateData - The data to update the review (e.g., { rating, comment }).
 * @returns {Promise<Object>} - Returns a promise that resolves with the updated review.
 */
export async function updateReview(recipeId, reviewId, updateData) {
    try {
        const response = await fetch(`${API_BASE_URL}/api/recipes/${recipeId}/reviews/${reviewId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updateData),
        });

        if (!response.ok) {
            throw new Error('Failed to update review');
        }

        const data = await response.json();
        return data; // Return the updated review

    } catch (error) {
        throw error;
    }
}

/**
 * Deletes a review for a specific recipe.
 *
 * @param {string} recipeId - The ID of the recipe the review is for.
 * @param {string} reviewId - The ID of the review to delete.
 * @returns {Promise<void>} - Returns a promise that resolves when the review is deleted.
 */
export async function deleteReview(recipeId, reviewId) {
    try {
        const response = await fetch(`${API_BASE_URL}/api/recipes/${recipeId}/reviews/${reviewId}`, {
            method: 'DELETE',
        });

        if (!response.ok) {
            throw new Error('Failed to delete review');
        }

        return; // No data returned upon successful deletion

    } catch (error) {
        throw error;
    }
}
