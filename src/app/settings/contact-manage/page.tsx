/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState, useCallback } from "react";
import http from "@/utils/http";
import { useToast } from "@/components/ToastContect";
import { FormatDateTime } from "@/utils/Format/date";
import LoadingSpinner from "@/components/Loading";
import { useRouter } from "next/navigation";
import { authService } from "@/lib/auth";

interface ContactMessage {
  _id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  status: "UR" | "R";
  createdAt: string;
}


export default function MessagesPage() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  const router = useRouter();

    const fetchMe = useCallback(async () => {
        
        setLoading(true);
  
        try {
          
          const isValid = await authService.checkSession();
  
          const profile = await authService.fetchProfile();

          if (profile?.role !== 'SA') {
            // router.push("/login?session=expired");
            router.push("/settings");
            return;
          }

          if (!isValid ) {
            router.push("/settings");
            return;
          }
  
        } catch (error) {
          showToast("error", `Gagal mengambil data: ${error}`);
          console.error("Error fetching data:", error);
        } finally {
          setLoading(false);
        }
      }, [router, showToast]);
    
  
  useEffect(() => {
      fetchMe();
    }, [fetchMe]);

  const fetchMessages = useCallback(async () => {
    setLoading(true);
    try {
      const res = await http.get("/contact");
      setMessages(res.data.data || []);
    } catch (error: any) {
      showToast("error", `Gagal mengambil pesan: ${error.message || error}`);
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  const markAsRead = async (id: string) => {
    try {
      await http.patch(`/contact/${id}/read`);
      setMessages((prev) =>
        prev.map((msg) => (msg._id === id ? { ...msg, status: "R" } : msg))
      );
      showToast("success", "Pesan ditandai sudah dibaca");
    } catch (error: any) {
      showToast("error", `Gagal update pesan: ${error.message || error}`);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  return (
    <div className="min-h-screen p-10 bg-gray-50">
      <h1 className="text-3xl font-extrabold mb-8 text-gray-900">Pesan Masuk</h1>

      {loading ? (
        <LoadingSpinner />
      ) : messages.length === 0 ? (
        <p className="text-gray-500 text-lg">Belum ada pesan masuk.</p>
      ) : (
        <div className="overflow-x-auto shadow-lg rounded-xl">
          <table className="w-full table-auto border-collapse bg-white rounded-xl">
            <thead className="bg-gray-100">
              <tr>
                {["Nama", "Email", "Phone", "Pesan", "Status", "Tanggal", "Aksi"].map((col) => (
                  <th key={col} className="p-4 text-left text-gray-700 font-medium text-sm">
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {messages.map((msg) => (
                <tr
                  key={msg._id}
                  className={`transition hover:bg-gray-50 ${
                    msg.status === "UR" ? "bg-green-50" : ""
                  }`}
                >
                  <td className="p-4 text-gray-800">{msg.name}</td>
                  <td className="p-4 text-gray-600">{msg.email}</td>
                  <td className="p-4 text-gray-600">{msg.phone}</td>
                  <td className="p-4 text-gray-700">{msg.message}</td>
                  <td className="p-4">
                    {msg.status === "UR" ? (
                      <span className="inline-block px-3 py-1 rounded-full bg-red-100 text-red-700 text-xs font-semibold">
                        Belum Dibaca
                      </span>
                    ) : (
                      <span className="inline-block px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-semibold">
                        Dibaca
                      </span>
                    )}
                  </td>
                  <td className="p-4 text-gray-500 text-sm">{FormatDateTime(msg.createdAt)}</td>
                  <td className="p-4">
                    {msg.status === "UR" && (
                      <button
                        onClick={() => markAsRead(msg._id)}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition text-sm"
                      >
                        Tandai Dibaca
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
