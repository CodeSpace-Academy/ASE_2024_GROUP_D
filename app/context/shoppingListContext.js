'use client'

import React, { createContext, useContext, useReducer, useEffect } from 'react';

// Initial state structure
const initialState = {
  items: [],
  userId: null,
  isLoading: false,
  error: null
};

// Reducer function
function shoppingListReducer(state, action) {
  switch (action.type) {
    case 'SET_USER_ID':
      return { ...state, userId: action.payload };
    case 'LOAD_LIST_START':
      return { ...state, isLoading: true, error: null };
    case 'LOAD_LIST_SUCCESS':
      return { 
        ...state, 
        items: action.payload, 
        isLoading: false, 
        error: null 
      };
    case 'LOAD_LIST_ERROR':
      return { 
        ...state, 
        isLoading: false, 
        error: action.payload 
      };
    case 'ADD_ITEM':
      return {
        ...state,
        items: [...state.items, action.payload]
      };
    case 'REMOVE_ITEM':
      return {
        ...state,
        items: state.items.filter(item => item.id !== action.payload.id)
      };
    case 'UPDATE_QUANTITY':
      return {
        ...state,
        items: state.items.map(item => 
          item.id === action.payload.id 
            ? { ...item, quantity: action.payload.quantity }
            : item
        )
      };
    case 'TOGGLE_PURCHASED':
      return {
        ...state,
        items: state.items.map(item => 
          item.id === action.payload.id 
            ? { ...item, purchased: !item.purchased }
            : item
        )
      };
    case 'CLEAR_LIST':
      return { ...state, items: [] };
    default:
      return state;
  }
}

// Create context
const ShoppingListContext = createContext();

// Provider component
export function ShoppingListProvider({ children }) {
  const [state, dispatch] = useReducer(shoppingListReducer, initialState);

  // Sync methods
  const syncLoadList = async (userId) => {
    if (!userId) return;

    dispatch({ type: 'LOAD_LIST_START' });
    try {
      const response = await fetch(`/api/shopping-list?userId=${userId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch shopping list');
      }
      const data = await response.json();
      dispatch({ 
        type: 'LOAD_LIST_SUCCESS', 
        payload: data.data.items || [] 
      });
    } catch (error) {
      dispatch({ 
        type: 'LOAD_LIST_ERROR', 
        payload: error.message 
      });
    }
  };

  const syncAddItem = async (userId, newItem) => {
    try {
      const response = await fetch('/api/shopping-list', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          userId, 
          newItem: { 
            ...newItem, 
            _id: newItem.id  // Ensure MongoDB compatible ID
          } 
        })
      });

      if (!response.ok) {
        throw new Error('Failed to add item');
      }

      dispatch({ type: 'ADD_ITEM', payload: newItem });
    } catch (error) {
      console.error('Sync add item failed:', error);
    }
  };

  const syncRemoveItem = async (userId, itemId) => {
    try {
      const response = await fetch('/api/shopping-list', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          userId, 
          itemId 
        })
      });

      if (!response.ok) {
        throw new Error('Failed to remove item');
      }

      dispatch({ type: 'REMOVE_ITEM', payload: { id: itemId } });
    } catch (error) {
      console.error('Sync remove item failed:', error);
    }
  };

  const syncUpdateQuantity = async (userId, itemId, newQuantity) => {
    try {
      const response = await fetch('/api/shopping-list', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          userId, 
          itemId, 
          updatedItem: { quantity: newQuantity } 
        })
      });

      if (!response.ok) {
        throw new Error('Failed to update quantity');
      }

      dispatch({ 
        type: 'UPDATE_QUANTITY', 
        payload: { id: itemId, quantity: newQuantity } 
      });
    } catch (error) {
      console.error('Sync update quantity failed:', error);
    }
  };

  const syncTogglePurchased = async (userId, itemId) => {
    try {
      const response = await fetch('/api/shopping-list', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          userId, 
          itemId, 
          updatedItem: { purchased: true } 
        })
      });

      if (!response.ok) {
        throw new Error('Failed to toggle purchased status');
      }

      dispatch({ type: 'TOGGLE_PURCHASED', payload: { id: itemId } });
    } catch (error) {
      console.error('Sync toggle purchased failed:', error);
    }
  };

  const syncClearList = async (userId) => {
    try {
      const response = await fetch(`/api/shopping-list`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId })
      });

      if (!response.ok) {
        throw new Error('Failed to clear list');
      }

      dispatch({ type: 'CLEAR_LIST' });
    } catch (error) {
      console.error('Sync clear list failed:', error);
    }
  };

  return (
    <ShoppingListContext.Provider 
      value={{ 
        state, 
        dispatch,
        syncLoadList,
        syncAddItem,
        syncRemoveItem,
        syncUpdateQuantity,
        syncTogglePurchased,
        syncClearList
      }}
    >
      {children}
    </ShoppingListContext.Provider>
  );
}

// Custom hook
export function useShoppingList() {
  const context = useContext(ShoppingListContext);
  if (!context) {
    throw new Error('useShoppingList must be used within a ShoppingListProvider');
  }
  return context;
}
