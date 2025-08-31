"use client"

import { useState, useEffect } from "react";
import { GetBooking, UpdateBookingStatus } from "./services/service_booking";
import { Booking } from "./models";
import { FormatDateTime } from "@/utils/Format/date";

export default function BookingListPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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
    fetchData();
  }, []);

  const updateStatus = async (id: string,room_key: string, newStatus: Booking["status"]) => {
    try {
      await UpdateBookingStatus(id, room_key, newStatus);
      setBookings((prev) =>
        prev.map((b) => (b._id === id ? { ...b, status: newStatus } : b))
      );
    } catch (err) {
      console.error("Gagal update status:", err);
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
            {bookings.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-4 text-gray-500">
                  Belum ada booking masuk.
                </td>
              </tr>
            ) : (
              bookings.map((b) => (
                <tr key={b._id} className="border-t">
                  <td className="px-4 py-2">{b.username}</td>
                  <td className="px-4 py-2">{b.phone}</td>
                  <td className="px-4 py-2">{b.email}</td>
                  <td className="px-4 py-2">{b?.room_key?.code}</td>
                  <td className="px-4 py-2">
                    {FormatDateTime(b?.booking_date)}
                  </td>
                  <td className="px-4 py-2 capitalize">
                    <span
                      className={`px-2 py-1 rounded text-xs ${
                        b.status === "pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : b.status === "confirmed"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {b.status}
                    </span>
                  </td>
                  <td className="px-4 py-2 space-x-2">
                    <button
                      onClick={() => updateStatus(b._id,b.room_key._id, "confirmed")}
                      className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                    >
                      Konfirmasi
                    </button>
                    <button
                      onClick={() => updateStatus(b._id,b.room_key._id, "canceled")}
                      className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                    >
                      Batalkan
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
