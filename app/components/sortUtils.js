/**
 * Sorts an array of recipe objects based on the specified field and order.
 *
 * @param {Array} recipes - The array of recipe objects to be sorted.
 * @param {string} sortBy - The field by which to sort the recipes. Valid options are:
 *     'createdAt' (sorts by published date),
 *     'prepTime' (sorts by preparation time),
 *     'cookTime' (sorts by cooking time),
 *     'instructions' (sorts by the number of instructions).
 * @param {string} sortOrder - The order of sorting; either 'ascending' or 'descending'.
 * @returns {Array} The sorted array of recipe objects.
 */
export const sortRecipes = (recipes, sortBy, sortOrder) => {
    // Return original recipes array if empty or undefined
    if (!recipes?.length) return recipes;

    const sorted = [...recipes];

    /**
     * Compares two values based on the specified order.
     *
     * @param {number} a - The first value to compare.
     * @param {number} b - The second value to compare.
     * @param {string} order - The order of comparison; either 'ascending' or 'descending'.
     * @returns {number} The comparison result, positive or negative, based on the sort order.
     */
    const compareValues = (a, b, order = 'ascending') => {
        const multiplier = order === 'ascending' ? 1 : -1;
        return (a - b) * multiplier;
    };

    // Define sorting strategies based on sortBy options
    const sortingStrategies = {
        /**
         * Sort by creation date in descending order by default (newest first).
         * @param {Object} a - The first recipe object.
         * @param {Object} b - The second recipe object.
         * @returns {number} The comparison result for dates.
         */
        createdAt: (a, b) => {
            const dateA = new Date(a.published || 0).getTime();
            const dateB = new Date(b.published || 0).getTime();
            return compareValues(dateB, dateA, 'descending'); // Newest first by default
        },

        /**
         * Sort by preparation time.
         * @param {Object} a - The first recipe object.
         * @param {Object} b - The second recipe object.
         * @returns {number} The comparison result for preparation times.
         */
        prepTime: (a, b) => {
            const timeA = parseInt(a.prep) || 0;
            const timeB = parseInt(b.prep) || 0;
            return compareValues(timeA, timeB, sortOrder);
        },

        /**
         * Sort by cooking time.
         * @param {Object} a - The first recipe object.
         * @param {Object} b - The second recipe object.
         * @returns {number} The comparison result for cooking times.
         */
        cookTime: (a, b) => {
            const timeA = parseInt(a.cook) || 0;
            const timeB = parseInt(b.cook) || 0;
            return compareValues(timeA, timeB, sortOrder);
        },

        /**
         * Sort by the number of instructions.
         * @param {Object} a - The first recipe object.
         * @param {Object} b - The second recipe object.
         * @returns {number} The comparison result for instruction counts.
         */
        instructions: (a, b) => {
            const lenA = Array.isArray(a.instructions) ? a.instructions.length : 0;
            const lenB = Array.isArray(b.instructions) ? b.instructions.length : 0;
            return compareValues(lenA, lenB, sortOrder);
        }
    };

    // Use the appropriate sorting strategy or a no-op if none is matched
    return sorted.sort(sortingStrategies[sortBy] || (() => 0));
};
