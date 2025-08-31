"use client";

import { useState, useEffect } from "react";
import AddFacilityModal from "./components/AddFacilityModal";
import EditFacilityModal from "./components/EditFacilityModal";
import { Facility } from "./models";
import { getFacilities, updateFacilityStatus } from "./services/service_facility";
import FacilityImageModal from "./components/AddImageModal";
import { Image, Plus } from "lucide-react";
export default function FacilityPage() {
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editData, setEditData] = useState<Facility | null>(null);
  const [showImageModal, setShowImageModal] = useState(false);
  const [imageFacility, setImageFacility] = useState<Facility | null>(null);

  // Load facilities dari API
  useEffect(() => {
    setLoading(true);
    getFacilities()
      .then((data) => {
        setFacilities(data);
        setError(null);
      })
      .catch((err) => {
        console.error("Error fetch fasilitas:", err);
        setError("Gagal memuat data fasilitas");
      })
      .finally(() => setLoading(false));
  }, []);

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

      {loading && <p className="text-center py-4 text-gray-600">Memuat data...</p>}
      {error && <p className="text-center py-4 text-red-600">{error}</p>}

      {!loading && !error && (
        <div className="overflow-x-auto bg-white rounded-lg shadow">
          <table className="w-full text-sm text-left text-gray-700">
            <thead className="bg-gray-100 text-gray-800">
              <tr>
                <th className="px-4 py-2">Nama</th>
                <th className="px-4 py-2">Kode</th>
                <th className="px-4 py-2">Qty</th>
                <th className="px-4 py-2">Harga</th>
                <th className="px-4 py-2">Tanggal Masuk</th>
                <th className="px-4 py-2">Tanggal Terakhir Perbaikan</th>
                <th className="px-4 py-2">Status</th>
                <th className="px-4 py-2">Image</th>
                <th className="px-4 py-2">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {facilities.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-4 text-gray-500">
                    Belum ada fasilitas.
                  </td>
                </tr>
              ) : (
                facilities.map((f) => (
                  <tr key={f.code} className="border-t">
                    <td className="px-4 py-2">{f.name}</td>
                    <td className="px-4 py-2">{f.code}</td>
                    <td className="px-4 py-2">{f.qty}</td>
                    <td className="px-4 py-2">{f.price}</td>
                    <td className="px-4 py-2">{formatDate(f.date_in)}</td>
                    <td className="px-4 py-2">{formatDate(f.date_repair)}</td>
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

                    <td className="px-4 py-2 flex gap-2">

                      <button
                        onClick={() => {
                          setImageFacility(f);
                          setShowImageModal(true);
                        }}
                        className="px-3 py-1  rounded text-gray-500"
                      >
                        <Image />
                      </button>
                    </td>

                    <td className="px-4 py-2">
                      <button
                        onClick={() => {
                          setEditData(f);
                          setShowEditModal(true);
                        }}
                        className="px-3 py-1 bg-gray-900 text-white rounded hover:bg-gray-950"
                      >
                        Update
                      </button>
                    </td>



                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

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
