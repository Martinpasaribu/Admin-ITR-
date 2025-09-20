/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import BaseModal from "./BaseModal";
import { useToast } from "@/components/ToastContect";
import { UpdateAdmin } from "../service/service_list_admin";
import { Eye, EyeOff } from "lucide-react";

interface UpdateProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  update: () => void;
  users: any
  adminId?: string; // id admin yang mau diupdate
}

export default function UpdateProfileModal({ isOpen, onClose, update, users }: UpdateProfileModalProps) {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [form, setForm] = useState({
    user_id: "",
    username: "",
    email: "",
    password: "",
    role: "",
  });

  const formatUserId = (value: string) => {
    return value
      .toLowerCase()         // jadi huruf kecil semua
      .replace(/\s+/g, "")   // hapus semua spasi
      .replace(/[^a-z0-9_]/g, ""); // hanya huruf, angka, underscore
  };


  const { showToast } = useToast();

  const handleUpdate = async (e: React.FormEvent) => {
    
    e.preventDefault();

    try {
      setLoading(true);
      if(!users._id){
        throw new Error("User id kosong");
      }
      const res = await UpdateAdmin(users?._id || "", form);
      showToast("success", res.message || "Update berhasil");
      onClose(); // tutup modal setelah update
      update()
    } catch (err: any) {
      showToast("error", err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <BaseModal title="Update Your Profile" isOpen={isOpen} onClose={onClose}>
      <form className="space-y-4" onSubmit={handleUpdate}>
          
        <input
          type="text"
          placeholder="Masukkan user id"
          value={form.user_id}
          onChange={(e) =>
            setForm({ ...form, user_id: formatUserId(e.target.value) })
          }
          className="w-full px-4 py-2 border rounded-lg text-gray-700 focus:ring-2 focus:ring-green-400 focus:outline-none"
        />

        <input
          type="text"
          placeholder="New Username"
          value={form.username}
          onChange={(e) => setForm({ ...form, username: e.target.value })}
          className="w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-indigo-500 outline-none"
        />

        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="New password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            className="w-full px-4 py-3 border rounded-lg text-gray-700 focus:ring-2 focus:ring-green-400 focus:outline-none pr-10"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-3 text-gray-500 hover:text-gray-700"
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>

        <input
          type="email"
          placeholder="New Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className="w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-indigo-500 outline-none"
        />

        <select
          value={form.role}
          onChange={(e) => setForm({ ...form, role: e.target.value })}
          className="w-full border rounded-lg p-2"
        >
          <option value="">Pilih Role</option>
          <option value="A">Admin</option>
          <option value="CA">Co Admin</option>
          <option value="SA">Super Admin</option>
        </select>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green-600 text-white font-semibold py-3 rounded-xl hover:bg-green-700 transition disabled:opacity-50"
        >
          {loading ? "Updating..." : "Save Changes"}
        </button>
      </form>
    </BaseModal>
  );
}
