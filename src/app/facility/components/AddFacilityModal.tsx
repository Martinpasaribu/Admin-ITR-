/* eslint-disable @typescript-eslint/no-explicit-any */
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
};

export default function AddFacilityModal({ show, onClose, onAdded }: Props) {
  const [form, setForm] = useState(INITIAL_FORM);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (field: keyof typeof form, value: string | number) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    if (!form.name.trim() || !form.code.trim()) {
      setMessage("⚠️ Nama dan kode wajib diisi");
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
        images: [],
      };

      const newFacility = await addFacility(payload);
      onAdded(newFacility);
      setMessage("✅ Fasilitas berhasil ditambahkan!");
      setForm(INITIAL_FORM);

      // Tutup otomatis setelah 1.5 detik
      setTimeout(() => {
        setMessage("");
        onClose();
      }, 1500);
    } catch (error) {
      console.error(error);
      setMessage("❌ Gagal menambahkan fasilitas. Coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setForm(INITIAL_FORM);
    setMessage("");
    onClose();
  };

  if (!show) return null;

  return (
    <div
      className="fixed text-gray-500 inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={handleCancel}
    >
      <div
        className="bg-white rounded-xl shadow-lg w-full max-w-md p-6 relative animate-fadeIn"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-lg font-semibold mb-4 text-gray-900 text-center">
          Tambah Fasilitas
        </h2>

        <div className="space-y-3 max-h-[70vh] overflow-y-auto scrollbar-thin">
          {[
            { label: "Nama", key: "name", type: "text" },
            { label: "Kode", key: "code", type: "text" },
            { label: "Harga", key: "price", type: "number" },
            { label: "Qty", key: "qty", type: "number" },
          ].map(({ label, key, type }) => (
            <div key={key}>
              <label className="block text-sm mb-1">{label}</label>
              <input
                type={type}
                value={form[key as keyof typeof form] as any}
                onChange={(e) => handleChange(key as any, e.target.value)}
                className="w-full border rounded-lg p-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                disabled={loading}
              />
            </div>
          ))}

          <div>
            <label className="block text-sm mb-1">Tanggal Masuk</label>
            <input
              type="date"
              value={form.date_in}
              onChange={(e) => handleChange("date_in", e.target.value)}
              className="w-full border rounded-lg p-2 text-sm"
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-sm mb-1">Tanggal Terakhir Perbaikan</label>
            <input
              type="date"
              value={form.date_repair}
              onChange={(e) => handleChange("date_repair", e.target.value)}
              className="w-full border rounded-lg p-2 text-sm"
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-sm mb-1">Harga Perbaikan</label>
            <input
              type="number"
              value={form.price_repair}
              onChange={(e) => handleChange("price_repair", e.target.value)}
              className="w-full border rounded-lg p-2 text-sm"
              min={0}
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-sm mb-1">Status</label>
            <select
              value={form.status}
              onChange={(e) => handleChange("status", e.target.value)}
              className="w-full border rounded-lg p-2 text-sm"
              disabled={loading}
            >
              <option value="B">Baik</option>
              <option value="P">Sedang Perbaikan</option>
              <option value="R">Rusak</option>
              <option value="T">Tidak Digunakan</option>
            </select>
          </div>
        </div>

        {message && (
          <p
            className={`mt-3 text-center text-sm font-medium ${
              message.startsWith("❌")
                ? "text-red-600"
                : message.startsWith("⚠️")
                ? "text-yellow-600"
                : "text-green-600"
            }`}
          >
            {message}
          </p>
        )}

        <div className="flex justify-end gap-3 mt-5">
          <button
            onClick={handleCancel}
            className="px-4 py-2 border rounded-lg text-gray-700 hover:bg-gray-50 active:scale-95 transition"
            disabled={loading}
          >
            Batal
          </button>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className={`px-4 py-2 rounded-lg text-white flex items-center justify-center gap-2 transition ${
              loading
                ? "bg-indigo-400 cursor-not-allowed"
                : "bg-indigo-600 hover:bg-indigo-700 active:scale-95"
            }`}
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Menyimpan...
              </>
            ) : (
              "Simpan"
            )}
          </button>
        </div>
      </div>

      <style jsx>{`
        .animate-fadeIn {
          animation: fadeIn 0.25s ease-in-out;
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>
    </div>
  );
}
