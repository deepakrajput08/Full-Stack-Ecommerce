import Navbar from "./componenets/Navbar";
import ProductList from "./pages/ProductList";
import Cart from "./pages/Cart";
import CheckOut from "./pages/CheckOut";
import ProductDetail from "./pages/ProductDetail";
import Footer from "./componenets/Footer";
import Login from "./pages/Login";

import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";

import { ToastContainer, Bounce } from "react-toastify";

import Signup from "./pages/Signup";
import AdminDashboard from "./pages/AdminDashboard";
import MyOrders from "./pages/MyOrders";
import BecomeSeller from "./pages/BecomeSeller";
import SellerDashboard from "./pages/SellerDashboard";

import { useAuth } from "./context/AuthContext.jsx";

// ================= HOME ROUTE =================
const HomeRoute = () => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <ProductList />;
};

// ================= LOGIN ROUTE =================
const LoginRoute = () => {
  const { user } = useAuth();

  if (user) {
    if (user.role === "admin") {
      return <Navigate to="/admin" replace />;
    }

    return <Navigate to="/" replace />;
  }

  return <Login />;
};

// ================= SELLER ROUTE =================
const SellerRoute = () => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!user.isSeller) {
    return <Navigate to="/become-seller" replace />;
  }

  return <SellerDashboard />;
};

// ================= ADMIN ROUTE =================
const AdminRoute = () => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  return <AdminDashboard />;
};

// ================= APP CONTENT =================
const AppContent = () => {
  const location = useLocation();

  const isAuthPage =
    location.pathname === "/login" ||
    location.pathname === "/signup";

  return (
    <div className="min-h-screen bg-gray-950 font-sans">

      {/* ================= NAVBAR ================= */}
      {!isAuthPage && <Navbar />}

      {/* ================= TOAST ================= */}
      <ToastContainer
        position="top-right"
        autoClose={1500}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
        transition={Bounce}
      />

      {/* ================= ROUTES ================= */}
      <Routes>

        {/* HOME */}
        <Route
          path="/"
          element={<HomeRoute />}
        />

        {/* PRODUCTS */}
        <Route
          path="/product/:id"
          element={<ProductDetail />}
        />

        {/* CART */}
        <Route
          path="/cart"
          element={<Cart />}
        />

        {/* CHECKOUT */}
        <Route
          path="/checkout"
          element={<CheckOut />}
        />

        {/* SIGNUP */}
        <Route
          path="/signup"
          element={<Signup />}
        />

        {/* LOGIN */}
        <Route
          path="/login"
          element={<LoginRoute />}
        />

        {/* ADMIN */}
        <Route
          path="/admin"
          element={<AdminRoute />}
        />

        {/* ORDERS */}
        <Route
          path="/my-orders"
          element={<MyOrders />}
        />

        {/* BECOME SELLER */}
        <Route
          path="/become-seller"
          element={<BecomeSeller />}
        />

        {/* SELLER */}
        <Route
          path="/seller"
          element={<SellerRoute />}
        />

        {/* UNKNOWN URL */}
        <Route
          path="*"
          element={<Navigate to="/" replace />}
        />

      </Routes>

      {/* ================= FOOTER ================= */}
      {!isAuthPage && <Footer />}

    </div>
  );
};

// ================= MAIN APP =================
const App = () => {
  return (
    <Router>
      <AppContent />
    </Router>
  );
};

export default App;