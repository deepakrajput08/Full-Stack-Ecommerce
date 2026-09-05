import { useEffect, useMemo, useState } from "react";
import { Package, ShoppingBag, IndianRupee, Plus, Pencil, Trash2, X, Store } from "lucide-react";
import { toast, Bounce } from "react-toastify";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

const emptyProduct = { name: "", price: "", image: "", description: "", category: "", stock: "" };
const toastOptions = { position: "top-right", autoClose: 1600, theme: "dark", transition: Bounce };

const SellerDashboard = () => {
  const { user } = useAuth();
  const { products, addProduct, updateProduct, deleteProduct } = useCart();
  const [orders, setOrders] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyProduct);
  const [loadingOrders, setLoadingOrders] = useState(true);

  const myProducts = useMemo(() => products.filter((p) => p.seller && String(p.seller._id || p.seller) === String(user?.id)), [products, user?.id]);
  const myProductIds = useMemo(() => new Set(myProducts.map((p) => String(p._id))), [myProducts]);
  const sellerItems = (order) => order.items.filter((item) => item.product && myProductIds.has(String(item.product._id || item.product)));
  const sales = useMemo(() => orders.reduce((sum, order) => sum + sellerItems(order).reduce((s, item) => s + Number(item.price) * Number(item.quantity), 0), 0), [orders, myProductIds]);
  const units = useMemo(() => orders.reduce((sum, order) => sum + sellerItems(order).reduce((s, item) => s + Number(item.quantity), 0), 0), [orders, myProductIds]);

  const fetchOrders = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/orders/seller", { headers: { Authorization: `Bearer ${user.token}` } });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to fetch orders");
      setOrders(data);
    } catch (error) {
      toast.error(error.message, toastOptions);
    } finally {
      setLoadingOrders(false);
    }
  };

  useEffect(() => { if (user?.isSeller) fetchOrders(); }, [user?.isSeller]);

  if (!user?.isSeller) return <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center">Seller access required.</div>;

  const openAdd = () => { setEditing(null); setForm(emptyProduct); setShowForm(true); };
  const openEdit = (product) => { setEditing(product); setForm({ name: product.name, price: product.price, image: product.image, description: product.description, category: product.category, stock: product.stock }); setShowForm(true); };

  const saveProduct = async () => {
    try {
      if (editing) await updateProduct(editing._id, form);
      else await addProduct(form);
      setShowForm(false); setEditing(null); setForm(emptyProduct);
    } catch (error) { toast.error(error.message, toastOptions); }
  };

  const removeProduct = async (id) => { await deleteProduct(id); };

  const updateStatus = async (id, status) => {
    try {
      const res = await fetch(`http://localhost:5000/api/orders/seller/${id}/status`, { method: "PUT", headers: { "Content-Type": "application/json", Authorization: `Bearer ${user.token}` }, body: JSON.stringify({ status }) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to update order");
      setOrders((prev) => prev.map((order) => order._id === id ? { ...order, status } : order));
      toast.success("Order status updated", toastOptions);
    } catch (error) { toast.error(error.message, toastOptions); }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white px-4 py-8 sm:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between gap-4 items-start sm:items-center mb-8">
          <div><div className="flex items-center gap-3"><Store className="text-orange-400" /><h1 className="text-3xl sm:text-4xl font-extrabold">{user.sellerProfile?.storeName || "Seller Dashboard"}</h1></div><p className="text-gray-400 mt-2">Manage products and customer orders</p></div>
          <button onClick={openAdd} className="px-6 py-3 rounded-xl bg-orange-600 hover:bg-orange-700 font-bold flex items-center gap-2"><Plus className="w-5 h-5" /> Add Product</button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-10">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6"><Package className="text-orange-400 mb-3" /><p className="text-gray-400">My Products</p><p className="text-3xl font-extrabold mt-1">{myProducts.length}</p></div>
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6"><ShoppingBag className="text-orange-400 mb-3" /><p className="text-gray-400">Units Sold</p><p className="text-3xl font-extrabold mt-1">{units}</p></div>
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6"><IndianRupee className="text-green-400 mb-3" /><p className="text-gray-400">Sales</p><p className="text-3xl font-extrabold mt-1">₹{sales.toFixed(2)}</p></div>
        </div>

        {showForm && <div className="mb-10 bg-gray-900 border border-gray-800 rounded-2xl p-6">
          <div className="flex justify-between items-center mb-5"><h2 className="text-2xl font-bold">{editing ? "Edit Product" : "Add Product"}</h2><button onClick={() => setShowForm(false)}><X /></button></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[["name","Product Name"],["price","Price"],["image","Image URL"],["category","Category"],["stock","Stock"]].map(([key, placeholder]) => <input key={key} type={key === "price" || key === "stock" ? "number" : "text"} placeholder={placeholder} value={form[key]} onChange={(e) => setForm({ ...form, [key]: e.target.value })} className="p-3 rounded-lg bg-gray-800 border border-gray-700 outline-none focus:border-orange-500" />)}
            <textarea placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows="4" className="p-3 rounded-lg bg-gray-800 border border-gray-700 outline-none focus:border-orange-500 md:col-span-2" />
          </div>
          <button onClick={saveProduct} className="mt-5 px-6 py-3 bg-green-600 hover:bg-green-700 rounded-xl font-bold">{editing ? "Save Changes" : "Publish Product"}</button>
        </div>}

        <section className="mb-10"><h2 className="text-2xl font-bold mb-4">My Products</h2>
          {myProducts.length === 0 ? <div className="bg-gray-900 border border-gray-800 rounded-2xl p-10 text-center text-gray-400">No products yet. Add your first product.</div> : <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">{myProducts.map((p) => <div key={p._id} className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden"><img src={p.image} alt={p.name} className="w-full h-48 object-cover bg-gray-800" /><div className="p-5"><h3 className="font-bold text-lg">{p.name}</h3><p className="text-orange-400 font-bold mt-1">₹{Number(p.price).toFixed(2)}</p><p className="text-gray-400 text-sm mt-1">Stock: {p.stock}</p><div className="flex gap-2 mt-4"><button onClick={() => openEdit(p)} className="flex-1 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 flex items-center justify-center gap-2"><Pencil className="w-4 h-4" /> Edit</button><button onClick={() => removeProduct(p._id)} className="py-2 px-4 rounded-lg bg-red-600/20 text-red-400 hover:bg-red-600/30"><Trash2 className="w-4 h-4" /></button></div></div></div>)}</div>}
        </section>

        <section><h2 className="text-2xl font-bold mb-4">Customer Orders</h2>{loadingOrders ? <div className="text-gray-400 py-8">Loading orders...</div> : orders.length === 0 ? <div className="bg-gray-900 border border-gray-800 rounded-2xl p-10 text-center text-gray-400">No orders for your products yet.</div> : <div className="space-y-4">{orders.map((order) => <div key={order._id} className="bg-gray-900 border border-gray-800 rounded-2xl p-5"><div className="flex flex-col md:flex-row md:items-center justify-between gap-4"><div><p className="font-bold">Order #{order._id.slice(-8)}</p><p className="text-gray-400 text-sm mt-1">Buyer: {order.user?.username || "Customer"} · {new Date(order.createdAt).toLocaleDateString()}</p></div><select value={order.status} onChange={(e) => updateStatus(order._id, e.target.value)} className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2"><option>pending</option><option>confirmed</option><option>shipped</option><option>delivered</option><option>cancelled</option></select></div><div className="mt-4 grid gap-2">{sellerItems(order).map((item, i) => <div key={i} className="flex justify-between bg-gray-800/60 rounded-lg px-4 py-3 text-sm"><span>{item.name} × {item.quantity}</span><span className="text-orange-400">₹{(item.price * item.quantity).toFixed(2)}</span></div>)}</div></div>)}</div>}</section>
      </div>
    </div>
  );
};

export default SellerDashboard;
