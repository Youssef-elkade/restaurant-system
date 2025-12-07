import React from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useData } from "../../contexts/DataContext";
import { ChevronRight, Clock, Star, TrendingUp } from "lucide-react";
import { ImageWithFallback } from "../ImageWithFallback";

interface CustomerHomeProps {
  onNavigateToMenu: () => void;
}

export default function CustomerHome({ onNavigateToMenu }: CustomerHomeProps) {
  const { user } = useAuth();
  const { menuItems } = useData();

  const categories = Array.from(new Set(menuItems.map((item) => item.category)));
  const featuredItems = menuItems.slice(0, 4);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="bg-gradient-to-r from-orange-600 to-orange-500 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-white mb-4">Welcome {user?.name}</h1>
            <p className="text-orange-100 mb-8 max-w-2xl mx-auto">
              Craving something delicious? Browse our menu and get your favorite
              food delivered right to your door.
            </p>
            <button
              onClick={onNavigateToMenu}
              className="bg-white text-orange-600 px-8 py-3 rounded-full hover:bg-orange-50 transition-colors inline-flex items-center gap-2"
            >
              Order Now
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-full mb-4">
              <Clock className="w-6 h-6 text-orange-600 dark:text-orange-400" />
            </div>
            <h3 className="text-gray-900 dark:text-white mb-2">
              Fast Delivery
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Get your food delivered in 30 minutes or less
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-full mb-4">
              <Star className="w-6 h-6 text-orange-600 dark:text-orange-400" />
            </div>
            <h3 className="text-gray-900 dark:text-white mb-2">Quality Food</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Fresh ingredients and authentic recipes
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-full mb-4">
              <TrendingUp className="w-6 h-6 text-orange-600 dark:text-orange-400" />
            </div>
            <h3 className="text-gray-900 dark:text-white mb-2">
              Easy Ordering
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Simple and secure online ordering process
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-gray-900 dark:text-white mb-6">
          Browse by Category
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((category) => (
            <button
              key={category}
              onClick={onNavigateToMenu}
              className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow text-center group"
            >
              <div className="text-gray-900 dark:text-white group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">
                {category}
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-gray-900 dark:text-white">Featured Dishes</h2>
          <button
            onClick={onNavigateToMenu}
            className="text-orange-600 dark:text-orange-400 hover:underline flex items-center gap-1"
          >
            View All
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredItems.map((item) => (
            <div
              key={item.id}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
              onClick={onNavigateToMenu}
            >
              <ImageWithFallback
                src={`${import.meta.env.BASE_URL}${item.image}`}
                alt={item.name}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="text-gray-900 dark:text-white mb-2">
                  {item.name}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                  {item.description}
                </p>
                <div className="flex justify-between items-center">
                  <span className="text-orange-600 dark:text-orange-400">
                    {item.price.toFixed(2)} LE
                  </span>
                  <span className="text-gray-500 dark:text-gray-400">
                    {item.category}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
