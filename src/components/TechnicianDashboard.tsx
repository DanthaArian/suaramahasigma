import { useState, useMemo } from 'react';
import { useAuth, Report, REPORT_CATEGORIES, ReportCategory, REPORT_STATUS, ReportStatus, STATUS_LABELS } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  MessageSquare, 
  LogOut, 
  FileText, 
  Clock, 
  CheckCircle2,
  Wrench,
  Tag,
  MessageCircle,
  Send,
  Search,
  Loader2,
  MapPin,
  Image,
  ExternalLink,
  User
} from 'lucide-react';
import { toast } from 'sonner';
import { ThemeToggle } from '@/components/ThemeToggle';

export function TechnicianDashboard() {
  const { user, reports, updateReportStatus, addTechnicianReply, logout } = useAuth();
  const [categoryFilter, setCategoryFilter] = useState<ReportCategory | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<ReportStatus | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Filter laporan yang di-assign ke teknisi ini
  const assignedReports = useMemo(() => {
    return reports
      .filter((r) => r.assignedTo === user?.username)
      .filter((r) => {
        const matchCategory = categoryFilter === 'all' || r.category === categoryFilter;
        const matchStatus = statusFilter === 'all' || r.status === statusFilter;
        const matchSearch = searchQuery === '' || 
          r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          r.content.toLowerCase().includes(searchQuery.toLowerCase());
        return matchCategory && matchStatus && matchSearch;
      });
  }, [reports, user?.username, categoryFilter, statusFilter, searchQuery]);

  // Statistik
  const stats = useMemo(() => ({
    total: reports.filter((r) => r.assignedTo === user?.username).length,
    pending: reports.filter((r) => r.assignedTo === user?.username && r.status === 'pending').length,
    inProgress: reports.filter((r) => r.assignedTo === user?.username && r.status === 'in_progress').length,
    resolved: reports.filter((r) => r.assignedTo === user?.username && r.status === 'resolved').length,
  }), [reports, user?.username]);

  const handleLogout = () => {
    logout();
    toast.success('Berhasil keluar!');
  };

  const handleUpdateStatus = (id: number, newStatus: ReportStatus) => {
    updateReportStatus(id, newStatus);
    toast.success(`Status laporan diubah menjadi ${STATUS_LABELS[newStatus]}`);
  };

  const handleSendReply = (id: number, reply: string) => {
    addTechnicianReply(id, reply);
    toast.success('Balasan berhasil dikirim!');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-card/80 backdrop-blur-sm">
        <div className="container mx-auto px-3 sm:px-4 h-14 sm:h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl gradient-primary flex items-center justify-center">
              <MessageSquare className="w-4 h-4 sm:w-5 sm:h-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="font-bold text-sm sm:text-base text-foreground">Suara Mahasiswa</h1>
              <p className="text-[10px] sm:text-xs text-muted-foreground">Panel Teknisi</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2 sm:gap-4">
            <div className="hidden md:flex items-center gap-2 text-sm">
              <Wrench className="w-4 h-4 text-primary" />
              <span className="font-medium text-foreground">{user?.fullName}</span>
            </div>
            <ThemeToggle />
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
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4 mb-4 sm:mb-8">
          <Card className="shadow-card animate-slide-up">
            <CardContent className="p-3 sm:p-6">
              <div className="flex flex-col items-center text-center">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-primary/10 flex items-center justify-center mb-2">
                  <FileText className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                </div>
                <p className="text-xl sm:text-2xl font-bold text-foreground">{stats.total}</p>
                <p className="text-[10px] sm:text-sm text-muted-foreground">Ditugaskan</p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="shadow-card animate-slide-up" style={{ animationDelay: '0.1s' }}>
            <CardContent className="p-3 sm:p-6">
              <div className="flex flex-col items-center text-center">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-amber-500/10 flex items-center justify-center mb-2">
                  <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-amber-500" />
                </div>
                <p className="text-xl sm:text-2xl font-bold text-foreground">{stats.pending}</p>
                <p className="text-[10px] sm:text-sm text-muted-foreground">Menunggu</p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="shadow-card animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <CardContent className="p-3 sm:p-6">
              <div className="flex flex-col items-center text-center">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-primary/10 flex items-center justify-center mb-2">
                  <Loader2 className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                </div>
                <p className="text-xl sm:text-2xl font-bold text-foreground">{stats.inProgress}</p>
                <p className="text-[10px] sm:text-sm text-muted-foreground">Diproses</p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="shadow-card animate-slide-up" style={{ animationDelay: '0.3s' }}>
            <CardContent className="p-3 sm:p-6">
              <div className="flex flex-col items-center text-center">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-accent/20 flex items-center justify-center mb-2">
                  <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6 text-accent" />
                </div>
                <p className="text-xl sm:text-2xl font-bold text-foreground">{stats.resolved}</p>
                <p className="text-[10px] sm:text-sm text-muted-foreground">Selesai</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Daftar Laporan */}
        <Card className="shadow-card animate-slide-up" style={{ animationDelay: '0.4s' }}>
          <CardHeader className="p-4 sm:p-6">
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Wrench className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-base sm:text-xl">Laporan yang Ditugaskan</CardTitle>
                  <CardDescription className="text-xs sm:text-sm">Kelola laporan yang diarahkan kepada Anda</CardDescription>
                </div>
              </div>

              {/* Search & Filters */}
              <div className="space-y-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Cari laporan..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 h-9 text-sm"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <Select value={categoryFilter} onValueChange={(value) => setCategoryFilter(value as ReportCategory | 'all')}>
                    <SelectTrigger className="h-9 text-xs sm:text-sm">
                      <SelectValue placeholder="Kategori" />
                    </SelectTrigger>
                    <SelectContent className="bg-card border z-50">
                      <SelectItem value="all" className="text-sm">Semua Kategori</SelectItem>
                      {REPORT_CATEGORIES.map((cat) => (
                        <SelectItem key={cat} value={cat} className="text-sm">
                          {cat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as ReportStatus | 'all')}>
                    <SelectTrigger className="h-9 text-xs sm:text-sm">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent className="bg-card border z-50">
                      <SelectItem value="all" className="text-sm">Semua Status</SelectItem>
                      {REPORT_STATUS.map((status) => (
                        <SelectItem key={status} value={status} className="text-sm">
                          {STATUS_LABELS[status]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 pt-0 sm:pt-0">
            {assignedReports.length === 0 ? (
              <div className="text-center py-8 sm:py-12">
                <FileText className="w-10 h-10 sm:w-12 sm:h-12 mx-auto text-muted-foreground/50 mb-3 sm:mb-4" />
                <p className="text-sm sm:text-base text-muted-foreground">
                  {searchQuery || categoryFilter !== 'all' || statusFilter !== 'all' 
                    ? 'Tidak ada laporan yang sesuai dengan filter' 
                    : 'Belum ada laporan yang ditugaskan kepada Anda'}
                </p>
              </div>
            ) : (
              <div className="space-y-3 sm:space-y-4">
                {assignedReports.map((report) => (
                  <TechnicianReportCard 
                    key={report.id} 
                    report={report} 
                    onUpdateStatus={handleUpdateStatus}
                    onSendReply={handleSendReply}
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

// Status Badge Component
function StatusBadge({ status }: { status: ReportStatus }) {
  const config = {
    pending: { icon: Clock, className: 'bg-amber-500/10 text-amber-600 dark:text-amber-400' },
    in_progress: { icon: Loader2, className: 'bg-primary/10 text-primary' },
    resolved: { icon: CheckCircle2, className: 'bg-accent/10 text-accent' },
  };
  
  const safeStatus = status && config[status] ? status : 'pending';
  const { icon: Icon, className } = config[safeStatus];
  
  return (
    <Badge className={`text-[10px] sm:text-xs gap-1 ${className}`}>
      <Icon className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
      {STATUS_LABELS[safeStatus]}
    </Badge>
  );
}

// Komponen untuk menampilkan laporan di panel teknisi
function TechnicianReportCard({ 
  report, 
  onUpdateStatus,
  onSendReply
}: { 
  report: Report;
  onUpdateStatus: (id: number, status: ReportStatus) => void;
  onSendReply: (id: number, reply: string) => void;
}) {
  const [replyText, setReplyText] = useState('');
  const [isReplying, setIsReplying] = useState(false);

  const handleSubmitReply = () => {
    if (!replyText.trim()) {
      toast.error('Isi balasan tidak boleh kosong!');
      return;
    }
    if (replyText.trim().length < 10) {
      toast.error('Balasan minimal 10 karakter!');
      return;
    }
    onSendReply(report.id, replyText.trim());
    setReplyText('');
    setIsReplying(false);
  };

  return (
    <div className="p-3 sm:p-5 rounded-lg sm:rounded-xl border bg-card hover:shadow-card transition-shadow">
      {/* Header */}
      <div className="space-y-2 mb-2 sm:mb-3">
        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
          <Badge variant="outline" className="text-[10px] sm:text-xs gap-1">
            <Tag className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
            {report.category}
          </Badge>
          <StatusBadge status={report.status} />
        </div>
        <h4 className="font-semibold text-sm sm:text-base text-foreground line-clamp-2">{report.title}</h4>
      </div>

      {/* Content */}
      <p className="text-xs sm:text-sm text-muted-foreground mb-3 sm:mb-4 line-clamp-3">{report.content}</p>

      {/* Image */}
      {report.imageUrl && (
        <div className="mb-3 sm:mb-4">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1.5">
            <Image className="w-3 h-3" />
            <span>Foto Laporan</span>
          </div>
          <img 
            src={report.imageUrl} 
            alt="Foto laporan" 
            className="max-w-full h-24 sm:h-32 object-cover rounded-lg border cursor-pointer hover:opacity-90 transition-opacity"
            onClick={() => window.open(report.imageUrl, '_blank')}
          />
        </div>
      )}

      {/* Coordinates */}
      {report.coordinates && (
        <div className="mb-3 sm:mb-4">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <MapPin className="w-3 h-3" />
            <span>{report.coordinates.latitude.toFixed(6)}, {report.coordinates.longitude.toFixed(6)}</span>
            <a 
              href={`https://www.google.com/maps?q=${report.coordinates.latitude},${report.coordinates.longitude}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline flex items-center gap-0.5"
            >
              <ExternalLink className="w-3 h-3" />
              Lihat
            </a>
          </div>
        </div>
      )}

      {/* Meta */}
      <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-[10px] sm:text-xs text-muted-foreground mb-3 sm:mb-4">
        <div className="flex items-center gap-1">
          <User className="w-3 h-3" />
          <span>{report.authorFullName}</span>
        </div>
        <div className="flex items-center gap-1">
          <Clock className="w-3 h-3" />
          <span>{new Date(report.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
        </div>
      </div>

      {/* Admin Reply (if exists) */}
      {report.adminReply && (
        <div className="mb-3 sm:mb-4 p-2.5 sm:p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
          <div className="flex items-center gap-1.5 text-xs font-medium text-blue-600 dark:text-blue-400 mb-1">
            <MessageCircle className="w-3 h-3" />
            Catatan Admin
          </div>
          <p className="text-xs sm:text-sm text-foreground">{report.adminReply}</p>
          {report.adminReplyAt && (
            <p className="text-[10px] text-muted-foreground mt-1">
              {new Date(report.adminReplyAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
            </p>
          )}
        </div>
      )}

      {/* Technician Reply (if exists) */}
      {report.technicianReply && (
        <div className="mb-3 sm:mb-4 p-2.5 sm:p-3 rounded-lg bg-accent/10 border border-accent/20">
          <div className="flex items-center gap-1.5 text-xs font-medium text-accent mb-1">
            <Wrench className="w-3 h-3" />
            Balasan Anda
          </div>
          <p className="text-xs sm:text-sm text-foreground">{report.technicianReply}</p>
          {report.technicianReplyAt && (
            <p className="text-[10px] text-muted-foreground mt-1">
              {new Date(report.technicianReplyAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
            </p>
          )}
        </div>
      )}

      {/* Actions */}
      <div className="flex flex-col gap-2">
        {/* Status Update */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs text-muted-foreground">Ubah Status:</span>
          <div className="flex flex-wrap gap-1.5">
            {REPORT_STATUS.map((status) => (
              <Button
                key={status}
                variant={report.status === status ? "default" : "outline"}
                size="sm"
                onClick={() => onUpdateStatus(report.id, status)}
                className="h-7 text-[10px] sm:text-xs px-2"
                disabled={report.status === status}
              >
                {STATUS_LABELS[status]}
              </Button>
            ))}
          </div>
        </div>

        {/* Reply Section */}
        {!report.technicianReply && (
          <>
            {isReplying ? (
              <div className="space-y-2">
                <Textarea
                  placeholder="Tulis balasan untuk pelapor..."
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  rows={3}
                  className="text-sm"
                />
                <div className="flex gap-2">
                  <Button 
                    size="sm" 
                    onClick={handleSubmitReply}
                    className="gap-1.5 h-8 text-xs"
                  >
                    <Send className="w-3 h-3" />
                    Kirim
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => { setIsReplying(false); setReplyText(''); }}
                    className="h-8 text-xs"
                  >
                    Batal
                  </Button>
                </div>
              </div>
            ) : (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setIsReplying(true)}
                className="gap-1.5 h-8 text-xs w-fit"
              >
                <MessageCircle className="w-3 h-3" />
                Beri Balasan
              </Button>
            )}
          </>
        )}
      </div>
    </div>
  );
}
