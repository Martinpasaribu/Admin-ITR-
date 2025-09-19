/* eslint-disable @typescript-eslint/no-explicit-any */
// pages/login.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import { Eye, EyeOff, LogIn } from "lucide-react"; // untuk ikon lucide-react
import { useToast } from "@/components/ToastContect";

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ user_id: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);


  const { showToast } = useToast();

  const handleLogin = async () => {
    if (!form.user_id || !form.password) {
      showToast("warning",`Email dan password wajib diisi!`);
      return;
    }

    try {
      setLoading(true);
      const res = await api.post("/auth/login", form);
      router.push("/dashboard");

      showToast("success", `${res.data.message}`);

    } catch (error: any) {
      showToast("error",`${error.response?.data.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 via-white to-indigo-50">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
        <h1 className="text-2xl font-bold text-gray-800 text-center mb-6">
          Selamat Datang 👋
        </h1>
        <p className="text-gray-500 text-center mb-8">
          Login untuk melanjutkan ke dashboard Admin
        </p>

        {/* Input Email */}
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">
            Email / User ID Admin
          </label>
          <input
            type="text"
            placeholder="Masukkan email atau user ID"
            value={form.user_id}
            onChange={(e) =>
              setForm({ ...form, user_id: e.target.value })
            }
            className="w-full px-4 py-2 border rounded-lg text-gray-700 focus:ring-2 focus:ring-indigo-400 focus:outline-none"
          />
        </div>

        {/* Input Password */}
        <div className="mb-6 relative">
          <label className="block text-gray-700 font-medium mb-2">
            Password
          </label>
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Masukkan password"
            value={form.password}
            onChange={(e) =>
              setForm({ ...form, password: e.target.value })
            }
            className="w-full px-4 py-2 border rounded-lg text-gray-700 focus:ring-2 focus:ring-indigo-400 focus:outline-none pr-10"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-[2.7rem] text-gray-500 hover:text-gray-700"
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>

        {/* Tombol Login */}
        <button
          onClick={handleLogin}
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Memproses..." : "Login"}
          {!loading && <LogIn size={18} />}
        </button>

        {/* Footer */}
        {/* <p className="text-sm text-center text-gray-500 mt-6">
          Belum punya akun?{" "}
          <a
            href="/register"
            className="text-indigo-600 hover:underline font-medium"
          >
            Daftar sekarang
          </a>
        </p> */}
      </div>
    </div>
  );
}
