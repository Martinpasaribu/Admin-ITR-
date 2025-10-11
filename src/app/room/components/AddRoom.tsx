"use client";

import { useToast } from "@/components/ToastContect";
import { Plus } from "lucide-react";
import React, { useState } from "react";
import { Facility } from "../models";

interface AddRoomFormProps {
  onAdd: (name: string, code: string, price: number, facility: Facility[]) => Promise<void>;
  loading?: boolean;
}

const defaultFacilities = [

  { code: "AC", name: "Air Conditioner" },
  { code: "TV", name: "Televisi" },
  { code: "WIFI", name: "WiFi" },
  { code: "FR", name: "Lemari Pakai" },
  { code: "HT", name: "Kipas Angin" },
  { code: "TH", name: "Meja dan Kursi" },
  { code: "HR", name: "Wastafel" },
  { code: "YR", name: "Kamar Mandi Dalam (WC Duduk)" },
  { code: "YP", name: "Kamar Mandi Dalam (WC Jongkok)" }
  
];

export default function AddRoomForm({ onAdd, loading }: AddRoomFormProps) {
  const [name, setName] = useState("");
  const [kode, setKode] = useState("");
  const [harga, setHarga] = useState<number | "">("");
  const [selectedFacilityCode, setSelectedFacilityCode] = useState(defaultFacilities[0].code);
  const [facilityStatus, setFacilityStatus] = useState<Facility["status"]>("B");
  const [facilities, setFacilities] = useState<Facility[]>([]);

  const { showToast } = useToast();

  const handleAddFacility = () => {
    const facilityCode = selectedFacilityCode.toUpperCase();
    const status = facilityStatus.toUpperCase() as Facility["status"];

    if (facilities.some((f) => f.code === facilityCode)) {
      showToast("warning", "Fasilitas sudah ada di daftar");
      return;
    }

    const facilityInfo = defaultFacilities.find((f) => f.code === facilityCode);
    if (!facilityInfo) {
      showToast("error", "Fasilitas tidak ditemukan");
      return;
    }

    setFacilities((prev) => [
      ...prev,
      { code: facilityInfo.code.toUpperCase(), name: facilityInfo.name, status },
    ]);
  };

  const handleRemoveFacility = (index: number) => {
    setFacilities((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !kode.trim() || !harga) {
      showToast("warning", "Nama, kode, dan harga harus diisi");
      return;
    }

    const formattedFacilities = facilities.map((f) => ({
      code: f.code.toUpperCase(),
      name: f.name,
      status: f.status.toUpperCase() as Facility["status"],
    }));

    await onAdd(name.trim(), kode.toUpperCase().trim(), Number(harga), formattedFacilities);

    setName("");
    setKode("");
    setHarga("");
    setFacilities([]);
  };

  return (
    <section className="bg-white rounded-xl shadow p-6 mb-8">
      <h3 className="text-lg font-semibold mb-4 text-gray-700 flex items-center gap-2">
        Tambah Room Baru
      </h3>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Input Room Info */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <input
            type="text"
            placeholder="Nama Kamar"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border rounded px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            disabled={loading}
          />

          <input
            type="text"
            placeholder="Kode Kamar (Kxx / Hxx)"
            maxLength={4}
            value={kode}
            onChange={(e) => setKode(e.target.value.toUpperCase())}
            className="border rounded px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            disabled={loading}
          />

          <input
            type="number"
            placeholder="Harga (Rp)"
            value={harga}
            onChange={(e) => setHarga(e.target.value === "" ? "" : Number(e.target.value))}
            className="border rounded px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            disabled={loading}
          />

          <button
            type="submit"
            className="flex justify-center items-center gap-2 bg-indigo-600 text-white rounded px-6 py-2 hover:bg-indigo-700 transition disabled:opacity-50"
            disabled={loading}
          >
            <Plus /> Tambah
          </button>
        </div>

        {/* Facility Input */}
        <div className="space-y-2">
          <h4 className="font-semibold text-gray-700">Fasilitas</h4>
          <div className="flex flex-wrap gap-2 items-center">
            <select
              value={selectedFacilityCode}
              onChange={(e) => setSelectedFacilityCode(e.target.value.toUpperCase())}
              className="border rounded px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              disabled={loading}
            >
              {defaultFacilities.map((f) => (
                <option key={f.code} value={f.code}>
                  {f.name} ({f.code})
                </option>
              ))}
            </select>

            <select
              value={facilityStatus}
              onChange={(e) =>
                setFacilityStatus(e.target.value.toUpperCase() as Facility["status"])
              }
              className="border rounded px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              disabled={loading}
            >
              <option value="B">BAIK</option>
              <option value="P">PERLU PERBAIKAN</option>
              <option value="R">RUSAK</option>
              <option value="T">TIDAK DIGUNAKAN</option>
            </select>

            <button
              type="button"
              onClick={handleAddFacility}
              className="bg-indigo-600 text-white rounded px-4 py-2 hover:bg-indigo-700 transition disabled:opacity-50"
              disabled={loading}
            >
              Tambah
            </button>
          </div>

          {/* Facility List */}
          {facilities.length > 0 && (
            <ul className="mt-2 space-y-2 max-h-48 overflow-y-auto border border-gray-200 rounded p-2">
              {facilities.map((f, i) => (
                <li
                  key={i}
                  className="flex justify-between items-center bg-gray-50 border border-gray-300 rounded px-3 py-1"
                >
                  <span className="text-gray-700 font-medium">
                    {f.name} ({f.code}) -{" "}
                    <span
                      className={
                        f.status === "B"
                          ? "text-green-600"
                          : f.status === "P"
                          ? "text-yellow-600"
                          : f.status === "R"
                          ? "text-red-600"
                          : "text-gray-500"
                      }
                    >
                      {f.status}
                    </span>
                  </span>
                  <button
                    type="button"
                    onClick={() => handleRemoveFacility(i)}
                    className="text-red-600 hover:text-red-800 font-bold"
                    disabled={loading}
                  >
                    &times;
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </form>
    </section>
  );
}
