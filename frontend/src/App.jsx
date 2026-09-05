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

  // Login aur Signup page par global Navbar/Footer hide
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

        <Route
          path="/"
          element={<ProductList />}
        />

        <Route
          path="/product/:id"
          element={<ProductDetail />}
        />

        <Route
          path="/cart"
          element={<Cart />}
        />

        <Route
          path="/checkout"
          element={<CheckOut />}
        />

        <Route
          path="/signup"
          element={<Signup />}
        />

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/admin"
          element={<AdminRoute />}
        />

        <Route
          path="/my-orders"
          element={<MyOrders />}
        />

        <Route
          path="/become-seller"
          element={<BecomeSeller />}
        />

        <Route
          path="/seller"
          element={<SellerRoute />}
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
