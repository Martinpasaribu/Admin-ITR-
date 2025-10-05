/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { Customer, CustomerClientEdit } from "../models";
import { updateCustomer } from "../services/customer";
import { useToast } from "@/components/ToastContect";
import { Eye, EyeOff } from "lucide-react";
import crypto from "crypto";

interface Props {
  show: boolean;
  onClose: () => void;
  customer: Customer;
  rooms: { _id: string; code: string; status: boolean }[];
  onUpdated: () => void;
}

export default function EditCustomerModal({ show, onClose, customer, rooms, onUpdated }: Props) {
  const { showToast } = useToast();
  const [showPassword, setShowPassword] = useState(false);

  const [form, setForm] = useState<CustomerClientEdit>({
    ...customer,
    room_key: customer.room_key?._id || "",
    password: "",
  });

  // ⚡ Format otomatis user_id saat ubah username
  const handleUsernameChange = (value: string) => {
    const prefix = value.substring(0, 6).toUpperCase();
    const randomCode = crypto.randomBytes(2).toString("hex").toUpperCase();
    const newUserId = `${prefix}${randomCode}`;
    setForm({ ...form, username: value, user_id: newUserId });
  };

  const handleSubmit = async () => {
    try {
      const { password, ...rest } = form;
      const payload = {
        ...rest,
        ...(password.trim() ? { password } : {}),
      };

      await updateCustomer(customer._id, payload);
      showToast("success", "Customer berhasil diperbarui");
      onUpdated();
      onClose();
    } catch (error: any) {
      showToast("error", error.message);
    }
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4 sm:px-0">
      <div className="bg-white text-gray-700 rounded-xl shadow-lg w-full max-w-lg p-6 overflow-y-auto max-h-[90vh]">
        <h2 className="text-xl font-semibold mb-6 text-gray-800 text-center">
          Edit Customer
        </h2>

        <div className="space-y-4">
          {/* User ID */}
          <div>
            <label className="block text-sm font-medium mb-1">User ID</label>
            <input
              type="text"
              className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-gray-100 cursor-not-allowed"
              value={form.user_id}
              readOnly
            />
          </div>

          {/* NIK */}
          <div>
            <label className="block text-sm font-medium mb-1">NIK</label>
            <input
              type="number"
              className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              value={form.nik}
              onChange={(e) =>
                setForm({ ...form, nik: Number(e.target.value) })
              }
            />
          </div>

          {/* Username */}
          <div>
            <label className="block text-sm font-medium mb-1">Username</label>
            <input
              type="text"
              className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              value={form.username}
              onChange={(e) => handleUsernameChange(e.target.value)}
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium mb-1">Password Baru</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={form.password}
                placeholder="Isi jika ingin ubah password"
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-[0.55rem] text-gray-500 hover:text-gray-700"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </div>

          {/* Nomor Telepon */}
          <div>
            <label className="block text-sm font-medium mb-1">Nomor Telepon</label>
            <input
              type="number"
              className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              value={form.phone || ""}
              onChange={(e) => setForm({ ...form, phone: Number(e.target.value) })}
            />
          </div>

          {/* Tanggal Check-In */}
          <div>
            <label className="block text-sm font-medium mb-1">Tanggal Check-In</label>
            <input
              type="date"
              className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              value={form.checkIn}
              onChange={(e) => setForm({ ...form, checkIn: e.target.value })}
            />
          </div>

          {/* Status Pembayaran */}
          <div>
            <label className="block text-sm font-medium mb-1">Status Pembayaran</label>
            <select
              className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              value={form.bill_status}
              onChange={(e) =>
                setForm({
                  ...form,
                  bill_status: e.target.value as "lunas" | "belum_lunas",
                })
              }
            >
              <option value="lunas">Lunas</option>
              <option value="belum_lunas">Belum Lunas</option>
            </select>
          </div>

          {/* Pilih Kamar */}
          <div>
            <label className="block text-sm font-medium mb-1">Pilih Kamar</label>
            <select
              className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              value={form.room_key}
              onChange={(e) => setForm({ ...form, room_key: e.target.value })}
            >
              {rooms.map((r) => (
                <option
                  key={r.code}
                  value={r._id}
                  disabled={!r.status}
                  className={!r.status ? "text-gray-400" : ""}
                >
                  Room {r.code} {!r.status && "(tidak tersedia)"}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Tombol Aksi */}
        <div className="flex flex-col sm:flex-row justify-end gap-2 mt-6">
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-4 py-2 bg-gray-100 text-gray-600 rounded-lg border hover:bg-gray-200 transition"
          >
            Batal
          </button>
          <button
            onClick={handleSubmit}
            className="w-full sm:w-auto px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
          >
            Update
          </button>
        </div>
      </div>
    </div>
  );
}
