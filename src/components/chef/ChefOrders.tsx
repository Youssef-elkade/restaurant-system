import React, { useState } from "react";
import { useData } from "../../contexts/DataContext";
import { ChefHat, Clock, CheckCircle } from "lucide-react";
import { toast } from "sonner";
import { Toaster } from "sonner";

export default function ChefOrders() {
  const { orders, updateOrderStatus } = useData();
  const [filterStatus, setFilterStatus] = useState<string>("All");

  const activeOrders = orders.filter(
    (order) =>
      order.status === "pending" ||
      order.status === "preparing" ||
      order.status === "ready"
  );

  const statusFilters = ["All", "pending", "preparing", "ready"] as const;

  const filteredOrders =
    filterStatus === "All"
      ? activeOrders
      : activeOrders.filter((order) => order.status === filterStatus);

  const sortedOrders = [...filteredOrders].sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  );

  const handleMarkAsPreparing = (orderId: string) => {
    updateOrderStatus(orderId, "preparing");
    toast.success("Order marked as preparing");
  };

  const handleMarkAsReady = (orderId: string) => {
    updateOrderStatus(orderId, "ready");
    toast.success("Order marked as ready");
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "pending":
        return "Pending";
      case "preparing":
        return "Preparing";
      case "ready":
        return "Ready";
      default:
        return status;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <Toaster position="top-right" richColors />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3 mb-8">
          <ChefHat className="w-8 h-8 text-orange-600 dark:text-orange-400" />
          <h1 className="text-gray-900 dark:text-white">Chef Dashboard</h1>
        </div>

        <div className="mb-6 flex gap-2 overflow-x-auto pb-2">
          {statusFilters.map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-4 py-2 rounded-full whitespace-nowrap transition-colors ${
                filterStatus === status
                  ? "bg-orange-600 text-white"
                  : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              }`}
            >
              {status === "All" ? "All Orders" : getStatusLabel(status)}
            </button>
          ))}
        </div>

        {sortedOrders.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-12 text-center">
            <CheckCircle className="w-16 h-16 text-green-600 dark:text-green-400 mx-auto mb-4" />
            <h2 className="text-gray-900 dark:text-white mb-2">
              All caught up
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              No orders to prepare at the moment
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {sortedOrders.map((order) => (
              <div
                key={order.id}
                className={`bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border-l-4 ${
                  order.status === "pending"
                    ? "border-red-500"
                    : order.status === "preparing"
                    ? "border-orange-600"
                    : "border-green-600"
                }`}
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-gray-900 dark:text-white mb-1">
                      Order #{order.id}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      {new Date(order.createdAt).toLocaleTimeString()}
                    </p>
                  </div>

                  <div
                    className={`px-3 py-1 rounded-full flex items-center gap-2 ${
                      order.status === "pending"
                        ? "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400"
                        : order.status === "preparing"
                        ? "bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400"
                        : "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400"
                    }`}
                  >
                    {order.status === "pending" && (
                      <>
                        <Clock className="w-4 h-4" />
                        <span>Pending</span>
                      </>
                    )}
                    {order.status === "preparing" && (
                      <>
                        <Clock className="w-4 h-4" />
                        <span>Preparing</span>
                      </>
                    )}
                    {order.status === "ready" && (
                      <>
                        <CheckCircle className="w-4 h-4" />
                        <span>Ready</span>
                      </>
                    )}
                  </div>
                </div>

                <div className="mb-4">
                  <p className="text-gray-700 dark:text-gray-300 mb-2">
                    Customer: {order.userName}
                  </p>
                  <p className="text-gray-700 dark:text-gray-300 mb-3">
                    Items to prepare:
                  </p>
                  <div className="space-y-2 bg-gray-50 dark:bg-gray-700 rounded-md p-4">
                    {order.items.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex justify-between items-center"
                      >
                        <div>
                          <span className="text-gray-900 dark:text-white">
                            {item.menuItem.name}
                          </span>
                          <span className="text-gray-500 dark:text-gray-400 ml-2">
                            x{item.quantity}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {order.status === "pending" && (
                  <button
                    onClick={() => handleMarkAsPreparing(order.id)}
                    className="w-full bg-orange-600 hover:bg-orange-700 text-white py-3 px-4 rounded-md transition-colors flex items-center justify-center gap-2"
                  >
                    <Clock className="w-5 h-5" />
                    Start Preparing
                  </button>
                )}

                {order.status === "preparing" && (
                  <button
                    onClick={() => handleMarkAsReady(order.id)}
                    className="w-full bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-md transition-colors flex items-center justify-center gap-2"
                  >
                    <CheckCircle className="w-5 h-5" />
                    Mark as Ready
                  </button>
                )}

                {order.status === "ready" && (
                  <div className="w-full bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 py-3 px-4 rounded-md text-center">
                    Waiting for delivery pickup
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
