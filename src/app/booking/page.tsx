/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useState, useEffect } from "react";
import { DeletedBooking, GetBooking, UpdateBookingStatus } from "./services/service_booking";
import { Booking } from "./models";
import { FormatDateTime } from "@/utils/Format/date";
import { Check, Trash2, X } from "lucide-react";
import { useToast } from "@/components/ToastContect";
import ConfirmDeleteModal from "@/components/ConfirmDeletedModal";
import { TypeStatus } from "./constant";


export default function BookingListPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<{ _id: string} | null>(null);


  const { showToast } = useToast();
  
  useEffect(() => {

    fetchData();
  }, []);

  async function fetchData() {
    try {
      const data = await GetBooking();
      setBookings(data);
    } catch (err) {
      console.error("Gagal ambil booking:", err);
    } finally {
      setLoading(false);
    }
  }

  const updateStatus = async (id: string,room_key: string, newStatus: Booking["status"]) => {
    try {
      await UpdateBookingStatus(id, room_key, newStatus);
      setBookings((prev) =>
        prev.map((b) => (b._id === id ? { ...b, status: newStatus } : b))
      );
      showToast("success", "Berhasil update status booking");
    } catch (error: any) {
        showToast("error", error.message);
    }
  };

    const handleDeleteBooking = async () => {

       if (!deleteId) return;

      try {
        await DeletedBooking(deleteId._id,);
        showToast("success", "Berhasil menghapus booking");
        setDeleteId(null);
        fetchData();
      } catch (err: any) {
        showToast("error", err.response?.data?.message || err.message);
        setDeleteId(null);
      }

    };
  

  if (loading) {
    // SKELETON LOADING
    return (
      <div className="min-h-screen p-6">
        <h1 className="text-xl font-semibold mb-6 text-gray-900">📋 Daftar Booking Masuk</h1>
        <div className="overflow-x-auto bg-white rounded-lg shadow">
          <table className="w-full text-sm text-left text-gray-700">
            <thead className="bg-gray-100 text-gray-800">
              <tr>
                <th className="px-4 py-2">Nama</th>
                <th className="px-4 py-2">No WA</th>
                <th className="px-4 py-2">Email</th>
                <th className="px-4 py-2">Kode Kamar</th>
                <th className="px-4 py-2">Tanggal Booking</th>
                <th className="px-4 py-2">Status</th>
                <th className="px-4 py-2">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: 5 }).map((_, i) => (
                <tr key={i} className="border-t animate-pulse">
                  <td className="px-4 py-3">
                    <div className="h-4 w-24 bg-gray-200 rounded"></div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="h-4 w-20 bg-gray-200 rounded"></div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="h-4 w-28 bg-gray-200 rounded"></div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="h-4 w-16 bg-gray-200 rounded"></div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="h-4 w-24 bg-gray-200 rounded"></div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="h-5 w-16 bg-gray-200 rounded"></div>
                  </td>
                  <td className="px-4 py-3 flex space-x-2">
                    <div className="h-8 w-20 bg-gray-200 rounded"></div>
                    <div className="h-8 w-20 bg-gray-200 rounded"></div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6">
      <h1 className="text-xl font-semibold mb-6 text-gray-900">Daftar Booking Masuk</h1>


      <div className="overflow-x-auto bg-white rounded-xl shadow-md">
        <table className="w-full text-sm text-left text-gray-700">
          <thead className="bg-gray-100 text-gray-800 text-sm uppercase">
            <tr>
              <th className="px-4 py-3">Nama</th>
              <th className="px-4 py-3">No WA</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Kode Kamar</th>
              <th className="px-4 py-3">Tanggal Booking</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {bookings.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-6 text-gray-500 italic">
                  Belum ada booking masuk.
                </td>
              </tr>
            ) : (
              bookings.map((b, idx) => (
                <tr
                  key={b._id}
                  className={`border-t ${
                    idx % 2 === 0 ? "bg-white" : "bg-gray-50"
                  } hover:bg-gray-100 transition`}
                >
                  <td className="px-4 py-3 font-medium">{b.username}</td>
                  <td className="px-4 py-3">{b.phone}</td>
                  <td className="px-4 py-3">{b.email}</td>
                  <td className="px-4 py-3">{b?.room_key?.code}</td>
                  <td className="px-4 py-3">{FormatDateTime(b?.booking_date)}</td>
                  <td className="px-4 py-3 capitalize">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold
                        ${TypeStatus(b.status).className}`}
                    >
                      {TypeStatus(b.status).label}
                    </span>
                  </td>
                  <td className="px-4 py-3 flex items-center gap-2">
            
                      <button
                        onClick={() => updateStatus(b._id, b.room_key._id, "C")}
                        className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-green-600 border border-green-600 hover:bg-green-50 transition"
                        title="Konfirmasi Booking"
                      >
                        <Check className="w-4 h-4" />
                        <span className="hidden sm:inline">Konfirmasi</span>
                      </button>
              
                    {  b.status === "C" && ( 
                      <button
                        onClick={() => updateStatus(b._id, b.room_key._id, "CL")}
                        className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-red-600 border border-red-600 hover:bg-red-50 transition"
                        title="Batalkan Booking"
                      >
                        <X className="w-4 h-4" />
                        <span className="hidden sm:inline">Batalkan</span>
                      </button>
                    )}

                    <button
                        onClick={() =>
                          // handleDeleteBooking(b._id)
                          setDeleteId({ _id:b._id  })
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

      <ConfirmDeleteModal
        isOpen={!!deleteId}
        onConfirm={handleDeleteBooking}
        onCancel={() => setDeleteId(null)}
        message="Yakin ingin menghapus Booking ini ?"
      />


    </div>
  );
}
