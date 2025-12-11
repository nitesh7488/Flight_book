import { useState, type FormEvent } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api";

export default function SignupPage() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSignup(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      // 🔥 API call only — no unused variable
      await api.post("/auth/register", { name, email, password });

      // 🎉 Toast message
      setSuccess("Signup Successful! Redirecting to login...");

      // 🔁 1.5 sec wait → go to login
      setTimeout(() => {
        navigate("/login");
      }, 1500);

    } catch (err: any) {
      setError(err.response?.data?.message || "Signup failed");
    }

    setLoading(false);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md space-y-4 relative">

        {/* ================= Toast Popup ================= */}
        {success && (
          <div className="absolute top-[-70px] left-1/2 -translate-x-1/2 bg-green-500 text-white px-4 py-2 rounded-md animate-bounce shadow">
            {success}
          </div>
        )}

        <h1 className="text-xl font-bold text-blue-600 text-center">
          Create Account ✨
        </h1>

        <form onSubmit={handleSignup} className="space-y-3">
          
          <input 
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border px-3 py-2 rounded-lg text-sm"
            required
          />

          <input 
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border px-3 py-2 rounded-lg text-sm"
            required
          />

          <input 
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border px-3 py-2 rounded-lg text-sm"
            required
          />

          {error && <p className="text-red-500 text-xs">{error}</p>}
          {success && <p className="text-green-600 text-xs">{success}</p>}

          <button 
            type="submit"
            className="w-full py-2 rounded-lg bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700"
            disabled={loading}
          >
            {loading ? "Creating..." : "Create Account"}
          </button>
        </form>

        <p className="text-xs text-center text-slate-500">
          Already have an account? 
          <Link to="/login" className="text-blue-600 ml-1 underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
