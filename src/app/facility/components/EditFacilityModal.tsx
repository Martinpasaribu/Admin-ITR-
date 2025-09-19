/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { Facility, FacilityUpdate } from "../models";
import { updateFacility } from "../services/service_facility";
import { useToast } from "@/components/ToastContect";

interface Props {
  show: boolean;
  onClose: () => void;
  facility: Facility;
}

export default function EditFacilityModal({ show, onClose, facility }: Props) {
  const [form, setForm] = useState({
    name: "",
    code: "",
    qty: "",
    price: 0,
    date_in: "",
    date_repair: "",
    price_repair: 0,
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const { showToast } = useToast();

  useEffect(() => {
    if (facility) {
      setForm({
        name: facility.name,
        code: facility.code,
        qty: String(facility.qty),
        price: facility.price,
        date_in: facility.date_in ? new Date(facility.date_in).toISOString().slice(0, 10) : "",
        date_repair: facility.date_repair ? new Date(facility.date_repair).toISOString().slice(0, 10) : "",
        price_repair: facility.price_repair,
      });
      setMessage("");
    }
  }, [facility]);

  // universal handler
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value ,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.code) {
      alert("Nama dan Kode harus diisi");
      return;
    }

    setLoading(true);
    setMessage("");
    try {
      const updatedData: FacilityUpdate = {
        name: form.name,
        code: form.code,
        qty: Number(form.qty),   
        price: Number(form.price),
        date_in: new Date(form.date_in),
        date_repair: new Date(form.date_repair),
        price_repair: Number(form.price_repair),
      };
      await updateFacility(form.code, updatedData);

      showToast("success", "Fasilitas berhasil diperbarui!");
      onClose();
    } catch (error: any) {
      console.error(error);
      showToast("error", error.message);
    } finally {
      setLoading(false);
    }
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 text-gray-500 bg-black/40 flex justify-center items-center z-50 p-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-xl shadow-lg w-full max-w-md p-6 relative"
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
          disabled={loading}
        >
          ✕
        </button>

        <h2 className="text-lg font-semibold mb-4 text-gray-900">Edit Fasilitas</h2>

        {/* Input fields */}
        <label className="block text-sm mb-1">Nama</label>
        <input
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
          className="w-full border rounded-lg p-2 mb-3"
          disabled={loading}
          required
        />

        <label className="block text-sm mb-1">Kode (tidak bisa diubah)</label>
        <input
          type="text"
          name="code"
          value={form.code}
          disabled
          className="w-full border rounded-lg p-2 mb-3 bg-gray-50"
        />

        <label className="block text-sm mb-1">Jumlah Barang</label>
        <input
          type="number"
          name="qty"
          value={form.qty}
          onChange={handleChange}
          className="w-full border rounded-lg p-2 mb-3"
          min={0}
          disabled={loading}
          required
        />


        <label className="block text-sm mb-1">Harga</label>
        <input
          type="number"
          name="price"
          value={form.price}
          onChange={handleChange}
          className="w-full border rounded-lg p-2 mb-3"
          min={0}
          disabled={loading}
          required
        />

        <label className="block text-sm mb-1">Tanggal Masuk</label>
        <input
          type="date"
          name="date_in"
          value={form.date_in}
          onChange={handleChange}
          className="w-full border rounded-lg p-2 mb-3"
          disabled={loading}
          required
        />

        <label className="block text-sm mb-1">Tanggal Terakhir Perbaikan</label>
        <input
          type="date"
          name="date_repair"
          value={form.date_repair}
          onChange={handleChange}
          className="w-full border rounded-lg p-2 mb-3"
          disabled={loading}
        />

        <label className="block text-sm mb-1">Biaya Perbaikan</label>
        <input
          type="number"
          name="price_repair"
          value={form.price_repair}
          onChange={handleChange}
          className="w-full border rounded-lg p-2 mb-3"
          min={0}
          disabled={loading}
          required
        />

        {/* Message */}
        {message && (
          <p
            className={`mb-3 text-center ${
              message.startsWith("❌") ? "text-red-600" : "text-green-600"
            }`}
          >
            {message}
          </p>
        )}

        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border rounded-lg text-gray-700 hover:bg-gray-50"
            disabled={loading}
          >
            Batal
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            disabled={loading}
          >
            {loading ? "Mengirim..." : "Update"}
          </button>
        </div>
      </form>
    </div>
  );
}
