"use client";

import { Report } from "../models";
import { Progress, StatusBroken, TypeBroken } from "../constant";
import { Trash2, Pencil, Image } from "lucide-react";
import { FormatDate } from "../utils/Date";
import { CalculateProgressDuration } from "../utils/TimeProgress";
import { useState } from "react";

interface Props {
  reports: Report[];
  onEdit: (report: Report) => void;
  onDelete: (reportId: string) => void;
}

export default function ReportTable({ reports, onEdit, onDelete }: Props) {

  const [previewImage, setPreviewImage] = useState<string | null>(null);
  

  return (
    <div className="overflow-x-auto bg-white rounded-lg shadow">
      <table className="w-full text-sm text-left text-gray-700">
        <thead className="bg-gray-100 text-gray-800">
          <tr>
            <th className="px-4 py-2">No Laporan</th>
            <th className="px-4 py-2">Tipe Report</th>
            <th className="px-4 py-2">Pelapor</th>
            <th className="px-4 py-2">Room</th>
            <th className="px-4 py-2">Tipe Kerusakan</th>
            <th className="px-4 py-2">Status</th>
            <th className="px-4 py-2">Laporan Masuk</th>
            <th className="px-4 py-2">Lama Pengerjaan</th>
            <th className="px-4 py-2">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {reports.map((r) => (
            <tr key={r._id} className="border-t hover:bg-gray-50">
              <td className="px-4 py-2">{r.report_code}</td>
              <td className="px-4 py-2">{TypeBroken(r.report_type).label}</td>
              <td className="px-4 py-2">{r.customer_key?.username || "-"}</td>
              <td className="px-4 py-2">
                {typeof r.customer_key !== "string" &&
                r.customer_key?.room_key &&
                typeof r.customer_key.room_key !== "string"
                  ? r.customer_key.room_key.code
                  : "-"}
              </td>
              <td className="px-4 py-2">{StatusBroken(r.broken_type).label}</td>
              <td className="px-4 py-2">
                <span className={`px-2 py-1 rounded-md text-xs font-semibold ${Progress(r.progress).className}`}>
                  {Progress(r.progress).label}
                </span>
              </td>

              <td className="px-6 py-4">

                  {r.image ? (
                    <p
                      onClick={() => setPreviewImage(r.image)} // ✅ trigger preview image
                      className="flex justify-center mt-1 text-sm font-semibold text-gray-900 cursor-pointer"
                    >
                      <Image size={20} className="text-gray-500 hover:text-gray-700 transition" />
                    </p>
                  ) : (
                    <span className="text-xs text-gray-400 italic">Tidak ada</span>
                  )}

              </td>

              <td className="px-4 py-2">{FormatDate(r.createdAt, "/")}</td>
              <td className="px-4 py-2">
                {r.progress_end
                  ? CalculateProgressDuration(r.createdAt, r.progress_end)
                  : "-"}
              </td>
              <td className="px-4 py-2 flex gap-2">
                <button
                  onClick={() => onEdit(r)}
                  className="p-2 bg-indigo-400 text-white rounded-lg hover:bg-indigo-500 shadow"
                >
                  <Pencil size={16} />
                </button>
                <button
                  onClick={() => r._id && onDelete(r._id)}
                  className="p-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500 shadow"
                >
                  <Trash2 size={16} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

            {/* 🔹 Preview Image Modal */}
      {previewImage && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50"
          onClick={() => setPreviewImage(null)}
        >
          <img
            src={previewImage}
            alt="Preview"
            className="max-w-[90%] max-h-[90%] rounded-lg shadow-2xl transition-transform duration-300 scale-100 hover:scale-105"
          />
          <button
            onClick={() => setPreviewImage(null)}
            className="absolute top-6 right-6 text-white bg-black/50 hover:bg-black/70 p-2 px-3 rounded-full transition"
          >
            ✕
          </button>
        </div>
      )}

    </div>
  );
}
