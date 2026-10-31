import { useState } from "react";
import {
  LockKeyhole,
  User,
  ArrowRight,
  House,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import Footer from "../componenets/Footer";

const Login = () => {
  const { setUser } = useAuth();
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!username || !password) {
      alert("Please enter username and password.");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(
        "http://localhost:5000/api/users/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username,
            password,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Login failed.");
        return;
      }

      console.log("Logged in user:", data.user);

      // Save user + token in AuthContext/localStorage
      setUser({
        ...data.user,
        token: data.token,
      });

      // Admin → Admin Dashboard
      if (data.user.role === "admin") {
        navigate("/admin", { replace: true });
      } else {
        // Normal user → Home
        navigate("/", { replace: true });
      }

    } catch (error) {
      console.error("Login failed:", error);
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col">

      {/* ================= LOGO ================= */}
      <header
        className="w-full
                   bg-gray-950
                   border-b border-orange-900
                   shadow-2xl shadow-gray-950/70"
      >
        <div className="w-full flex justify-center items-center py-5">
          <div className="flex items-center gap-3 cursor-pointer">

            <House
              className="w-8 h-8
                         text-orange-400
                         drop-shadow-lg"
            />

            <h1
              className="text-3xl md:text-4xl
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
        </div>
      </header>

      {/* ================= LOGIN ================= */}
      <main
        className="flex-1
                   flex
                   items-center
                   justify-center
                   px-4
                   py-10"
      >
        <div className="w-full max-w-md">

          <div
            className="bg-gray-900
                       border border-gray-800
                       rounded-3xl
                       p-8
                       shadow-2xl"
          >

            {/* TITLE */}
            <div className="text-center mb-8">

              <h1 className="text-3xl font-extrabold text-white">
                Welcome!
              </h1>

              <p className="text-gray-500 text-sm mt-2">
                Sign in to continue
              </p>

            </div>

            {/* FORM */}
            <form
              onSubmit={handleLogin}
              className="space-y-5"
            >

              {/* USERNAME */}
              <div>

                <label
                  className="text-sm
                             font-semibold
                             text-gray-300
                             mb-2
                             block"
                >
                  Username
                </label>

                <div className="relative">

                  <User
                    className="absolute
                               left-4
                               top-1/2
                               -translate-y-1/2
                               w-5 h-5
                               text-gray-500"
                  />

                  <input
                    type="text"
                    value={username}
                    onChange={(e) =>
                      setUsername(e.target.value)
                    }
                    placeholder="Enter username"
                    disabled={loading}
                    className="w-full
                               pl-12
                               pr-4
                               py-3.5
                               bg-gray-800
                               border border-gray-700
                               rounded-xl
                               text-white
                               placeholder-gray-600
                               outline-none
                               focus:border-orange-500
                               focus:ring-2
                               focus:ring-orange-500/20
                               transition-all
                               duration-300
                               disabled:opacity-50"
                  />

                </div>
              </div>

              {/* PASSWORD */}
              <div>

                <label
                  className="text-sm
                             font-semibold
                             text-gray-300
                             mb-2
                             block"
                >
                  Password
                </label>

                <div className="relative">

                  <LockKeyhole
                    className="absolute
                               left-4
                               top-1/2
                               -translate-y-1/2
                               w-5 h-5
                               text-gray-500"
                  />

                  <input
                    type="password"
                    value={password}
                    onChange={(e) =>
                      setPassword(e.target.value)
                    }
                    placeholder="Enter password"
                    disabled={loading}
                    className="w-full
                               pl-12
                               pr-4
                               py-3.5
                               bg-gray-800
                               border border-gray-700
                               rounded-xl
                               text-white
                               placeholder-gray-600
                               outline-none
                               focus:border-orange-500
                               focus:ring-2
                               focus:ring-orange-500/20
                               transition-all
                               duration-300
                               disabled:opacity-50"
                  />

                </div>
              </div>

              {/* LOGIN BUTTON */}
              <button
                type="submit"
                disabled={loading}
                className="w-full
                           mt-3
                           py-3.5
                           bg-orange-600
                           text-white
                           font-bold
                           rounded-xl
                           flex
                           items-center
                           justify-center
                           gap-2
                           shadow-lg
                           shadow-orange-900/30
                           hover:bg-orange-700
                           hover:-translate-y-0.5
                           hover:shadow-orange-900/50
                           active:scale-95
                           transition-all
                           duration-300
                           disabled:opacity-50
                           disabled:cursor-not-allowed
                           disabled:hover:translate-y-0"
              >
                {loading ? "Logging in..." : "Login"}

                {!loading && (
                  <ArrowRight className="w-5 h-5" />
                )}
              </button>

            </form>

            {/* SIGNUP */}
            <div className="text-center mt-6">

              <p className="text-gray-500 text-sm">
                Don't have an account?{" "}

                <Link
                  to="/signup"
                  className="text-orange-500
                             font-semibold
                             hover:text-orange-400
                             transition-colors"
                >
                  Sign Up
                </Link>
              </p>

            </div>

          </div>
        </div>
      </main>

      {/* ================= FOOTER ================= */}
      <Footer />

    </div>
  );
};

export default Login;
