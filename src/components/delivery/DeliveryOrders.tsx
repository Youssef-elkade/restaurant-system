import React, { useState } from "react";
import { useData } from "../../contexts/DataContext";
import { Truck, MapPin, Phone, CheckCircle, Package } from "lucide-react";
import { toast } from "sonner";
import { Toaster } from "sonner";

export default function DeliveryOrders() {
  const { orders, updateOrderStatus } = useData();
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>("All");

  const deliveryOrders = orders.filter(
    (order) => order.status === "ready" || order.status === "out-for-delivery"
  );

  const statusFilters = ["All", "ready", "out-for-delivery"] as const;

  const filteredOrders =
    filterStatus === "All"
      ? deliveryOrders
      : deliveryOrders.filter((order) => order.status === filterStatus);

  const sortedOrders = [...filteredOrders].sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  );

  const handlePickup = (orderId: string) => {
    updateOrderStatus(orderId, "out-for-delivery");
    toast.success("Order picked up for delivery!", {
      action: {
        label: "X",
        onClick: () => toast.dismiss(),
      },
    });
  };

  const handleDeliver = (orderId: string) => {
    updateOrderStatus(orderId, "delivered");
    toast.success("Order delivered successfully!", {
      action: {
        label: "X",
        onClick: () => toast.dismiss(),
      },
    });
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "ready":
        return "Ready for Pickup";
      case "out-for-delivery":
        return "Out for Delivery";
      default:
        return status;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <Toaster position="top-right" richColors />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3 mb-8">
          <Truck className="w-8 h-8 text-orange-600 dark:text-orange-400" />
          <h1 className="text-gray-900 dark:text-white">Delivery Dashboard</h1>
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
              All deliveries complete!
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              No orders waiting for delivery at the moment
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {sortedOrders.map((order) => (
              <div
                key={order.id}
                className={`bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden border-l-4 ${
                  order.status === "ready"
                    ? "border-green-600"
                    : "border-blue-600"
                }`}
              >
                <div className="p-6">
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
                        order.status === "ready"
                          ? "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400"
                          : "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
                      }`}
                    >
                      {order.status === "ready" ? (
                        <>
                          <Package className="w-4 h-4" />
                          Ready for Pickup
                        </>
                      ) : (
                        <>
                          <Truck className="w-4 h-4" />
                          Out for Delivery
                        </>
                      )}
                    </div>
                  </div>

                  <div className="space-y-3 mb-4">
                    <div className="flex items-start gap-2">
                      <MapPin className="w-5 h-5 text-orange-600 dark:text-orange-400 mt-0.5" />
                      <div>
                        <p className="text-gray-700 dark:text-gray-300">
                          Delivery Address
                        </p>
                        <p className="text-gray-900 dark:text-white">
                          {order.deliveryAddress}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <Phone className="w-5 h-5 text-orange-600 dark:text-orange-400 mt-0.5" />
                      <div>
                        <p className="text-gray-700 dark:text-gray-300">
                          Customer Contact
                        </p>
                        <p className="text-gray-900 dark:text-white">
                          {order.userName} - {order.phone}
                        </p>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() =>
                      setExpandedOrder(
                        expandedOrder === order.id ? null : order.id
                      )
                    }
                    className="text-orange-600 dark:text-orange-400 hover:underline mb-4"
                  >
                    {expandedOrder === order.id ? "Hide" : "View"} Order Items
                  </button>

                  {expandedOrder === order.id && (
                    <div className="mb-4 bg-gray-50 dark:bg-gray-700 rounded-md p-4">
                      <div className="space-y-2">
                        {order.items.map((item: any, idx: number) => (
                          <div
                            key={idx}
                            className="flex justify-between text-gray-600 dark:text-gray-400"
                          >
                            <span>
                              {item.menuItem.name} x{item.quantity}
                            </span>
                            <span>
                              {(item.menuItem.price * item.quantity).toFixed(2)}
                              LE
                            </span>
                          </div>
                        ))}
                        <div className="border-t border-gray-200 dark:border-gray-600 pt-2 flex justify-between">
                          <span className="text-gray-900 dark:text-white">
                            Total
                          </span>
                          <span className="text-orange-600 dark:text-orange-400">
                            {order.total.toFixed(2)} LE
                          </span>
                        </div>
                        <div className="flex justify-between text-gray-600 dark:text-gray-400">
                          <span>Payment Method</span>
                          <span>{order.paymentMethod}</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {order.status === "ready" && (
                    <button
                      onClick={() => handlePickup(order.id)}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-md transition-colors flex items-center justify-center gap-2"
                    >
                      <Truck className="w-5 h-5" />
                      Pick Up Order
                    </button>
                  )}

                  {order.status === "out-for-delivery" && (
                    <button
                      onClick={() => handleDeliver(order.id)}
                      className="w-full bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-md transition-colors flex items-center justify-center gap-2"
                    >
                      <CheckCircle className="w-5 h-5" />
                      Mark as Delivered
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
