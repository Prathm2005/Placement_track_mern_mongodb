  import { useState } from 'react'
  import { Link, useNavigate } from "react-router-dom";
  import api from '../api/axios';
  import {useAuth} from '../context/AuthContext'
  const Register = () => {
    const [form, setForm] = useState({ name: "", email: "", password: "" });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();
    const handleSubmit= async(e)=>{
      e.preventDefault();
      setError("");
      setLoading(true);
      try {
        const {data}=await api.post("/auth/register",form);
        login(data);
        navigate("/dsa");
      } catch (error) {
        setError(error.response?.data?.message || "Registration failed");
      }
      finally{
        setLoading(false);
      }
    }
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 px-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="text-5xl mb-3">🎯</div>
            <h1 className="text-3xl font-bold text-white">Create Account</h1>
            <p className="text-slate-400 mt-2">Start tracking your placement prep</p>
          </div>
  
          <div className="bg-slate-800 rounded-2xl p-8 border border-slate-700">
            {error && (
              <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-lg mb-4 text-sm">
                {error}
              </div>
            )}
  
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm text-slate-400 mb-1">Full Name</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                  placeholder="Rahul Sharma"
                  required
                />
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-1">Email</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                  placeholder="you@example.com"
                  required
                />
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-1">Password</label>
                <input
                  type="password"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                  placeholder="Min 6 characters"
                  minLength={6}
                  required
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white py-2.5 rounded-lg font-medium transition"
              >
                {loading ? "Creating account..." : "Register"}
              </button>
            </form>
  
            <p className="text-slate-400 text-sm text-center mt-6">
              Already have an account?{" "}
              <Link to="/login" className="text-indigo-400 hover:text-indigo-300">
                Login
              </Link>
            </p>
          </div>
        </div>
      </div>
    )
  }

  export default Register