import React, { createContext, useContext, useState, ReactNode } from 'react';

// Tipe data untuk user
export interface User {
  username: string;
  role: 'user' | 'admin' | 'technician';
  fullName: string;
}

// Daftar teknisi yang tersedia
export interface Technician {
  username: string;
  fullName: string;
}

// Kategori laporan
export const REPORT_CATEGORIES = [
  'Kebersihan',
  'Ruangan Kelas',
  'Masjid',
  'Laboratorium',
  'Keamanan',
  'Toilet',
  'Aula',
  'Lainnya',
] as const;

export type ReportCategory = typeof REPORT_CATEGORIES[number];

// Status laporan
export const REPORT_STATUS = ['pending', 'in_progress', 'resolved'] as const;
export type ReportStatus = typeof REPORT_STATUS[number];

export const STATUS_LABELS: Record<ReportStatus, string> = {
  pending: 'Menunggu',
  in_progress: 'Diproses',
  resolved: 'Selesai',
};

// Tipe data untuk koordinat lokasi
export interface Coordinates {
  latitude: number;
  longitude: number;
}

// Tipe data untuk laporan
export interface Report {
  id: number;
  title: string;
  category: ReportCategory;
  content: string;
  author: string;
  authorFullName: string;
  createdAt: Date;
  status: ReportStatus;
  imageUrl?: string;
  coordinates?: Coordinates;
  adminReply?: string;
  adminReplyAt?: Date;
  assignedTo?: string; // username teknisi
  assignedToName?: string; // nama lengkap teknisi
  assignedAt?: Date;
  technicianReply?: string;
  technicianReplyAt?: Date;
}

// Tipe data untuk membuat laporan baru
export interface CreateReportData {
  title: string;
  category: ReportCategory;
  content: string;
  imageUrl?: string;
  coordinates?: Coordinates;
}

// Kredensial yang sudah di-hardcode
const CREDENTIALS = {
  users: [
    { username: 'user1', password: 'user123', fullName: 'M Dantha Arianvasya', role: 'user' as const },
    { username: 'user2', password: 'user123', fullName: 'Budi Santoso', role: 'user' as const },
  ],
  admins: [
    { username: 'admin', password: 'admin123', fullName: 'Admin Kampus', role: 'admin' as const },
  ],
  technicians: [
    { username: 'teknisi1', password: 'teknisi123', fullName: 'Pak Joko Teknisi', role: 'technician' as const },
    { username: 'teknisi2', password: 'teknisi123', fullName: 'Pak Budi Teknisi', role: 'technician' as const },
    { username: 'teknisi3', password: 'teknisi123', fullName: 'Pak Ahmad Teknisi', role: 'technician' as const },
  ],
};

// Export daftar teknisi untuk digunakan di komponen lain
export const TECHNICIANS: Technician[] = CREDENTIALS.technicians.map((t) => ({
  username: t.username,
  fullName: t.fullName,
}));

interface AuthContextType {
  user: User | null;
  reports: Report[];
  login: (username: string, password: string) => { success: boolean; message: string };
  logout: () => void;
  addReport: (data: CreateReportData) => void;
  updateReportStatus: (id: number, status: ReportStatus) => void;
  addAdminReply: (id: number, reply: string) => void;
  assignToTechnician: (id: number, technicianUsername: string) => void;
  addTechnicianReply: (id: number, reply: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Helper untuk load reports dari localStorage
const loadReportsFromStorage = (): Report[] => {
  try {
    const stored = localStorage.getItem('suara-mahasiswa-reports');
    if (stored) {
      const parsed = JSON.parse(stored);
      return parsed.map((r: Report & { createdAt: string; adminReplyAt?: string }) => ({
        ...r,
        createdAt: new Date(r.createdAt),
        adminReplyAt: r.adminReplyAt ? new Date(r.adminReplyAt) : undefined,
        status: r.status || 'pending',
        category: r.category || 'Lainnya',
      }));
    }
  } catch (e) {
    console.error('Error loading reports:', e);
    localStorage.removeItem('suara-mahasiswa-reports');
  }
  // Default reports jika belum ada di localStorage
  return [
    {
      id: 1,
      title: 'Fasilitas WiFi Kampus Lemot',
      category: 'Lainnya' as ReportCategory,
      content: 'Koneksi WiFi di gedung kuliah sangat lambat, terutama saat jam sibuk. Mohon ditingkatkan kapasitasnya.',
      author: 'user1',
      authorFullName: 'M Dantha Arianvasya',
      createdAt: new Date('2024-01-15'),
      status: 'resolved' as ReportStatus,
      adminReply: 'Terima kasih atas laporannya. Kami akan segera menghubungi pihak IT untuk meningkatkan kapasitas WiFi.',
      adminReplyAt: new Date('2024-01-16'),
    },
    {
      id: 2,
      title: 'AC Ruang Kelas Rusak',
      category: 'Ruangan Kelas' as ReportCategory,
      content: 'AC di ruang kelas 301 sudah tidak berfungsi selama 2 minggu. Sangat mengganggu proses belajar.',
      author: 'user2',
      authorFullName: 'Budi Santoso',
      createdAt: new Date('2024-01-20'),
      status: 'pending' as ReportStatus,
    },
    {
      id: 3,
      title: 'Toilet Gedung B Perlu Perbaikan',
      category: 'Toilet' as ReportCategory,
      content: 'Beberapa toilet di lantai 2 Gedung B mengalami kerusakan pada kran dan pintu.',
      author: 'user1',
      authorFullName: 'M Dantha Arianvasya',
      createdAt: new Date('2024-01-22'),
      status: 'in_progress' as ReportStatus,
    },
    {
      id: 4,
      title: 'Kebersihan Kantin',
      category: 'Kebersihan' as ReportCategory,
      content: 'Area makan di kantin pusat perlu dibersihkan lebih sering karena banyak sampah berserakan.',
      author: 'user2',
      authorFullName: 'Budi Santoso',
      createdAt: new Date('2024-01-25'),
      status: 'pending' as ReportStatus,
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

    // Cek di daftar teknisi
    const foundTechnician = CREDENTIALS.technicians.find(
      (t) => t.username === username && t.password === password
    );
    if (foundTechnician) {
      const userData = { username: foundTechnician.username, role: foundTechnician.role, fullName: foundTechnician.fullName };
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
  const addReport = (data: CreateReportData) => {
    if (!user) return;
    
    const newReport: Report = {
      id: Date.now(),
      title: data.title,
      category: data.category,
      content: data.content,
      author: user.username,
      authorFullName: user.fullName,
      createdAt: new Date(),
      status: 'pending',
      imageUrl: data.imageUrl,
      coordinates: data.coordinates,
    };
    
    setReports((prev) => [newReport, ...prev]);
  };

  // Fungsi menambah balasan admin
  const addAdminReply = (id: number, reply: string) => {
    setReports((prev) =>
      prev.map((report) =>
        report.id === id 
          ? { ...report, adminReply: reply, adminReplyAt: new Date() } 
          : report
      )
    );
  };

  // Fungsi update status laporan
  const updateReportStatus = (id: number, status: ReportStatus) => {
    setReports((prev) =>
      prev.map((report) =>
        report.id === id ? { ...report, status } : report
      )
    );
  };

  // Fungsi assign laporan ke teknisi
  const assignToTechnician = (id: number, technicianUsername: string) => {
    const technician = TECHNICIANS.find((t) => t.username === technicianUsername);
    if (!technician) return;

    setReports((prev) =>
      prev.map((report) =>
        report.id === id
          ? {
              ...report,
              assignedTo: technician.username,
              assignedToName: technician.fullName,
              assignedAt: new Date(),
            }
          : report
      )
    );
  };

  // Fungsi menambah balasan teknisi
  const addTechnicianReply = (id: number, reply: string) => {
    setReports((prev) =>
      prev.map((report) =>
        report.id === id
          ? { ...report, technicianReply: reply, technicianReplyAt: new Date() }
          : report
      )
    );
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      reports, 
      login, 
      logout, 
      addReport, 
      updateReportStatus, 
      addAdminReply,
      assignToTechnician,
      addTechnicianReply
    }}>
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
