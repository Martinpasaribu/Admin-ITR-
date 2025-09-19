/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import AddFacilityModal from "./components/AddFacilityModal";
import EditFacilityModal from "./components/EditFacilityModal";
import { Facility } from "./models";
import { DeletedFacility, getFacilities, updateFacilityStatus } from "./services/service_facility";
import FacilityImageModal from "./components/AddImageModal";
import { Image, Plus, Trash2 } from "lucide-react";
import LoadingSpinner from "@/components/Loading";
import { useToast } from "@/components/ToastContect";
import ConfirmDeleteModal from "@/components/ConfirmDeletedModal";
export default function FacilityPage() {
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editData, setEditData] = useState<Facility | null>(null);
  const [showImageModal, setShowImageModal] = useState(false);
  const [imageFacility, setImageFacility] = useState<Facility | null>(null);
  const [deleteId, setDeleteId] = useState<{ _id: string } | null>(null);

  const { showToast } = useToast();

  // Load facilities dari API
  useEffect(() => {

    setLoading(true);
    GetFacilities()

  }, []);

  const GetFacilities = async () => {
    setLoading(true);
    try {
      const data = await getFacilities();
      setFacilities(data.data);
      setError(null);
      showToast("success", `${data.message}`);
    } catch (error: any) {
      showToast("error", error.message);
    } finally {
      setLoading(false);
    }
  };
    

  const handleAdd = (data: Facility) => setFacilities((prev) => [...prev, data]);
  
  const handleUpdateStatus = async (code: string, newStatus: Facility["status"]) => {
    try {
      const updated = await updateFacilityStatus(code, newStatus);
      setFacilities((prev) =>
        prev.map((f) => (f.code === code ? { ...f, status: updated.status } : f))
      );
    } catch (err) {
      console.error("Gagal update status:", err);
      alert("❌ Gagal update status");
    }
  };


  const handleDeleteRoom = async () => {
    if (!deleteId) return;
    try {
      
      await DeletedFacility(deleteId._id);
      showToast("success", "Berhasil menghapus customer");

      // Hapus dari state customer
     await GetFacilities()

      setDeleteId(null);
    } catch (err: any) {
      showToast("error", err.response?.data?.message || err.message);
      setDeleteId(null);
    }
  };

  const formatDate = (date: Date) => {
    if (!date) return "";
    const d = new Date(date);
    return d.toISOString().substring(0, 10);
  };

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-semibold text-gray-800">Daftar Fasilitas Umum</h1>
        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
        >
          + Tambah Fasilitas
        </button>
      </div>

      {loading && <div className="text-center py-4 text-gray-600">
        <LoadingSpinner />
      </div>}
      {error && <p className="text-center py-4 text-red-600">{error}</p>}

      {!loading && !error && (
        <div className="overflow-x-auto bg-white rounded-xl shadow-md mt-10">
          <table className="w-full text-sm text-left text-gray-700">
            <thead className="bg-gray-100 text-gray-800 text-sm uppercase">
              <tr>
                <th className="px-4 py-3">Nama</th>
                <th className="px-4 py-3">Kode</th>
                <th className="px-4 py-3">Jumlah Barang</th>
                <th className="px-4 py-3">Harga</th>
                <th className="px-4 py-3">Tanggal Masuk</th>
                <th className="px-4 py-3">Tanggal Terakhir Perbaikan</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Image</th>
                <th className="px-4 py-3">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {facilities.length === 0 ? (
                <tr>
                  <td
                    colSpan={9}
                    className="text-center py-6 text-gray-500 italic"
                  >
                    Belum ada fasilitas.
                  </td>
                </tr>
              ) : (
                facilities.map((f, idx) => (
                  <tr
                    key={f.code}
                    className={`border-t ${
                      idx % 2 === 0 ? "bg-white" : "bg-gray-50"
                    } hover:bg-gray-100 transition-colors`}
                  >
                    <td className="px-4 py-3 font-medium">{f.name}</td>
                    <td className="px-4 py-3">{f.code}</td>
                    <td className="px-4 py-3">{f.qty}</td>
                    <td className="px-4 py-3">Rp {f.price.toLocaleString()}</td>
                    <td className="px-4 py-3">{formatDate(f.date_in)}</td>
                    <td className="px-4 py-3">{formatDate(f.date_repair)}</td>
                    {/* <td className="px-4 py-3">
                      <span
                        className={`px-2 py-1 text-xs font-semibold rounded-full
                          ${
                            f.status === "B"
                              ? "bg-green-100 text-green-700"
                              : f.status === "P"
                              ? "bg-yellow-100 text-yellow-700"
                              : f.status === "R"
                              ? "bg-red-100 text-red-700"
                              : "bg-gray-200 text-gray-700"
                          }`}
                      >
                        {f.status === "B"
                          ? "Baik"
                          : f.status === "P"
                          ? "Sedang Perbaikan"
                          : f.status === "R"
                          ? "Rusak"
                          : "Tidak Digunakan"}
                      </span>
                    </td>           */}
                    <td className="px-4 py-2">
                      <select
                        value={f.status}
                        onChange={(e) => handleUpdateStatus(f.code, e.target.value as Facility["status"])}
                        className="border rounded p-1"
                      >
                        <option value="B">Baik</option>
                        <option value="P">Sedang Perbaikan</option>
                        <option value="R">Rusak</option>
                        <option value="T">Tidak Sedang Gunakan</option>
                      </select>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => {
                          setImageFacility(f);
                          setShowImageModal(true);
                        }}
                        className="p-2 rounded-full border border-gray-200 text-gray-600 bg-white hover:bg-gray-50 hover:shadow-sm transition"
                        title="Lihat Gambar"
                      >
                        <Image size={18} />
                      </button>
                    </td>
                    <td className="flex gap-2 px-4 py-3">
                       <button
                        onClick={() => {
                          setEditData(f);
                          setShowEditModal(true);
                        }}
                        className="p-2 rounded-full border border-indigo-200 text-indigo-600 bg-white hover:bg-indigo-50 hover:shadow-sm transition"
                        title="Update Customer"
                      >
                        ✏️
                      </button>
                      <button
                        onClick={() =>
                          setDeleteId({ _id: f._id })
                        }
                        className="p-2 rounded-full border border-red-200 text-red-600 bg-white hover:bg-red-50 hover:shadow-sm transition"
                        title="Hapus Customer"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}



      {/* Modal */}
      <ConfirmDeleteModal
        isOpen={!!deleteId}
        onConfirm={handleDeleteRoom}
        onCancel={() => setDeleteId(null)}
        message="Yakin ingin menghapus room ini?"
      />

      {/* Modal Tambah */}
      <AddFacilityModal
        show={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAdded={handleAdd}
      />

      {/* Modal Edit */}
      {editData && (
        <EditFacilityModal
          show={showEditModal}
          onClose={() => setShowEditModal(false)}
          facility={editData}
          // onUpdated={handleUpdate}
        />
      )}

      {imageFacility && (
        <FacilityImageModal
          facility={imageFacility}
          show={showImageModal}
          onClose={() => setShowImageModal(false)}
          onUpdated={(updated) => {
            setFacilities((prev) =>
              prev.map((x) => (x.code === updated.code ? updated : x))
            );
            setImageFacility(updated);
          }}
        />
      )}

    </div>
  );
}
