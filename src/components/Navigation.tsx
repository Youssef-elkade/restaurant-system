import React, { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useCart } from "../contexts/CartContext";
import { useTheme } from "../contexts/ThemeContext";
import {
  Home,
  ShoppingCart,
  User,
  LogOut,
  Sun,
  Moon,
  Package,
  Settings,
  Users,
  Menu as MenuIcon,
  ChefHat,
  Truck,
  UtensilsCrossed,
} from "lucide-react";

interface NavigationProps {
  currentPage: string;
  onNavigate: (page: any) => void;
}

export default function Navigation({
  currentPage,
  onNavigate,
}: NavigationProps) {
  const { user, logout } = useAuth();
  const { getCartCount } = useCart();
  const { theme, toggleTheme } = useTheme();
  const cartCount = getCartCount();

  const [isMobile, setIsMobile] = useState<boolean>(
    typeof window !== "undefined" ? window.innerWidth < 930 : false
  );
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    function onResize() {
      const mobile = window.innerWidth < 930;
      setIsMobile(mobile);
      if (!mobile) setMobileMenuOpen(false);
    }
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const handleLogout = () => {
    setMobileMenuOpen(false);
    logout();
  };

  const navigateAndClose = (page: string) => {
    setMobileMenuOpen(false);
    onNavigate(page);
  };

  const renderMobileMenu = () => {
    if (!isMobile || !mobileMenuOpen) return null;

    return (
      <div className="md:hidden absolute inset-x-0 top-16 bg-white dark:bg-gray-800 shadow-md z-40">
        <div className="px-4 py-3 flex flex-col gap-1">
          {user?.role === "customer" && (
            <>
              <button
                onClick={() => navigateAndClose("home")}
                className={`px-3 py-2 rounded-md flex items-center gap-2 ${
                  currentPage === "home"
                    ? "bg-orange-100 dark:bg-orange-900 text-orange-600 dark:text-orange-400"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
              >
                <div className="flex items-center gap-2">
                  <Home className="w-4 h-4" />
                  Home
                </div>
              </button>

              <button
                onClick={() => navigateAndClose("menu")}
                className={`px-3 py-2 rounded-md flex items-center gap-2 ${
                  currentPage === "menu"
                    ? "bg-orange-100 dark:bg-orange-900 text-orange-600 dark:text-orange-400"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
              >
                <div className="flex items-center gap-2">
                  <MenuIcon className="w-4 h-4" />
                  Menu
                </div>
              </button>

              <button
                onClick={() => navigateAndClose("orders")}
                className={`px-3 py-2 rounded-md flex items-center gap-2 ${
                  currentPage === "orders"
                    ? "bg-orange-100 dark:bg-orange-900 text-orange-600 dark:text-orange-400"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
              >
                <div className="flex items-center gap-2">
                  <Package className="w-4 h-4" />
                  My Orders
                </div>
              </button>

              <button
                onClick={() => navigateAndClose("profile")}
                className={`px-3 py-2 rounded-md flex items-center gap-2 ${
                  currentPage === "profile"
                    ? "bg-orange-100 dark:bg-orange-900 text-orange-600 dark:text-orange-400"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
              >
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  {user.name}
                </div>
              </button>
            </>
          )}

          {user?.role === "admin" && (
            <>
              <button
                onClick={() => navigateAndClose("admin-dashboard")}
                className={`px-3 py-2 rounded-md flex items-center gap-2 ${
                  currentPage === "admin-dashboard"
                    ? "bg-orange-100 dark:bg-orange-900 text-orange-600 dark:text-orange-400"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
              >
                <div className="flex items-center gap-2">
                  <Home className="w-4 h-4" />
                  Dashboard
                </div>
              </button>

              <button
                onClick={() => navigateAndClose("admin-orders")}
                className={`px-3 py-2 rounded-md flex items-center gap-2 ${
                  currentPage === "admin-orders"
                    ? "bg-orange-100 dark:bg-orange-900 text-orange-600 dark:text-orange-400"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
              >
                <div className="flex items-center gap-2">
                  <Package className="w-4 h-4" />
                  Orders
                </div>
              </button>

              <button
                onClick={() => navigateAndClose("admin-menu")}
                className={`px-3 py-2 rounded-md flex items-center gap-2 ${
                  currentPage === "admin-menu"
                    ? "bg-orange-100 dark:bg-orange-900 text-orange-600 dark:text-orange-400"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
              >
                <div className="flex items-center gap-2">
                  <MenuIcon className="w-4 h-4" />
                  Menu
                </div>
              </button>

              <button
                onClick={() => navigateAndClose("admin-users")}
                className={`px-3 py-2 rounded-md flex items-center gap-2 ${
                  currentPage === "admin-users"
                    ? "bg-orange-100 dark:bg-orange-900 text-orange-600 dark:text-orange-400"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
              >
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  Users
                </div>
              </button>
              <button
                onClick={() => navigateAndClose("profile")}
                className={`px-3 py-2 rounded-md flex items-center gap-2 ${
                  currentPage === "profile"
                    ? "bg-orange-100 dark:bg-orange-900 text-orange-600 dark:text-orange-400"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
              >
                <div className="flex items-center gap-2">
                  <Settings className="w-4 h-4" />
                  {user.name}
                </div>
              </button>
            </>
          )}

          {user?.role === "delivery" && (
            <>
              <button
                onClick={() => navigateAndClose("delivery-orders")}
                className={`px-3 py-2 rounded-md flex items-center gap-2 ${
                  currentPage === "delivery-orders"
                    ? "bg-orange-100 dark:bg-orange-900 text-orange-600 dark:text-orange-400"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
              >
                <div className="flex items-center gap-2">
                  <Home className="w-4 h-4" />
                  Dashboard
                </div>
              </button>
              <button
                onClick={() => navigateAndClose("profile")}
                className={`px-3 py-2 rounded-md flex items-center gap-2 ${
                  currentPage === "profile"
                    ? "bg-orange-100 dark:bg-orange-900 text-orange-600 dark:text-orange-400"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
              >
                <div className="flex items-center gap-2">
                  <Truck className="w-4 h-4" />
                  {user.name}
                </div>
              </button>
            </>
          )}

          {user?.role === "chef" && (
            <>
              <button
                onClick={() => navigateAndClose("chef-orders")}
                className={`px-3 py-2 rounded-md flex items-center gap-2 ${
                  currentPage === "chef-orders"
                    ? "bg-orange-100 dark:bg-orange-900 text-orange-600 dark:text-orange-400"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
              >
                <div className="flex items-center gap-2">
                  <Home className="w-4 h-4" />
                  Dashboard
                </div>
              </button>
              <button
                onClick={() => navigateAndClose("profile")}
                className={`px-3 py-2 rounded-md flex items-center gap-2 ${
                  currentPage === "profile"
                    ? "bg-orange-100 dark:bg-orange-900 text-orange-600 dark:text-orange-400"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
              >
                <div className="flex items-center gap-2">
                  <ChefHat className="w-4 h-4" />
                  {user.name}
                </div>
              </button>
            </>
          )}

          {/* <div className="border-t border-gray-200 dark:border-gray-700 mt-2 pt-2 flex flex-col gap-1">
            <button
              onClick={() => {
                toggleTheme();
                setMobileMenuOpen(false);
              }}
              className="text-left px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
            >
              {theme === "light" ? (
                <Moon className="w-4 h-4" />
              ) : (
                <Sun className="w-4 h-4" />
              )}
              {theme === "light" ? "Dark Mode" : "Light Mode"}
            </button>

            <button
              onClick={handleLogout}
              className="text-left px-3 py-2 rounded-md hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-2 text-red-600 dark:text-red-400"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div> */}
        </div>
      </div>
    );
  };

  if (user?.role === "customer") {
    return (
      <nav className="bg-white dark:bg-gray-800 shadow-md sticky top-0 z-50 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-4">
              {isMobile && (
                <button
                  onClick={() => setMobileMenuOpen((s) => !s)}
                  aria-label="Open menu"
                  className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <MenuIcon className="w-6 h-6 text-gray-700 dark:text-gray-300" />
                </button>
              )}

              <div className="flex items-center gap-3 flex-shrink-0">
                <button
                  onClick={() => onNavigate("home")}
                  className="w-8 h-8 bg-orange-600 rounded-lg flex items-center justify-center"
                >
                  <UtensilsCrossed className="w-5 h-5 text-white" />
                </button>
                <button
                  onClick={() => onNavigate("home")}
                  className="flex flex-col"
                >
                  <span className="text-orange-600 dark:text-orange-400 leading-none">
                    Elite Foods
                  </span>
                </button>
              </div>

              <div className={`${isMobile ? "hidden" : "flex"} gap-4`}>
                <button
                  onClick={() => onNavigate("home")}
                  className={`px-3 py-2 rounded-md flex items-center gap-2 ${
                    currentPage === "home"
                      ? "bg-orange-100 dark:bg-orange-900 text-orange-600 dark:text-orange-400"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  }`}
                >
                  <Home className="w-4 h-4" />
                  Home
                </button>
                <button
                  onClick={() => onNavigate("menu")}
                  className={`px-3 py-2 rounded-md flex items-center gap-2 ${
                    currentPage === "menu"
                      ? "bg-orange-100 dark:bg-orange-900 text-orange-600 dark:text-orange-400"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  }`}
                >
                  <MenuIcon className="w-4 h-4" />
                  Menu
                </button>
                <button
                  onClick={() => onNavigate("orders")}
                  className={`px-3 py-2 rounded-md flex items-center gap-2 ${
                    currentPage === "orders"
                      ? "bg-orange-100 dark:bg-orange-900 text-orange-600 dark:text-orange-400"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  }`}
                >
                  <Package className="w-4 h-4" />
                  My Orders
                </button>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <button
                onClick={() => onNavigate("cart")}
                className="relative p-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
              >
                <ShoppingCart className="w-5 h-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-orange-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </button>

              <button
                onClick={toggleTheme}
                className="p-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
              >
                {theme === "light" ? (
                  <Moon className="w-5 h-5" />
                ) : (
                  <Sun className="w-5 h-5" />
                )}
              </button>

              <button
                onClick={() => onNavigate("profile")}
                className={`${
                  isMobile ? "hidden" : "flex"
                } px-3 py-2 rounded-md items-center gap-2 ${
                  currentPage === "profile"
                    ? "bg-orange-100 dark:bg-orange-900 text-orange-600 dark:text-orange-400"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
              >
                <User className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                <span className="max-w-[90px] truncate">{user.name}</span>
              </button>

              <button
                onClick={handleLogout}
                className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {renderMobileMenu()}
      </nav>
    );
  }

  if (user?.role === "admin") {
    return (
      <nav className="bg-white dark:bg-gray-800 shadow-md sticky top-0 z-50 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-4">
              {isMobile && (
                <button
                  onClick={() => setMobileMenuOpen((s) => !s)}
                  aria-label="Open menu"
                  className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <MenuIcon className="w-6 h-6 text-gray-700 dark:text-gray-300" />
                </button>
              )}

              <div className="flex items-center gap-3 flex-shrink-0">
                <button
                  onClick={() => onNavigate("admin-dashboard")}
                  className="w-8 h-8 bg-orange-600 rounded-lg flex items-center justify-center"
                >
                  <UtensilsCrossed className="w-5 h-5 text-white" />
                </button>
                <button
                  onClick={() => onNavigate("admin-dashboard")}
                  className="flex flex-col"
                >
                  <span className="text-orange-600 dark:text-orange-400 leading-none">
                    Elite Foods
                  </span>
                </button>
              </div>

              <div className={`${isMobile ? "hidden" : "flex"} gap-4`}>
                <button
                  onClick={() => onNavigate("admin-dashboard")}
                  className={`px-3 py-2 rounded-md flex items-center gap-2 ${
                    currentPage === "admin-dashboard"
                      ? "bg-orange-100 dark:bg-orange-900 text-orange-600 dark:text-orange-400"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  }`}
                >
                  <Home className="w-4 h-4" />
                  Dashboard
                </button>
                <button
                  onClick={() => onNavigate("admin-orders")}
                  className={`px-3 py-2 rounded-md flex items-center gap-2 ${
                    currentPage === "admin-orders"
                      ? "bg-orange-100 dark:bg-orange-900 text-orange-600 dark:text-orange-400"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  }`}
                >
                  <Package className="w-4 h-4" />
                  Orders
                </button>
                <button
                  onClick={() => onNavigate("admin-menu")}
                  className={`px-3 py-2 rounded-md flex items-center gap-2 ${
                    currentPage === "admin-menu"
                      ? "bg-orange-100 dark:bg-orange-900 text-orange-600 dark:text-orange-400"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  }`}
                >
                  <MenuIcon className="w-4 h-4" />
                  Menu
                </button>
                <button
                  onClick={() => onNavigate("admin-users")}
                  className={`px-3 py-2 rounded-md flex items-center gap-2 ${
                    currentPage === "admin-users"
                      ? "bg-orange-100 dark:bg-orange-900 text-orange-600 dark:text-orange-400"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  }`}
                >
                  <Users className="w-4 h-4" />
                  Users
                </button>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <button
                onClick={toggleTheme}
                className="p-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
              >
                {theme === "light" ? (
                  <Moon className="w-5 h-5" />
                ) : (
                  <Sun className="w-5 h-5" />
                )}
              </button>
              <button
                onClick={() => onNavigate("profile")}
                className={`${
                  isMobile ? "hidden" : "flex"
                } px-3 py-2 rounded-md items-center gap-2 ${
                  currentPage === "profile"
                    ? "bg-orange-100 dark:bg-orange-900 text-orange-600 dark:text-orange-400"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
              >
                <Settings className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                <span className="max-w-[90px] truncate">{user.name}</span>
              </button>
              <button
                onClick={handleLogout}
                className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {renderMobileMenu()}
      </nav>
    );
  }

  if (user?.role === "chef") {
    return (
      <nav className="bg-white dark:bg-gray-800 shadow-md sticky top-0 z-50 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-4">
              {isMobile && (
                <button
                  onClick={() => setMobileMenuOpen((s) => !s)}
                  aria-label="Open menu"
                  className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <MenuIcon className="w-6 h-6 text-gray-700 dark:text-gray-300" />
                </button>
              )}

              <div className="flex items-center gap-3 flex-shrink-0">
                <button
                  onClick={() => onNavigate("chef-orders")}
                  className="w-8 h-8 bg-orange-600 rounded-lg flex items-center justify-center"
                >
                  <UtensilsCrossed className="w-5 h-5 text-white" />
                </button>
                <button
                  onClick={() => onNavigate("chef-orders")}
                  className="flex flex-col"
                >
                  <span className="text-orange-600 dark:text-orange-400 leading-none">
                    Elite Foods
                  </span>
                </button>
              </div>

              <div className={`${isMobile ? "hidden" : "flex"} gap-4`}>
                <button
                  onClick={() => onNavigate("chef-orders")}
                  className={`px-3 py-2 rounded-md flex items-center gap-2 ${
                    currentPage === "chef-orders"
                      ? "bg-orange-100 dark:bg-orange-900 text-orange-600 dark:text-orange-400"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  }`}
                >
                  <Home className="w-4 h-4" />
                  Dashboard
                </button>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <button
                onClick={toggleTheme}
                className="p-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
              >
                {theme === "light" ? (
                  <Moon className="w-5 h-5" />
                ) : (
                  <Sun className="w-5 h-5" />
                )}
              </button>
              <button
                onClick={() => onNavigate("profile")}
                className={`${
                  isMobile ? "hidden" : "flex"
                } px-3 py-2 rounded-md items-center gap-2 ${
                  currentPage === "profile"
                    ? "bg-orange-100 dark:bg-orange-900 text-orange-600 dark:text-orange-400"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
              >
                <ChefHat className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                <span className="max-w-[90px] truncate">{user.name}</span>
              </button>
              <button
                onClick={handleLogout}
                className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {renderMobileMenu()}
      </nav>
    );
  }

  if (user?.role === "delivery") {
    return (
      <nav className="bg-white dark:bg-gray-800 shadow-md sticky top-0 z-50 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-4">
              {isMobile && (
                <button
                  onClick={() => setMobileMenuOpen((s) => !s)}
                  aria-label="Open menu"
                  className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <MenuIcon className="w-6 h-6 text-gray-700 dark:text-gray-300" />
                </button>
              )}

              <div className="flex items-center gap-3 flex-shrink-0">
                <button
                  onClick={() => onNavigate("delivery-orders")}
                  className="w-8 h-8 bg-orange-600 rounded-lg flex items-center justify-center"
                >
                  <UtensilsCrossed className="w-5 h-5 text-white" />
                </button>
                <button
                  onClick={() => onNavigate("delivery-orders")}
                  className="flex flex-col"
                >
                  <span className="text-orange-600 dark:text-orange-400 leading-none">
                    Elite Foods
                  </span>
                </button>
              </div>

              <div className={`${isMobile ? "hidden" : "flex"} gap-4`}>
                <button
                  onClick={() => onNavigate("delivery-orders")}
                  className={`px-3 py-2 rounded-md flex items-center gap-2 ${
                    currentPage === "delivery-orders"
                      ? "bg-orange-100 dark:bg-orange-900 text-orange-600 dark:text-orange-400"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  }`}
                >
                  <Home className="w-4 h-4" />
                  Dashboard
                </button>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <button
                onClick={toggleTheme}
                className="p-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
              >
                {theme === "light" ? (
                  <Moon className="w-5 h-5" />
                ) : (
                  <Sun className="w-5 h-5" />
                )}
              </button>
              <button
                onClick={() => onNavigate("profile")}
                className={`${
                  isMobile ? "hidden" : "flex"
                } px-3 py-2 rounded-md items-center gap-2 ${
                  currentPage === "profile"
                    ? "bg-orange-100 dark:bg-orange-900 text-orange-600 dark:text-orange-400"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
              >
                <Truck className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                <span className="max-w-[90px] truncate">{user.name}</span>
              </button>
              <button
                onClick={handleLogout}
                className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {renderMobileMenu()}
      </nav>
    );
  }

  return null;
}
