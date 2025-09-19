"use client";

import { useState } from "react";
import { Facility, FacilityMappingAdd } from "../models";
import { addFacility } from "../services/service_facility";

interface Props {
  show: boolean;
  onClose: () => void;
  onAdded: (data: Facility) => void; // callback kalau sukses
}

const INITIAL_FORM = {
  name: "",
  code: "",
  qty: 0,
  price: 0,
  status: "B" as Facility["status"],
  date_in: new Date().toISOString().substring(0, 10),
  date_repair: new Date().toISOString().substring(0, 10),
  price_repair: 0,
  // image: "",
};

export default function AddFacilityModal({ show, onClose, onAdded }: Props) {
  const [form, setForm] = useState(INITIAL_FORM);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (field: keyof typeof form, value: string | number) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    if (!form.name || !form.code) {
      alert("Nama dan Kode harus diisi");
      return;
    }

    setLoading(true);
    setMessage("");
    try {
      const payload: FacilityMappingAdd = {
        ...form,
        qty: Number(form.qty),
        price: Number(form.price),
        date_in: new Date(form.date_in),
        date_repair: new Date(form.date_repair),
        price_repair: Number(form.price_repair),
        image: "",
        image_IRepair: "",
        images: []
      };
      const newFacility = await addFacility(payload);
      setMessage("✅ Fasilitas berhasil ditambahkan!");
      onAdded(newFacility);
      setForm(INITIAL_FORM);
      onClose();
    } catch (error) {
      console.error(error);
      setMessage("❌ Gagal menambahkan fasilitas, coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 text-gray-600 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6">
        <h2 className="text-lg font-semibold mb-4 text-gray-900">Tambah Fasilitas</h2>

        <label className="block text-sm mb-1">Nama</label>
        <input
          type="text"
          value={form.name}
          onChange={(e) => handleChange("name", e.target.value)}
          className="w-full border rounded-lg p-2 mb-3"
          disabled={loading}
          required
        />

        <label className="block text-sm mb-1">Kode</label>
        <input
          type="text"
          value={form.code}
          onChange={(e) => handleChange("code", e.target.value)}
          className="w-full border rounded-lg p-2 mb-3"
          disabled={loading}
          required
        />

        <label className="block text-sm mb-1">Harga</label>
        <input
          type="number"
          value={form.price}
          onChange={(e) => handleChange("price", e.target.value)}
          className="w-full border rounded-lg p-2 mb-3"
          min={0}
          disabled={loading}
          required
        />

        <label className="block text-sm mb-1">Qty</label>
        <input
          type="number"
          value={form.qty}
          onChange={(e) => handleChange("qty", e.target.value)}
          className="w-full border rounded-lg p-2 mb-3"
          min={0}
          disabled={loading}
          required
        />

        <label className="block text-sm mb-1">Tanggal Masuk</label>
        <input
          type="date"
          value={form.date_in}
          onChange={(e) => handleChange("date_in", e.target.value)}
          className="w-full border rounded-lg p-2 mb-3"
          disabled={loading}
          required
        />

        <label className="block text-sm mb-1">Tanggal Terakhir Perbaikan</label>
        <input
          type="date"
          value={form.date_repair}
          onChange={(e) => handleChange("date_repair", e.target.value)}
          className="w-full border rounded-lg p-2 mb-3"
          disabled={loading}
          required
        />

        <label className="block text-sm mb-1">Harga Perbaikan</label>
        <input
          type="number"
          value={form.price_repair}
          onChange={(e) => handleChange("price_repair", e.target.value)}
          className="w-full border rounded-lg p-2 mb-3"
          min={0}
          disabled={loading}
        />

        {/* <label className="block text-sm mb-1">Gambar (URL)</label>
        <input
          type="text"
          value={form.image}
          onChange={(e) => handleChange("image", e.target.value)}
          className="w-full border rounded-lg p-2 mb-4"
          disabled={loading}
        /> */}

        <label className="block text-sm mb-1">Status</label>
        <select
          value={form.status}
          onChange={(e) => handleChange("status", e.target.value)}
          className="w-full border rounded-lg p-2 mb-4"
          disabled={loading}
          required
        >
          <option value="B">Baik</option>
          <option value="P">Sedang Perbaikan</option>
          <option value="R">Rusak</option>
          <option value="T">Tidak Sedang Gunakan</option>
        </select>

        {message && (
          <p className={`mb-3 text-center ${message.startsWith("❌") ? "text-red-600" : "text-green-600"}`}>
            {message}
          </p>
        )}

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border rounded-lg text-gray-700 hover:bg-gray-50"
            disabled={loading}
          >
            Batal
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
            disabled={loading}
          >
            {loading ? "Mengirim..." : "Simpan"}
          </button>
        </div>
      </div>
    </div>
  );
}
