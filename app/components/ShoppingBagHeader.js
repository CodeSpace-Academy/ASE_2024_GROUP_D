'use client';

import { useShoppingList } from '../context/shoppingListContext';
import { useRouter } from 'next/navigation';
import { ShoppingBag } from 'lucide-react';

const ShoppingBagHeader = () => {
  const { state } = useShoppingList();
  const router = useRouter();

  const itemCount = state.items.length;

  return (
    <button 
      onClick={() => router.push('/shopping-list')}
      className="relative p-2  rounded-full transition-colors"
      aria-label="Shopping List"
    >
      <ShoppingBag className="h-6 w-6 text-[#020123] dark:text-[#dddcfe] hover:text-[#ff4f1a] dark:hover:text-[#e63600" />
      {itemCount > 0 && (
        <span className="absolute -top-1 -right-1 bg-[#ff4f1a] dark:bg-[#e63600] text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-centerr">
          {itemCount}
        </span>
      )}
    </button>
  );
};

export default ShoppingBagHeader;