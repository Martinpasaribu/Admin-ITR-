/* eslint-disable @typescript-eslint/no-explicit-any */
// app/dashboard/page.tsx
"use client";

import { useCallback, useEffect, useState } from "react";
import { User, Settings, LogOut, FileText, BarChart3, Users, DollarSign, BedSingle, Package, Link } from "lucide-react";
import { getDashboardInfo } from "./services/service_dashboard";
import { Dashboard } from "./models";
import { authService } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ToastContect";

export default function DashboardPage() {
  const [userName] = useState("Admin");
const [dashboard, setDashboard] = useState<Dashboard | null>(null);

    
  const [totalReports] = useState(3); // Dummy jumlah laporan
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<any>();

  const { showToast } = useToast();
  const router = useRouter();

  const fetchData = useCallback(async () => {
      
      setLoading(true);

      try {
        
        const isValid = await authService.checkSession();

        if (!isValid) {
          router.push("/login?session=expired");
          return;
        }
  
        const profile = await authService.fetchProfile();
        if (profile?.username) {
          setUser(profile);
        }

        const res = await getDashboardInfo()

        if (res) {
          setDashboard(res);
         }

      } catch (error) {
        showToast("error", `Gagal mengambil data: ${error}`);
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    }, [router, showToast]);

    useEffect(() => {
      fetchData();
    }, [fetchData]);
    



    const handleLogout = async () => {
      try {
        await authService.logout();
        router.push("/login"); // Redirect ke halaman login setelah berhasil logout
      } catch (error) {
        console.error("Logout gagal:", error);
      }
    };
    
  return (
    <main className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <header className="flex justify-between items-center bg-white shadow-sm rounded-xl px-6 py-4 mb-8">
        <h1 className="text-xl font-bold text-gray-900">Dashboard</h1>
        <div className="flex items-center gap-3">
          <Link href="/settings">
            <button className="p-2 hover:bg-gray-100 rounded-full transition">
              <Settings size={20} className="text-gray-700" />
            </button>
          </Link>
          <button className="p-2 hover:bg-gray-100 rounded-full transition">
            <LogOut onClick={handleLogout} size={20} className="text-gray-700" />
          </button>
        </div>
      </header>

      {/* Greeting */}
      <section className="bg-gradient-to-br from-indigo-700 to-indigo-800 text-white rounded-xl shadow p-6 mb-8">
        <div className="flex items-center gap-4">
          <div className="bg-white text-indigo-600 p-3 rounded-full shadow-inner">
            <User size={28} />
          </div>
          <div>
            <h2 className="text-lg font-semibold">Halo, {user?.username} </h2>
            <p className="text-sm opacity-90">
              Senang melihat Anda kembali. Semoga harimu menyenangkan!
            </p>
          </div>
        </div>
      </section>

      {/* Ringkasan */}
      <section>
        <h3 className="text-lg font-semibold mb-4 text-gray-900">Ringkasan</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Total Pengguna */}
          <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-indigo-100 text-indigo-600 rounded-lg">
                <Users size={20} />
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500">Total Pengguna</h4>
                <p className="text-2xl font-bold text-gray-900 mt-1">{ dashboard?.amountUser }</p>
              </div>
            </div>
               
            <button
              onClick={() => (window.location.href = "/customer")}
              className="mt-4 inline-flex items-center px-3 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition"
            >
              <FileText size={16} className="mr-2" /> Lihat Semua
            </button>
          </div>

          {/* Laporan Masuk */}
          <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition ">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-red-100 text-red-600 rounded-lg">
                <FileText size={20} />
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500">Laporan Masuk</h4>
                <p className="text-2xl font-bold text-gray-900 mt-1">{dashboard?.amountReport}</p>
              </div>
            </div>
            <button
              onClick={() => (window.location.href = "/reports")}
              className="mt-4 inline-flex items-center px-3 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition"
            >
              <FileText size={16} className="mr-2" /> Lihat Semua
            </button>
          </div>

          {/* Laporan Masuk */}
          <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition ">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-yellow-100 text-yellow-600 rounded-lg">
                <BedSingle size={20} />
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500">Room Tersedia</h4>
                <p className="text-2xl font-bold text-gray-900 mt-1">{dashboard?.amountRoom}</p>
              </div>
            </div>
            <button
              onClick={() => (window.location.href = "/room")}
              className="mt-4 inline-flex items-center px-3 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition"
            >
              <FileText size={16} className="mr-2" /> Lihat Semua
            </button>
          </div>

          {/* Laporan Masuk */}
          <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition ">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gray-100 text-gray-600 rounded-lg">
                <Package size={20} />
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500">Fasilitas Tersedia</h4>
                <p className="text-2xl font-bold text-gray-900 mt-1">{dashboard?.amountFacility}</p>
              </div>
            </div>
            <button
              onClick={() => (window.location.href = "/facility")}
              className="mt-4 inline-flex items-center px-3 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition"
            >
              <FileText size={16} className="mr-2" /> Lihat Semua
            </button>
          </div>

          {/* Pesanan Hari Ini */}
          <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-green-100 text-green-600 rounded-lg">
                <BarChart3 size={20} />
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500">Booking Masuk</h4>
                <p className="text-2xl font-bold text-gray-900 mt-1">{dashboard?.amountBooking}</p>
              </div>
            </div>
            <button
              onClick={() => (window.location.href = "/booking")}
              className="mt-4 inline-flex items-center px-3 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition"
            >
              <FileText size={16} className="mr-2" /> Lihat Semua
            </button>
          </div>

          {/* Pendapatan */}
          {/* <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-yellow-100 text-yellow-600 rounded-lg">
                <DollarSign size={20} />
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500">Pendapatan</h4>
                <p className="text-2xl font-bold text-gray-900 mt-1">Rp 12.340.000</p>
              </div>
            </div>
          </div> */}
        </div>
      </section>
    </main>
  );
}
