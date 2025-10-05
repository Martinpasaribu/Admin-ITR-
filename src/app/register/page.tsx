/* eslint-disable @typescript-eslint/no-explicit-any */
// pages/register.tsx
"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import { Eye, EyeOff, UserPlus } from "lucide-react";
import { useToast } from "@/components/ToastContect";
import { authService } from "@/lib/auth";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    user_id: "",
    username: "",
    email: "",
    password: "",
    role: "",
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { showToast } = useToast();
   
  // const fetchMe = useCallback(async () => {
      
  //     setLoading(true);

  //     try {
        
  //       const isValid = await authService.checkSession();

  //       const profile = await authService.fetchProfile();

  //       if (profile?.role !== 'SA') {
  //         // router.push("/login?session=expired");
  //         router.push("/settings");
  //         return;
  //       }

  //       if (!isValid ) {
  //         router.push("/settings");
  //         return;
  //       }

  //     } catch (error) {
  //       showToast("error", `Gagal mengambil data: ${error}`);
  //       console.error("Error fetching data:", error);
  //     } finally {
  //       setLoading(false);
  //     }
  //   }, [router, showToast]);
    
  // useEffect(() => {
  //   fetchMe();
  // }, [fetchMe]);
  
  const handleRegister = async () => {
    if (!form.user_id || !form.email || !form.password) {
      showToast("warning", `Semua field wajib diisi!`);
      return;
    }

    try {
      setLoading(true);
      const res = await api.post("/admin/register", form);
      // alert("Berhasil daftar!");
      showToast("success", `${res.data.message}`);
      router.push("/login");
    } catch (err : any) {
      // alert("Gagal daftar! Periksa kembali data Anda.");
      showToast("error",`${err.response?.data.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 via-white to-indigo-50">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
        <h1 className="text-2xl font-bold text-gray-800 text-center mb-6">
          Daftar Akun Baru
        </h1>
        <p className="text-gray-500 text-center mb-8">
          Buat akun untuk mengakses dashboard
        </p>

        {/* Username */}
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">
            User ID Admin
          </label>
          <input
            type="text"
            placeholder="Masukkan username"
            value={form.user_id}
            onChange={(e) =>
              setForm({ ...form, user_id: e.target.value })
            }
            className="w-full px-4 py-2 border rounded-lg text-gray-700 focus:ring-2 focus:ring-indigo-400 focus:outline-none"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">
            Username
          </label>
          <input
            type="text"
            placeholder="Masukkan username"
            value={form.username}
            onChange={(e) =>
              setForm({ ...form, username: e.target.value })
            }
            className="w-full px-4 py-2 border rounded-lg text-gray-700 focus:ring-2 focus:ring-indigo-400 focus:outline-none"
          />
        </div>

        {/* Email */}
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">
            Email
          </label>
          <input
            type="email"
            placeholder="Masukkan email"
            value={form.email}
            onChange={(e) =>
              setForm({ ...form, email: e.target.value })
            }
            className="w-full px-4 py-2 border rounded-lg text-gray-700 focus:ring-2 focus:ring-indigo-400 focus:outline-none"
          />
        </div>

        <div className="mb-4 text-gray-600">

          <label className="block text-gray-700 font-medium mb-2">
            Role
          </label>

          <select
            className="w-full border rounded-lg p-2 mb-3"
            value={form.role}
            onChange={(e) => setForm({ ...form, role: e.target.value })}
          >
            <option value={"A"}>Admin</option>
            <option value={"CA"}>Co Admin</option>
            <option value={"SA"}>Super Admin</option>
          </select>

        </div>


        {/* Password */}
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
            className="absolute right-3 top-11 text-gray-500 hover:text-gray-700"
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>



        {/* Tombol Register */}
        <button
          onClick={handleRegister}
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 bg-indigo-700 hover:bg-indigo-800 text-white font-semibold py-2 px-4 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Memproses..." : "Daftar"}
          {!loading && <UserPlus size={18} />}
        </button>

        {/* Footer */}
        {/* <p className="text-sm text-center text-gray-500 mt-6">
          Sudah punya akun?{" "}
          <a
            href="/login"
            className="text-indigo-700 hover:underline font-medium"
          >
            Login di sini
          </a>
        </p> */}
      </div>
    </div>
  );
}
