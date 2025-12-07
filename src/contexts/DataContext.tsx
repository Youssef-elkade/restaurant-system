import React, { createContext, useContext, useState, useEffect } from "react";

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  available: boolean;
}

export interface Order {
  id: string;
  userId: string;
  userName: string;
  items: Array<{
    menuItem: MenuItem;
    quantity: number;
  }>;
  total: number;
  status: "pending" | "preparing" | "ready" | "out-for-delivery" | "delivered";
  paymentMethod: string;
  deliveryAddress: string;
  phone: string;
  createdAt: string;
}

interface DataContextType {
  menuItems: MenuItem[];
  orders: Order[];
  addMenuItem: (item: Omit<MenuItem, "id">) => void;
  updateMenuItem: (id: string, item: Partial<MenuItem>) => void;
  deleteMenuItem: (id: string) => void;
  addOrder: (order: Omit<Order, "id" | "createdAt" | "status">) => string;
  updateOrderStatus: (id: string, status: Order["status"]) => void;
  deleteOrder: (id: string) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

const defaultMenuItems: MenuItem[] = [
  {
    id: "1",
    name: "Margherita Pizza",
    description: "Classic pizza with tomato sauce, mozzarella, and fresh basil",
    price: 250,
    category: "Pizza",
    image: "/images/margherita.jpg",
    available: true,
  },
  {
    id: "2",
    name: "Pepperoni Pizza",
    description: "Traditional pizza topped with pepperoni and cheese",
    price: 300,
    category: "Pizza",
    image: "/images/pepperoni.jpg",
    available: true,
  },
  {
    id: "3",
    name: "Cheese burger",
    description:
      "Juicy beef patty with cheese, lettuce, tomato, and special sauce",
    price: 150,
    category: "Burgers",
    image: "/images/cheese burger.jpg",
    available: true,
  },
  {
    id: "4",
    name: "Chicken Burger",
    description: "Grilled chicken breast with mayo, lettuce, and tomato",
    price: 150,
    category: "Burgers",
    image: "/images/chicken burger.jpg",
    available: true,
  },
  {
    id: "5",
    name: "Caesar Salad",
    description: "Fresh romaine lettuce with Caesar dressing and croutons",
    price: 50,
    category: "Salads",
    image: "/images/caesar salad.jpg",
    available: true,
  },
  {
    id: "6",
    name: "Greek Salad",
    description: "Mixed greens with feta cheese, olives, and Greek dressing",
    price: 80,
    category: "Salads",
    image: "/images/greek salad.jpg",
    available: true,
  },
  {
    id: "7",
    name: "Spaghetti Carbonara",
    description: "Creamy pasta with bacon, egg, and parmesan cheese",
    price: 150,
    category: "Pasta",
    image: "/images/carbonara.jpg",
    available: true,
  },
  {
    id: "8",
    name: "Alfredo Pasta",
    description:
      "Fettuccine pasta with grilled chicken in creamy alfredo sauce",
    price: 180,
    category: "Pasta",
    image: "/images/alfredo.jpg",
    available: true,
  },
  {
    id: "9",
    name: "Chocolate Cake",
    description: "Rich chocolate cake with chocolate frosting",
    price: 80,
    category: "Desserts",
    image: "/images/chocolate cake.jpg",
    available: true,
  },
  {
    id: "10",
    name: "Tiramisu",
    description: "Classic Italian dessert with coffee-soaked ladyfingers",
    price: 70,
    category: "Desserts",
    image: "/images/tiramisu.jpg",
    available: true,
  },
  {
    id: "11",
    name: "Orange Juice",
    description: "Freshly squeezed orange juice",
    price: 35,
    category: "Beverages",
    image: "/images/orange juice.jpg",
    available: true,
  },
  {
    id: "12",
    name: "Iced Coffee",
    description: "Cold brewed coffee served over ice",
    price: 40,
    category: "Beverages",
    image: "/images/iced coffee.jpg",
    available: true,
  },
];

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [menuItems, setMenuItems] = useState<MenuItem[]>(() => {
    try {
      const saved = localStorage.getItem("menuItems");
      if (!saved) return defaultMenuItems;

      const parsed = JSON.parse(saved) as MenuItem[];

      return parsed.map((item) => ({
        ...item,
        available: item.available ?? true,
      }));
    } catch (e) {
      console.error("Failed to parse menuItems from localStorage", e);
      return defaultMenuItems;
    }
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem("orders");
      if (!saved) return [];
      return JSON.parse(saved) as Order[];
    } catch (e) {
      console.error("Failed to parse orders from localStorage", e);
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem("menuItems", JSON.stringify(menuItems));
    } catch (e) {
      console.error("Failed to save menuItems to localStorage", e);
    }
  }, [menuItems]);

  useEffect(() => {
    try {
      localStorage.setItem("orders", JSON.stringify(orders));
    } catch (e) {
      console.error("Failed to save orders to localStorage", e);
    }
  }, [orders]);

  const addMenuItem = (item: Omit<MenuItem, "id">) => {
    const newItem: MenuItem = {
      ...item,
      id: Date.now().toString(),
    };
    setMenuItems((prev) => [...prev, newItem]);
  };

  const updateMenuItem = (id: string, updates: Partial<MenuItem>) => {
    setMenuItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updates } : item))
    );
  };

  const deleteMenuItem = (id: string) => {
    setMenuItems((prev) => prev.filter((item) => item.id !== id));
  };

  const addOrder = (
    order: Omit<Order, "id" | "createdAt" | "status">
  ): string => {
    const newOrder: Order = {
      ...order,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      status: "pending",
    };
    setOrders((prev) => [newOrder, ...prev]);
    return newOrder.id;
  };

  const updateOrderStatus = (id: string, status: Order["status"]) => {
    setOrders((prev) =>
      prev.map((order) => (order.id === id ? { ...order, status } : order))
    );
  };

  const deleteOrder = (id: string) => {
    setOrders((prev) => prev.filter((order) => order.id !== id));
  };

  return (
    <DataContext.Provider
      value={{
        menuItems,
        orders,
        addMenuItem,
        updateMenuItem,
        deleteMenuItem,
        addOrder,
        updateOrderStatus,
        deleteOrder,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error("useData must be used within DataProvider");
  }
  return context;
}
