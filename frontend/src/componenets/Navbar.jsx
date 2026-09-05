import { House, ShoppingCart, Menu, X, LogOut } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const { cartCount } = useCart();

  const navigate = useNavigate();

  const [menuOpen, setMenuOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  // ================= LOGOUT =================
  const handleLogout = () => {
    logout();
    setMenuOpen(false);
    setShowLogoutConfirm(false);
    navigate("/login");
  };

  const openLogoutConfirm = () => {
    setShowLogoutConfirm(true);
  };

  const cancelLogout = () => {
    setShowLogoutConfirm(false);
  };

  return (
    <>
      {/* ================= HEADER ================= */}
      <header
        className="sticky top-0 z-50
                   bg-gray-950/95 backdrop-blur-md
                   text-white
                   shadow-2xl shadow-gray-950/70
                   border-b border-orange-900"
      >
        <div className="container mx-auto px-4 py-4">

          {/* ================= TOP NAVBAR ================= */}
          <div className="flex justify-between items-center">

            {/* ================= LOGO ================= */}
            <Link
              to="/"
              onClick={() => setMenuOpen(false)}
            >
              <div
                className="flex items-center
                           space-x-2 sm:space-x-3
                           cursor-pointer"
              >
                <House
                  className="w-6 h-6 sm:w-8 sm:h-8
                             text-orange-400
                             drop-shadow-lg"
                />

                <h1
                  className="text-2xl sm:text-3xl md:text-4xl
                             font-extrabold
                             tracking-widest
                             uppercase"
                >
                  DEEP
                  <span className="text-orange-400">
                    STORE
                  </span>
                </h1>
              </div>
            </Link>

            {/* ================= DESKTOP MENU ================= */}
            <nav
              className="hidden md:flex
                         items-center
                         space-x-4 lg:space-x-6"
            >

              {/* ADMIN DASHBOARD */}
              {user?.role === "admin" && (
                <Link
                  to="/admin"
                  className="px-4 lg:px-5 py-3
                             bg-orange-600
                             text-white
                             font-semibold
                             rounded-xl
                             hover:bg-orange-700
                             active:scale-95
                             transition-all duration-300"
                >
                  Admin Dashboard
                </Link>
              )}

              {/* BECOME SELLER */}
              {user &&
                user.role !== "admin" &&
                !user.isSeller && (
                  <Link
                    to="/become-seller"
                    className="px-4 lg:px-5 py-3
                               bg-green-600
                               text-white
                               font-semibold
                               rounded-xl
                               hover:bg-green-700
                               active:scale-95
                               transition-all duration-300"
                  >
                    Become a Seller
                  </Link>
                )}

              {/* SELLER DASHBOARD */}
              {user?.isSeller && (
                <Link
                  to="/seller"
                  className="px-4 lg:px-5 py-3
                             bg-green-600
                             text-white
                             font-semibold
                             rounded-xl
                             hover:bg-green-700
                             active:scale-95
                             transition-all duration-300"
                >
                  Seller Dashboard
                </Link>
              )}

              {/* MY ORDERS */}
              <Link
                to="/my-orders"
                className="px-4 lg:px-5 py-3
                           bg-gray-800
                           text-white
                           font-semibold
                           rounded-xl
                           hover:bg-gray-700
                           active:scale-95
                           transition-all duration-300"
              >
                My Orders
              </Link>

              {/* CART */}
              <Link
                to="/cart"
                className="relative
                           p-3
                           bg-orange-500/10
                           rounded-xl
                           hover:bg-orange-500/20
                           transition duration-200
                           border border-orange-400/50
                           shadow-lg
                           cursor-pointer"
              >
                <ShoppingCart
                  className="w-6 h-6 text-orange-400"
                />

                {cartCount > 0 && (
                  <span
                    className="absolute
                               top-0
                               right-0
                               inline-flex
                               items-center
                               justify-center
                               px-2
                               py-1
                               text-xs
                               font-bold
                               leading-none
                               text-white
                               transform
                               translate-x-1/2
                               -translate-y-1/2
                               bg-red-600
                               rounded-full
                               min-w-6
                               h-5"
                  >
                    {cartCount}
                  </span>
                )}
              </Link>

              {/* LOGOUT */}
              <button
                onClick={openLogoutConfirm}
                className="px-4 lg:px-5 py-3
                           bg-red-600
                           text-white
                           font-semibold
                           rounded-xl
                           hover:bg-red-700
                           active:scale-95
                           transition-all duration-300"
              >
                Logout
              </button>

            </nav>

            {/* ================= MOBILE MENU BUTTON ================= */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden
                         p-2
                         rounded-xl
                         bg-orange-500/10
                         border border-orange-400/50
                         hover:bg-orange-500/20
                         transition"
            >
              {menuOpen ? (
                <X className="w-7 h-7 text-orange-400" />
              ) : (
                <Menu className="w-7 h-7 text-orange-400" />
              )}
            </button>

          </div>

          {/* ================= MOBILE MENU ================= */}
          {menuOpen && (
            <nav
              className="md:hidden
                         mt-4
                         pt-4
                         border-t border-orange-900
                         flex flex-col gap-3"
            >

              {/* ADMIN DASHBOARD */}
              {user?.role === "admin" && (
                <Link
                  to="/admin"
                  onClick={() => setMenuOpen(false)}
                  className="w-full
                             text-center
                             px-5 py-3
                             bg-orange-600
                             rounded-xl
                             font-semibold
                             hover:bg-orange-700
                             transition-all"
                >
                  Admin Dashboard
                </Link>
              )}

              {/* BECOME SELLER */}
              {user &&
                user.role !== "admin" &&
                !user.isSeller && (
                  <Link
                    to="/become-seller"
                    onClick={() => setMenuOpen(false)}
                    className="w-full
                               text-center
                               px-5 py-3
                               bg-green-600
                               rounded-xl
                               font-semibold
                               hover:bg-green-700
                               transition-all"
                  >
                    Become a Seller
                  </Link>
                )}

              {/* SELLER DASHBOARD */}
              {user?.isSeller && (
                <Link
                  to="/seller"
                  onClick={() => setMenuOpen(false)}
                  className="w-full
                             text-center
                             px-5 py-3
                             bg-green-600
                             rounded-xl
                             font-semibold
                             hover:bg-green-700
                             transition-all"
                >
                  Seller Dashboard
                </Link>
              )}

              {/* MY ORDERS */}
              <Link
                to="/my-orders"
                onClick={() => setMenuOpen(false)}
                className="w-full
                           text-center
                           px-5 py-3
                           bg-gray-800
                           rounded-xl
                           font-semibold
                           hover:bg-gray-700
                           transition-all"
              >
                My Orders
              </Link>

              {/* CART */}
              <Link
                to="/cart"
                onClick={() => setMenuOpen(false)}
                className="relative
                           w-full
                           flex
                           justify-center
                           items-center
                           px-5 py-3
                           bg-orange-500/10
                           rounded-xl
                           border border-orange-400/50
                           hover:bg-orange-500/20
                           transition"
              >
                <ShoppingCart
                  className="w-6 h-6 text-orange-400"
                />

                {cartCount > 0 && (
                  <span
                    className="absolute
                               right-1/3
                               top-1/2
                               -translate-y-1/2
                               bg-red-600
                               text-white
                               text-xs
                               font-bold
                               rounded-full
                               min-w-6
                               h-5
                               flex
                               items-center
                               justify-center
                               px-2"
                  >
                    {cartCount}
                  </span>
                )}
              </Link>

              {/* LOGOUT */}
              <button
                onClick={openLogoutConfirm}
                className="w-full
                           px-5 py-3
                           bg-red-600
                           text-white
                           font-semibold
                           rounded-xl
                           hover:bg-red-700
                           active:scale-95
                           transition-all"
              >
                Logout
              </button>

            </nav>
          )}

        </div>
      </header>

      {/* =====================================================
          LOGOUT CONFIRMATION MODAL
          IMPORTANT: Header ke BAHAR hai
          ===================================================== */}
      {showLogoutConfirm && (
        <div
          className="fixed
                     inset-0
                     z-[9999]
                     flex
                     items-center
                     justify-center
                     bg-black/70
                     backdrop-blur-sm
                     px-4"
          onClick={cancelLogout}
        >
          <div
            className="w-full
                       max-w-sm
                       rounded-2xl
                       border border-orange-900
                       bg-gray-950
                       p-6
                       shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >

            {/* MODAL HEADER */}
            <div className="flex items-center gap-3 mb-4">

              <div
                className="flex
                           h-11
                           w-11
                           items-center
                           justify-center
                           rounded-full
                           bg-red-600/20"
              >
                <LogOut
                  className="h-5 w-5 text-red-400"
                />
              </div>

              <div>
                <h2
                  className="text-xl
                             font-bold
                             text-white"
                >
                  Confirm Logout
                </h2>

                <p
                  className="text-sm
                             text-gray-400"
                >
                  Are you sure you want to logout?
                </p>
              </div>

            </div>

            {/* MODAL BUTTONS */}
            <div className="flex gap-3">

              {/* CANCEL */}
              <button
                type="button"
                onClick={cancelLogout}
                className="flex-1
                           rounded-xl
                           bg-gray-800
                           px-4
                           py-3
                           font-semibold
                           text-white
                           transition
                           hover:bg-gray-700
                           active:scale-95"
              >
                Cancel
              </button>

              {/* LOGOUT */}
              <button
                type="button"
                onClick={handleLogout}
                className="flex-1
                           rounded-xl
                           bg-red-600
                           px-4
                           py-3
                           font-semibold
                           text-white
                           transition
                           hover:bg-red-700
                           active:scale-95"
              >
                Logout
              </button>

            </div>

          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
