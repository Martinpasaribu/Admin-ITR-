"use client";

import { useToast } from "@/components/ToastContect";
import { Plus } from "lucide-react";
import React, { useState } from "react";
import { Facility } from "../models";


interface AddRoomFormProps {
  onAdd: (code: string, price: number, facility: Facility[]) => Promise<void>;
  loading?: boolean;
}

const defaultFacilities = [
  { code: "AC", name: "Air Conditioner" },
  { code: "TV", name: "Televisi" },
  { code: "WIFI", name: "WiFi" },
  { code: "FR", name: "Kulkas" },
  { code: "HT", name: "Hair Dryer" },
];

export default function AddRoomForm({ onAdd, loading }: AddRoomFormProps) {
  const [kode, setKode] = useState("");
  const [harga, setHarga] = useState<number | "">("");

  // Pilihan fasilitas (ambil dari defaultFacilities)
  const [selectedFacilityCode, setSelectedFacilityCode] = useState(defaultFacilities[0].code);
  const [facilityStatus, setFacilityStatus] = useState<Facility["status"]>("B");
  const [facilities, setFacilities] = useState<Facility[]>([]);

  const { showToast } = useToast();

  const handleAddFacility = () => {
    // Cek apakah sudah ada facility dengan code yang sama
    if (facilities.some((f) => f.code === selectedFacilityCode)) {
      showToast("warning", "Fasilitas sudah ada di daftar");
      return;
    }

    const facilityInfo = defaultFacilities.find((f) => f.code === selectedFacilityCode);
    if (!facilityInfo) {
      showToast("error", "Fasilitas tidak ditemukan");
      return;
    }

    setFacilities((prev) => [
      ...prev,
      {
        code: facilityInfo.code,
        name: facilityInfo.name,
        status: facilityStatus,
      },
    ]);
  };

  const handleRemoveFacility = (index: number) => {
    setFacilities((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!kode.trim() || !harga) {
      showToast("warning", "Kode dan harga harus diisi");
      return;
    }

    if (!/^([KH])\d{1,2}$/i.test(kode.trim())) {
      showToast(
        "warning",
        "Kode harus diawali K atau H dan diikuti angka, contoh: K01, H12"
      );
      return;
    }

    await onAdd(kode.toUpperCase().trim(), Number(harga), facilities);

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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            type="text"
            placeholder="Kode room (Kxx atau Hxx)"
            maxLength={3}
            value={kode}
            onChange={(e) => setKode(e.target.value.toUpperCase())}
            className="border rounded px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            disabled={loading}
          />

          <input
            type="number"
            placeholder="Harga (Rp)"
            value={harga}
            onChange={(e) =>
              setHarga(e.target.value === "" ? "" : Number(e.target.value))
            }
            className="border rounded px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            disabled={loading}
          />

          <button
            type="submit"
            className="flex justify-center items-center gap-2 bg-gray-800 text-white rounded px-6 py-2 hover:bg-gray-950 transition disabled:opacity-50"
            disabled={loading}
          >
             <Plus />Tambah
          </button>
        </div>

        {/* Facility input */}
        <div>
          <h4 className="font-semibold mb-2 text-gray-700 ">Tambah Facility</h4>
          <div className="flex flex-wrap gap-2 items-center">
            <select
              value={selectedFacilityCode}
              onChange={(e) => setSelectedFacilityCode(e.target.value)}
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
                setFacilityStatus(e.target.value as Facility["status"])
              }
              className="border rounded px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              disabled={loading}
            >
              <option value="B">Baik</option>
              <option value="P">Perlu Perbaikan</option>
              <option value="R">Rusak</option>
              <option value="T">Tidak sedang digunakan</option>
            </select>

            <button
              type="button"
              onClick={handleAddFacility}
              className="bg-gray-800 border-[1px] text-white rounded px-4 py-2 hover:bg-gray-950 transition"
              disabled={loading}
            >
              Tambah Facility
            </button>
          </div>
        </div>

        {/* List Facility */}
        {facilities.length > 0 && (
          <div>
            <h4 className="font-semibold text-gray-700 mb-2">Facility</h4>
            <ul className="space-y-2 max-h-48 overflow-y-auto">
              {facilities.map((f, i) => (
                <li
                  key={i}
                  className="flex justify-between items-center border-[1px] border-gray-400 text-indigo-500 rounded px-4 py-2"
                >
                  <span>
                    {f.name} ({f.code}) -{" "}
                    <span
                      className={
                        f.status === "B"
                          ? "text-green-600"
                          : f.status === "P"
                          ? "text-yellow-600"
                          : "text-red-600"
                      }
                    >
                      {f.status}
                    </span>
                  </span>
                  <button
                    type="button"
                    onClick={() => handleRemoveFacility(i)}
                    className="text-gray-600 hover:text-red-800"
                    title="Hapus facility"
                    disabled={loading}
                  >
                    &times;
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </form>
    </section>
  );
}
