import { useState, useMemo, useRef } from 'react';
import { useAuth, Report, REPORT_CATEGORIES, ReportCategory, STATUS_LABELS, ReportStatus, Coordinates } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
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
  Plus, 
  FileText, 
  Clock, 
  CheckCircle2,
  Send,
  User,
  Tag,
  MessageCircle,
  Search,
  Loader2,
  ImagePlus,
  X,
  MapPin,
  Navigation,
  Wrench
} from 'lucide-react';
import { toast } from 'sonner';
import { ThemeToggle } from '@/components/ThemeToggle';

const MAX_IMAGE_SIZE = 500 * 1024; // 500 KB
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

export function UserDashboard() {
  const { user, reports, addReport, logout } = useAuth();
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<ReportCategory | ''>('');
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Image upload state
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Location state
  const [coordinates, setCoordinates] = useState<Coordinates | null>(null);
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [manualLat, setManualLat] = useState('');
  const [manualLng, setManualLng] = useState('');

  // Filter laporan milik user yang sedang login dengan pencarian
  const userReports = useMemo(() => {
    return reports
      .filter((report) => report.author === user?.username)
      .filter((report) => 
        searchQuery === '' ||
        report.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        report.content.toLowerCase().includes(searchQuery.toLowerCase())
      );
  }, [reports, user?.username, searchQuery]);

  // Handle image selection
  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      toast.error('Format file tidak didukung! Gunakan JPG, PNG, WEBP, atau GIF.');
      return;
    }

    // Validate file size
    if (file.size > MAX_IMAGE_SIZE) {
      toast.error(`Ukuran file terlalu besar! Maksimal ${MAX_IMAGE_SIZE / 1024} KB.`);
      return;
    }

    setImageFile(file);
    
    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  // Remove image
  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Get current location
  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      toast.error('Browser tidak mendukung geolocation!');
      return;
    }

    setIsGettingLocation(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const coords = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        };
        setCoordinates(coords);
        setManualLat(coords.latitude.toFixed(6));
        setManualLng(coords.longitude.toFixed(6));
        setIsGettingLocation(false);
        toast.success('Lokasi berhasil diambil!');
      },
      (error) => {
        setIsGettingLocation(false);
        switch (error.code) {
          case error.PERMISSION_DENIED:
            toast.error('Izin lokasi ditolak. Silakan aktifkan izin lokasi.');
            break;
          case error.POSITION_UNAVAILABLE:
            toast.error('Informasi lokasi tidak tersedia.');
            break;
          case error.TIMEOUT:
            toast.error('Waktu permintaan lokasi habis.');
            break;
          default:
            toast.error('Gagal mengambil lokasi.');
        }
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  // Handle manual coordinate input
  const handleManualCoordinates = () => {
    const lat = parseFloat(manualLat);
    const lng = parseFloat(manualLng);

    if (manualLat && manualLng) {
      if (isNaN(lat) || isNaN(lng)) {
        toast.error('Koordinat harus berupa angka!');
        return;
      }
      if (lat < -90 || lat > 90) {
        toast.error('Latitude harus antara -90 dan 90!');
        return;
      }
      if (lng < -180 || lng > 180) {
        toast.error('Longitude harus antara -180 dan 180!');
        return;
      }
      setCoordinates({ latitude: lat, longitude: lng });
      toast.success('Koordinat disimpan!');
    } else {
      setCoordinates(null);
    }
  };

  // Clear coordinates
  const handleClearCoordinates = () => {
    setCoordinates(null);
    setManualLat('');
    setManualLng('');
  };

  // Handler untuk submit laporan baru
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validasi input
    if (!title.trim()) {
      toast.error('Judul laporan wajib diisi!');
      return;
    }

    if (title.trim().length < 5) {
      toast.error('Judul laporan minimal 5 karakter!');
      return;
    }

    if (!category) {
      toast.error('Pilih kategori laporan!');
      return;
    }

    if (!content.trim()) {
      toast.error('Deskripsi laporan wajib diisi!');
      return;
    }

    if (content.trim().length < 20) {
      toast.error('Deskripsi laporan minimal 20 karakter!');
      return;
    }

    setIsSubmitting(true);
    
    // Simulasi delay
    await new Promise((resolve) => setTimeout(resolve, 500));
    
    addReport({
      title: title.trim(),
      category,
      content: content.trim(),
      imageUrl: imagePreview || undefined,
      coordinates: coordinates || undefined,
    });
    
    toast.success('Laporan berhasil dikirim!');
    
    // Reset form
    setTitle('');
    setCategory('');
    setContent('');
    handleRemoveImage();
    handleClearCoordinates();
    setIsSubmitting(false);
  };

  // Handler logout
  const handleLogout = () => {
    logout();
    toast.success('Berhasil keluar!');
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
            <ThemeToggle />
            <Button variant="outline" size="sm" onClick={handleLogout} className="gap-1.5 sm:gap-2 h-8 sm:h-9 px-2 sm:px-3 text-xs sm:text-sm">
              <LogOut className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">Keluar</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-3 sm:px-4 py-4 sm:py-6">
        <div className="grid lg:grid-cols-2 gap-4 sm:gap-6">
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
                    <Label htmlFor="title" className="text-sm">
                      Judul Laporan <span className="text-destructive">*</span>
                    </Label>
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
                    <Label htmlFor="category" className="text-sm">
                      Kategori <span className="text-destructive">*</span>
                    </Label>
                    <Select value={category} onValueChange={(value) => setCategory(value as ReportCategory)}>
                      <SelectTrigger className="h-9 sm:h-10 text-sm">
                        <SelectValue placeholder="Pilih kategori laporan" />
                      </SelectTrigger>
                      <SelectContent className="bg-card border z-50">
                        {REPORT_CATEGORIES.map((cat) => (
                          <SelectItem key={cat} value={cat} className="text-sm">
                            {cat}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-1.5 sm:space-y-2">
                    <Label htmlFor="content" className="text-sm">
                      Deskripsi Laporan <span className="text-destructive">*</span>
                    </Label>
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

                  {/* Image Upload */}
                  <div className="space-y-1.5 sm:space-y-2">
                    <Label className="text-sm">Foto Pendukung (Opsional)</Label>
                    <div className="space-y-2">
                      {imagePreview ? (
                        <div className="relative inline-block">
                          <img 
                            src={imagePreview} 
                            alt="Preview" 
                            className="max-w-full h-32 sm:h-40 object-cover rounded-lg border"
                          />
                          <Button
                            type="button"
                            variant="destructive"
                            size="icon"
                            className="absolute -top-2 -right-2 w-6 h-6"
                            onClick={handleRemoveImage}
                          >
                            <X className="w-3 h-3" />
                          </Button>
                        </div>
                      ) : (
                        <div
                          className="border-2 border-dashed rounded-lg p-4 sm:p-6 text-center cursor-pointer hover:border-primary/50 transition-colors"
                          onClick={() => fileInputRef.current?.click()}
                        >
                          <ImagePlus className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
                          <p className="text-xs sm:text-sm text-muted-foreground">
                            Klik untuk upload foto
                          </p>
                          <p className="text-[10px] sm:text-xs text-muted-foreground mt-1">
                            Maks. 500 KB (JPG, PNG, WEBP, GIF)
                          </p>
                        </div>
                      )}
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept={ALLOWED_IMAGE_TYPES.join(',')}
                        onChange={handleImageSelect}
                        className="hidden"
                      />
                    </div>
                  </div>

                  {/* Location Input */}
                  <div className="space-y-1.5 sm:space-y-2">
                    <Label className="text-sm">Koordinat Lokasi (Opsional)</Label>
                    <div className="space-y-2">
                      <div className="flex gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={handleGetLocation}
                          disabled={isGettingLocation}
                          className="gap-1.5 text-xs h-8"
                        >
                          {isGettingLocation ? (
                            <Loader2 className="w-3 h-3 animate-spin" />
                          ) : (
                            <Navigation className="w-3 h-3" />
                          )}
                          Ambil Lokasi
                        </Button>
                        {coordinates && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={handleClearCoordinates}
                            className="gap-1.5 text-xs h-8 text-destructive"
                          >
                            <X className="w-3 h-3" />
                            Hapus
                          </Button>
                        )}
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <Input
                            placeholder="Latitude"
                            value={manualLat}
                            onChange={(e) => setManualLat(e.target.value)}
                            onBlur={handleManualCoordinates}
                            className="h-8 text-xs"
                          />
                        </div>
                        <div>
                          <Input
                            placeholder="Longitude"
                            value={manualLng}
                            onChange={(e) => setManualLng(e.target.value)}
                            onBlur={handleManualCoordinates}
                            className="h-8 text-xs"
                          />
                        </div>
                      </div>
                      {coordinates && (
                        <p className="text-[10px] text-muted-foreground flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {coordinates.latitude.toFixed(6)}, {coordinates.longitude.toFixed(6)}
                        </p>
                      )}
                    </div>
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
                <div className="flex items-center gap-2 sm:gap-3 mb-3">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-accent/20 flex items-center justify-center">
                    <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-accent" />
                  </div>
                  <div>
                    <CardTitle className="text-base sm:text-xl">Laporan Saya</CardTitle>
                    <CardDescription className="text-xs sm:text-sm">
                      {userReports.length} laporan ditemukan
                    </CardDescription>
                  </div>
                </div>
                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Cari laporan..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 h-9 text-sm"
                  />
                </div>
              </CardHeader>
              <CardContent className="p-4 sm:p-6 pt-0 sm:pt-0">
                {userReports.length === 0 ? (
                  <div className="text-center py-8 sm:py-12">
                    <FileText className="w-10 h-10 sm:w-12 sm:h-12 mx-auto text-muted-foreground/50 mb-3 sm:mb-4" />
                    <p className="text-sm sm:text-base text-muted-foreground">
                      {searchQuery ? 'Tidak ada laporan yang sesuai' : 'Belum ada laporan'}
                    </p>
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      {!searchQuery && 'Buat laporan pertama Anda!'}
                    </p>
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

// Komponen untuk menampilkan satu laporan
function ReportCard({ report }: { report: Report }) {
  return (
    <div className="p-3 rounded-lg border bg-card hover:shadow-card transition-shadow">
      {/* Header row */}
      <div className="flex items-start justify-between gap-2 mb-1.5">
        <h4 className="font-semibold text-sm text-foreground leading-tight line-clamp-2 flex-1">{report.title}</h4>
        <StatusBadge status={report.status} />
      </div>

      {/* Meta row */}
      <div className="flex flex-wrap items-center gap-1.5 mb-2 text-[10px] text-muted-foreground">
        <Badge variant="outline" className="text-[9px] gap-0.5 px-1.5 py-0">
          <Tag className="w-2.5 h-2.5" />
          {report.category || 'Lainnya'}
        </Badge>
        <span className="flex items-center gap-0.5">
          <Clock className="w-2.5 h-2.5" />
          {new Date(report.createdAt).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'short',
          })}
        </span>
        {report.coordinates && (
          <span className="flex items-center gap-0.5">
            <MapPin className="w-2.5 h-2.5" />
            Lokasi
          </span>
        )}
      </div>

      <p className="text-xs text-muted-foreground line-clamp-2 mb-2">{report.content}</p>

      {/* Image */}
      {report.imageUrl && (
        <div className="mb-2">
          <img 
            src={report.imageUrl} 
            alt="Foto laporan" 
            className="w-full h-24 sm:h-32 object-cover rounded-lg border"
          />
        </div>
      )}

      {/* Balasan Admin */}
      {report.adminReply && (
        <div className="mt-2 p-2 rounded-lg bg-primary/5 border border-primary/20">
          <div className="flex items-center gap-1 mb-1">
            <MessageCircle className="w-3 h-3 text-primary" />
            <span className="text-[10px] font-medium text-primary">Balasan Admin</span>
          </div>
          <p className="text-[11px] sm:text-xs text-foreground leading-relaxed">{report.adminReply}</p>
          {report.adminReplyAt && (
            <p className="text-[9px] text-muted-foreground mt-1">
              {new Date(report.adminReplyAt).toLocaleDateString('id-ID', {
                day: 'numeric',
                month: 'short',
              })}
            </p>
          )}
        </div>
      )}

      {/* Info Teknisi */}
      {report.assignedTo && (
        <div className="mt-2 p-2 rounded-lg bg-muted/50 border">
          <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
            <Wrench className="w-3 h-3" />
            <span>Ditangani oleh: <span className="font-medium text-foreground">{report.assignedToName}</span></span>
          </div>
        </div>
      )}

      {/* Balasan Teknisi */}
      {report.technicianReply && (
        <div className="mt-2 p-2 rounded-lg bg-accent/10 border border-accent/20">
          <div className="flex items-center gap-1 mb-1">
            <Wrench className="w-3 h-3 text-accent" />
            <span className="text-[10px] font-medium text-accent">Balasan Teknisi</span>
          </div>
          <p className="text-[11px] sm:text-xs text-foreground leading-relaxed">{report.technicianReply}</p>
          {report.technicianReplyAt && (
            <p className="text-[9px] text-muted-foreground mt-1">
              {new Date(report.technicianReplyAt).toLocaleDateString('id-ID', {
                day: 'numeric',
                month: 'short',
              })}
            </p>
          )}
        </div>
      )}
    </div>
  );
}