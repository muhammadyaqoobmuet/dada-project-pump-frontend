"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { saveToken } from "@/lib/auth";
import { Zap } from "lucide-react";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await api.post<{ token: string }>("/auth/login", {
        username,
        password,
      });
      saveToken(res.token);
      router.push("/dashboard");
    } catch {
      setError("Invalid username or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 font-sans">
      <div className="bg-white border border-slate-200 rounded-2xl p-8 w-full max-w-sm shadow-xl shadow-slate-200/40">
        
        <div className="flex flex-col items-center justify-center mb-8">
          <div className="w-12 h-12 bg-slate-900 rounded-xl flex items-center justify-center mb-4 shadow-sm">
            <Zap className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Welcome Back
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Sign in to manage your station
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full border border-slate-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200 transition-all placeholder:text-slate-400"
              placeholder="e.g. admin"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-slate-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200 transition-all placeholder:text-slate-400"
              placeholder="••••••••"
              required
            />
          </div>
          
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-100 rounded-lg text-rose-600 text-sm font-medium text-center">
              {error}
            </div>
          )}
          
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-slate-900 text-white py-2.5 rounded-lg font-medium hover:bg-slate-800 disabled:opacity-70 transition-colors shadow-sm"
          >
            {loading ? "Authenticating..." : "Sign in"}
          </button>
        </form>
      </div>
    </div>
  );
}
