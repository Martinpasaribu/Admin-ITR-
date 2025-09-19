/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { Report } from "./models";
import EditReportModal from "./components/UpdateStatusReport";
import { DeletedReport, getReport, updateReport } from "./service/services.report";
import { filterReports, ReportFilters } from "./utils/Filter";
import ReportCard from "./components/ReportCard";
import { DateRangePicker } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { useToast } from "@/components/ToastContect";
import ConfirmDeleteModal from "@/components/ConfirmDeletedModal";
import ReportTable from "./components/ReportTable";

export default function ReportsPage() {
  const [loading, setLoading] = useState(true);
  const [reports, setReports] = useState<Report[]>([]);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showDateModal, setShowDateModal] = useState(false);
  const [deleteId, setDeleteId] = useState<{ _id: string } | null>(null);
  const [viewMode, setViewMode] = useState<"card" | "table">("card");


  const { showToast } = useToast();

  const [dateRange, setDateRange] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: "selection",
    },
  ]);

  const [filters, setFilters] = useState<ReportFilters>({
    report_type: "",
    broken_type: "",
    progress: "",
    startDate: undefined,
    endDate: undefined,
    searchTerm: "",  // 🔹 Tambahkan filter baru
  });

  useEffect(() => {
    let mounted = true;

    const init = async () => {
      setLoading(true);
      try {
        const report = await getReport();
        if (mounted) setReports(report || []);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    init();
    return () => {
      mounted = false;
    };
  }, []);

  const openModal = (report: Report) => {
    setSelectedReport(report);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedReport(null);
    setIsModalOpen(false);
  };

  const saveChanges = async (updatedReport: Report) => {
    try {
      const res = await updateReport(updatedReport._id as string, {
        progress: updatedReport.progress,
        admin_note: updatedReport.admin_note,
      });

      setReports((prev) =>
        prev.map((r) => (r._id === updatedReport._id ? { ...r, ...res } : r))
      );

      const report = await getReport();
      setReports(report || []);
    } catch (err) {
      console.error("Gagal update report:", err);
    }
  };

  const handleDateChange = (ranges: any) => {
    const { startDate, endDate } = ranges.selection;
    setDateRange([ranges.selection]);
    setFilters((prev) => ({
      ...prev,
      startDate: startDate instanceof Date ? startDate : undefined,
      endDate: endDate instanceof Date ? endDate : undefined,
    }));
  };

  const handleClearDateFilter = () => {
    setDateRange([
      {
        startDate: new Date(),
        endDate: new Date(),
        key: "selection",
      },
    ]);
    
    setFilters((prev) => ({
      ...prev,
      startDate: undefined,
      endDate: undefined,
    }));
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

const handleDeleteReport = async () => {
    if (!deleteId) return;
    try {
      await DeletedReport(deleteId._id);
      showToast("success", "Berhasil menghapus report");

      // 🔹 Ambil ulang data setelah berhasil menghapus
      const report = await getReport();
      setReports(report || []);

      setDeleteId(null);
    } catch (err: any) {
      showToast("error", err.response?.data?.message || err.message);
      setDeleteId(null);
    }
  };
  

  const filteredReports = filterReports(reports, filters);

  return (
    <main className="p-8 bg-gray-50 text-gray-800 min-h-screen">
      <h1 className="text-3xl font-bold mb-8 text-gray-900">Manajemen Laporan</h1>

      <div className="bg-white p-4 rounded-lg shadow mb-6 flex flex-wrap gap-4 justify-between">

        <div className="flex flex-wrap gap-4 items-center">

        {/* 🔹 Satu input untuk mencari nama pelanggan atau kode kamar */}
        <input
          type="text"
          placeholder="Cari Report | Customer | Room "
          className="border rounded-lg p-2 text-sm"
          value={filters.searchTerm}
          onChange={(e) => setFilters({ ...filters, searchTerm: e.target.value })}
        />
          {/* --- SELECT DROPDOWNS --- */}
          <select
            className="border rounded-lg p-2 text-sm"
            value={filters.report_type}
            onChange={(e) => setFilters({ ...filters, report_type: e.target.value })}
          >
            <option value="">Semua Tipe Report</option>
            <option value="FK">Fasilitas Kamar</option>
            <option value="FU">Fasilitas Umum</option>
            <option value="K">Kebersihan</option>
          </select>

          <select
            className="border rounded-lg p-2 text-sm"
            value={filters.broken_type}
            onChange={(e) => setFilters({ ...filters, broken_type: e.target.value })}
          >
            <option value="">Semua Kategori Kerusakan</option>
            <option value="SP">Sedikit Rusak</option>
            <option value="R">Rusak</option>
            <option value="SR">Sarana</option>
          </select>

          <select
            className="border rounded-lg p-2 text-sm"
            value={filters.progress}
            onChange={(e) => setFilters({ ...filters, progress: e.target.value })}
          >
            <option value="">Semua Progress</option>
            <option value="A">Antrian</option>
            <option value="P">Proses</option>
            <option value="S">Selesai</option>
            <option value="T">Tolak</option>
          </select>

        </div>


        <div className="flex flex-wrap gap-2">
          {/* Tampilan tanggal yang dipilih dan tombol hapus */}
            {filters.startDate && filters.endDate && (
              <div className="flex items-center gap-2 bg-gray-100 p-2 rounded-lg text-sm">
                <span>
                  {formatDate(filters.startDate)} - {formatDate(filters.endDate)}
                </span>
                <button
                  onClick={handleClearDateFilter}
                  className="text-red-500 hover:text-red-700 font-bold"
                  aria-label="Hapus filter tanggal"
                >
                  &times;
                </button>
              </div>
            )}

          {/* Tombol untuk membuka modal date range */}
            <button
              onClick={() => setShowDateModal(true)}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-600 transition-colors"
            >
              Filter Tanggal

  
            </button>

        </div>

      </div>

      {/* 🔹 Modal untuk DateRangePicker */}
      {showDateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/10 bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-xl relative">
            <button
              onClick={() => setShowDateModal(false)}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 text-2xl font-bold"
            >
              &times;
            </button>
            <h3 className="text-lg font-bold mb-4">Pilih Rentang Tanggal</h3>
            <DateRangePicker
              ranges={dateRange}
              onChange={handleDateChange}
              editableDateInputs={true}
              moveRangeOnFirstSelection={false}
            />
          </div>
        </div>
      )}

      <div className="flex justify-end mb-4">
        <button
          onClick={() => setViewMode("card")}
          className={`px-4 py-2 rounded-l-lg text-sm font-medium ${
            viewMode === "card"
              ? "bg-blue-500 text-white"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          Card
        </button>
        <button
          onClick={() => setViewMode("table")}
          className={`px-4 py-2 rounded-r-lg text-sm font-medium ${
            viewMode === "table"
              ? "bg-blue-500 text-white"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          Table
        </button>
      </div>


      {/* Tampilan Data  */}
      {loading ? (
        <p className="text-gray-500">Loading...</p>
      ) : filteredReports.length === 0 ? (
        <p className="text-gray-500">Tidak ada laporan sesuai filter.</p>
      ) : viewMode === "card" ? (
        <div className="space-y-5">
          {filteredReports.map((r) => (
            <ReportCard
              key={r._id}
              report={r}
              onEdit={openModal}
              onDelete={() => r._id && setDeleteId({ _id: r._id })}
            />
          ))}
        </div>
      ) : (
        <ReportTable
          reports={filteredReports}
          onEdit={openModal}
          onDelete={(id) => setDeleteId({ _id: id })}
        />
      )}

      {selectedReport && (
        <EditReportModal
          show={isModalOpen}
          report={selectedReport}
          onClose={closeModal}
          onSave={saveChanges}
        />
      )}

      <ConfirmDeleteModal
        isOpen={!!deleteId}
        onConfirm={handleDeleteReport}
        onCancel={() => setDeleteId(null)}
        message="Yakin ingin menghapus report ini?"
      />

    </main>
  );
}