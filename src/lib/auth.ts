// lib/auth.ts
import { baseURL } from "@/utils/Uri";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

interface DecodedToken {
  exp: number;
  role?: string;
  username?: string;
  userId?: string;
}

interface UserProfile {
  user_id: string | null;
  username: string;
  role: string;
  email?: string;
  avatar?: string;
}

const api = axios.create({
  baseURL: baseURL,
  withCredentials: true,
});

let accessToken: string | null = null;
let user: UserProfile | null = null;

// ====== Tambah Interceptor ======
api.interceptors.response.use(
  (res) => res,
  async (error) => {
    if (error.response?.status === 401) {
      // coba refresh token
      try {
        const { data } = await axios.get(`${baseURL}auth/token`, {
          withCredentials: true,
        });
        accessToken = data.accessToken;

        // ulang request dengan token baru
        error.config.headers["Authorization"] = `Bearer ${accessToken}`;
        return api.request(error.config);
      } catch (err) {
        accessToken = null;
        user = null;
        window.location.href = "/login?session=expired";
      }
    }
    return Promise.reject(error);
  }
);

export const authService = {
  getToken: () => accessToken,
  getUser: () => user,

  async fetchProfile() {
    if (!accessToken) return null;
    const res = await api.get("/auth/me", {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    user = res.data.data;
    return user;
  },

  async login(user_id: string, password: string, recaptchaToken: string) {
    const res = await api.post("/auth/login", {
      user_id,
      password,
      recaptchaToken,
    });
    accessToken = res.data.data.accessToken;
    return this.fetchProfile();
  },

  async checkSession(): Promise<boolean> {
    try {
      // coba refresh token di awal
      const res = await api.get("/auth/token");
      const newAccessToken = res.data.accessToken;

      if (!newAccessToken) return false;
      accessToken = newAccessToken;

      const decoded = jwtDecode<DecodedToken>(newAccessToken);
      if (decoded.exp * 1000 <= Date.now()) return false;

      await this.fetchProfile();
      return !!user;
    } catch {
      return false;
    }
  },

  async logout() {
    try {
      await api.delete("/auth/logout");
    } finally {
      accessToken = null;
      user = null;
    }
  },
};
