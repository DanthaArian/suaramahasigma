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
  Users,
  Shield,
  Tag,
  MessageCircle,
  Send,
  Filter,
  Search,
  Loader2,
  BarChart3
} from 'lucide-react';
import { toast } from 'sonner';
import { ThemeToggle } from '@/components/ThemeToggle';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

export function AdminDashboard() {
  const { user, reports, updateReportStatus, addAdminReply, logout } = useAuth();
  const [categoryFilter, setCategoryFilter] = useState<ReportCategory | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<ReportStatus | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Filter laporan berdasarkan kategori, status, dan pencarian
  const filteredReports = useMemo(() => {
    return reports.filter((r) => {
      const matchCategory = categoryFilter === 'all' || r.category === categoryFilter;
      const matchStatus = statusFilter === 'all' || r.status === statusFilter;
      const matchSearch = searchQuery === '' || 
        r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.authorFullName.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCategory && matchStatus && matchSearch;
    });
  }, [reports, categoryFilter, statusFilter, searchQuery]);

  // Statistik laporan
  const stats = useMemo(() => ({
    total: reports.length,
    pending: reports.filter((r) => r.status === 'pending').length,
    inProgress: reports.filter((r) => r.status === 'in_progress').length,
    resolved: reports.filter((r) => r.status === 'resolved').length,
  }), [reports]);

  // Data untuk chart kategori
  const categoryChartData = useMemo(() => {
    const counts: Record<string, number> = {};
    REPORT_CATEGORIES.forEach((cat) => {
      counts[cat] = reports.filter((r) => r.category === cat).length;
    });
    return Object.entries(counts)
      .filter(([, count]) => count > 0)
      .map(([name, value]) => ({ name, value }));
  }, [reports]);

  // Data untuk pie chart status
  const statusChartData = useMemo(() => [
    { name: 'Menunggu', value: stats.pending, color: 'hsl(45, 93%, 47%)' },
    { name: 'Diproses', value: stats.inProgress, color: 'hsl(217, 91%, 60%)' },
    { name: 'Selesai', value: stats.resolved, color: 'hsl(162, 73%, 46%)' },
  ].filter((d) => d.value > 0), [stats]);

  // Handler logout
  const handleLogout = () => {
    logout();
    toast.success('Berhasil keluar!');
  };

  // Handler update status
  const handleUpdateStatus = (id: number, newStatus: ReportStatus) => {
    updateReportStatus(id, newStatus);
    toast.success(`Status laporan diubah menjadi ${STATUS_LABELS[newStatus]}`);
  };

  // Handler kirim balasan
  const handleSendReply = (id: number, reply: string) => {
    addAdminReply(id, reply);
    toast.success('Balasan berhasil dikirim!');
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
                <p className="text-[10px] sm:text-sm text-muted-foreground">Total</p>
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

        {/* Statistik Charts */}
        <div className="grid md:grid-cols-2 gap-4 sm:gap-6 mb-4 sm:mb-8">
          <Card className="shadow-card animate-slide-up" style={{ animationDelay: '0.4s' }}>
            <CardHeader className="p-4 sm:p-6 pb-2">
              <div className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                <CardTitle className="text-sm sm:text-base">Laporan per Kategori</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-4 sm:p-6 pt-0">
              {categoryChartData.length > 0 ? (
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={categoryChartData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis 
                      dataKey="name" 
                      tick={{ fontSize: 10 }} 
                      angle={-45}
                      textAnchor="end"
                      height={60}
                      className="fill-muted-foreground"
                    />
                    <YAxis tick={{ fontSize: 10 }} className="fill-muted-foreground" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--card))', 
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px'
                      }}
                    />
                    <Bar dataKey="value" fill="hsl(217, 91%, 60%)" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-[200px] flex items-center justify-center text-muted-foreground text-sm">
                  Belum ada data
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="shadow-card animate-slide-up" style={{ animationDelay: '0.5s' }}>
            <CardHeader className="p-4 sm:p-6 pb-2">
              <div className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                <CardTitle className="text-sm sm:text-base">Status Laporan</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-4 sm:p-6 pt-0">
              {statusChartData.length > 0 ? (
                <div className="flex items-center justify-center">
                  <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                      <Pie
                        data={statusChartData}
                        cx="50%"
                        cy="50%"
                        innerRadius={40}
                        outerRadius={70}
                        paddingAngle={5}
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        labelLine={false}
                      >
                        {statusChartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'hsl(var(--card))', 
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px'
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="h-[200px] flex items-center justify-center text-muted-foreground text-sm">
                  Belum ada data
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Daftar Semua Laporan */}
        <Card className="shadow-card animate-slide-up" style={{ animationDelay: '0.6s' }}>
          <CardHeader className="p-4 sm:p-6">
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Users className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-base sm:text-xl">Semua Laporan Mahasiswa</CardTitle>
                  <CardDescription className="text-xs sm:text-sm">Kelola dan tinjau laporan yang masuk</CardDescription>
                </div>
              </div>

              {/* Search & Filters */}
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Cari laporan..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 h-9 text-sm"
                  />
                </div>
                <div className="flex gap-2">
                  <div className="flex items-center gap-1.5">
                    <Filter className="w-4 h-4 text-muted-foreground hidden sm:block" />
                    <Select value={categoryFilter} onValueChange={(value) => setCategoryFilter(value as ReportCategory | 'all')}>
                      <SelectTrigger className="h-9 text-xs sm:text-sm w-[130px] sm:w-[150px]">
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
                  </div>
                  <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as ReportStatus | 'all')}>
                    <SelectTrigger className="h-9 text-xs sm:text-sm w-[110px] sm:w-[130px]">
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
            {filteredReports.length === 0 ? (
              <div className="text-center py-8 sm:py-12">
                <FileText className="w-10 h-10 sm:w-12 sm:h-12 mx-auto text-muted-foreground/50 mb-3 sm:mb-4" />
                <p className="text-sm sm:text-base text-muted-foreground">
                  {searchQuery || categoryFilter !== 'all' || statusFilter !== 'all' 
                    ? 'Tidak ada laporan yang sesuai dengan filter' 
                    : 'Belum ada laporan'}
                </p>
              </div>
            ) : (
              <div className="space-y-3 sm:space-y-4">
                {filteredReports.map((report) => (
                  <AdminReportCard 
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
  
  const { icon: Icon, className } = config[status];
  
  return (
    <Badge className={`text-[10px] sm:text-xs gap-1 ${className}`}>
      <Icon className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
      {STATUS_LABELS[status]}
    </Badge>
  );
}

// Komponen untuk menampilkan laporan di panel admin
function AdminReportCard({ 
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
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-[10px] sm:text-xs gap-1">
            <Tag className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
            {report.category || 'Lainnya'}
          </Badge>
          <StatusBadge status={report.status} />
        </div>
      </div>
      
      <p className="text-xs sm:text-base text-muted-foreground mb-3 sm:mb-4 leading-relaxed">{report.content}</p>

      {/* Existing Admin Reply */}
      {report.adminReply && (
        <div className="mb-3 sm:mb-4 p-2.5 sm:p-3 rounded-lg bg-primary/5 border border-primary/20">
          <div className="flex items-center gap-1.5 mb-1.5">
            <MessageCircle className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-primary" />
            <span className="text-[10px] sm:text-xs font-medium text-primary">Balasan Anda</span>
          </div>
          <p className="text-xs sm:text-sm text-foreground">{report.adminReply}</p>
          {report.adminReplyAt && (
            <p className="text-[10px] sm:text-xs text-muted-foreground mt-1.5">
              Dikirim: {new Date(report.adminReplyAt).toLocaleDateString('id-ID', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}
            </p>
          )}
        </div>
      )}
      
      <div className="flex flex-wrap gap-2">
        {/* Status Update Dropdown */}
        <Select 
          value={report.status} 
          onValueChange={(value) => onUpdateStatus(report.id, value as ReportStatus)}
        >
          <SelectTrigger className="h-8 sm:h-9 text-xs sm:text-sm w-[130px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-card border z-50">
            {REPORT_STATUS.map((status) => (
              <SelectItem key={status} value={status} className="text-sm">
                {STATUS_LABELS[status]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Reply Button - only show if no reply yet */}
        {!report.adminReply && !isReplying && (
          <Button 
            size="sm" 
            variant="outline"
            onClick={() => setIsReplying(true)}
            className="gap-1 h-8 sm:h-9 text-xs sm:text-sm px-2 sm:px-3"
          >
            <MessageCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            Balas
          </Button>
        )}
      </div>

      {/* Reply Form */}
      {isReplying && !report.adminReply && (
        <div className="mt-3 sm:mt-4 p-3 rounded-lg bg-muted/30 border">
          <p className="text-xs sm:text-sm font-medium text-foreground mb-2">Tulis Balasan</p>
          <Textarea
            placeholder="Tulis balasan untuk laporan ini..."
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            rows={3}
            maxLength={500}
            className="text-sm min-h-[80px] mb-2"
          />
          <p className="text-[10px] sm:text-xs text-muted-foreground mb-2">{replyText.length}/500 karakter</p>
          <div className="flex gap-2">
            <Button
              size="sm"
              onClick={handleSubmitReply}
              className="gap-1 h-8 text-xs sm:text-sm"
            >
              <Send className="w-3.5 h-3.5" />
              Kirim Balasan
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => {
                setIsReplying(false);
                setReplyText('');
              }}
              className="h-8 text-xs sm:text-sm"
            >
              Batal
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
