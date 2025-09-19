/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { Customer, CustomerClient } from "./models";
import AddCustomerModal from "./components/AddCustomer";
import EditCustomerModal from "./components/EditCustomer";
import { addCustomer, DeletedCustomer, getCustomers, updateCustomer, updateStatusBooking } from "./services/customer";
import { getRoomCodes } from "./services/code_room";
import { Room } from "../room/models";
import { StatusBooking } from "./constant";
import { useToast } from "@/components/ToastContect";
import { FormatDateTime } from "@/utils/Format/date";
import ConfirmDeleteModal from "@/components/ConfirmDeletedModal";
import { Trash2 } from "lucide-react";
import LoadingSpinner from "@/components/Loading";
import { div } from "framer-motion/client";

export default function CustomerPage() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editData, setEditData] = useState<Customer | null>(null);
  const [deleteId, setDeleteId] = useState<{ _id: string; room_id: string } | null>(null);


  const { showToast } = useToast();

  // Load data awal
  useEffect(() => {
    fetchRooms();
    fetchCustomers();
  }, []);

  const fetchRooms = async () => {
    try {
      const data = await getRoomCodes();
      setRooms(data);
    } catch (err) {
      console.error("Gagal mengambil rooms", err);
    }
  };

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const data = await getCustomers();
      setCustomers(data);
    } catch (err) {
      console.error("Gagal mengambil customers", err);
    } finally {
      setLoading(false);
    }
  };
  
  const handleAdd = async (data: CustomerClient) => {
    try {
      await addCustomer(data);
      fetchCustomers(); 
      showToast("success", "Berhasil tambah customer");
      setShowAddModal(false);
    } catch (error: any) {
      showToast("error", error.message);
    }
  };

  const handleUpdateStatus = async (code: string, newStatus: CustomerClient["booking_status"], roomId: string) => {
    try {
     
      await updateStatusBooking(code, newStatus, roomId);

      await fetchCustomers()

      showToast("success", "Berhasil update status booking");
    } catch (error: any) {
        showToast("error", error.message);
    }
  };


  const handleDeleteRoom = async () => {
    if (!deleteId) return;
    try {
      await DeletedCustomer(deleteId._id, deleteId.room_id);
      showToast("success", "Berhasil menghapus customer");

      // Hapus dari state customer
      setCustomers((prev) => prev.filter((c) => c._id !== deleteId._id));

      setDeleteId(null);
    } catch (err: any) {
      showToast("error", err.response?.data?.message || err.message);
      setDeleteId(null);
    }
  };


  return (
    <div className="min-h-screen p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-semibold text-gray-800">Daftar Customer</h1>
        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
        >
          + Tambah Customer
        </button>
      </div>

      <div className="overflow-x-auto bg-white rounded-xl shadow-md mt-10">
        <table className="w-full text-sm text-gray-700">
          <thead>
            <tr className="bg-gray-50 text-gray-600 text-xs uppercase tracking-wider">
              <th className="px-4 py-3 text-left">User ID</th>
              <th className="px-4 py-3 text-left">Username</th>
              <th className="px-4 py-3 text-left">NIK</th>
              <th className="px-4 py-3 text-left">Email</th>
              <th className="px-4 py-3 text-left">Phone</th>
              <th className="px-4 py-3 text-left">Tanggal Masuk</th>
              <th className="px-4 py-3 text-center">Status Bill</th>
              <th className="px-4 py-3 text-center">No Kamar</th>
              <th className="px-4 py-3 text-center">Status Book</th>
              <th className="px-4 py-3 text-center">Aksi</th>
            </tr>
          </thead>
          
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={10} className="py-10">
                  <div className="flex justify-center items-center">
                    <LoadingSpinner />
                  </div>
                </td>
              </tr>
            ) : customers.length === 0 ? (
              <tr>
                <td colSpan={10} className="text-center py-6 text-gray-500">
                  Belum ada customer.
                </td>
              </tr>
            ) : (
              customers.map((c, idx) => (
                <tr
                  key={c._id}
                  className={`${
                    idx % 2 === 0 ? "bg-white" : "bg-gray-50"
                  } border-t hover:bg-gray-100 transition`}
                >
                  <td className="px-4 py-3 font-medium">{c.user_id}</td>
                  <td className="px-4 py-3">{c.username}</td>
                  <td className="px-4 py-3">{c.nik}</td>
                  <td className="px-4 py-3">{c.email}</td>
                  <td className="px-4 py-3">{c.phone}</td>
                  <td className="px-4 py-3">{FormatDateTime(c.checkIn)}</td>

                  {/* Status Bill */}
                  <td className="px-4 py-3 text-center">
                    <span
                      className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        c.bill_status === "lunas"
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {c.bill_status}
                    </span>
                  </td>

                  {/* No Kamar */}
                  <td className="px-4 py-3 text-center font-medium">
                    {c.room_key.code}
                  </td>

                  {/* Status Book */}
                  <td className="px-4 py-3 text-center">
                    <select
                      value={c.booking_status}
                      onChange={(e) =>
                        handleUpdateStatus(
                          c._id,
                          e.target.value as CustomerClient["booking_status"],
                          c.room_key?._id,
                        )
                      }
                      className={`px-2 py-1 rounded-md border text-sm ${StatusBooking(
                        c.booking_status
                      ).className}`}
                    >
                      <option value="M">Masuk</option>
                      <option value="K">Keluar</option>
                      <option value="P">Pembayaran</option>
                      <option value="AK">Pengajuan Keluar</option>
                    </select>
                  </td>

                  {/* Aksi */}
                  <td className="px-4 py-3 text-center">
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={() => {
                          setEditData(c);
                          setShowEditModal(true);
                        }}
                        className="p-2 rounded-full border border-indigo-200 text-indigo-600 bg-white hover:bg-indigo-50 hover:shadow-sm transition"
                        title="Update Customer"
                      >
                        ✏️
                      </button>
                      <button
                        onClick={() =>
                          setDeleteId({ _id: c._id, room_id: c.room_key._id })
                        }
                        className="p-2 rounded-full border border-red-200 text-red-600 bg-white hover:bg-red-50 hover:shadow-sm transition"
                        title="Hapus Customer"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>

        </table>
      </div>


      {/* Modal */}
      <ConfirmDeleteModal
        isOpen={!!deleteId}
        onConfirm={handleDeleteRoom}
        onCancel={() => setDeleteId(null)}
        message="Yakin ingin menghapus room ini?"
      />

      <AddCustomerModal
        show={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSave={handleAdd}
        rooms={rooms}
      />

      {editData && (
        <EditCustomerModal
          show={showEditModal}
          onClose={() => setShowEditModal(false)}
          onUpdated={() => {
            fetchCustomers();
            setShowEditModal(false);
          }}
          customer={editData}
          rooms={rooms}
        />
      )}
    </div>
  );
}
