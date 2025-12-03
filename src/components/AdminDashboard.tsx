import { useAuth, Report } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  MessageSquare, 
  LogOut, 
  FileText, 
  Clock, 
  CheckCircle2,
  Users,
  TrendingUp,
  Shield
} from 'lucide-react';
import { toast } from 'sonner';

export function AdminDashboard() {
  const { user, reports, updateReportStatus, logout } = useAuth();

  // Statistik laporan
  const totalReports = reports.length;
  const pendingReports = reports.filter((r) => r.status === 'pending').length;
  const reviewedReports = reports.filter((r) => r.status === 'reviewed').length;

  // Handler logout
  const handleLogout = () => {
    logout();
    toast.success('Berhasil keluar!');
  };

  // Handler update status
  const handleUpdateStatus = (id: number, newStatus: 'pending' | 'reviewed') => {
    updateReportStatus(id, newStatus);
    toast.success(`Status laporan diubah menjadi ${newStatus === 'reviewed' ? 'Ditinjau' : 'Menunggu'}`);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header / Navbar */}
      <header className="sticky top-0 z-50 border-b bg-card/80 backdrop-blur-sm">
        <div className="container mx-auto px-3 sm:px-4 h-14 sm:h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl gradient-primary flex items-center justify-center">
              <MessageSquare className="w-4 h-4 sm:w-5 sm:h-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="font-bold text-sm sm:text-base text-foreground">Suara Mahasiswa</h1>
              <p className="text-[10px] sm:text-xs text-muted-foreground">Panel Admin</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2 sm:gap-4">
            <div className="hidden md:flex items-center gap-2 text-sm">
              <Shield className="w-4 h-4 text-primary" />
              <span className="font-medium text-foreground">{user?.fullName}</span>
            </div>
            <Button variant="outline" size="sm" onClick={handleLogout} className="gap-1.5 sm:gap-2 h-8 sm:h-9 px-2 sm:px-3 text-xs sm:text-sm">
              <LogOut className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">Keluar</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-3 sm:px-4 py-4 sm:py-8">
        {/* Statistik Cards */}
        <div className="grid grid-cols-3 gap-2 sm:gap-4 mb-4 sm:mb-8">
          <Card className="shadow-card animate-slide-up">
            <CardContent className="p-3 sm:p-6">
              <div className="flex flex-col sm:flex-row items-center sm:gap-4 text-center sm:text-left">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-primary/10 flex items-center justify-center mb-2 sm:mb-0">
                  <FileText className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                </div>
                <div>
                  <p className="text-xl sm:text-2xl font-bold text-foreground">{totalReports}</p>
                  <p className="text-[10px] sm:text-sm text-muted-foreground">Total Laporan</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="shadow-card animate-slide-up" style={{ animationDelay: '0.1s' }}>
            <CardContent className="p-3 sm:p-6">
              <div className="flex flex-col sm:flex-row items-center sm:gap-4 text-center sm:text-left">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-amber-500/10 flex items-center justify-center mb-2 sm:mb-0">
                  <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-amber-500" />
                </div>
                <div>
                  <p className="text-xl sm:text-2xl font-bold text-foreground">{pendingReports}</p>
                  <p className="text-[10px] sm:text-sm text-muted-foreground">Menunggu</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="shadow-card animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <CardContent className="p-3 sm:p-6">
              <div className="flex flex-col sm:flex-row items-center sm:gap-4 text-center sm:text-left">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-accent/20 flex items-center justify-center mb-2 sm:mb-0">
                  <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6 text-accent" />
                </div>
                <div>
                  <p className="text-xl sm:text-2xl font-bold text-foreground">{reviewedReports}</p>
                  <p className="text-[10px] sm:text-sm text-muted-foreground">Ditinjau</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Daftar Semua Laporan */}
        <Card className="shadow-card animate-slide-up" style={{ animationDelay: '0.3s' }}>
          <CardHeader className="p-4 sm:p-6">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Users className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
              </div>
              <div>
                <CardTitle className="text-base sm:text-xl">Semua Laporan Mahasiswa</CardTitle>
                <CardDescription className="text-xs sm:text-sm">Kelola dan tinjau laporan yang masuk</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 pt-0 sm:pt-0">
            {reports.length === 0 ? (
              <div className="text-center py-8 sm:py-12">
                <FileText className="w-10 h-10 sm:w-12 sm:h-12 mx-auto text-muted-foreground/50 mb-3 sm:mb-4" />
                <p className="text-sm sm:text-base text-muted-foreground">Belum ada laporan</p>
              </div>
            ) : (
              <div className="space-y-3 sm:space-y-4">
                {reports.map((report) => (
                  <AdminReportCard 
                    key={report.id} 
                    report={report} 
                    onUpdateStatus={handleUpdateStatus}
                  />
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}

// Komponen untuk menampilkan laporan di panel admin
function AdminReportCard({ 
  report, 
  onUpdateStatus 
}: { 
  report: Report;
  onUpdateStatus: (id: number, status: 'pending' | 'reviewed') => void;
}) {
  return (
    <div className="p-3 sm:p-5 rounded-lg sm:rounded-xl border bg-card hover:shadow-card transition-shadow">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 sm:gap-4 mb-2 sm:mb-3">
        <div className="flex-1">
          <h4 className="font-semibold text-sm sm:text-lg text-foreground mb-0.5 sm:mb-1">{report.title}</h4>
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 text-[10px] sm:text-sm text-muted-foreground">
            <span className="flex items-center gap-0.5 sm:gap-1">
              <Users className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              {report.authorFullName}
            </span>
            <span>•</span>
            <span className="flex items-center gap-0.5 sm:gap-1">
              <Clock className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              {new Date(report.createdAt).toLocaleDateString('id-ID', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
              })}
            </span>
          </div>
        </div>
        <Badge 
          variant={report.status === 'reviewed' ? 'default' : 'secondary'}
          className={`text-[10px] sm:text-xs ${report.status === 'reviewed' ? 'bg-accent text-accent-foreground' : 'bg-amber-500/10 text-amber-600'}`}
        >
          {report.status === 'reviewed' ? (
            <span className="flex items-center gap-0.5 sm:gap-1">
              <CheckCircle2 className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
              Ditinjau
            </span>
          ) : (
            <span className="flex items-center gap-0.5 sm:gap-1">
              <Clock className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
              Menunggu
            </span>
          )}
        </Badge>
      </div>
      
      <p className="text-xs sm:text-base text-muted-foreground mb-3 sm:mb-4 leading-relaxed">{report.content}</p>
      
      <div className="flex gap-2">
        {report.status === 'pending' ? (
          <Button 
            size="sm" 
            onClick={() => onUpdateStatus(report.id, 'reviewed')}
            className="gap-1 bg-accent text-accent-foreground hover:bg-accent/90 h-8 sm:h-9 text-xs sm:text-sm px-2 sm:px-3"
          >
            <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span className="hidden xs:inline">Tandai</span> Ditinjau
          </Button>
        ) : (
          <Button 
            size="sm" 
            variant="outline"
            onClick={() => onUpdateStatus(report.id, 'pending')}
            className="gap-1 h-8 sm:h-9 text-xs sm:text-sm px-2 sm:px-3"
          >
            <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span className="hidden sm:inline">Kembalikan ke</span> Menunggu
          </Button>
        )}
      </div>
    </div>
  );
}
