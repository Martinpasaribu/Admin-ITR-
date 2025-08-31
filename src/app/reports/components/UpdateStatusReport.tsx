"use client";
import { useState } from "react";
import { Report } from "../models";

interface EditReportModalProps {
  show: boolean;
  report: Report;
  onClose: () => void;
  onSave: (updatedReport: Report) => void;
}

export default function EditReportModal({
  show,
  report,
  onClose,
  onSave,
}: EditReportModalProps) {
  if (!show) return null;

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [form, setForm] = useState<Report>(report);

  const handleChange = (field: keyof Report, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    onSave(form); // kirim form ke parent
    onClose();    // tutup modal setelah simpan
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6 animate-fadeIn">
        <h2 className="text-xl font-semibold mb-4 text-gray-900">Ubah Laporan</h2>

        {/* Status */}
        <label className="block mt-2 text-sm font-medium text-gray-900">Status</label>
        <select
          value={form.progress}
          onChange={(e) => handleChange("progress", e.target.value)}
          className="mt-1 border border-gray-300 rounded-lg px-3 py-2 w-full text-gray-900 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
        >
          <option value="A">Antrian</option>
          <option value="P">Proses</option>
          <option value="S">Selesai</option>
          <option value="T">Tolak</option>
        </select>

        {/* Catatan Admin */}
        <label className="block mt-4 text-sm font-medium text-gray-900">Catatan Admin</label>
        <textarea
          value={form.admin_note}
          onChange={(e) => handleChange("admin_note", e.target.value)}
          className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          rows={4}
        />

        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 text-gray-900 transition"
          >
            Batal
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 shadow-sm transition"
          >
            Simpan
          </button>
        </div>
      </div>
    </div>
  );
}
