import { useState } from 'react';
import { useAuth, Report } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  MessageSquare, 
  LogOut, 
  Plus, 
  FileText, 
  Clock, 
  CheckCircle2,
  Send,
  User
} from 'lucide-react';
import { toast } from 'sonner';

export function UserDashboard() {
  const { user, reports, addReport, logout } = useAuth();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Filter laporan milik user yang sedang login
  const userReports = reports.filter((report) => report.author === user?.username);

  // Handler untuk submit laporan baru
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validasi input
    if (!title.trim() || !content.trim()) {
      toast.error('Judul dan isi laporan harus diisi!');
      return;
    }

    if (title.trim().length < 5) {
      toast.error('Judul laporan minimal 5 karakter!');
      return;
    }

    if (content.trim().length < 20) {
      toast.error('Isi laporan minimal 20 karakter!');
      return;
    }

    setIsSubmitting(true);
    
    // Simulasi delay
    await new Promise((resolve) => setTimeout(resolve, 500));
    
    addReport(title.trim(), content.trim());
    toast.success('Laporan berhasil dikirim!');
    
    // Reset form
    setTitle('');
    setContent('');
    setIsSubmitting(false);
  };

  // Handler logout
  const handleLogout = () => {
    logout();
    toast.success('Berhasil keluar!');
  };

  // Format tanggal
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
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
              <p className="text-[10px] sm:text-xs text-muted-foreground">Dashboard User</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2 sm:gap-4">
            <div className="hidden md:flex items-center gap-2 text-sm">
              <User className="w-4 h-4 text-muted-foreground" />
              <span className="text-muted-foreground">Halo,</span>
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
        <div className="grid lg:grid-cols-2 gap-4 sm:gap-8">
          {/* Form Laporan Baru */}
          <div className="animate-slide-up">
            <Card className="shadow-card">
              <CardHeader className="p-4 sm:p-6">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Plus className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-base sm:text-xl">Buat Laporan Baru</CardTitle>
                    <CardDescription className="text-xs sm:text-sm">Sampaikan aspirasi atau keluhan Anda</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-4 sm:p-6 pt-0 sm:pt-0">
                <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
                  <div className="space-y-1.5 sm:space-y-2">
                    <Label htmlFor="title" className="text-sm">Judul Laporan</Label>
                    <Input
                      id="title"
                      placeholder="Contoh: Fasilitas kampus perlu diperbaiki"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      maxLength={100}
                      className="h-9 sm:h-10 text-sm"
                    />
                    <p className="text-[10px] sm:text-xs text-muted-foreground">{title.length}/100 karakter</p>
                  </div>
                  
                  <div className="space-y-1.5 sm:space-y-2">
                    <Label htmlFor="content" className="text-sm">Isi Laporan</Label>
                    <Textarea
                      id="content"
                      placeholder="Jelaskan detail laporan Anda di sini..."
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      rows={4}
                      maxLength={1000}
                      className="text-sm min-h-[100px] sm:min-h-[120px]"
                    />
                    <p className="text-[10px] sm:text-xs text-muted-foreground">{content.length}/1000 karakter</p>
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full gradient-primary text-primary-foreground gap-1.5 sm:gap-2 h-9 sm:h-10 text-sm"
                    disabled={isSubmitting}
                  >
                    <Send className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    {isSubmitting ? 'Mengirim...' : 'Kirim Laporan'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Daftar Laporan User */}
          <div className="animate-slide-up" style={{ animationDelay: '0.1s' }}>
            <Card className="shadow-card">
              <CardHeader className="p-4 sm:p-6">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-accent/20 flex items-center justify-center">
                    <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-accent" />
                  </div>
                  <div>
                    <CardTitle className="text-base sm:text-xl">Laporan Saya</CardTitle>
                    <CardDescription className="text-xs sm:text-sm">
                      {userReports.length} laporan telah dikirim
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-4 sm:p-6 pt-0 sm:pt-0">
                {userReports.length === 0 ? (
                  <div className="text-center py-8 sm:py-12">
                    <FileText className="w-10 h-10 sm:w-12 sm:h-12 mx-auto text-muted-foreground/50 mb-3 sm:mb-4" />
                    <p className="text-sm sm:text-base text-muted-foreground">Belum ada laporan</p>
                    <p className="text-xs sm:text-sm text-muted-foreground">Buat laporan pertama Anda!</p>
                  </div>
                ) : (
                  <div className="space-y-3 sm:space-y-4 max-h-[400px] sm:max-h-[500px] overflow-y-auto pr-1 sm:pr-2">
                    {userReports.map((report) => (
                      <ReportCard key={report.id} report={report} />
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}

// Komponen untuk menampilkan satu laporan
function ReportCard({ report }: { report: Report }) {
  return (
    <div className="p-3 sm:p-4 rounded-lg border bg-card hover:shadow-card transition-shadow">
      <div className="flex items-start justify-between gap-2 sm:gap-4 mb-1.5 sm:mb-2">
        <h4 className="font-semibold text-sm sm:text-base text-foreground line-clamp-1">{report.title}</h4>
        <Badge 
          variant={report.status === 'reviewed' ? 'default' : 'secondary'}
          className={`text-[10px] sm:text-xs ${report.status === 'reviewed' ? 'bg-accent text-accent-foreground' : ''}`}
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
      <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2 mb-2 sm:mb-3">{report.content}</p>
      <p className="text-[10px] sm:text-xs text-muted-foreground flex items-center gap-1">
        <Clock className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
        {new Date(report.createdAt).toLocaleDateString('id-ID', {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        })}
      </p>
    </div>
  );
}