/* eslint-disable @next/next/no-img-element */
"use client";
import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Facility } from "../models";
import {
  addFacilityImage,
  addFacilityGalleryImage,
  deleteFacilityGalleryImage,
  addFacilityImageIRepair,
} from "../services/service_facility";

interface PropsAddImage {
  show: boolean;
  onClose: () => void;
  facility: Facility;
  onUpdated: (data: Facility) => void;
}

export default function FacilityImageModal({
  facility,
  show,
  onClose,
  onUpdated,
}: PropsAddImage) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const mainInputRef = useRef<HTMLInputElement>(null);
  const imageIRepairInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  if (!show) return null;

  const handleMainImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const updated = await addFacilityImage(facility.code, file);
      onUpdated(updated);
    } catch {
      alert("Gagal upload main image");
    } finally {
      setUploading(false);
    }
  };

  const handleMainImageIRepairChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const updated = await addFacilityImageIRepair(facility.code, file);
      onUpdated(updated);
    } catch {
      alert("Gagal upload main image");
    } finally {
      setUploading(false);
    }
  };

  const handleAddGalleryImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const updated = await addFacilityGalleryImage(facility.code, file);
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
      const updated = await deleteFacilityGalleryImage(facility.code, img);
      onUpdated(updated);
    } catch {
      alert("Gagal menghapus gambar");
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
          Gambar untuk {facility.name}
        </h2>

        <div className="w-full flex justify-between items-center">
          
          {/* Main image */}
          <div className="mb-6 w-1/2">
            <p className="text-xs uppercase font-medium text-gray-500 mb-2">Main Image</p>
            {facility.image ? (
              <img
                src={facility.image}
                alt="main"
                onClick={() => setPreview(facility.image!)}
                className="w-32 h-32 object-cover rounded-lg shadow cursor-pointer hover:opacity-80 transition"
              />
            ) : (
              <p className="text-sm text-gray-400">Belum ada main image</p>
            )}
            <button
              onClick={() => mainInputRef.current?.click()}
              className="mt-3 px-3 py-1.5 text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
            >
              {facility.image ? "Ganti Main Image" : "Tambah Main Image"}
            </button>
            <input
              ref={mainInputRef}
              type="file"
              accept="image/*"
              onChange={handleMainImageChange}
              className="hidden"
            />
          </div>

          {/* Page Invoice Repair*/}
          <div className="mb-6 w-1/2">
            <p className="text-xs uppercase font-medium text-gray-500 mb-2">Invoice Perbaikan</p>
            {facility.image_IRepair ? (
              <img
                src={facility.image_IRepair}
                alt="main"
                onClick={() => setPreview(facility.image_IRepair!)}
                className="w-32 h-32 object-cover rounded-lg shadow cursor-pointer hover:opacity-80 transition"
              />
            ) : (
              <p className="text-sm text-gray-400">Belum ada image invoice repair</p>
            )}
            <button
              onClick={() => imageIRepairInputRef.current?.click()}
              className="mt-3 px-3 py-1.5 text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
            >
              {facility.image_IRepair ? "Ganti Image Invoice Repair" : "Tambah Image"}
            </button>
            <input
              ref={imageIRepairInputRef}
              type="file"
              accept="image/*"
              onChange={handleMainImageIRepairChange}
              className="hidden"
            />
          </div>
        </div>

        {/* Gallery images */}
        <div className="mb-6">
          <p className="text-xs uppercase font-medium text-gray-500 mb-2">Gallery Images</p>
          <div className="flex flex-wrap gap-3 mb-3">
            <AnimatePresence>
              {facility.images?.map((img, i) => (
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
