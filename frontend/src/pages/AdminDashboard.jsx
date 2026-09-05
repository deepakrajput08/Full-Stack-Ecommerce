import { useEffect, useState } from "react";
import { Trash2, X } from "lucide-react";
import { useCart } from "../context/CartContext";

const AdminDashboard = () => {
  const { products, addProduct, updateProduct, deleteProduct } = useCart();
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user"));

        const res = await fetch(
          "http://localhost:5000/api/orders/all",
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
        setOrdersLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [deletingProduct, setDeletingProduct] = useState(null);

  const emptyProduct = {
    name: "",
    price: "",
    image: "",
    description: "",
    category: "",
    stock: "",
  };

  const [newProduct, setNewProduct] = useState(emptyProduct);
  const [editProduct, setEditProduct] = useState(emptyProduct);

  // ================= ADD PRODUCT =================
  const handleAddProduct = async () => {
    try {
      await addProduct(newProduct);

      setShowForm(false);
      setNewProduct(emptyProduct);
    } catch (error) {
      console.error("Failed to add product:", error);
    }
  };

  // ================= EDIT PRODUCT =================
  const handleEditProduct = async () => {
    try {
      await updateProduct(editingProduct._id, editProduct);

      setEditingProduct(null);
      setEditProduct(emptyProduct);
    } catch (error) {
      console.error("Failed to update product:", error);
    }
  };

  // ================= START EDITING =================
  const startEditing = (product) => {
    setEditingProduct(product);

    setEditProduct({
      name: product.name,
      price: product.price,
      image: product.image,
      description: product.description,
      category: product.category,
      stock: product.stock,
    });

    setShowForm(false);
  };

  // ================= DELETE PRODUCT =================
  const handleDeleteProduct = async () => {
    if (!deletingProduct) return;

    await deleteProduct(deletingProduct._id);
    setDeletingProduct(null);
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white px-4 py-6 sm:p-8">
      <div className="max-w-7xl mx-auto">

        {/* ================= HEADER ================= */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">

          <div>
            <h1 className="text-3xl sm:text-4xl font-extrabold">
              Admin Dashboard
            </h1>

            <p className="text-gray-400 mt-2">
              Manage your products easily
            </p>
          </div>

          <button
            onClick={() => {
              setShowForm(true);
              setEditingProduct(null);
            }}
            className="w-full sm:w-auto px-6 py-3 bg-orange-600
                       text-white font-bold rounded-xl
                       hover:bg-orange-700 hover:-translate-y-0.5
                       active:scale-95 transition-all duration-300"
          >
            + Add Product
          </button>
        </div>

        {/* ================= ADD PRODUCT FORM ================= */}
        {showForm && (
          <div className="mb-8 bg-gray-900 border border-gray-800
                          rounded-2xl p-4 sm:p-6 shadow-xl">

            <div className="flex justify-between items-center mb-5">
              <h2 className="text-2xl font-bold">
                Add New Product
              </h2>

              <button
                onClick={() => setShowForm(false)}
                className="p-2 text-gray-400 hover:text-white
                           hover:bg-gray-800 rounded-lg transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

              <input
                type="text"
                placeholder="Product Name"
                value={newProduct.name}
                onChange={(e) =>
                  setNewProduct({
                    ...newProduct,
                    name: e.target.value,
                  })
                }
                className="p-3 rounded-lg bg-gray-800 text-white
                           border border-gray-700 outline-none
                           focus:border-orange-500"
              />

              <input
                type="number"
                placeholder="Price"
                value={newProduct.price}
                onChange={(e) =>
                  setNewProduct({
                    ...newProduct,
                    price: e.target.value,
                  })
                }
                className="p-3 rounded-lg bg-gray-800 text-white
                           border border-gray-700 outline-none
                           focus:border-orange-500"
              />

              <input
                type="text"
                placeholder="Image URL"
                value={newProduct.image}
                onChange={(e) =>
                  setNewProduct({
                    ...newProduct,
                    image: e.target.value,
                  })
                }
                className="p-3 rounded-lg bg-gray-800 text-white
                           border border-gray-700 outline-none
                           focus:border-orange-500"
              />

              <input
                type="text"
                placeholder="Category"
                value={newProduct.category}
                onChange={(e) =>
                  setNewProduct({
                    ...newProduct,
                    category: e.target.value,
                  })
                }
                className="p-3 rounded-lg bg-gray-800 text-white
                           border border-gray-700 outline-none
                           focus:border-orange-500"
              />

              <input
                type="number"
                placeholder="Stock"
                value={newProduct.stock}
                onChange={(e) =>
                  setNewProduct({
                    ...newProduct,
                    stock: e.target.value,
                  })
                }
                className="p-3 rounded-lg bg-gray-800 text-white
                           border border-gray-700 outline-none
                           focus:border-orange-500"
              />

              <textarea
                placeholder="Description"
                value={newProduct.description}
                onChange={(e) =>
                  setNewProduct({
                    ...newProduct,
                    description: e.target.value,
                  })
                }
                className="p-3 rounded-lg bg-gray-800 text-white
                           border border-gray-700 outline-none
                           focus:border-orange-500 md:col-span-2"
                rows="4"
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-3 mt-5">

              <button
                onClick={handleAddProduct}
                className="px-6 py-3 bg-green-600 text-white
                           font-bold rounded-lg hover:bg-green-700
                           active:scale-95 transition-all duration-300"
              >
                Add Product
              </button>

              <button
                onClick={() => setShowForm(false)}
                className="px-6 py-3 bg-gray-700 text-white
                           font-bold rounded-lg hover:bg-gray-600
                           active:scale-95 transition-all duration-300"
              >
                Cancel
              </button>

            </div>
          </div>
        )}

        {/* ================= EDIT PRODUCT FORM ================= */}
        {editingProduct && (
          <div className="mb-8 bg-gray-900 border border-gray-800
                          rounded-2xl p-4 sm:p-6 shadow-xl">

            <div className="flex justify-between items-center mb-5">
              <h2 className="text-2xl font-bold">
                Edit Product
              </h2>

              <button
                onClick={() => setEditingProduct(null)}
                className="p-2 text-gray-400 hover:text-white
                           hover:bg-gray-800 rounded-lg transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

              <input
                type="text"
                placeholder="Product Name"
                value={editProduct.name}
                onChange={(e) =>
                  setEditProduct({
                    ...editProduct,
                    name: e.target.value,
                  })
                }
                className="p-3 rounded-lg bg-gray-800 text-white
                           border border-gray-700 outline-none
                           focus:border-orange-500"
              />

              <input
                type="number"
                placeholder="Price"
                value={editProduct.price}
                onChange={(e) =>
                  setEditProduct({
                    ...editProduct,
                    price: e.target.value,
                  })
                }
                className="p-3 rounded-lg bg-gray-800 text-white
                           border border-gray-700 outline-none
                           focus:border-orange-500"
              />

              <input
                type="text"
                placeholder="Image URL"
                value={editProduct.image}
                onChange={(e) =>
                  setEditProduct({
                    ...editProduct,
                    image: e.target.value,
                  })
                }
                className="p-3 rounded-lg bg-gray-800 text-white
                           border border-gray-700 outline-none
                           focus:border-orange-500"
              />

              <input
                type="text"
                placeholder="Category"
                value={editProduct.category}
                onChange={(e) =>
                  setEditProduct({
                    ...editProduct,
                    category: e.target.value,
                  })
                }
                className="p-3 rounded-lg bg-gray-800 text-white
                           border border-gray-700 outline-none
                           focus:border-orange-500"
              />

              <input
                type="number"
                placeholder="Stock"
                value={editProduct.stock}
                onChange={(e) =>
                  setEditProduct({
                    ...editProduct,
                    stock: e.target.value,
                  })
                }
                className="p-3 rounded-lg bg-gray-800 text-white
                           border border-gray-700 outline-none
                           focus:border-orange-500"
              />

              <textarea
                placeholder="Description"
                value={editProduct.description}
                onChange={(e) =>
                  setEditProduct({
                    ...editProduct,
                    description: e.target.value,
                  })
                }
                className="p-3 rounded-lg bg-gray-800 text-white
                           border border-gray-700 outline-none
                           focus:border-orange-500 md:col-span-2"
                rows="4"
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-3 mt-5">

              <button
                onClick={handleEditProduct}
                className="px-6 py-3 bg-blue-600 text-white
                           font-bold rounded-lg hover:bg-blue-700
                           active:scale-95 transition-all duration-300"
              >
                Save Changes
              </button>

              <button
                onClick={() => setEditingProduct(null)}
                className="px-6 py-3 bg-gray-700 text-white
                           font-bold rounded-lg hover:bg-gray-600
                           active:scale-95 transition-all duration-300"
              >
                Cancel
              </button>

            </div>
          </div>
        )}

        {/* ================= PRODUCTS ================= */}
        <div className="bg-gray-900 border border-gray-800
                        rounded-2xl p-4 sm:p-6">

          <div className="flex flex-col sm:flex-row
                          sm:items-center justify-between gap-2 mb-6">

            <h2 className="text-2xl font-bold">
              Products
            </h2>

            <span className="text-sm text-gray-400">
              {products.length} total products
            </span>
          </div>

          {products.length === 0 ? (
            <div className="text-center py-16">

              <p className="text-gray-400 text-lg">
                No products available.
              </p>

              <button
                onClick={() => setShowForm(true)}
                className="mt-4 px-5 py-2.5 bg-orange-600
                           rounded-lg font-semibold
                           hover:bg-orange-700 transition"
              >
                Add Your First Product
              </button>

            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">

              {products.map((product) => (
                <div
                  key={product._id}
                  className="bg-gray-800 border border-gray-700
                             rounded-2xl overflow-hidden
                             hover:border-orange-500/50
                             hover:-translate-y-1
                             transition-all duration-300 shadow-lg"
                >

                  {/* Product Image */}
                  <div className="h-48 bg-gray-900
                                  flex items-center justify-center
                                  overflow-hidden">

                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-contain p-4"
                    />
                  </div>

                  {/* Product Details */}
                  <div className="p-5">

                    <h3 className="font-bold text-lg text-white truncate">
                      {product.name}
                    </h3>

                    <p className="text-orange-400 font-bold text-xl mt-2">
                      ₹{product.price}
                    </p>

                    <div className="flex flex-col gap-1 mt-3 text-sm">

                      <span className="text-gray-400">
                        Category: {product.category}
                      </span>

                      <span className="text-gray-400">
                        Stock: {product.stock}
                      </span>

                    </div>

                    {/* Buttons */}
                    <div className="flex gap-3 mt-5">

                      <button
                        onClick={() => startEditing(product)}
                        className="flex-1 px-4 py-2.5
                                   bg-blue-600 text-white
                                   font-semibold rounded-lg
                                   hover:bg-blue-700
                                   active:scale-95
                                   transition-all duration-300"
                      >
                        ✏️ Edit
                      </button>

                      <button
                        onClick={() => setDeletingProduct(product)}
                        className="flex-1 px-4 py-2.5
                                   bg-red-600 text-white
                                   font-semibold rounded-lg
                                   hover:bg-red-700
                                   active:scale-95
                                   transition-all duration-300"
                      >
                        🗑️ Delete
                      </button>

                    </div>
                  </div>
                </div>
              ))}

            </div>
          )}
        </div>

        {/* ================= ORDERS ================= */}
        <div className="mt-8 bg-gray-900 border border-gray-800 rounded-2xl p-4 sm:p-6">

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
            <h2 className="text-2xl font-bold">
              Orders
            </h2>

            <span className="text-sm text-gray-400">
              {orders.length} total orders
            </span>
          </div>

          {ordersLoading ? (
            <div className="text-center py-12">
              <p className="text-gray-400">
                Loading orders...
              </p>
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-400 text-lg">
                No orders yet.
              </p>
            </div>
          ) : (
            <div className="space-y-5">

              {orders.map((order) => (
                <div
                  key={order._id}
                  className="bg-gray-800 border border-gray-700 rounded-2xl p-5"
                >

                  {/* ORDER HEADER */}
                  <div className="flex flex-col sm:flex-row justify-between gap-3 border-b border-gray-700 pb-4">

                    <div>
                      <p className="text-gray-400 text-sm">
                        Order ID
                      </p>

                      <p className="text-white font-semibold break-all">
                        {order._id}
                      </p>
                    </div>

                    <div>
                      <p className="text-gray-400 text-sm">
                        Status
                      </p>

                      <select
                        value={order.status}
                        onChange={async (e) => {
                          try {
                            const user = JSON.parse(
                              localStorage.getItem("user")
                            );

                            const res = await fetch(
                              `http://localhost:5000/api/orders/${order._id}/status`,
                              {
                                method: "PUT",
                                headers: {
                                  "Content-Type": "application/json",
                                  Authorization: `Bearer ${user.token}`,
                                },
                                body: JSON.stringify({
                                  status: e.target.value,
                                }),
                              }
                            );

                            const data = await res.json();

                            if (!res.ok) {
                              throw new Error(
                                data.message || "Failed to update status"
                              );
                            }

                            setOrders((prevOrders) =>
                              prevOrders.map((item) =>
                                item._id === order._id
                                  ? data.order
                                  : item
                              )
                            );
                          } catch (error) {
                            console.error(
                              "UPDATE STATUS ERROR:",
                              error
                            );
                          }
                        }}
                        className="mt-1 px-3 py-2 bg-gray-900
             border border-gray-700 rounded-lg
             text-orange-400 font-semibold
             outline-none cursor-pointer"
                      >
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </div>

                  </div>

                  {/* CUSTOMER */}
                  <div className="mt-4">
                    <p className="text-gray-400 text-sm">
                      Customer
                    </p>

                    <p className="text-white font-semibold">
                      {order.user?.username || "Unknown User"}
                    </p>

                    <p className="text-gray-400 text-sm">
                      {order.user?.email || ""}
                    </p>
                  </div>

                  {/* ITEMS */}
                  <div className="mt-5 space-y-3">

                    {order.items.map((item, index) => (
                      <div
                        key={index}
                        className="flex justify-between items-center border-b border-gray-700 pb-3"
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

                  {/* SHIPPING ADDRESS */}
                  <div className="mt-5 bg-gray-900 rounded-xl p-4">

                    <p className="text-gray-400 text-sm mb-1">
                      Shipping Address
                    </p>

                    <p className="text-white">
                      {order.shippingAddress.name}
                    </p>

                    <p className="text-gray-400">
                      {order.shippingAddress.address},{" "}
                      {order.shippingAddress.city} -{" "}
                      {order.shippingAddress.zip}
                    </p>

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

        {/* ================= DELETE CONFIRMATION MODAL ================= */}
        {deletingProduct && (
          <div
            className="fixed inset-0 z-100 flex items-center justify-center
                       bg-black/70 backdrop-blur-sm px-4"
          >
            <div
              className="w-full max-w-md bg-gray-900
                         border border-gray-700 rounded-2xl
                         p-6 shadow-2xl"
            >

              {/* Modal Header */}
              <div className="flex justify-between items-start">

                <div
                  className="w-12 h-12 rounded-full bg-red-500/10
                             flex items-center justify-center"
                >
                  <Trash2 className="w-6 h-6 text-red-500" />
                </div>

                <button
                  onClick={() => setDeletingProduct(null)}
                  className="p-2 text-gray-400 hover:text-white
                             hover:bg-gray-800 rounded-lg transition"
                >
                  <X className="w-5 h-5" />
                </button>

              </div>

              {/* Modal Content */}
              <h2 className="text-2xl font-bold mt-5">
                Delete Product?
              </h2>

              <p className="text-gray-400 mt-2">
                Are you sure you want to delete{" "}
                <span className="text-white font-semibold">
                  "{deletingProduct.name}"
                </span>
                ? This action cannot be undone.
              </p>

              {/* Modal Buttons */}
              <div className="flex gap-3 mt-6">

                <button
                  onClick={() => setDeletingProduct(null)}
                  className="flex-1 px-5 py-3 bg-gray-700
                             text-white font-semibold rounded-xl
                             hover:bg-gray-600 active:scale-95
                             transition-all"
                >
                  Cancel
                </button>

                <button
                  onClick={handleDeleteProduct}
                  className="flex-1 px-5 py-3 bg-red-600
                             text-white font-semibold rounded-xl
                             hover:bg-red-700 active:scale-95
                             transition-all"
                >
                  Delete
                </button>

              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default AdminDashboard;

