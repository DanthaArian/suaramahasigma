import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageSquare, User, Lock, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { ThemeToggle } from '@/components/ThemeToggle';

export function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Validasi input
    if (!username.trim() || !password.trim()) {
      setError('Username dan password harus diisi!');
      setIsLoading(false);
      return;
    }

    // Simulasi delay untuk UX
    await new Promise((resolve) => setTimeout(resolve, 500));

    const result = login(username, password);
    
    if (result.success) {
      toast.success(result.message);
    } else {
      setError(result.message);
    }
    
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen gradient-hero flex items-center justify-center p-3 sm:p-4 relative">
      {/* Theme Toggle */}
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      
      <div className="w-full max-w-md animate-slide-up">
        {/* Logo dan Header */}
        <div className="text-center mb-6 sm:mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl gradient-primary shadow-elevated mb-3 sm:mb-4">
            <MessageSquare className="w-6 h-6 sm:w-8 sm:h-8 text-primary-foreground" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Suara Mahasiswa</h1>
          <p className="text-sm sm:text-base text-muted-foreground mt-1 sm:mt-2">Portal aspirasi dan laporan mahasiswa</p>
        </div>

        {/* Card Login */}
        <Card className="shadow-elevated border-0">
          <CardHeader className="space-y-1 pb-3 sm:pb-4 px-4 sm:px-6">
            <CardTitle className="text-xl sm:text-2xl font-semibold text-center">Masuk</CardTitle>
            <CardDescription className="text-center text-xs sm:text-sm">
              Masukkan kredensial Anda untuk melanjutkan
            </CardDescription>
          </CardHeader>
          <CardContent className="px-4 sm:px-6">
            <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
              {/* Error Message */}
              {error && (
                <div className="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 text-destructive text-sm animate-scale-in">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* Username Field */}
              <div className="space-y-2">
                <Label htmlFor="username" className="text-sm font-medium">
                  Username
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="username"
                    type="text"
                    placeholder="Masukkan username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="pl-10 h-11"
                    autoComplete="username"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium">
                  Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="Masukkan password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 h-11"
                    autoComplete="current-password"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full h-11 gradient-primary font-semibold text-primary-foreground hover:opacity-90 transition-opacity"
                disabled={isLoading}
              >
                {isLoading ? 'Memproses...' : 'Masuk'}
              </Button>
            </form>

            {/* Demo Credentials */}
            <div className="mt-4 sm:mt-6 p-3 sm:p-4 rounded-lg bg-muted/50">
              <p className="text-xs font-medium text-muted-foreground mb-1.5 sm:mb-2">Demo Akun:</p>
              <div className="space-y-0.5 sm:space-y-1 text-xs text-muted-foreground">
                <p><span className="font-medium text-foreground">User:</span> user1 / user123</p>
                <p><span className="font-medium text-foreground">Admin:</span> admin / admin123</p>
                <p><span className="font-medium text-foreground">Teknisi:</span> teknisi1 / teknisi123</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <p className="text-center text-xs sm:text-sm text-muted-foreground mt-4 sm:mt-6">
          © 2024 Suara Mahasiswa. Semua hak dilindungi.
        </p>
      </div>
    </div>
  );
}
