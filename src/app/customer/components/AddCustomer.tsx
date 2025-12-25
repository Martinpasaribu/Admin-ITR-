"use client";

import { useEffect, useState } from "react";
import { CustomerClient } from "../models";
import { Room } from "@/app/room/models";
import { Eye, EyeOff } from "lucide-react";

interface Props {
  show: boolean;
  onClose: () => void;
  onSave: (customer: CustomerClient) => Promise<boolean> | boolean;
  rooms: Room[];
}

export default function AddCustomerModal({ show, onClose, onSave, rooms }: Props) {
  const [room, setRoom] = useState<Room[]>([]);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const defaultForm: CustomerClient = {
    username: "",
    nik: 0,
    password: "",
    email: "",
    phone: 0,
    role: "customer",
    checkIn: "",
    bill_status: "belum_lunas",
    room_key: "",
    booking_status: "M",
  };

  const [form, setForm] = useState<CustomerClient>(defaultForm);

  // Set default room ketika rooms berubah
  useEffect(() => {
    if (rooms && rooms.length > 0) {
      setRoom(rooms);
      setForm((prev) => ({
        ...prev,
        room_key: prev.room_key || rooms[0]._id,
      }));
    }
  }, [rooms]);

  // Reset form ketika modal ditutup
  useEffect(() => {
    if (!show) {
      setForm({
        ...defaultForm,
        room_key: rooms[0]?._id || "",
      });
      setLoading(false);
    }
  }, [show, rooms]);

  // Handle simpan data
  const handleSubmit = async () => {
    if (loading) return;
    setLoading(true);

    try {
      const success = await onSave(form);

      if (success) {
        // ✅ Reset hanya jika sukses
        setForm({
          ...defaultForm,
          room_key: rooms[0]?._id || "",
        });
        onClose();
      }
    } catch (err) {
      console.error("Gagal menyimpan data:", err);
    } finally {
      setLoading(false);
    }
  };


  // Handle batal
  const handleCancel = () => {
    setForm({
      ...defaultForm,
      room_key: rooms[0]?._id || "",
    });
    setLoading(false);
    onClose();
  };

  if (!show) return null;

  return (
    <div
      className={`fixed inset-0 bg-black/40 flex items-center justify-center z-50 transition-all duration-200 ${
        show ? "opacity-100 visible" : "opacity-0 invisible"
      }`}
    >
      <div className="bg-white text-gray-700 rounded-2xl shadow-xl w-full max-w-2xl mx-4 sm:mx-6 md:mx-0 max-h-[90vh] overflow-y-auto p-6 sm:p-8">
        {/* Header */}
        <h2 className="text-2xl font-semibold mb-6 text-gray-800 text-center sm:text-left">
          Tambah Customer
        </h2>

        {/* Form */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* NIK */}
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-600">NIK</label>
            <input
              type="number"
              className="w-full border rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              value={form.nik || ""}
              onChange={(e) =>
                setForm({ ...form, nik: e.target.value === "" ? 0 : Number(e.target.value) })
              }
            />
          </div>

          {/* Username */}
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-600">Username</label>
            <input
              type="text"
              className="w-full border rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
            />
          </div>

          {/* Password */}
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium mb-1 text-gray-600">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-[0.6rem] text-gray-500 hover:text-gray-700"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-600">Email</label>
            <input
              type="email"
              className="w-full border rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-600">Nomor Telepon</label>
            <input
              type="number"
              className="w-full border rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              value={form.phone || ""}
              onChange={(e) => setForm({ ...form, phone: Number(e.target.value) })}
            />
          </div>

          {/* Check-in */}
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-600">Tanggal Check-In</label>
            <input
              type="date"
              className="w-full border rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              value={form.checkIn}
              onChange={(e) => setForm({ ...form, checkIn: e.target.value })}
            />
          </div>

          {/* Status Pembayaran */}
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-600">Status Pembayaran</label>
            <select
              className="w-full border rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              value={form.bill_status}
              onChange={(e) =>
                setForm({ ...form, bill_status: e.target.value as "lunas" | "belum_lunas" })
              }
            >
              <option value="lunas">Lunas</option>
              <option value="belum_lunas">Belum Lunas</option>
            </select>
          </div>

          {/* Pilih Kamar */}
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-600">Pilih Kamar</label>
            <select
              className="w-full border rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              value={form.room_key}
              onChange={(e) => setForm({ ...form, room_key: e.target.value })}
            >
              {room.map((r) => (
                <option
                  key={r.code}
                  value={r._id}
                  disabled={!r.status}
                  className={!r.status ? "text-gray-400" : ""}
                >
                  Room {r.code} {!r.status && "(Habis)"}
                </option>
              ))}
            </select>
          </div>

          {/* Status Booking */}
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-600">Status Booking</label>
            <select
              className="w-full border rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              value={form.booking_status}
              onChange={(e) =>
                setForm({ ...form, booking_status: e.target.value as "M" | "K" | "P" })
              }
            >
              <option value="M">Masuk</option>
              <option value="P">Pesanan</option>
              <option value="K">Keluar</option>
            </select>
          </div>
        </div>

        {/* Tombol Aksi */}
        <div className="flex flex-col sm:flex-row justify-end gap-3 mt-8">
          <button
            onClick={handleCancel}
            className="px-5 py-2.5 bg-gray-100 text-gray-600 rounded-lg border hover:bg-gray-200 transition text-sm sm:text-base"
            disabled={loading}
          >
            Batal
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className={`px-5 py-2.5 rounded-lg text-white transition text-sm sm:text-base ${
              loading
                ? "bg-indigo-400 cursor-not-allowed"
                : "bg-indigo-600 hover:bg-indigo-700"
            }`}
          >
            {loading ? "Menyimpan..." : "Simpan"}
          </button>
        </div>
      </div>
    </div>
  );
}
