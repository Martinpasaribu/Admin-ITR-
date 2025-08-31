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

  const handleUpdateStatus = async (code: string, newStatus: CustomerClient["booking_status"]) => {
    try {
      const updated = await updateStatusBooking(code, newStatus);
      setCustomers((prev) =>
        prev.map((f) => (f._id === code ? { ...f, booking_status: updated.booking_status } : f))
      );
    } catch (err) {
      console.error("Gagal update status:", err);
      alert("❌ Gagal update status");
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


  // Skeleton loader component
  const SkeletonRow = () => (
    <tr className="animate-pulse border-t">
      {Array.from({ length: 10 }).map((_, i) => (
        <td key={i} className="px-4 py-2">
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        </td>
      ))}
    </tr>
  );

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

      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="w-full text-sm text-left text-gray-700">
          <thead className="bg-gray-100 text-gray-800">
            <tr>
              <th className="px-4 py-2">User ID</th>
              <th className="px-4 py-2">Username</th>
              <th className="px-4 py-2">NIK</th>
              <th className="px-4 py-2">Email</th>
              <th className="px-4 py-2">Phone</th>
              <th className="px-4 py-2">Tanggal Masuk</th>
              <th className="px-4 py-2">Status Bill</th>
              <th className="px-4 py-2">No Kamar</th>
              <th className="px-4 py-2">Status Book</th>
              <th className="px-4 py-2">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              // tampilkan skeleton saat loading
              <>
                {Array.from({ length: 5 }).map((_, i) => (
                  <SkeletonRow key={i} />
                ))}
              </>
            ) : customers.length === 0 ? (
              <tr>
                <td colSpan={10} className="text-center py-4 text-gray-500">
                  Belum ada customer.
                </td>
              </tr>
            ) : (
              customers.map((c) => (
                <tr key={c._id} className="border-t">
                  <td className="px-4 py-2">{c.user_id}</td>
                  <td className="px-4 py-2">{c.username}</td>
                  <td className="px-4 py-2">{c.nik}</td>
                  <td className="px-4 py-2">{c.email}</td>
                  <td className="px-4 py-2">{c.phone}</td>
                  <td className="px-4 py-2">{FormatDateTime(c.checkIn)}</td>
                  <td className="px-4 py-2 capitalize ">
                    <p className="mx-2">{c.bill_status}</p>
                  </td>
                  <td className="px-4 py-2">{c.room_key.code}</td> 
                  <td className="px-4 py-2">
                    <select
                      value={c.booking_status}
                      onChange={(e) => handleUpdateStatus(c._id, e.target.value as CustomerClient["booking_status"])}
                      className={`border rounded p-1 ${StatusBooking(c.booking_status).className}`}
                    >
                      <option value="M">Masuk</option>
                      <option value="K">Keluar</option>
                      <option value="P">Pembayaran</option>
                      <option value="AK">Pengajuan Keluar</option>
                    </select>
                  </td>
                  <td className="flex justify-center items-center mt-2 ">
                    <button
                      onClick={() => {
                        setEditData(c);
                        setShowEditModal(true);
                      }}
                      className="px-3 py-1 bg-gray-900 text-white rounded hover:bg-gray-950"
                    >
                      Update
                    </button>
                    <button
                      onClick={() => setDeleteId({ _id: c._id, room_id: c.room_key._id })}
                      className="px-3 py-1 text-red-600 hover:text-red-800"
                    >
                      <Trash2 />
                    </button>

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
