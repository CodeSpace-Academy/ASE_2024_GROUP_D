

import ShoppingList from '../components/shoppingList';
import { ShoppingListProvider } from '../context/shoppingListContext'; 

export default function ShoppingListPage() {
  return (
    <ShoppingListProvider>
      <div className="container mx-auto p-4">
        <ShoppingList />
      </div>
    </ShoppingListProvider>
  );
}
