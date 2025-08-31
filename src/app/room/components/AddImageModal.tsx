/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
"use client";
import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Room } from "../models";
import {
  addFacilityGalleryImage,
  deleteFacilityGalleryImage,
  deleteFacilityImage,
  updateFacilityImage,
} from "../services/service_room";

interface PropsAddImage {
  show: boolean;
  onClose: () => void;
  room: Room;
  onUpdated: (data: Room) => void;
}

export default function RoomImageModal({
  room,
  show,
  onClose,
  onUpdated,
}: PropsAddImage) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const mainInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  if (!show) return null;

  

  const handleAddGalleryImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const updated = await addFacilityGalleryImage(room.code, file);
      onUpdated(updated);
    } catch {
      alert("Gagal upload gallery image");
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteImage = async (img: string) => {
    if (!confirm("Hapus gambar ini?")) return;
    try {
      const updated = await deleteFacilityGalleryImage(room.code, img);
      onUpdated(updated);
    } catch {
      alert("Gagal menghapus gambar");
    }
  };

  const handleUpdateFacilityImage = async (
  facilityId: string,
  e: React.ChangeEvent<HTMLInputElement>
) => {
  const file = e.target.files?.[0];
  if (!file) return;
  setUploading(true);
  try {
    const updated = await updateFacilityImage(room.code, facilityId, file);
    onUpdated(updated);
  } catch {
    alert("Gagal upload facility image");
  } finally {
    setUploading(false);
  }
};

const handleDeleteFacilityImage = async (facilityId: string) => {
  if (!confirm("Hapus gambar facility ini?")) return;
  try {
    const updated = await deleteFacilityImage(room.code, facilityId);
    onUpdated(updated);
  } catch {
    alert("Gagal menghapus facility image");
  }
};


  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 font-sans ">
      <motion.div
        initial={{ scale: 0.85, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.85, opacity: 0 }}
        className="bg-white p-6 rounded-2xl shadow-xl w-full max-w-[50rem] relative"
      >
        <h2 className="text-xl font-semibold text-blue-600 mb-4">
          Gambar untuk Kamar {room.code}
        </h2>

        {/* Gallery images */}
        <div className="mb-6">
          <p className="text-xs uppercase font-medium text-gray-500 mb-2">Gallery Images</p>
          <div className="flex flex-wrap gap-3 mb-3">
            <AnimatePresence>
              {room.images?.map((img, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.85 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.5 }}
                  transition={{ duration: 0.2 }}
                  className="relative group"
                >
                  <img
                    src={img}
                    alt="facility"
                    onClick={() => setPreview(img)}
                    className="w-20 h-20 object-cover rounded-lg shadow cursor-pointer hover:opacity-80 transition"
                  />
                  <button
                    onClick={() => handleDeleteImage(img)}
                    className="absolute top-1 right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center opacity-80 group-hover:opacity-100 transition"
                  >
                    ✕
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
          <button
            onClick={() => galleryInputRef.current?.click()}
            className="px-3 py-1.5 text-sm bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
          >
            Tambah Gambar ke Gallery
          </button>
          <input
            ref={galleryInputRef}
            type="file"
            accept="image/*"
            onChange={handleAddGalleryImage}
            className="hidden"
          />
        </div>

        {/* /* images Facility */ }
        <div className="mb-6">
          <p className="text-xs uppercase font-medium text-gray-500 mb-2">Facility Images</p>
          <div className="flex flex-wrap gap-6 mb-3">
            <AnimatePresence>
              {room.facility?.map((fac) => (
                <motion.div
                  key={fac._id as any}
                  initial={{ opacity: 0, scale: 0.85 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.5 }}
                  transition={{ duration: 0.2 }}
                  className="relative group flex flex-col items-center"
                >
                  <img
                    src={fac.image || "/no-image.png"}
                    alt={fac.name}
                    onClick={() => fac.image && setPreview(fac.image)}
                    className="w-20 h-20 object-cover rounded-lg shadow cursor-pointer hover:opacity-80 transition"
                  />

                  <span className="text-xs mt-1 text-gray-600">{fac.name}</span>

                  {fac.image && (
                    <button
                      onClick={() => handleDeleteFacilityImage(fac._id)}
                      className="absolute top-1 right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center opacity-80 group-hover:opacity-100 transition"
                    >
                      ✕
                    </button>
                  )}

                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    id={`file-${fac._id}`}
                    onChange={(e) => handleUpdateFacilityImage(fac._id, e)}
                  />
                  <label
                    htmlFor={`file-${fac._id}`}
                    className="mt-2 px-2 py-1 text-xs bg-green-500 text-white rounded cursor-pointer hover:bg-green-600 transition"
                  >
                    {fac.image ? "Ganti" : "Tambah"}
                  </label>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>


        {uploading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-2 text-blue-500 text-sm mb-3"
          >
            <svg
              className="animate-spin h-5 w-5"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
              ></path>
            </svg>
            Uploading...
          </motion.div>
        )}

        <div className="flex justify-end mt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
          >
            Tutup
          </button>
        </div>
      </motion.div>

      {/* Fullscreen preview */}
      <AnimatePresence>
        {preview && (
          <motion.div
            key="preview"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
            onClick={() => setPreview(null)}
          >
            <motion.img
              src={preview}
              alt="preview"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              className="max-w-3xl max-h-[90vh] rounded-lg shadow-xl cursor-pointer"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
