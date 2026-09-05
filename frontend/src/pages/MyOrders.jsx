import React, { useEffect, useState } from "react";

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user"));

        if (!user?.token) {
          return;
        }

        const res = await fetch(
          "http://localhost:5000/api/orders/my-orders",
          {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          }
        );

        const data = await res.json();

        if (!res.ok) {
          throw new Error(
            data.message || "Failed to fetch orders"
          );
        }

        setOrders(data);
      } catch (error) {
        console.error("FETCH ORDERS ERROR:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center">
        <p className="text-xl text-gray-400">
          Loading orders...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white px-4 py-8">
      <div className="max-w-5xl mx-auto">

        <h1 className="text-4xl font-extrabold mb-8">
          My Orders
        </h1>

        {orders.length === 0 ? (
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-10 text-center">
            <p className="text-gray-400 text-lg">
              You haven't placed any orders yet.
            </p>
          </div>
        ) : (
          <div className="space-y-6">

            {orders.map((order) => (
              <div
                key={order._id}
                className="bg-gray-900 border border-gray-800 rounded-2xl p-6 shadow-xl"
              >

                {/* ORDER HEADER */}
                <div className="flex flex-col sm:flex-row justify-between gap-3 border-b border-gray-800 pb-4">

                  <div>
                    <p className="text-gray-400 text-sm">
                      Order ID
                    </p>

                    <p className="text-white font-semibold break-all">
                      {order._id}
                    </p>
                  </div>

                  <div className="text-left sm:text-right">
                    <p className="text-gray-400 text-sm">
                      Status
                    </p>

                    <span className="inline-block mt-1 px-3 py-1 bg-orange-500/10 text-orange-400 rounded-full font-semibold capitalize">
                      {order.status}
                    </span>
                  </div>

                </div>

                {/* ITEMS */}
                <div className="mt-5 space-y-3">

                  {order.items.map((item, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center border-b border-gray-800 pb-3"
                    >
                      <div>
                        <p className="text-white font-semibold">
                          {item.name}
                        </p>

                        <p className="text-gray-400 text-sm">
                          ₹{item.price} × {item.quantity}
                        </p>
                      </div>

                      <p className="text-orange-400 font-bold">
                        ₹{(
                          item.price * item.quantity
                        ).toFixed(2)}
                      </p>
                    </div>
                  ))}

                </div>

                {/* TOTAL */}
                <div className="flex justify-between items-center mt-5">
                  <span className="text-xl font-bold">
                    Total
                  </span>

                  <span className="text-2xl font-extrabold text-orange-400">
                    ₹{Number(order.totalAmount).toFixed(2)}
                  </span>
                </div>

                {/* DATE */}
                <p className="text-gray-500 text-sm mt-3">
                  Ordered on{" "}
                  {new Date(order.createdAt).toLocaleString()}
                </p>

              </div>
            ))}

          </div>
        )}

      </div>
    </div>
  );
};

export default MyOrders;