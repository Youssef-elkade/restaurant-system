import React, { useState } from "react";
import { useData, MenuItem } from "../../contexts/DataContext";
import { Plus, Edit, Trash2, X, Save, Upload, ChevronDown } from "lucide-react";
import { toast } from "sonner";
import { Toaster } from "sonner";
import DeleteConfirmModal from "../DeleteConfirmModal";
import { ImageWithFallback } from "../ImageWithFallback";

export default function MenuManagement() {
  const { menuItems, addMenuItem, updateMenuItem, deleteMenuItem } = useData();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);

  const [filterCategory, setFilterCategory] = useState<string>("All");
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    itemId: string | null;
    itemName: string;
  }>({
    isOpen: false,
    itemId: null,
    itemName: "",
  });

  const [formData, setFormData] = useState<{
    name: string;
    description: string;
    price: string;
    category: string;
    image: string;
    available: boolean;
  }>({
    name: "",
    description: "",
    price: "",
    category: "",
    image: "",
    available: true,
  });

  const [imagePreview, setImagePreview] = useState<string>("");
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);

  const categories = [
    "All",
    ...Array.from(new Set(menuItems.map((item) => item.category))),
  ];

  const existingCategories = Array.from(
    new Set(menuItems.map((item) => item.category))
  );

  const filteredMenuItems =
    filterCategory === "All"
      ? menuItems
      : menuItems.filter((item) => item.category === filterCategory);

  const filteredCategories = existingCategories.filter((cat) =>
    cat.toLowerCase().includes(formData.category.toLowerCase())
  );

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size should be less than 5MB", {
          action: {
            label: "✕",
            onClick: () => toast.dismiss(),
          },
        });
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setImagePreview(result);
        setFormData((prev) => ({ ...prev, image: result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const validateForm = () => {
    if (
      !formData.name ||
      !formData.description ||
      !formData.price ||
      !formData.category
    ) {
      toast.error("Please fill in all required fields", {
        action: {
          label: "✕",
          onClick: () => toast.dismiss(),
        },
      });
      return false;
    }

    if (!formData.image) {
      toast.error("Please upload an image", {
        action: {
          label: "✕",
          onClick: () => toast.dismiss(),
        },
      });
      return false;
    }

    if (isNaN(Number(formData.price)) || Number(formData.price) <= 0) {
      toast.error("Please enter a valid price", {
        action: {
          label: "✕",
          onClick: () => toast.dismiss(),
        },
      });
      return false;
    }

    return true;
  };

  const handleAddItem = () => {
    if (!validateForm()) return;

    addMenuItem({
      name: formData.name,
      description: formData.description,
      price: parseFloat(formData.price),
      category: formData.category,
      image: formData.image,
      available: formData.available,
    });

    toast.success("Menu item added successfully", {
      action: {
        label: "✕",
        onClick: () => toast.dismiss(),
      },
    });
    setIsAddModalOpen(false);
    resetForm();
  };

  const handleUpdateItem = () => {
    if (!editingItem) return;
    if (!validateForm()) return;

    updateMenuItem(editingItem.id, {
      name: formData.name,
      description: formData.description,
      price: parseFloat(formData.price),
      category: formData.category,
      image: formData.image,
      available: formData.available,
    });

    toast.success("Menu item updated successfully", {
      action: {
        label: "✕",
        onClick: () => toast.dismiss(),
      },
    });
    setEditingItem(null);
    resetForm();
    setIsAddModalOpen(false);
  };

  const openDeleteModal = (itemId: string, itemName: string) => {
    setDeleteModal({ isOpen: true, itemId, itemName });
  };

  const handleDeleteItem = () => {
    if (deleteModal.itemId) {
      deleteMenuItem(deleteModal.itemId);
      toast.success("Menu item deleted successfully", {
        action: {
          label: "✕",
          onClick: () => toast.dismiss(),
        },
      });
      setDeleteModal({ isOpen: false, itemId: null, itemName: "" });
    }
  };

  const openEditModal = (item: MenuItem) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      description: item.description,
      price: item.price.toString(),
      category: item.category,
      image: item.image,
      available: item.available,
    });
    setImagePreview(item.image);
    setIsAddModalOpen(true);
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      price: "",
      category: "",
      image: "",
      available: true,
    });
    setImagePreview("");
  };

  const closeModals = () => {
    setIsAddModalOpen(false);
    setEditingItem(null);
    resetForm();
  };

  const handleCategorySelect = (category: string) => {
    setFormData((prev) => ({ ...prev, category }));
    setShowCategoryDropdown(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <Toaster position="top-right" richColors />

      <DeleteConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={() =>
          setDeleteModal({ isOpen: false, itemId: null, itemName: "" })
        }
        onConfirm={handleDeleteItem}
        title="Delete Menu Item"
        message={`Are you sure you want to delete "${deleteModal.itemName}"? This action cannot be undone.`}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-gray-900 dark:text-white">Menu Management</h1>
          <button
            onClick={() => {
              setIsAddModalOpen(true);
              setEditingItem(null);
              resetForm();
            }}
            className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-md flex items-center gap-2 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Add Menu Item
          </button>
        </div>

        <div className="mb-6 flex gap-2 overflow-x-auto pb-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setFilterCategory(category)}
              className={`px-4 py-2 rounded-full whitespace-nowrap transition-colors ${
                filterCategory === category
                  ? "bg-orange-600 text-white"
                  : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMenuItems.map((item) => (
            <div
              key={item.id}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden"
            >
              <ImageWithFallback
                src={item.image}
                alt={item.name}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-gray-900 dark:text-white">{item.name}</h3>
                  <span className="text-orange-600 dark:text-orange-400">
                    {item.price.toFixed(2)} LE
                  </span>
                </div>
                <p className="text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                  {item.description}
                </p>
                <div className="flex justify-between items-center mb-3">
                  <span className="text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full">
                    {item.category}
                  </span>
                  <span
                    className={`px-3 py-1 rounded-full ${
                      item.available
                        ? "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400"
                        : "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400"
                    }`}
                  >
                    {item.available ? "Available" : "Unavailable"}
                  </span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => openEditModal(item)}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md flex items-center justify-center gap-2"
                  >
                    <Edit className="w-4 h-4" />
                    Edit
                  </button>
                  <button
                    onClick={() => openDeleteModal(item.id, item.name)}
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-md flex items-center justify-center gap-2"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {(isAddModalOpen || editingItem) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-gray-900 dark:text-white">
                {editingItem ? "Edit Menu Item" : "Add New Menu Item"}
              </h2>
              <button
                onClick={closeModals}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-gray-700 dark:text-gray-300 mb-2">
                  Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, name: e.target.value }))
                  }
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-gray-700 dark:text-gray-300 mb-2">
                  Description *
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-gray-700 dark:text-gray-300 mb-2">
                  Price *
                </label>
                <input
                  type="number"
                  step="1"
                  value={formData.price}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, price: e.target.value }))
                  }
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-gray-700 dark:text-gray-300 mb-2">
                  Category *
                </label>
                <div className="relative">
                  <div className="relative">
                    <input
                      type="text"
                      value={formData.category}
                      onChange={(e) => {
                        setFormData((prev) => ({
                          ...prev,
                          category: e.target.value,
                        }));
                        setShowCategoryDropdown(true);
                      }}
                      onFocus={() => setShowCategoryDropdown(true)}
                      onBlur={() =>
                        setTimeout(() => setShowCategoryDropdown(false), 200)
                      }
                      placeholder="Select existing or type new category"
                      className="w-full px-4 py-2.5 pr-10 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                    <ChevronDown
                      className={`absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 transition-transform ${
                        showCategoryDropdown ? "rotate-180" : ""
                      }`}
                    />
                  </div>

                  {showCategoryDropdown && existingCategories.length > 0 && (
                    <div className="absolute z-20 w-full mt-2 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                      <div className="p-2">
                        <div className="text-gray-500 dark:text-gray-400 px-3 py-2">
                          Existing Categories
                        </div>
                        {filteredCategories.length > 0 ? (
                          filteredCategories.map((cat) => (
                            <button
                              key={cat}
                              type="button"
                              onMouseDown={(e) => {
                                e.preventDefault();
                                handleCategorySelect(cat);
                              }}
                              className="w-full text-left px-3 py-2.5 rounded-md hover:bg-orange-50 dark:hover:bg-orange-900/20 text-gray-700 dark:text-gray-200 transition-colors flex items-center gap-2"
                            >
                              <div className="w-2 h-2 bg-orange-600 rounded-full" />
                              {cat}
                            </button>
                          ))
                        ) : (
                          <div className="px-3 py-2 text-gray-500 dark:text-gray-400">
                            No matching categories. Type to create new.
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
                {formData.category &&
                  !existingCategories.includes(formData.category) && (
                    <div className="mt-2 flex items-center gap-2 text-green-600 dark:text-green-400">
                      <div className="w-2 h-2 bg-green-600 dark:bg-green-400 rounded-full" />
                      <span>
                        New category: "{formData.category}" will be created
                      </span>
                    </div>
                  )}
              </div>

              <div>
                <label className="block text-gray-700 dark:text-gray-300 mb-2">
                  Upload Image *
                </label>
                <div className="space-y-3">
                  <div className="flex items-center justify-center w-full">
                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <Upload className="w-8 h-8 mb-2 text-gray-500 dark:text-gray-400" />
                        <p className="mb-2 text-gray-500 dark:text-gray-400">
                          <span>Click to upload</span> or drag and drop
                        </p>
                        <p className="text-gray-500 dark:text-gray-400">
                          PNG, JPG (MAX. 5MB)
                        </p>
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </label>
                  </div>
                  {imagePreview && (
                    <div className="relative">
                      <ImageWithFallback
                        src={imagePreview}
                        alt="Preview"
                        className="w-full h-48 object-cover rounded-md"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setImagePreview("");
                          setFormData((prev) => ({ ...prev, image: "" }));
                        }}
                        className="absolute top-2 right-2 bg-red-600 text-white p-1 rounded-full hover:bg-red-700"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="available"
                  checked={formData.available}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      available: e.target.checked,
                    }))
                  }
                  className="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
                />
                <label
                  htmlFor="available"
                  className="text-gray-700 dark:text-gray-300"
                >
                  Available for order
                </label>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={editingItem ? handleUpdateItem : handleAddItem}
                className="flex-1 bg-orange-600 hover:bg-orange-700 text-white py-2 px-4 rounded-md transition-colors flex items-center justify-center gap-2"
              >
                <Save className="w-4 h-4" />
                {editingItem ? "Update" : "Add"} Item
              </button>
              <button
                onClick={closeModals}
                className="flex-1 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 py-2 px-4 rounded-md transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
