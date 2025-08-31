"use client";

import { Report } from "../models";
import { Progress, StatusBroken, TypeBroken } from "../constant";
import { Trash2, Pencil } from "lucide-react";

interface Props {
  report: Report;
  onEdit: (report: Report) => void;
 onDelete: (reportId: string) => void;
}

export default function ReportCard({ report, onEdit, onDelete }: Props) {
  return (
    <div className="relative group bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-lg transition">
      <div className="space-y-1">
        <div className="flex flex-wrap gap-x-6 gap-y-2">
          <div className="space-y-3">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
              Tipe Report
            </p>
            <p className="text-sm font-semibold text-gray-900 ">
              {TypeBroken(report.report_type).label}
            </p>
          </div>

          <div className="space-y-2">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
              Pelapor
            </p>
            <span
              className={`text-sm font-semibold px-2 py-1 rounded-md `}
            >
              {report.customer_key?.username}
            </span>
          </div>

          <div className="space-y-2">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
              Room
            </p>
            <span className="text-sm text-gray-700 font-semibold px-2 rounded-md">
              {typeof report.customer_key !== "string" &&
              report.customer_key?.room_key &&
              typeof report.customer_key.room_key !== "string"
                ? report.customer_key.room_key.code
                : "-"}
            </span>
          </div>

          <div className="space-y-2">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
              Tip Kerusakan
            </p>
            <span
              className={`text-sm font-semibold px-2 py-1 rounded-md `}
            >
              {StatusBroken(report.broken_type).label}
            </span>
          </div>
          
          <div className="space-y-2">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
              Status
            </p>
            <span
              className={`text-sm font-semibold px-2 py-1 rounded-md ${Progress(
                report.progress
              ).className}`}
            >
              {Progress(report.progress).label}
            </span>
          </div>


        </div>

        <div className="mt-3">
          <p className="text-gray-500 text-sm">Pesan Customer</p>
          <p className="text-gray-700 text-sm bg-gray-50 p-3 rounded-lg">
            {report.broken_des
              ? report.broken_des
              : report.complain_des || "Belum ada balasan"}
          </p>
        </div>
        <div className="mt-3">
          <p className="text-gray-500 text-sm">Balasan Admin</p>
          <p className="text-gray-700 text-sm bg-gray-50 p-3 rounded-lg">
            {report.admin_note || "Belum ada balasan"}
          </p>
        </div>
      </div>

      {/* 🔹 Tombol muncul saat hover */}
      <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition flex gap-2">
        <button
          onClick={() => onEdit(report)}
          className="p-2 bg-indigo-400 text-white rounded-lg hover:bg-indigo-500 shadow"
        >
          <Pencil size={16} />
        </button>
        <button
          onClick={() => report._id && onDelete(report._id)}
          className="p-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500 shadow"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
}
