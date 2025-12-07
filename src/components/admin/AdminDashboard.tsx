import React from "react";
import { useData } from "../../contexts/DataContext";
import {
  Package,
  DollarSign,
  Users,
  ShoppingBag,
  TrendingUp,
  Clock,
  CheckCircle,
  Truck,
} from "lucide-react";

export default function AdminDashboard() {
  const { orders, menuItems } = useData();

  const totalOrders = orders.length;
  const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);

  const activeOrders = orders.filter(
    (o) =>
      o.status === "pending" ||
      o.status === "preparing" ||
      o.status === "ready" ||
      o.status === "out-for-delivery"
  ).length;

  const deliveredOrders = orders.filter((o) => o.status === "delivered").length;

  const recentOrders = orders.slice(0, 5);

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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-gray-900 dark:text-white mb-8">
          Dashboard Overview
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center">
                <Package className="w-6 h-6 text-orange-600 dark:text-orange-400" />
              </div>
              <TrendingUp className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="text-gray-900 dark:text-white mb-1">
              {totalOrders}
            </h3>
            <p className="text-gray-600 dark:text-gray-400">Total Orders</p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <TrendingUp className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="text-gray-900 dark:text-white mb-1">
              {totalRevenue.toFixed(2)} LE
            </h3>
            <p className="text-gray-600 dark:text-gray-400">Total Revenue</p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                <ShoppingBag className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
            <h3 className="text-gray-900 dark:text-white mb-1">
              {activeOrders}
            </h3>
            <p className="text-gray-600 dark:text-gray-400">Active Orders</p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
            <h3 className="text-gray-900 dark:text-white mb-1">
              {deliveredOrders}
            </h3>
            <p className="text-gray-600 dark:text-gray-400">Completed Orders</p>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h2 className="text-gray-900 dark:text-white mb-6">Recent Orders</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
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
                </tr>
              </thead>
              <tbody>
                {recentOrders.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="text-center py-8 text-gray-500 dark:text-gray-400"
                    >
                      No orders yet
                    </td>
                  </tr>
                ) : (
                  recentOrders.map((order) => (
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
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
