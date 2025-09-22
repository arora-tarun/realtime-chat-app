// client/src/pages/Login.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post("/user/login", { email, password });
      localStorage.setItem("user", JSON.stringify(res.data));
      navigate("/chat");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left side illustration / gradient */}
      <div className="hidden md:flex flex-1 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700 items-center justify-center">
        <div className="text-center px-10">
          <h1 className="text-5xl font-bold text-white mb-4">
            Welcome Back!
          </h1>
          <p className="text-gray-300 text-lg">
            Connect with your friends and colleagues in real-time.
          </p>
        </div>
      </div>

      {/* Right side form */}
      <div className="flex flex-1 justify-center items-center bg-gray-900 px-4">
        <div className="w-full max-w-md bg-gray-800 rounded-3xl shadow-2xl p-10">
          <h2 className="text-4xl font-bold mb-6 text-center text-white">
            Login
          </h2>

          {error && (
            <div className="bg-red-600 text-white p-2 rounded mb-4 text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block mb-1 font-medium text-gray-300">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-white text-white"
                required
              />
            </div>

            <div>
              <label className="block mb-1 font-medium text-gray-300">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="********"
                className="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-white text-white"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-white hover:bg-gray-100 text-gray-900 font-semibold p-3 rounded-lg transition-colors"
            >
              Login
            </button>
          </form>

          <p className="mt-6 text-center text-gray-400">
            Don't have an account?{" "}
            <span
              onClick={() => navigate("/register")}
              className="text-white hover:underline cursor-pointer"
            >
              Register
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
