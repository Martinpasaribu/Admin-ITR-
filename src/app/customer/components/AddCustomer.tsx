"use client";

import { useEffect, useState } from "react";
import { Customer, CustomerClient } from "../models";
import { Room } from "@/app/room/models";

interface Props {
  show: boolean;
  onClose: () => void;
  onSave: (customer: CustomerClient) => void;
  rooms: Room[];
}

export default function AddCustomerModal({ show, onClose, onSave, rooms }: Props) {
  
  const [room, setRoom] = useState<Room[]>([])


useEffect(() => {
  if (rooms && rooms.length > 0) {
    setRoom(rooms);

    // Set default room_key ke room pertama
    setForm((prev) => ({
      ...prev,
      room_key: rooms[0]._id
    }));

    console.log('data room', rooms)
  }
}, [rooms]);


  const [form, setForm] = useState<CustomerClient>({
    user_id:"",
    username: "",
    nik: 0,
    password: "",
    email: "",
    phone: 0,
    role: "customer",
    checkIn: "",
    bill_status: "belum_lunas",
    room_key:  "",
    booking_status: "M",
  });

  if (!show) return null;

  const handleSubmit = () => {
    onSave(form);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white text-gray-500 rounded-lg p-6 w-full max-w-lg">
        <h2 className="text-lg font-semibold mb-4">Tambah Customer</h2>

        {/* <input
          type="text"
          placeholder="User ID"
          className="w-full border rounded-lg p-2 mb-3"
          value={form.user_id}
          onChange={(e) => setForm({ ...form, user_id: e.target.value })}
        /> */}
        <input
          type="number"
          placeholder="NIK"
          className="w-full border rounded-lg p-2 mb-3"
          value={form.nik || ""}
          onChange={(e) => setForm({ ...form, nik: e.target.value === "" ? 0 : Number(e.target.value) })}
        />

        <input
          type="text"
          placeholder="Username"
          className="w-full border rounded-lg p-2 mb-3"
          value={form.username}
          onChange={(e) => setForm({ ...form, username: e.target.value })}
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full border rounded-lg p-2 mb-3"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />
        <input
          type="email"
          placeholder="Email"
          className="w-full border rounded-lg p-2 mb-3"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        <input
          type="number"
          placeholder="Phone"
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
        {room.map((r) => (
          <option
            key={r.code}
            value={r._id}
            disabled={!r.status} // kalau status false, option disable
            className={!r.status ? "text-gray-400" : ""}
          >
            Room {r.code} {!r.status && "( Habis )"}
          </option>
        ))}


        </select>

        <select
          className="w-full border rounded-lg p-2 mb-4"
          value={form.booking_status}
          onChange={(e) => setForm({ ...form, booking_status: e.target.value as "M" | "K" })}
        >
          <option value="M">Masuk</option>
          <option value="P">Pesanan</option>
          <option value="K">Keluar</option>
        </select>

        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 bg-gray-50 rounded-lg border">
            Batal
          </button>
          <button onClick={handleSubmit} className="px-4 py-2 bg-indigo-600 text-white rounded-lg">
            Simpan
          </button>
        </div>
      </div>
    </div>
  );
}
