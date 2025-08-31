/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { MonitorCheck, Settings, LogOut, Home, Trash2, Eye } from "lucide-react";
import api from "@/lib/api";
import AddRoomForm from "./components/AddRoom";
import { useToast } from "@/components/ToastContect";
import ConfirmDeleteModal from "@/components/ConfirmDeletedModal";
import { Facility, Room } from "./models";
import ModalFacility from "./components/FacilityModal";
import { Image } from "lucide-react";
import RoomImageModal from "./components/AddImageModal";

export default function RoomPage() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { showToast } = useToast();

  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [facilityModalOpen, setFacilityModalOpen] = useState(false);
  const [selectedFacilities, setSelectedFacilities] = useState<Facility[]>([]);
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);
  const [imageFacility, setImageFacility] = useState<Room | null>(null);
  const [showImageModal, setShowImageModal] = useState(false);

  const fetchRooms = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get("/api/v1/room");
      setRooms(res.data.data || []);
    } catch (err: any) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  const handleAddRoom = async (
    code: string,
    price: number,
    facility: Facility[]
  ) => {
    try {
      await api.post("/api/v1/room", { code, price, facility });
      showToast("success", "Berhasil tambah kamar");
      fetchRooms();
    } catch (err: any) {
      showToast("error", err.response?.data?.message || err.message);
    }
  };

  const handleDeleteRoom = async () => {
    if (!deleteId) return;
    try {
      await api.delete(`/api/v1/room/${deleteId}`);
      showToast("success", "Berhasil menghapus kamar");
      setRooms((prev) => prev.filter((r) => r._id !== deleteId));
      setDeleteId(null);
    } catch (err: any) {
      showToast("error", err.response?.data?.message || err.message);
      setDeleteId(null);
    }
  };

  const handleOpenFacilityModal = async (roomId: string) => {
    try {
      const res = await api.get(`/api/v1/room/${roomId}/facility`);
      setSelectedFacilities(res.data.data || []);
      setSelectedRoomId(roomId);
      setFacilityModalOpen(true);
    } catch {
      showToast("error", "Gagal memuat facility");
    }
  };

  // Update status facility di backend + frontend
  const handleUpdateFacilityStatus = async (
    facilityCode: string,
    status: Facility["status"]
  ) => {
    if (!selectedRoomId) return;
    try {
      await api.patch(
        `/api/v1/room/${selectedRoomId}/facility/${facilityCode}`,
        { status }
      );
      handleChangeStatus(facilityCode, status);
    } catch (error) {
      showToast("error", "Gagal update status facility");
    }
  };

  // Update state facility di frontend saja
  const handleChangeStatus = (
    facilityCode: string,
    status: Facility["status"]
  ) => {
    setSelectedFacilities((prev) =>
      prev.map((f) =>
        f.code === facilityCode ? { ...f, status } : f
      )
    );
  };

  // Tambah facility baru
  const handleAddFacility = async (facility: {
    code: string;
    name: string;
    status: Facility["status"];
  }) => {
    if (!selectedRoomId) {
      showToast("error", "Pilih room terlebih dahulu");
      return;
    }

    try {
      const res = await api.post(
        `/api/v1/room/${selectedRoomId}/facility`,
        facility
      );

      const newFacility: Facility = res.data.data || facility;

      setSelectedFacilities((prev) => {
        if (prev.some((f) => f.code === newFacility.code)) return prev;
        return [...prev, newFacility];
      });

      showToast("success", "Facility berhasil ditambahkan");
    } catch (err: any) {
      showToast("error", err.response?.data?.message || err.message);
    }
  };

  return (
    <div className="min-h-screen p-6  mx-auto">
      {/* Header */}
      <header className="flex justify-between items-center bg-white shadow rounded-xl px-6 py-4 mb-8">
        <h1 className="text-xl font-bold flex items-center gap-2">
          <Home size={24} /> Data Room
        </h1>
        <div className="flex items-center gap-4">
          <button
            className="p-2 hover:bg-gray-100 rounded-full"
            onClick={() => router.push("/settings")}
          >
            <Settings size={20} />
          </button>
          <button
            className="p-2 hover:bg-gray-100 rounded-full"
            onClick={() => router.push("/login")}
          >
            <LogOut size={20} />
          </button>
        </div>
      </header>

      {/* Greeting */}
      <section className="bg-gradient-to-br from-indigo-500 to-indigo-600 text-white rounded-xl shadow p-6 mb-8">
        <h2 className="text-lg font-semibold">Halo, Admin 👋</h2>
        <p className="text-sm opacity-90">Kelola data kamar di sini</p>
      </section>

      {/* Form tambah room */}
      <AddRoomForm onAdd={handleAddRoom} loading={loading} />

      {/* Table */}
      <section className="bg-white rounded-xl shadow overflow-hidden">
        {error && (
          <p className="text-center text-red-600 p-4 font-semibold">{error}</p>
        )}
        <table className="w-full text-sm text-gray-700">
          <thead className="bg-gray-100 border-b">
            <tr>
              <th className="p-3 text-left">Kode Room</th>
              <th className="p-3 text-right">Harga</th>
              <th className="p-3 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {rooms.map((r) => (
              <tr key={r._id} className="border-b hover:bg-gray-50">
                <td className="p-3">{r.code}</td>
                <td className="p-3 text-right">
                  Rp {r.price.toLocaleString("id-ID")}
                </td>
                <td className="p-3 text-center flex justify-center gap-3">
                  <button
                    onClick={() => handleOpenFacilityModal(r._id)}
                    className="px-3 py-1 text-blue-600 hover:text-blue-800"
                  >
                    <MonitorCheck  />
                  </button>
                  <button
                    onClick={() => setDeleteId(r._id)}
                    className="px-3 py-1 text-red-600 hover:text-red-800"
                  >
                    <Trash2  />
                  </button>

                  <button
                    onClick={() => {
                      setImageFacility(r);
                      setShowImageModal(true);
                    }}
                    className="px-3 py-1  rounded text-gray-500"
                  >
                    <Image />
                  </button>

                </td>

    

              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* Modal */}
      <ConfirmDeleteModal
        isOpen={!!deleteId}
        onConfirm={handleDeleteRoom}
        onCancel={() => setDeleteId(null)}
        message="Yakin ingin menghapus room ini?"
      />
      <ModalFacility
        isOpen={facilityModalOpen}
        facilities={selectedFacilities}
        onClose={() => setFacilityModalOpen(false)}
        onUpdate={handleUpdateFacilityStatus}
        onAdd={handleAddFacility} // 🔹 tambahkan ini
      />

    {imageFacility && (
      <RoomImageModal
        room={imageFacility}
        show={showImageModal}
        onClose={() => setShowImageModal(false)}
        onUpdated={(updated) => {
          setRooms((prev) =>
            prev.map((x) => (x.code === updated.code ? updated : x))
          );
          setImageFacility(updated);
        }}
      />
    )}

    </div>
  );
}
