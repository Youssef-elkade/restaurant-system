import React, { createContext, useContext, useState, useEffect } from "react";

export interface User {
  id: string;
  email: string;
  name: string;
  role: "customer" | "admin" | "chef" | "delivery";
  phone?: string;
  address?: string;
  profileImage?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => boolean;
  register: (user: Omit<User, "id"> & { password: string }) => boolean;
  logout: () => void;
  updateUser: (user: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const currentUser = localStorage.getItem("currentUser");
    if (currentUser) {
      setUser(JSON.parse(currentUser));
      setIsAuthenticated(true);
    } else {
      initializeDefaultAccounts();
    }
  }, []);

  const initializeDefaultAccounts = () => {
    const users = localStorage.getItem("users");
    if (!users) {
      const defaultUsers = [
        {
          id: "1",
          email: "admin@elitefoods.com",
          password: "admin123",
          name: "Admin",
          role: "admin",
        },
        {
          id: "2",
          email: "chef@elitefoods.com",
          password: "chef123",
          name: "Chef",
          role: "chef",
        },
        {
          id: "3",
          email: "delivery@elitefoods.com",
          password: "delivery123",
          name: "Delivery",
          role: "delivery",
        },
        {
          id: "4",
          email: "customer@elitefoods.com",
          password: "customer123",
          name: "Customer",
          role: "customer",
          phone: "01234567890",
          address: "123 Main St, City",
        },
        {
          id: "5",
          email: "youssef.admin@elitefoods.com",
          password: "youssef.admin",
          name: "Youssef",
          role: "admin",
        },
        {
          id: "6",
          email: "youssef.chef@elitefoods.com",
          password: "youssef.chef",
          name: "Youssef",
          role: "chef",
        },
        {
          id: "7",
          email: "youssef.delivery@elitefoods.com",
          password: "youssef.delivery",
          name: "Youssef",
          role: "delivery",
        },
        {
          id: "8",
          email: "youssef@gmail.com",
          password: "youssef",
          name: "Youssef",
          role: "customer",
          phone: "01013436823",
        },
      ];
      localStorage.setItem("users", JSON.stringify(defaultUsers));
    }
  };

  const login = (email: string, password: string): boolean => {
    const users = JSON.parse(localStorage.getItem("users") || "[]");
    const foundUser = users.find(
      (u: any) => u.email === email && u.password === password
    );

    if (foundUser) {
      const { password: _, ...userWithoutPassword } = foundUser;
      setUser(userWithoutPassword);
      setIsAuthenticated(true);
      localStorage.setItem("currentUser", JSON.stringify(userWithoutPassword));
      return true;
    }
    return false;
  };

  const register = (
    newUser: Omit<User, "id"> & { password: string }
  ): boolean => {
    const users = JSON.parse(localStorage.getItem("users") || "[]");
    if (users.some((u: any) => u.email === newUser.email)) {
      return false;
    }

    const userWithId = {
      ...newUser,
      id: Date.now().toString(),
    };

    users.push(userWithId);
    localStorage.setItem("users", JSON.stringify(users));

    const { password: _, ...userWithoutPassword } = userWithId;
    setUser(userWithoutPassword);
    setIsAuthenticated(true);
    localStorage.setItem("currentUser", JSON.stringify(userWithoutPassword));
    return true;
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem("currentUser");
  };

  const updateUser = (updatedUser: User) => {
    const users = JSON.parse(localStorage.getItem("users") || "[]");
    const index = users.findIndex((u: any) => u.id === updatedUser.id);
    if (index !== -1) {
      users[index] = updatedUser;
      localStorage.setItem("users", JSON.stringify(users));
      setUser(updatedUser);
      localStorage.setItem("currentUser", JSON.stringify(updatedUser));
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated, login, register, logout, updateUser }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
