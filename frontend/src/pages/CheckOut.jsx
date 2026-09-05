import React, { useState } from "react";
import OrderConfirmation from "./OrderConformation";
import { MapPin, Package } from "lucide-react";
import { useCart } from "../context/CartContext";

const Checkout = () => {
  const { cartTotal, clearCart, cart } = useCart();

  const [deliveryDetails, setDeliveryDetails] = useState({
    name: "",
    address: "",
    city: "",
    zip: "",
  });

  const [isConfirmed, setIsConfirmed] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setDeliveryDetails((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const user = JSON.parse(localStorage.getItem("user"));

      if (!user?.token) {
        alert("Please login first.");
        return;
      }

      const orderItems = cart.map((item) => ({
        product: item._id || item.id,
        name: item.name,
        price: Number(item.price),
        quantity: item.quantity,
      }));

      const res = await fetch(
        "http://localhost:5000/api/orders",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },

          body: JSON.stringify({
            items: orderItems,
            shippingAddress: deliveryDetails,
            totalAmount: cartTotal,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(
          data.message || "Failed to create order"
        );
      }

      console.log("ORDER CREATED:", data);

      clearCart();
      setIsConfirmed(true);
    } catch (error) {
      console.error("ORDER ERROR:", error);
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Empty cart protection
  if (cart.length === 0 && !isConfirmed) {
    return (
      <div className="container mx-auto px-4 md:px-8 pt-20 text-center">
        <h2 className="text-4xl font-extrabold text-white">
          Your Cart is Empty
        </h2>

        <p className="text-gray-400 mt-3">
          Add some products before checkout.
        </p>
      </div>
    );
  }

  if (isConfirmed) {
    return (
      <OrderConfirmation
        deliveryDetails={deliveryDetails}
      />
    );
  }

  return (
    <>
      <div className="container mx-auto px-4 md:px-8 pt-8">
        <h2 className="text-5xl font-extrabold text-white mb-10 tracking-tight">
          Finalize Order
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

          {/* SHIPPING FORM */}
          <div className="lg:col-span-2 p-8 bg-gray-900 rounded-2xl shadow-2xl border border-gray-800">

            <h3 className="text-3xl font-bold text-orange-400 mb-6 flex items-center space-x-3 border-b border-gray-700 pb-4">
              <MapPin className="w-7 h-7 text-orange-500" />

              <span>Shipping Information</span>
            </h3>

            <form
              className="space-y-6"
              onSubmit={handleSubmit}
            >
              {Object.keys(deliveryDetails).map((key) => (
                <div key={key}>

                  <label
                    htmlFor={key}
                    className="block text-sm font-semibold text-gray-300 capitalize mb-1"
                  >
                    {key === "zip"
                      ? "Pin Code"
                      : key}
                  </label>

                  <input
                    type={key === "zip" ? "number" : "text"}
                    id={key}
                    name={key}
                    value={deliveryDetails[key]}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full px-5 py-3 border border-gray-700 rounded-xl shadow-inner text-white bg-gray-800 placeholder-gray-500"
                  />

                </div>
              ))}

              <div className="pt-6">

                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full py-4 text-white font-extrabold text-xl rounded-full shadow-lg transition duration-300 flex items-center justify-center uppercase tracking-wider ${
                    loading
                      ? "bg-gray-600 cursor-not-allowed"
                      : "bg-orange-600 hover:bg-orange-700 cursor-pointer"
                  }`}
                >
                  {loading
                    ? "Processing Order..."
                    : `₹ Pay and Confirm Order (₹${cartTotal.toFixed(2)})`}
                </button>

              </div>
            </form>
          </div>

          {/* ORDER SUMMARY */}
          <div className="lg:col-span-1 p-8 bg-gray-900 rounded-2xl shadow-2xl sticky top-20 h-fit border border-gray-800">

            <h3 className="text-3xl font-bold text-white mb-5 border-b border-gray-700 pb-3 flex items-center space-x-2">
              <Package className="w-6 h-6 text-orange-400" />

              <span>Summary</span>
            </h3>

            <div className="space-y-4 text-gray-400">

              {cart.map((item) => (
                <div
                  key={item._id || item.id}
                  className="flex justify-between text-base border-b border-gray-800 pb-2"
                >
                  <span className="truncate text-gray-300">
                    {item.name} × {item.quantity}
                  </span>

                  <span className="font-medium text-orange-300">
                    ₹{(item.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}

              <div className="space-y-4 text-gray-400">

                <div className="flex justify-between text-xl">
                  <span>SubTotal :</span>

                  <span className="font-semibold text-white">
                    ₹{cartTotal.toFixed(2)}
                  </span>
                </div>

                <div className="flex justify-between text-xl">
                  <span>Shipping (Express):</span>

                  <span className="font-semibold text-green-400">
                    Free
                  </span>
                </div>

                <div className="flex justify-between pt-6 border-t border-gray-700">

                  <span className="text-2xl font-extrabold text-white">
                    Total Due:
                  </span>

                  <span className="text-3xl font-extrabold text-orange-400">
                    ₹{cartTotal.toFixed(2)}
                  </span>

                </div>

              </div>
            </div>
          </div>

        </div>
      </div>
    </>
  );
};

export default Checkout;