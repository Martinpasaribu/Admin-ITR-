"use client";

import { Report } from "../models";
import { Progress, StatusBroken, TypeBroken } from "../constant";
import { Trash2, Pencil } from "lucide-react";
import { FormatDate } from "../utils/Date";
import { CalculateProgressDuration } from "../utils/TimeProgress";

interface Props {
  reports: Report[];
  onEdit: (report: Report) => void;
  onDelete: (reportId: string) => void;
}

export default function ReportTable({ reports, onEdit, onDelete }: Props) {
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
    </div>
  );
}
