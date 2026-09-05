import { useState } from "react";
import { Store, ArrowRight, ShieldCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast, Bounce } from "react-toastify";
import { useAuth } from "../context/AuthContext";

const BecomeSeller = () => {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();
  const [storeName, setStoreName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const options = { position: "top-right", autoClose: 1800, theme: "dark", transition: Bounce };

  if (!user) {
    navigate("/login", { replace: true });
    return null;
  }

  if (user.isSeller) {
    navigate("/seller", { replace: true });
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/users/become-seller", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${user.token}` },
        body: JSON.stringify({ storeName, description }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Could not create seller account");
      setUser({ ...user, ...data.user, token: user.token });
      toast.success("Seller account created!", options);
      navigate("/seller");
    } catch (error) {
      toast.error(error.message, options);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white px-4 py-12">
      <div className="max-w-3xl mx-auto">
        <div className="bg-gray-900 border border-gray-800 rounded-3xl p-6 sm:p-10 shadow-2xl">
          <div className="w-16 h-16 rounded-2xl bg-orange-500/10 border border-orange-500/30 flex items-center justify-center mb-6">
            <Store className="w-8 h-8 text-orange-400" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold">Start Selling on DEEPSTORE</h1>
          <p className="text-gray-400 mt-3">Turn your existing account into a seller account. You can still shop normally.</p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">Store Name</label>
              <input required value={storeName} onChange={(e) => setStoreName(e.target.value)} placeholder="e.g. Deep Fashion Hub" className="w-full p-4 rounded-xl bg-gray-800 border border-gray-700 text-white outline-none focus:border-orange-500" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">Store Description</label>
              <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows="5" placeholder="Tell buyers about your store..." className="w-full p-4 rounded-xl bg-gray-800 border border-gray-700 text-white outline-none focus:border-orange-500" />
            </div>
            <div className="flex gap-3 items-start p-4 rounded-xl bg-gray-800/60 border border-gray-700">
              <ShieldCheck className="w-6 h-6 text-green-400 shrink-0" />
              <p className="text-sm text-gray-400">Your seller account uses the same login. Your products are linked to your account, so other sellers cannot edit or delete them.</p>
            </div>
            <button disabled={loading} className="w-full py-4 rounded-xl bg-orange-600 hover:bg-orange-700 disabled:bg-gray-700 font-bold text-lg flex items-center justify-center gap-2 transition">
              {loading ? "Creating Seller Account..." : "Create Seller Account"}
              {!loading && <ArrowRight className="w-5 h-5" />}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BecomeSeller;
