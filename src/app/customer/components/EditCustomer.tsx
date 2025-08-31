/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { CustomerClient, Customer } from "../models";
import { updateCustomer } from "../services/customer";
import { useToast } from "@/components/ToastContect";

interface Props {
  show: boolean;
  onClose: () => void;
  customer: Customer;
  rooms: { _id: string; code: string }[];
  onUpdated: () => void; // callback ke main page
}

export default function EditCustomerModal({ show, onClose, customer, rooms, onUpdated }: Props) {
  const { showToast } = useToast();

  const [form, setForm] = useState<CustomerClient>({
    ...customer,
    room_key: customer.room_key?._id || "", // default ke id room
    password: "", // ⚡ kosongkan password saat edit
  });

  if (!show) return null;

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
  }  catch (error: any) {
  showToast("error", error.message);
}

};


  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white text-gray-500 rounded-lg p-6 w-full max-w-lg">
        <h2 className="text-lg font-semibold mb-4">Edit Customer</h2>

        <input
          type="text"
          className="w-full border rounded-lg p-2 mb-3"
          value={form.username}
          onChange={(e) => setForm({ ...form, username: e.target.value })}
        />

        {/* ⚡ password selalu kosong, hanya isi kalau mau ganti */}
        <input
          type="password"
          className="w-full border rounded-lg p-2 mb-3"
          value={form.password}
          placeholder="Password baru"
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />

        <input
          type="email"
          className="w-full border rounded-lg p-2 mb-3"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        <input
          type="number"
          className="w-full border rounded-lg p-2 mb-3"
          value={form.phone || ""}
          onChange={(e) => setForm({ ...form, phone: Number(e.target.value) })}
        />

        <input
          type="date"
          className="w-full border rounded-lg p-2 mb-3"
          value={form.checkIn}
          onChange={(e) => setForm({ ...form, checkIn: e.target.value })}
        />

        <select
          className="w-full border rounded-lg p-2 mb-3"
          value={form.bill_status}
          onChange={(e) => setForm({ ...form, bill_status: e.target.value as "lunas" | "belum_lunas" })}
        >
          <option value="lunas">Lunas</option>
          <option value="belum_lunas">Belum Lunas</option>
        </select>

        <select
          className="w-full border rounded-lg p-2 mb-3"
          value={form.room_key}
          onChange={(e) => setForm({ ...form, room_key: e.target.value })}
        >
          {rooms.map((r) => (
            <option key={r._id} value={r._id}>
              {r.code}
            </option>
          ))}
        </select>

        {/* <select
          className="w-full border rounded-lg p-2 mb-4"
          value={form.booking_status}
          onChange={(e) => setForm({ ...form, booking_status: e.target.value as "M" | "K" })}
        >
          <option value="M">Masuk</option>
          <option value="K">Keluar</option>
        </select> */}

        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 bg-gray-50 border rounded-lg">
            Batal
          </button>
          <button onClick={handleSubmit} className="px-4 py-2 bg-indigo-600 text-white rounded-lg">
            Update
          </button>
        </div>
      </div>
    </div>
  );
}
