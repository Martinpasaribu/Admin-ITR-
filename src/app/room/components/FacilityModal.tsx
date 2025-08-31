import React, { useState } from "react";
import { Facility } from "@/app/room/models";

const defaultFacilities = [
  { code: "AC", name: "Air Conditioner" },
  { code: "TV", name: "Televisi" },
  { code: "WIFI", name: "WiFi" },
  { code: "FR", name: "Kulkas" },
  { code: "HT", name: "Hair Dryer" },
];

interface ModalFacilityProps {
  isOpen: boolean;
  facilities: Facility[];
  onClose: () => void;
  onUpdate: (code: string, status: Facility["status"]) => void;
  onAdd: (facility: { code: string; name: string; status: Facility["status"] }) => void;
}

export default function ModalFacility({
  isOpen,
  facilities,
  onClose,
  onUpdate,
  onAdd,
}: ModalFacilityProps) {
  const [newCode, setNewCode] = useState("");
  const [newStatus, setNewStatus] = useState<Facility["status"]>("B");

  if (!isOpen) return null;

  const handleStatusChange = (code: string, value: string) => {
    onUpdate(code, value as Facility["status"]);
  };

  const handleAddFacility = () => {
    const selected = defaultFacilities.find((f) => f.code === newCode);
    if (!selected) return;
    onAdd({ code: selected.code, name: selected.name, status: newStatus });
    setNewCode("");
    setNewStatus("B");
  };    

  const getStatusColor = (status: Facility["status"]) => {
    switch (status) {
      case "B":
        return "bg-green-100 text-green-800 border-green-300";
      case "P":
        return "bg-yellow-100 text-yellow-800 border-yellow-300";
      case "R":
        return "bg-red-100 text-red-800 border-red-300";
      case "T":
        return "bg-slate-100 text-slate-800 border-slate-300";
      default:
        return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 bg-opacity-50 flex justify-center items-center">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6">
        <h2 className="text-lg text-gray-800 font-bold mb-4">Facility</h2>

        {/* List facility */}
        <ul className="divide-y">
          {facilities.length === 0 ? (
            <p className="text-gray-700">Tidak ada facility</p>
          ) : (
            facilities.map((f) => (
              <li
                key={f._id}
                className="flex justify-between items-center py-2"
              >
                <span className="font-medium text-gray-700">{f.name}</span>
                <select
                  value={f.status}
                  onChange={(e) => handleStatusChange(f.code, e.target.value)}
                  className={`rounded px-2 py-1 text-sm border ${getStatusColor(
                    f.status
                  )}`}
                >
                  <option value="B">Baik</option>
                  <option value="P">Sedang Perbaikan</option>
                  <option value="R">Rusak</option>
                  <option value="T">Tidak sedang digunakan</option>
                </select>
              </li>
            ))
          )}
        </ul>

        {/* Form tambah facility */}
        <div className="mt-4 border-t pt-4">
          <h3 className="hidden text-sm font-semibold text-black mb-2">Tambah Facility</h3>
          <div className="flex flex-col gap-2">
            <select
              value={newCode}
              onChange={(e) => setNewCode(e.target.value)}
              className="border rounded px-2 py-1 text-sm text-gray-600"
            >
              <option value="">Pilih Facility</option>
              {defaultFacilities.map((f) => (
                <option key={f.code} value={f.code}>
                  {f.name}
                </option>
              ))}
            </select>

            <select
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value as Facility["status"])}
              className={`rounded px-2 py-1 text-sm border ${getStatusColor(
                newStatus
              )}`}
            >
              <option value="B">Baik</option>
              <option value="P">Sedang Perbaikan</option>
              <option value="R">Rusak</option>
              <option value="T">Tidak sedang digunakan</option>
            </select>

            <button
              className="bg-gray-800 hover:bg-gray-900 text-white rounded px-3 py-1 text-sm"
              onClick={handleAddFacility}
              disabled={!newCode}
            >
              Tambah Facility
            </button>
          </div>
        </div>

        <div className="mt-4 flex justify-end gap-2">
          <button
            className="px-4 py-2 border-[1px] text-gray-800 border-gray-800 rounded-lg "
            onClick={onClose}
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
}
