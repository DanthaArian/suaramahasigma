import { useAuth } from '@/contexts/AuthContext';
import { LoginPage } from '@/components/LoginPage';
import { UserDashboard } from '@/components/UserDashboard';
import { AdminDashboard } from '@/components/AdminDashboard';

const Index = () => {
  const { user } = useAuth();

  // Jika belum login, tampilkan halaman login
  if (!user) {
    return <LoginPage />;
  }

  // Jika user adalah admin, tampilkan dashboard admin
  if (user.role === 'admin') {
    return <AdminDashboard />;
  }

  // Jika user biasa, tampilkan dashboard user
  return <UserDashboard />;
};

export default Index;
