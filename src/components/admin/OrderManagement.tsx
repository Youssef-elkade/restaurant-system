import React, { useState } from "react";
import { useData } from "../../contexts/DataContext";
import {
  Trash2,
  Eye,
  X,
  ChevronRight,
  Package,
  Clock,
  CheckCircle,
  Truck,
} from "lucide-react";

import { toast } from "sonner";
import { Toaster } from "sonner";
import DeleteConfirmModal from "../DeleteConfirmModal";

export default function OrderManagement() {
  const { orders, updateOrderStatus, deleteOrder } = useData();
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState<string | null>(null);

  const filteredOrders =
    filterStatus === "all"
      ? orders
      : orders.filter((order) => order.status === filterStatus);

  const handleStatusChange = (orderId: string, newStatus: any) => {
    updateOrderStatus(orderId, newStatus);
    toast.success("Order status updated", {
      action: {
        label: "✕",
        onClick: () => toast.dismiss(),
      },
    });
  };

  const openDeleteModal = (orderId: string) => {
    setOrderToDelete(orderId);
    setIsDeleteModalOpen(true);
  };

  const confirmDeleteOrder = () => {
    if (!orderToDelete) return;

    deleteOrder(orderToDelete);
    toast.success("Order deleted", {
      action: {
        label: "✕",
        onClick: () => toast.dismiss(),
      },
    });

    if (selectedOrder && selectedOrder.id === orderToDelete) {
      setSelectedOrder(null);
    }

    setOrderToDelete(null);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400";
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

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "pending":
        return "Pending";
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

  const getStatusIcon = (status: string) => {
      switch (status) {
        case "pending":
          return (
            <Clock className="w-5 h-5 text-red-600 dark:text-red-400" />
          );
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

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <Toaster position="top-right" richColors />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-gray-900 dark:text-white mb-8">Order Management</h1>

        <div className="mb-6 flex gap-2 overflow-x-auto pb-2">
          <button
            onClick={() => setFilterStatus("all")}
            className={`px-4 py-2 rounded-full whitespace-nowrap transition-colors ${
              filterStatus === "all"
                ? "bg-orange-600 text-white"
                : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
            }`}
          >
            All Orders
          </button>

          <button
            onClick={() => setFilterStatus("pending")}
            className={`px-4 py-2 rounded-full whitespace-nowrap transition-colors ${
              filterStatus === "pending"
                ? "bg-orange-600 text-white"
                : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
            }`}
          >
            Pending
          </button>

          <button
            onClick={() => setFilterStatus("preparing")}
            className={`px-4 py-2 rounded-full whitespace-nowrap transition-colors ${
              filterStatus === "preparing"
                ? "bg-orange-600 text-white"
                : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
            }`}
          >
            Preparing
          </button>
          <button
            onClick={() => setFilterStatus("ready")}
            className={`px-4 py-2 rounded-full whitespace-nowrap transition-colors ${
              filterStatus === "ready"
                ? "bg-orange-600 text-white"
                : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
            }`}
          >
            Ready and Waiting for Delivery
          </button>
          <button
            onClick={() => setFilterStatus("out-for-delivery")}
            className={`px-4 py-2 rounded-full whitespace-nowrap transition-colors ${
              filterStatus === "out-for-delivery"
                ? "bg-orange-600 text-white"
                : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
            }`}
          >
            Out for Delivery
          </button>
          <button
            onClick={() => setFilterStatus("delivered")}
            className={`px-4 py-2 rounded-full whitespace-nowrap transition-colors ${
              filterStatus === "delivered"
                ? "bg-orange-600 text-white"
                : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
            }`}
          >
            Delivered
          </button>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="text-left py-3 px-4 text-gray-700 dark:text-gray-300">
                    Order ID
                  </th>
                  <th className="text-left py-3 px-4 text-gray-700 dark:text-gray-300">
                    Customer
                  </th>
                  <th className="text-left py-3 px-4 text-gray-700 dark:text-gray-300">
                    Items
                  </th>
                  <th className="text-left py-3 px-4 text-gray-700 dark:text-gray-300">
                    Total
                  </th>
                  <th className="text-left py-3 px-4 text-gray-700 dark:text-gray-300">
                    Status
                  </th>
                  <th className="text-left py-3 px-4 text-gray-700 dark:text-gray-300">
                    Date
                  </th>
                  <th className="text-left py-3 px-4 text-gray-700 dark:text-gray-300">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.length === 0 ? (
                  <tr>
                    <td
                      colSpan={7}
                      className="text-center py-8 text-gray-500 dark:text-gray-400"
                    >
                      No orders found
                    </td>
                  </tr>
                ) : (
                  filteredOrders.map((order) => (
                    <tr
                      key={order.id}
                      className="border-b border-gray-200 dark:border-gray-700"
                    >
                      <td className="py-3 px-4 text-gray-900 dark:text-white">
                        #{order.id}
                      </td>
                      <td className="py-3 px-4 text-gray-900 dark:text-white">
                        {order.userName}
                      </td>
                      <td className="py-3 px-4 text-gray-600 dark:text-gray-400">
                        {order.items.length} item(s)
                      </td>
                      <td className="py-3 px-4 text-gray-900 dark:text-white">
                        {order.total.toFixed(2)} LE
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-flex items-center gap-2 px-3 py-1 rounded-full ${getStatusColor(
                            order.status
                          )}`}
                        >
                          {getStatusIcon(order.status)}
                          {getStatusLabel(order.status)}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-gray-600 dark:text-gray-400">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => setSelectedOrder(order)}
                            className="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-md"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => openDeleteModal(order.id)}
                            className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-gray-900 dark:text-white">Order Details</h2>
              <button
                onClick={() => setSelectedOrder(null)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="text-gray-900 dark:text-white mb-3">
                  Order Information
                </h3>
                <div className="grid grid-cols-2 gap-4 text-gray-600 dark:text-gray-400">
                  <div>
                    <span className="block text-gray-500 dark:text-gray-500">
                      Order ID
                    </span>
                    <span className="text-gray-900 dark:text-white">
                      #{selectedOrder.id}
                    </span>
                  </div>
                  <div>
                    <span className="block text-gray-500 dark:text-gray-500">
                      Date
                    </span>
                    <span className="text-gray-900 dark:text-white">
                      {new Date(selectedOrder.createdAt).toLocaleString()}
                    </span>
                  </div>
                  <div>
                    <span className="block text-gray-500 dark:text-gray-500">
                      Customer
                    </span>
                    <span className="text-gray-900 dark:text-white">
                      {selectedOrder.userName}
                    </span>
                  </div>
                  <div>
                    <span className="block text-gray-500 dark:text-gray-500">
                      Phone
                    </span>
                    <span className="text-gray-900 dark:text-white">
                      {selectedOrder.phone}
                    </span>
                  </div>
                  <div className="col-span-2">
                    <span className="block text-gray-500 dark:text-gray-500">
                      Delivery Address
                    </span>
                    <span className="text-gray-900 dark:text-white">
                      {selectedOrder.deliveryAddress}
                    </span>
                  </div>
                  <div>
                    <span className="block text-gray-500 dark:text-gray-500">
                      Payment Method
                    </span>
                    <span className="text-gray-900 dark:text-white">
                      {selectedOrder.paymentMethod}
                    </span>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="text-gray-900 dark:text-white mb-3">Items</h3>
                <div className="space-y-2">
                  {selectedOrder.items.map((item: any, idx: number) => (
                    <div
                      key={idx}
                      className="flex justify-between py-2 border-b border-gray-200 dark:border-gray-700"
                    >
                      <span className="text-gray-900 dark:text-white">
                        {item.menuItem.name} x{item.quantity}
                      </span>
                      <span className="text-gray-900 dark:text-white">
                        {(item.menuItem.price * item.quantity).toFixed(2)} LE
                      </span>
                    </div>
                  ))}
                  <div className="flex justify-between pt-2">
                    <span className="text-gray-900 dark:text-white">Total</span>
                    <span className="text-orange-600 dark:text-orange-400">
                      {selectedOrder.total.toFixed(2)} LE
                    </span>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="text-gray-900 dark:text-white mb-3">
                  Update Status
                </h3>
                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => {
                      handleStatusChange(selectedOrder.id, "pending");
                      setSelectedOrder({ ...selectedOrder, status: "pending" });
                    }}
                    className={`p-3 rounded-md flex items-center justify-between ${
                      selectedOrder.status === "pending"
                        ? "bg-yellow-600 text-white"
                        : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                    }`}
                  >
                    <span>Pending</span>
                    {selectedOrder.status === "pending" && (
                      <ChevronRight className="w-5 h-5" />
                    )}
                  </button>

                  <button
                    onClick={() => {
                      handleStatusChange(selectedOrder.id, "preparing");
                      setSelectedOrder({
                        ...selectedOrder,
                        status: "preparing",
                      });
                    }}
                    className={`p-3 rounded-md flex items-center justify-between ${
                      selectedOrder.status === "preparing"
                        ? "bg-orange-600 text-white"
                        : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                    }`}
                  >
                    <span>Preparing</span>
                    {selectedOrder.status === "preparing" && (
                      <ChevronRight className="w-5 h-5" />
                    )}
                  </button>

                  <button
                    onClick={() => {
                      handleStatusChange(selectedOrder.id, "ready");
                      setSelectedOrder({ ...selectedOrder, status: "ready" });
                    }}
                    className={`p-3 rounded-md flex items-center justify-between ${
                      selectedOrder.status === "ready"
                        ? "bg-green-600 text-white"
                        : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                    }`}
                  >
                    <span>Ready</span>
                    {selectedOrder.status === "ready" && (
                      <ChevronRight className="w-5 h-5" />
                    )}
                  </button>

                  <button
                    onClick={() => {
                      handleStatusChange(selectedOrder.id, "out-for-delivery");
                      setSelectedOrder({
                        ...selectedOrder,
                        status: "out-for-delivery",
                      });
                    }}
                    className={`p-3 rounded-md flex items-center justify-between ${
                      selectedOrder.status === "out-for-delivery"
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                    }`}
                  >
                    <span>Out for Delivery</span>
                    {selectedOrder.status === "out-for-delivery" && (
                      <ChevronRight className="w-5 h-5" />
                    )}
                  </button>

                  <button
                    onClick={() => {
                      handleStatusChange(selectedOrder.id, "delivered");
                      setSelectedOrder({
                        ...selectedOrder,
                        status: "delivered",
                      });
                    }}
                    className={`p-3 rounded-md flex items-center justify-between ${
                      selectedOrder.status === "delivered"
                        ? "bg-gray-600 text-white"
                        : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                    }`}
                  >
                    <span>Delivered</span>
                    {selectedOrder.status === "delivered" && (
                      <ChevronRight className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>
              <button
                onClick={() => openDeleteModal(selectedOrder.id)}
                className="w-full mt-2 p-3 rounded-md bg-red-600 hover:bg-red-700 text-white flex items-center justify-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                Delete Order
              </button>
            </div>
          </div>
        </div>
      )}

      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setOrderToDelete(null);
        }}
        onConfirm={confirmDeleteOrder}
        title="Delete Order"
        message="Are you sure you want to delete this order? This action cannot be undone."
      />
    </div>
  );
}
