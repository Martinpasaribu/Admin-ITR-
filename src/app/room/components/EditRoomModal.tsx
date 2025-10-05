/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useState } from "react";
import { X } from "lucide-react";
import Input from "@/components/UI/Input";
import Button from "@/components/UI/Button";
import { fetchRoomById, updateRoom } from "../services/service_room";
import { useToast } from "@/components/ToastContect";

interface Facility {
  name: string;
  code: string;
  status: string;
  image?: string;
  _id?: string;
}

interface Room {
  _id: string;
  name: string;
  code: string;
  facility: Facility[];
  price: number;
  status: boolean;
  customer_key?: string;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  room_id: string | null;
  onUpdate: () => void
}

export default function UpdateRoomModal({ isOpen, onClose, room_id, onUpdate }: Props) {
  const [form, setForm] = useState<Room | null>(null);
  const [originalData, setOriginalData] = useState<Room | null>(null); // ✅ simpan data asli
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    if (room_id && isOpen) {
      loadRoomData(room_id);
    }
  }, [room_id, isOpen]);

  const loadRoomData = async (id: string) => {
    try {
      const data = await fetchRoomById(id);
      setForm(data);
      setOriginalData(data); // ✅ simpan versi original untuk reset nanti
    } catch (error: any) {
      showToast("error", error.message);
    }
  };

  if (!isOpen || !form) return null;

  const handleChange = (key: keyof Room, value: any) => {
    setForm((prev) => (prev ? { ...prev, [key]: value } : prev));
  };

  const removeFacility = (index: number) => {
    setForm((prev) =>
      prev
        ? { ...prev, facility: prev.facility.filter((_, i) => i !== index) }
        : prev
    );
  };

  const handleCancel = () => {
    if (originalData) {
      setForm(originalData); // ✅ kembalikan ke versi awal
    }
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form?._id) return;

    try {
      setLoading(true);
      await updateRoom(form._id, form);
      showToast("success", "Room berhasil diperbarui!");
      onClose();
      onUpdate()
    } catch (error: any) {
      showToast("error", error.message);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 text-gray-500">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg p-6 relative">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Update Room</h2>
          <button onClick={handleCancel}>
            <X className="w-5 h-5 text-gray-600 hover:text-gray-800" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Kode Room */}
          <Input
            label="Kode Room"
            value={form.code}
            maxLength={4}
            onChange={(e) => handleChange("code", e.target.value.toUpperCase())}
            placeholder="Misal: H02"
          />

          <Input
            label="Nama Kamar"
            value={form.name}
            onChange={(e) => handleChange("name", e.target.value)}
            placeholder="Misal: Kamar Cemara"
          />

          {/* Harga */}
          <Input
            label="Harga (Rp)"
            type="number"
            value={form.price}
            onChange={(e) => handleChange("price", Number(e.target.value))}
            placeholder="200000"
          />

          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status Room
            </label>
            <select
              value={form.status ? "true" : "false"}
              onChange={(e) => handleChange("status", e.target.value === "true")}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="true">Kosong</option>
              <option value="false">Terisi</option>
            </select>
          </div>

          {/* Fasilitas */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Fasilitas (hanya bisa dihapus)
            </label>

            {form.facility.length === 0 && (
              <p className="text-sm text-gray-500 italic">
                Tidak ada fasilitas yang terdaftar.
              </p>
            )}

            {form.facility.map((item, i) => (
              <div
                key={i}
                className="flex items-center gap-2 mb-2 border p-2 rounded-md"
              >
                <Input value={item.name} disabled placeholder="Nama fasilitas" />
                <Input
                  value={item.code}
                  disabled
                  className="w-24"
                  placeholder="Kode"
                />
                <button
                  type="button"
                  onClick={() => removeFacility(i)}
                  className="text-red-500 hover:text-red-700"
                  title="Hapus fasilitas"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 mt-6">
            <Button type="button" variant="secondary" onClick={handleCancel}>
              Batal
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Menyimpan..." : "Simpan"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
