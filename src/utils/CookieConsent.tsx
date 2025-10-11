"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [preferences, setPreferences] = useState({
    essential: true,
    analytics: false,
    marketing: false,
  });

  useEffect(() => {
    const consent = localStorage.getItem("cookie-consent");
    if (!consent) {
      setVisible(true);
    } else {
      const parsed = JSON.parse(consent);
      setPreferences(parsed);
    }
  }, []);

  const handleAcceptAll = () => {
    const newPrefs = { essential: true, analytics: true, marketing: true };
    localStorage.setItem("cookie-consent", JSON.stringify(newPrefs));
    setPreferences(newPrefs);
    aktifkanCookie(newPrefs);
    setVisible(false);
  };

  const handleSaveSettings = () => {
    localStorage.setItem("cookie-consent", JSON.stringify(preferences));
    aktifkanCookie(preferences);
    setVisible(false);
    setShowSettings(false);
  };

  const aktifkanCookie = (prefs: typeof preferences) => {
    console.log("⚙️ Preferensi cookie diterapkan:", prefs);
    if (prefs.analytics) console.log("📊 Cookie analitik aktif ✅");
    if (prefs.marketing) console.log("🎯 Cookie marketing aktif ✅");
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="cookie-banner"
          initial={{ opacity: 0, x: -80, y: 30 }}
          animate={{ opacity: 1, x: 0, y: 0 }}
          exit={{ opacity: 0, x: -80, y: 30 }}
          transition={{ type: "spring", stiffness: 70, damping: 15 }}
          className="fixed bottom-6 left-6 z-[9999] w-[90%] md:w-[400px] bg-white border border-gray-200 shadow-2xl rounded-2xl p-6"
        >
          {!showSettings ? (
            <>
              <h2 className="text-lg font-semibold text-gray-800 mb-2">
                🍪 Pengaturan Privasi Cookie
              </h2>
              <p className="text-sm text-gray-600 mb-3 leading-relaxed">
                Kami menggunakan cookie untuk meningkatkan pengalaman pengguna,
                menganalisis lalu lintas situs, dan mendukung kegiatan pemasaran.
                Anda dapat menerima semua cookie atau mengatur preferensi Anda.
              </p>

              <p className="text-xs text-gray-500 mb-4">
                Baca{" "}
                <a
                  href="/kebijakan-cookie"
                  className="underline font-medium hover:text-blue-600 transition"
                >
                  Kebijakan Cookie
                </a>{" "}
                untuk detail lebih lanjut.
              </p>

              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => setShowSettings(true)}
                  className="px-4 py-2 text-sm border border-gray-300 text-gray-500 rounded-md hover:bg-gray-50 transition"
                >
                  Pengaturan Cookie
                </button>
                <button
                  onClick={handleAcceptAll}
                  className="px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 shadow-md transition"
                >
                  Terima Semua
                </button>
              </div>
            </>
          ) : (
            <>
              <h2 className="text-lg font-semibold text-gray-800 mb-4">
                ⚙️ Kelola Preferensi Cookie
              </h2>

              <div className="space-y-4">
                {/* === COOKIE ESSENSIAL === */}
                <div className="border border-gray-100 rounded-md p-3 bg-gray-50">
                  <label className="flex items-center gap-2 text-sm text-gray-800 font-medium">
                    <input type="checkbox" checked disabled />
                    🍪 Cookie Esensial (Wajib)
                  </label>
                  <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                    Cookie ini diperlukan agar website dapat berfungsi dengan
                    baik, seperti menjaga sesi login, pengaturan keamanan, dan
                    preferensi utama Anda.
                  </p>
                </div>

                {/* === COOKIE ANALITIK === */}
                <div className="border border-gray-100 rounded-md p-3 bg-gray-50">
                  <label className="flex items-center gap-2 text-sm text-gray-800 font-medium">
                    <input
                      type="checkbox"
                      checked={preferences.analytics}
                      onChange={(e) =>
                        setPreferences({
                          ...preferences,
                          analytics: e.target.checked,
                        })
                      }
                    />
                    📊 Cookie Analitik
                  </label>
                  <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                    Cookie ini membantu kami memahami bagaimana pengguna
                    berinteraksi dengan situs, seperti halaman yang paling sering
                    dikunjungi, sehingga kami dapat meningkatkan pengalaman Anda.
                  </p>
                </div>

                {/* === COOKIE MARKETING === */}
                <div className="border border-gray-100 rounded-md p-3 bg-gray-50">
                  <label className="flex items-center gap-2 text-sm text-gray-800 font-medium">
                    <input
                      type="checkbox"
                      checked={preferences.marketing}
                      onChange={(e) =>
                        setPreferences({
                          ...preferences,
                          marketing: e.target.checked,
                        })
                      }
                    />
                    🎯 Cookie Marketing
                  </label>
                  <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                    Cookie ini digunakan untuk menampilkan iklan yang relevan
                    berdasarkan minat Anda dan mengukur efektivitas kampanye
                    pemasaran kami di berbagai platform.
                  </p>
                </div>
              </div>

              <div className="flex gap-3 justify-end mt-5">
                <button
                  onClick={() => setShowSettings(false)}
                  className="px-4 py-2 text-sm border border-gray-300 text-gray-500 rounded-md hover:bg-gray-50 transition"
                >
                  Kembali
                </button>
                <button
                  onClick={handleSaveSettings}
                  className="px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 shadow-md transition"
                >
                  Simpan Pengaturan
                </button>
              </div>
            </>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
