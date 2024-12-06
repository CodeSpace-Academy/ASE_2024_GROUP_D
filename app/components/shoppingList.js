'use client';

import { useEffect, useState } from 'react';

/**
 * Renders the shopping list page, displaying items fetched from the API.
 * 
 * @component
 * @returns {JSX.Element} Shopping list with functionality to delete items
 */
const ShoppingListPage = () => {
  const [shoppingList, setShoppingList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch the shopping list items from the API when the component mounts
  useEffect(() => {
    const fetchShoppingList = async () => {
      try {
        const response = await fetch('/api/shopping_lists');
        const data = await response.json();
        if (data.success) {
          setShoppingList(data.data);
        } else {
          throw new Error('Failed to fetch shopping list');
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchShoppingList();
  }, []);

  /**
   * Deletes an item from the shopping list.
   * 
   * @param {string} id - The ID of the item to delete
   */
  const deleteItem = async (id) => {
    try {
      const response = await fetch('/api/shopping_lists', { // Corrected endpoint
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id }),
      });

      const data = await response.json();
      if (data.success) {
        setShoppingList((prevList) => prevList.filter((item) => item._id !== id));
      } else {
        throw new Error('Failed to delete item');
      }
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-semibold mb-4">Shopping List</h1>
      <ul className="space-y-4">
        {shoppingList.length > 0 ? (
          shoppingList.map((item) => (
            <li key={item._id} className="flex items-center justify-between">
              <span>{item.name}</span>
              <button
                className="bg-red-500 text-white px-3 py-1 rounded"
                onClick={() => deleteItem(item._id)}
              >
                Delete
              </button>
            </li>
          ))
        ) : (
          <p>Your shopping list is empty.</p>
        )}
      </ul>
    </div>
  );
};

export default ShoppingListPage;
