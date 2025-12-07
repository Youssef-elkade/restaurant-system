import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { DataProvider } from './contexts/DataContext';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import CustomerHome from './components/customer/CustomerHome';
import Menu from './components/customer/Menu';
import Cart from './components/customer/Cart';
import Checkout from './components/customer/Checkout';
import OrderConfirmation from './components/customer/OrderConfirmation';
import CustomerOrders from './components/customer/CustomerOrders';
import AdminDashboard from './components/admin/AdminDashboard';
import UserManagement from './components/admin/UserManagement';
import MenuManagement from './components/admin/MenuManagement';
import OrderManagement from './components/admin/OrderManagement';
import ChefOrders from './components/chef/ChefOrders';
import DeliveryOrders from './components/delivery/DeliveryOrders';
import Navigation from './components/Navigation';
import Profile from './components/Profile';

type Page = 'home' | 'menu' | 'cart' | 'checkout' | 'confirmation' | 'orders' | 
  'login' | 'register' | 'admin-dashboard' | 'admin-users' | 'admin-menu' | 
  'admin-orders' | 'chef-orders' | 'delivery-orders' | 'profile';

function AppContent() {
  const { user, isAuthenticated } = useAuth();
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [confirmedOrderId, setConfirmedOrderId] = useState<string | null>(null);

  useEffect(() => {
    if (isAuthenticated && user) {
      if (user.role === 'admin' && currentPage === 'login') {
        setCurrentPage('admin-dashboard');
      } else if (user.role === 'chef' && currentPage === 'login') {
        setCurrentPage('chef-orders');
      } else if (user.role === 'delivery' && currentPage === 'login') {
        setCurrentPage('delivery-orders');
      } else if (user.role === 'customer' && currentPage === 'login') {
        setCurrentPage('home');
      }
    } else if (!isAuthenticated && currentPage !== 'register') {
      setCurrentPage('login');
    }
  }, [isAuthenticated, user, currentPage]);

  const handleOrderConfirmed = (orderId: string) => {
    setConfirmedOrderId(orderId);
    setCurrentPage('confirmation');
  };

  const renderPage = () => {
    if (!isAuthenticated) {
      if (currentPage === 'register') {
        return <Register onSwitchToLogin={() => setCurrentPage('login')} />;
      }
      return <Login onSwitchToRegister={() => setCurrentPage('register')} />;
    }

    if (currentPage === 'profile') {
      return <Profile />;
    }

    if (user?.role === 'admin') {
      switch (currentPage) {
        case 'admin-dashboard':
          return <AdminDashboard />;
        case 'admin-users':
          return <UserManagement />;
        case 'admin-menu':
          return <MenuManagement />;
        case 'admin-orders':
          return <OrderManagement />;
        default:
          return <AdminDashboard />;
      }
    }

    if (user?.role === 'chef') {
      return <ChefOrders />;
    }

    if (user?.role === 'delivery') {
      return <DeliveryOrders />;
    }

    switch (currentPage) {
      case 'home':
        return <CustomerHome onNavigateToMenu={() => setCurrentPage('menu')} />;
      case 'menu':
        return <Menu />;
      case 'cart':
        return <Cart onCheckout={() => setCurrentPage('checkout')} />;
      case 'checkout':
        return <Checkout onOrderConfirmed={handleOrderConfirmed} />;
      case 'confirmation':
        return <OrderConfirmation orderId={confirmedOrderId} onBackToHome={() => setCurrentPage('home')} />;
      case 'orders':
        return <CustomerOrders />;
      default:
        return <CustomerHome onNavigateToMenu={() => setCurrentPage('menu')} />;
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors">
      {isAuthenticated && <Navigation currentPage={currentPage} onNavigate={setCurrentPage} />}
      {renderPage()}
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <DataProvider>
          <CartProvider>
            <AppContent />
          </CartProvider>
        </DataProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}