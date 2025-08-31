"use client";

import { useState } from "react";

interface AddReportModalProps {
  show: boolean;
  onClose: () => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onSave: (data: any) => void;
  defaultRoomNo: string;
  defaultUserId: string;
  defaultStatus: string;
  defaultNoteAdmin: string;
}

export default function AddReportModal({
  show,
  onClose,
  onSave,
  defaultRoomNo,
  defaultUserId,
  defaultStatus,
  defaultNoteAdmin,
}: AddReportModalProps) {
  const [form, setForm] = useState({
    report_type: "facility_room",
    room_no: defaultRoomNo,
    user_id: defaultUserId,
    damage_type: "good",
    damage_desc: "",
    image: "",
    status: defaultStatus,
    admin_note: defaultNoteAdmin,
  });

  const handleSubmit = () => {
    onSave(form);
    setForm({
      report_type: "facility_room",
      room_no: defaultRoomNo,
      user_id: defaultUserId,
      damage_type: "good",
      damage_desc: "",
      image: "",
      status: defaultStatus,
      admin_note: defaultNoteAdmin,
    });
  };

  const handleReportTypeChange = (value: string) => {
    if (value === "complaint") {
      setForm({
        ...form,
        report_type: value,
        damage_type: "",
        damage_desc: "",
      });
    } else {
      setForm({
        ...form,
        report_type: value,
        damage_type: "good",
      });
    }
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md">
        <h2 className="text-lg font-semibold mb-4 text-gray-800">Tambah Report</h2>

        {/* Tipe Report */}
        <label className="block mb-2 text-sm font-medium text-gray-700">
          Tipe Report
        </label>
        <select
          value={form.report_type}
          onChange={(e) => handleReportTypeChange(e.target.value)}
          className="w-full border rounded-lg p-2 mb-4 text-gray-400 text-sm"
        >
          <option value="facility_room">Fasilitas Kamar</option>
          <option value="facility">Fasilitas</option>
          <option value="complaint">Komplain</option>
        </select>

        {/* Tipe Kerusakan & Penjelasan Kerusakan hanya muncul jika bukan Komplain */}

        {form.report_type === "complaint" ? (
          <>
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Penjelasan Komplain
            </label>
            <textarea
              value={form.damage_desc}
              onChange={(e) =>
                setForm({ ...form, damage_desc: e.target.value })
              }
              className="w-full border rounded-lg p-2 mb-4 text-gray-700 placeholder-gray-500"
              placeholder="Tuliskan keluhan atau komplain Anda..."
            />
          </>
        ) : (
          <>
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Tipe Kerusakan
            </label>
            <select
              value={form.damage_type}
              onChange={(e) =>
                setForm({ ...form, damage_type: e.target.value })
              }
              className="w-full border rounded-lg p-2 mb-4 text-gray-700 text-sm"
            >
              <option value="good">Good</option>
              <option value="repair">Repair</option>
              <option value="change">Change</option>
            </select>

            <label className="block mb-2 text-sm font-medium text-gray-700">
              Penjelasan Kerusakan
            </label>
            <textarea
              value={form.damage_desc}
              onChange={(e) =>
                setForm({ ...form, damage_desc: e.target.value })
              }
              className="w-full border rounded-lg p-2 mb-4 text-gray-700 placeholder-gray-500"
              placeholder="Deskripsi kerusakan..."
            />
          </>
        )}


        {/* Image URL */}
        <label className="block mb-2 text-sm font-medium text-gray-700">

          Image URL
        </label>
        <input
          type="text"
          value={form.image}
          onChange={(e) => setForm({ ...form, image: e.target.value })}
          className="w-full border rounded-lg p-2 mb-4"
          placeholder="Masukkan URL gambar"
        />

        {/* Actions */}
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border rounded-lg hover:bg-gray-50 text-gray-700"
          >
            Batal
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            Simpan
          </button>
        </div>
      </div>
    </div>
  );
}
