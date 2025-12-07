import React from 'react';
import { CheckCircle, Home } from 'lucide-react';

interface OrderConfirmationProps {
  orderId: string | null;
  onBackToHome: () => void;
}

export default function OrderConfirmation({ orderId, onBackToHome }: OrderConfirmationProps) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full mb-6">
            <CheckCircle className="w-12 h-12 text-green-600 dark:text-green-400" />
          </div>
          <h1 className="text-gray-900 dark:text-white mb-4">Order Confirmed!</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-2">
            Thank you for your order. Your delicious food is being prepared!
          </p>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            Order ID: <span className="text-orange-600 dark:text-orange-400">#{orderId}</span>
          </p>

          <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg p-6 mb-8">
            <h3 className="text-gray-900 dark:text-white mb-4">What happens next?</h3>
            <div className="space-y-3 text-left">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-orange-600 text-white rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  1
                </div>
                <div>
                  <p className="text-gray-900 dark:text-white">Order Confirmation</p>
                  <p className="text-gray-600 dark:text-gray-400">Your order has been received and confirmed</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-orange-600 text-white rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  2
                </div>
                <div>
                  <p className="text-gray-900 dark:text-white">Preparing</p>
                  <p className="text-gray-600 dark:text-gray-400">Our chef is preparing your order</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-orange-600 text-white rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  3
                </div>
                <div>
                  <p className="text-gray-900 dark:text-white">Out for Delivery</p>
                  <p className="text-gray-600 dark:text-gray-400">Your order is on its way</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-orange-600 text-white rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  4
                </div>
                <div>
                  <p className="text-gray-900 dark:text-white">Delivered</p>
                  <p className="text-gray-600 dark:text-gray-400">Enjoy your meal!</p>
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={onBackToHome}
            className="bg-orange-600 hover:bg-orange-700 text-white py-3 px-6 rounded-md transition-colors inline-flex items-center gap-2"
          >
            <Home className="w-5 h-5" />
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
}
