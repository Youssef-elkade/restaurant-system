import React from "react";
import { useCart } from "../../contexts/CartContext";
import { ShoppingCart, Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { ImageWithFallback } from "../ImageWithFallback";

interface CartProps {
  onCheckout: () => void;
}

export default function Cart({ onCheckout }: CartProps) {
  const { cartItems, removeFromCart, updateQuantity, getCartTotal, clearCart } =
    useCart();

  const handleQuantityChange = (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    updateQuantity(itemId, newQuantity);
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-gray-900 dark:text-white mb-8">Shopping Cart</h1>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-12 text-center">
            <ShoppingCart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-gray-900 dark:text-white mb-2">
              Your cart is empty
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Add some delicious items to get started!
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-gray-900 dark:text-white mb-8">Shopping Cart</h1>

        <div className="flex justify-end mb-4">
          <button
            onClick={clearCart}
            className="flex items-center gap-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 p-2 rounded-md"
          >
            <Trash2 className="w-4 h-4" />
            Clear All
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map(({ menuItem, quantity }) => (
              <div
                key={menuItem.id}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 flex gap-4"
              >
                <ImageWithFallback
                  src={`${import.meta.env.BASE_URL}${menuItem.image}`}
                  alt={menuItem.name}
                  className="w-24 h-24 object-cover rounded-md"
                />
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="text-gray-900 dark:text-white">
                        {menuItem.name}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400">
                        {menuItem.category}
                      </p>
                    </div>
                    <button
                      onClick={() => removeFromCart(menuItem.id)}
                      className="text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 p-2 rounded-md"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() =>
                          handleQuantityChange(menuItem.id, quantity - 1)
                        }
                        className="w-8 h-8 flex items-center justify-center bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="text-gray-900 dark:text-white w-8 text-center">
                        {quantity}
                      </span>
                      <button
                        onClick={() =>
                          handleQuantityChange(menuItem.id, quantity + 1)
                        }
                        className="w-8 h-8 flex items-center justify-center bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                    <span className="text-orange-600 dark:text-orange-400">
                      {(menuItem.price * quantity).toFixed(2)} LE
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 sticky top-24">
              <h2 className="text-gray-900 dark:text-white mb-4">
                Order Summary
              </h2>
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                  <span>Subtotal</span>
                  <span>{getCartTotal().toFixed(2)} LE</span>
                </div>
                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                  <span>Delivery Fee</span>
                  <span>15 LE</span>
                </div>
                <div className="border-t border-gray-200 dark:border-gray-700 pt-3">
                  <div className="flex justify-between text-gray-900 dark:text-white">
                    <span>Total</span>
                    <span>{(getCartTotal() + 15).toFixed(2)} LE</span>
                  </div>
                </div>
              </div>
              <button
                onClick={onCheckout}
                className="w-full bg-orange-600 hover:bg-orange-700 text-white py-3 px-4 rounded-md transition-colors flex items-center justify-center gap-2"
              >
                <ShoppingBag className="w-5 h-5" />
                Proceed to Checkout
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
