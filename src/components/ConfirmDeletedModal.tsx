"use client";

import { DeleteIcon, FolderX } from "lucide-react";
import React from "react";

interface ConfirmDeleteModalProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  message?: string;
}

export default function ConfirmDeleteModal({
  isOpen,
  onConfirm,
  onCancel,
  message = "Apakah Anda yakin ingin menghapus data ini?",
}: ConfirmDeleteModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl shadow-xl p-6 max-w-sm w-full text-center transform transition-transform duration-300 scale-95 animate-scale-up">
        <div className="flex flex-col items-center">
          <div className="bg-red-100 p-4 rounded-full mb-4">
            <FolderX className="text-red-600 w-6 h-6" />
          </div>
          <p className="text-gray-700 text-center mb-6">{message}</p>
          <div className="flex gap-4 w-full justify-center">
            <button
              onClick={onCancel}
              className="flex-1 px-4 py-2 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300 transition"
            >
              Batal
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition"
            >
              Hapus
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
