import React, { useState } from "react";
import { useCart } from "../../contexts/CartContext";
import { useAuth } from "../../contexts/AuthContext";
import { useData } from "../../contexts/DataContext";
import { MapPin, Phone, CreditCard, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { Toaster } from "sonner";

interface CheckoutProps {
  onOrderConfirmed: (orderId: string) => void;
}

export default function Checkout({ onOrderConfirmed }: CheckoutProps) {
  const { cartItems, getCartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const { addOrder } = useData();

  const [deliveryInfo, setDeliveryInfo] = useState({
    address: user?.address || "",
    phone: user?.phone || "",
  });

  const [paymentMethod, setPaymentMethod] = useState<"card" | "paypal">("card");
  const [cardInfo, setCardInfo] = useState({
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    cardholderName: "",
  });
  const [paypalEmail, setPaypalEmail] = useState("");

  const subtotal = getCartTotal();
  const deliveryFee = 15;
  const total = subtotal + deliveryFee;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!deliveryInfo.address || !deliveryInfo.phone) {
      toast.error("Please fill in delivery information", {
        action: {
          label: "X",
          onClick: () => toast.dismiss(),
        },
      });
      return;
    }

    if (paymentMethod === "card") {
      if (
        !cardInfo.cardNumber ||
        !cardInfo.expiryDate ||
        !cardInfo.cvv ||
        !cardInfo.cardholderName
      ) {
        toast.error("Please fill in all card details", {
          action: {
            label: "X",
            onClick: () => toast.dismiss(),
          },
        });
        return;
      }
    } else if (paymentMethod === "paypal") {
      if (!paypalEmail) {
        toast.error("Please enter your PayPal email", {
          action: {
            label: "X",
            onClick: () => toast.dismiss(),
          },
        });
        return;
      }
    }

    const orderId = addOrder({
      userId: user!.id,
      userName: user!.name,
      items: cartItems,
      total,
      paymentMethod: paymentMethod === "card" ? "Credit Card" : "PayPal",
      deliveryAddress: deliveryInfo.address,
      phone: deliveryInfo.phone,
    });

    clearCart();
    toast.success("Order placed successfully!", {
      action: {
        label: "X",
        onClick: () => toast.dismiss(),
      },
    });
    onOrderConfirmed(orderId);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <Toaster position="top-right" richColors />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-gray-900 dark:text-white mb-8">Checkout</h1>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 lg:grid-cols-3 gap-8"
        >
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <div className="flex items-center gap-2 mb-4">
                <MapPin className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                <h2 className="text-gray-900 dark:text-white">
                  Delivery Information
                </h2>
              </div>
              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="address"
                    className="block text-gray-700 dark:text-gray-300 mb-2"
                  >
                    Delivery Address *
                  </label>
                  <textarea
                    id="address"
                    value={deliveryInfo.address}
                    onChange={(e) =>
                      setDeliveryInfo((prev) => ({
                        ...prev,
                        address: e.target.value,
                      }))
                    }
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="Enter your complete delivery address"
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="phone"
                    className="block text-gray-700 dark:text-gray-300 mb-2"
                  >
                    Phone Number *
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      id="phone"
                      type="tel"
                      value={deliveryInfo.phone}
                      onChange={(e) => {
                        let value = e.target.value.replace(/\D/g, "");
                        setDeliveryInfo((prev) => ({ ...prev, phone: value }));
                      }}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      placeholder="0123-456-7890"
                      maxLength={11}
                      required
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <div className="flex items-center gap-2 mb-4">
                <CreditCard className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                <h2 className="text-gray-900 dark:text-white">
                  Payment Method
                </h2>
              </div>
              <div className="space-y-4">
                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod("card")}
                    className={`flex-1 p-4 border-2 rounded-lg flex items-center justify-center gap-2 transition-colors ${
                      paymentMethod === "card"
                        ? "border-orange-600 bg-orange-50 dark:bg-orange-900/20"
                        : "border-gray-300 dark:border-gray-600"
                    }`}
                  >
                    <CreditCard className="w-5 h-5" />
                    Credit Card
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod("paypal")}
                    className={`flex-1 p-4 border-2 rounded-lg flex items-center justify-center gap-2 transition-colors ${
                      paymentMethod === "paypal"
                        ? "border-orange-600 bg-orange-50 dark:bg-orange-900/20"
                        : "border-gray-300 dark:border-gray-600"
                    }`}
                  >
                    <svg
                      className="w-5 h-5"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M6.908 24H3.804c-.664 0-1.086-.529-.936-1.18l.149-.674h2.071c.666 0 1.336-.533 1.482-1.182l1.064-4.592c.15-.648.816-1.18 1.48-1.18h.883c3.789 0 6.734-.779 8.84-2.34s3.16-3.6 3.16-6.135c0-1.125-.195-2.055-.588-2.789 0-.016-.016-.031-.016-.046l.135.075c.75.465 1.32 1.064 1.711 1.814.404.75.598 1.68.598 2.791 0 2.535-1.049 4.574-3.164 6.135-2.1 1.545-5.055 2.324-8.834 2.324h-.9c-.66 0-1.334.525-1.484 1.186L8.39 22.812c-.149.645-.81 1.17-1.47 1.17L6.908 24zm-2.677-2.695H1.126c-.663 0-1.084-.529-.936-1.18L4.563 1.182C4.714.529 5.378 0 6.044 0h6.465c1.395 0 2.609.098 3.648.289 1.035.189 1.92.519 2.684.99.736.465 1.322 1.072 1.697 1.818.389.748.584 1.68.584 2.797 0 2.535-1.051 4.574-3.164 6.119-2.1 1.561-5.056 2.326-8.836 2.326h-.883c-.66 0-1.328.524-1.478 1.169L5.7 20.097c-.149.646-.817 1.172-1.485 1.172l.016.036zm7.446-17.369h-1.014c-.666 0-1.332.529-1.48 1.178l-.93 4.02c-.15.648.27 1.179.93 1.179h.766c1.664 0 2.97-.343 3.9-1.021.929-.686 1.395-1.654 1.395-2.912 0-.83-.301-1.445-.9-1.84-.6-.404-1.5-.605-2.686-.605l.019.001z" />
                    </svg>
                    PayPal
                  </button>
                </div>

                {paymentMethod === "card" && (
                  <div className="space-y-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <div>
                      <label
                        htmlFor="cardholderName"
                        className="block text-gray-700 dark:text-gray-300 mb-2"
                      >
                        Cardholder Name *
                      </label>
                      <input
                        id="cardholderName"
                        type="text"
                        value={cardInfo.cardholderName}
                        onChange={(e) => {
                          let value = e.target.value.replace(/[0-9]/g, "");
                          setCardInfo((prev) => ({
                            ...prev,
                            cardholderName: value,
                          }));
                        }}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        placeholder="Enter your full name"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="cardNumber"
                        className="block text-gray-700 dark:text-gray-300 mb-2"
                      >
                        Card Number *
                      </label>
                      <input
                        id="cardNumber"
                        type="text"
                        value={cardInfo.cardNumber}
                        onChange={(e) => {
                          let value = e.target.value.replace(/\D/g, "");
                          setCardInfo((prev) => ({
                            ...prev,
                            cardNumber: value,
                          }));
                        }}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        placeholder="1234 5678 9012 3456"
                        maxLength={19}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label
                          htmlFor="expiryDate"
                          className="block text-gray-700 dark:text-gray-300 mb-2"
                        >
                          Expiry Date *
                        </label>
                        <input
                          id="expiryDate"
                          type="text"
                          value={cardInfo.expiryDate}
                          onChange={(e) => {
                            let value = e.target.value.replace(/\D/g, "");
                            if (value.length > 2) {
                              value =
                                value.slice(0, 2) + "/" + value.slice(2, 4);
                            }

                            setCardInfo((prev) => ({
                              ...prev,
                              expiryDate: value,
                            }));
                          }}
                          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                          placeholder="MM/YY"
                          maxLength={5}
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="cvv"
                          className="block text-gray-700 dark:text-gray-300 mb-2"
                        >
                          CVV *
                        </label>
                        <input
                          id="cvv"
                          type="text"
                          value={cardInfo.cvv}
                          onChange={(e) => {
                            let value = e.target.value.replace(/\D/g, "");
                            setCardInfo((prev) => ({ ...prev, cvv: value }));
                          }}
                          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                          placeholder="123"
                          maxLength={3}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {paymentMethod === "paypal" && (
                  <div className="space-y-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <div>
                      <label
                        htmlFor="paypalEmail"
                        className="block text-gray-700 dark:text-gray-300 mb-2"
                      >
                        PayPal Email *
                      </label>
                      <input
                        id="paypalEmail"
                        type="email"
                        value={paypalEmail}
                        onChange={(e) => setPaypalEmail(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        placeholder="your@email.com"
                      />
                    </div>
                    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-md p-4">
                      <p className="text-blue-800 dark:text-blue-300">
                        You will be redirected to PayPal to complete your
                        payment securely.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 sticky top-24">
              <h2 className="text-gray-900 dark:text-white mb-4">
                Order Summary
              </h2>
              <div className="space-y-2 mb-4">
                {cartItems.map(({ menuItem, quantity }) => (
                  <div
                    key={menuItem.id}
                    className="flex justify-between text-gray-600 dark:text-gray-400"
                  >
                    <span>
                      {menuItem.name} x{quantity}
                    </span>
                    <span>{(menuItem.price * quantity).toFixed(2)} LE</span>
                  </div>
                ))}
              </div>
              <div className="border-t border-gray-200 dark:border-gray-700 pt-4 space-y-2">
                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                  <span>Subtotal</span>
                  <span>{subtotal.toFixed(2)} LE</span>
                </div>
                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                  <span>Delivery Fee</span>
                  <span>{deliveryFee.toFixed(2)} LE</span>
                </div>
                <div className="border-t border-gray-200 dark:border-gray-700 pt-2">
                  <div className="flex justify-between text-gray-900 dark:text-white">
                    <span>Total</span>
                    <span>{total.toFixed(2)} LE</span>
                  </div>
                </div>
              </div>
              <button
                type="submit"
                className="w-full mt-6 bg-orange-600 hover:bg-orange-700 text-white py-3 px-4 rounded-md transition-colors"
              >
                Place Order
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
