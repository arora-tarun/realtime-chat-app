// client/src/pages/Register.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

export default function Register() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post("/user/register", { username, email, password });
      localStorage.setItem("user", JSON.stringify(res.data));
      navigate("/chat");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left side illustration / gradient */}
      <div className="hidden md:flex flex-1 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700 items-center justify-center">
        <div className="text-center px-10">
          <h1 className="text-5xl font-bold text-white mb-4">Join Us!</h1>
          <p className="text-gray-300 text-lg">
            Create your account and start chatting in real-time with friends.
          </p>
        </div>
      </div>

      {/* Right side form */}
      <div className="flex flex-1 justify-center items-center bg-gray-900 px-4">
        <div className="w-full max-w-md bg-gray-800 rounded-3xl shadow-2xl p-10">
          <h2 className="text-4xl font-bold mb-6 text-center text-white">
            Register
          </h2>

          {error && (
            <div className="bg-red-600 text-white p-2 rounded mb-4 text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-5">
            <div>
              <label className="block mb-1 font-medium text-gray-300">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Your username"
                className="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-white text-white"
                required
              />
            </div>

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
              Register
            </button>
          </form>

          <p className="mt-6 text-center text-gray-400">
            Already have an account?{" "}
            <span
              onClick={() => navigate("/login")}
              className="text-white hover:underline cursor-pointer"
            >
              Login
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
