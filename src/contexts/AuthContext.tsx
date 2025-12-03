import React, { createContext, useContext, useState, ReactNode } from 'react';

// Tipe data untuk user
export interface User {
  username: string;
  role: 'user' | 'admin';
  fullName: string;
}

// Tipe data untuk laporan
export interface Report {
  id: number;
  title: string;
  content: string;
  author: string;
  authorFullName: string;
  createdAt: Date;
  status: 'pending' | 'reviewed';
}

// Kredensial yang sudah di-hardcode
const CREDENTIALS = {
  users: [
    { username: 'user1', password: 'user123', fullName: 'M Dantha Arianvasya', role: 'user' as const },
    { username: 'user2', password: 'user123', fullName: 'Fardho', role: 'user' as const },
  ],
  admins: [
    { username: 'admin', password: 'admin123', fullName: 'Admin Kampus', role: 'admin' as const },
  ],
};

interface AuthContextType {
  user: User | null;
  reports: Report[];
  login: (username: string, password: string) => { success: boolean; message: string };
  logout: () => void;
  addReport: (title: string, content: string) => void;
  updateReportStatus: (id: number, status: 'pending' | 'reviewed') => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Helper untuk load reports dari localStorage
const loadReportsFromStorage = (): Report[] => {
  const stored = localStorage.getItem('suara-mahasiswa-reports');
  if (stored) {
    const parsed = JSON.parse(stored);
    return parsed.map((r: Report & { createdAt: string }) => ({
      ...r,
      createdAt: new Date(r.createdAt),
    }));
  }
  // Default reports jika belum ada di localStorage
  return [
    {
      id: 1,
      title: 'Fasilitas WiFi Kampus Lemot',
      content: 'Koneksi WiFi di gedung kuliah sangat lambat, terutama saat jam sibuk. Mohon ditingkatkan kapasitasnya.',
      author: 'user1',
      authorFullName: 'M Dantha Arianvasya',
      createdAt: new Date('2024-01-15'),
      status: 'reviewed' as const,
    },
    {
      id: 2,
      title: 'AC Ruang Kelas Rusak',
      content: 'AC di ruang kelas 301 sudah tidak berfungsi selama 2 minggu. Sangat mengganggu proses belajar.',
      author: 'Fardho',
      authorFullName: 'Budi Santoso',
      createdAt: new Date('2024-01-20'),
      status: 'pending' as const,
    },
  ];
};

// Helper untuk load user dari sessionStorage (per-tab session)
const loadUserFromStorage = (): User | null => {
  const stored = sessionStorage.getItem('suara-mahasiswa-user');
  if (stored) {
    return JSON.parse(stored);
  }
  return null;
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(loadUserFromStorage);
  const [reports, setReports] = useState<Report[]>(loadReportsFromStorage);

  // Simpan reports ke localStorage setiap kali berubah
  React.useEffect(() => {
    localStorage.setItem('suara-mahasiswa-reports', JSON.stringify(reports));
  }, [reports]);

  // Fungsi login
  const login = (username: string, password: string) => {
    // Cek di daftar user
    const foundUser = CREDENTIALS.users.find(
      (u) => u.username === username && u.password === password
    );
    if (foundUser) {
      const userData = { username: foundUser.username, role: foundUser.role, fullName: foundUser.fullName };
      setUser(userData);
      sessionStorage.setItem('suara-mahasiswa-user', JSON.stringify(userData));
      return { success: true, message: 'Login berhasil!' };
    }

    // Cek di daftar admin
    const foundAdmin = CREDENTIALS.admins.find(
      (a) => a.username === username && a.password === password
    );
    if (foundAdmin) {
      const userData = { username: foundAdmin.username, role: foundAdmin.role, fullName: foundAdmin.fullName };
      setUser(userData);
      sessionStorage.setItem('suara-mahasiswa-user', JSON.stringify(userData));
      return { success: true, message: 'Login berhasil!' };
    }

    return { success: false, message: 'Username atau password salah!' };
  };

  // Fungsi logout
  const logout = () => {
    setUser(null);
    sessionStorage.removeItem('suara-mahasiswa-user');
  };

  // Fungsi menambah laporan baru
  const addReport = (title: string, content: string) => {
    if (!user) return;
    
    const newReport: Report = {
      id: Date.now(),
      title,
      content,
      author: user.username,
      authorFullName: user.fullName,
      createdAt: new Date(),
      status: 'pending',
    };
    
    setReports((prev) => [newReport, ...prev]);
  };

  // Fungsi update status laporan
  const updateReportStatus = (id: number, status: 'pending' | 'reviewed') => {
    setReports((prev) =>
      prev.map((report) =>
        report.id === id ? { ...report, status } : report
      )
    );
  };

  return (
    <AuthContext.Provider value={{ user, reports, login, logout, addReport, updateReportStatus }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
