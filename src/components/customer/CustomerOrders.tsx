import React from "react";
import { useData } from "../../contexts/DataContext";
import { useAuth } from "../../contexts/AuthContext";
import { Package, Clock, CheckCircle, Truck } from "lucide-react";

export default function CustomerOrders() {
  const { orders } = useData();
  const { user } = useAuth();

  const myOrders = orders.filter((order) => order.userId === user?.id);

  const normalizeStatusForCustomer = (status: string) => {
    return status === "pending" ? "preparing" : status;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "preparing":
        return (
          <Clock className="w-5 h-5 text-orange-600 dark:text-orange-400" />
        );
      case "ready":
        return (
          <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
        );
      case "out-for-delivery":
        return <Truck className="w-5 h-5 text-blue-600 dark:text-blue-400" />;
      case "delivered":
        return (
          <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
        );
      default:
        return <Package className="w-5 h-5" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "preparing":
        return "Preparing";
      case "ready":
        return "Ready and Waiting for Delivery";
      case "out-for-delivery":
        return "Out for Delivery";
      case "delivered":
        return "Delivered";
      default:
        return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "preparing":
        return "bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400";
      case "ready":
        return "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400";
      case "out-for-delivery":
        return "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400";
      case "delivered":
        return "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400";
      default:
        return "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-gray-900 dark:text-white mb-8">My Orders</h1>

        {myOrders.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-12 text-center">
            <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-gray-900 dark:text-white mb-2">
              No orders yet
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Start ordering to see your order history here
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {myOrders.map((order) => {
              const displayStatus = normalizeStatusForCustomer(order.status);

              return (
                <div
                  key={order.id}
                  className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-gray-900 dark:text-white mb-1">
                        Order #{order.id}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400">
                        {new Date(order.createdAt).toLocaleDateString()} at{" "}
                        {new Date(order.createdAt).toLocaleTimeString()}
                      </p>
                    </div>
                    <div
                      className={`px-3 py-1 rounded-full flex items-center gap-2 ${getStatusColor(
                        displayStatus
                      )}`}
                    >
                      {getStatusIcon(displayStatus)}
                      {getStatusText(displayStatus)}
                    </div>
                  </div>

                  <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mb-4">
                    <div className="space-y-2">
                      {order.items.map((item, idx) => (
                        <div
                          key={idx}
                          className="flex justify-between text-gray-600 dark:text-gray-400"
                        >
                          <span>
                            {item.menuItem.name} x{item.quantity}
                          </span>
                          <span>
                            {(item.menuItem.price * item.quantity).toFixed(2)}{" "}
                            LE
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-600 dark:text-gray-400">
                        Payment Method
                      </span>
                      <span className="text-gray-900 dark:text-white">
                        {order.paymentMethod}
                      </span>
                    </div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-600 dark:text-gray-400">
                        Delivery Address
                      </span>
                      <span className="text-gray-900 dark:text-white text-right max-w-xs">
                        {order.deliveryAddress}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-900 dark:text-white">
                        Total
                      </span>
                      <span className="text-orange-600 dark:text-orange-400">
                        {order.total.toFixed(2)} LE
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
