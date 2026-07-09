import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import Link from 'next/link';
import { 
  ShieldCheck, 
  LogOut, 
  User, 
  MapPin, 
  Briefcase, 
  MessageSquare, 
  Bookmark, 
  Award 
} from 'lucide-react';

export default async function DashboardPage() {
  // Supabase sunucu bağlantısını oluştur
  const supabase = createClient();
  
  // 1. Kullanıcı oturumunu güvenli bir şekilde kontrol et
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  // Oturum yoksa veya hata varsa login sayfasına şutla
  if (authError || !user) {
    redirect('/login');
  }

  // 2. Kullanıcı profil verilerini veritabanından çek
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  // 3. Çıkış Yapma İşlemi (Server Action)
  const signOut = async () => {
    'use server';
    const supabaseClient = createClient();
    await supabaseClient.auth.signOut();
    revalidatePath('/', 'layout');
    redirect('/login');
  };

  return (
    <main className="min-h-screen bg-background pb-16">
      
      {/* Üst Navigasyon */}
      <nav className="bg-card border-b border-border sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-primary" />
            <span className="font-bold text-lg tracking-tight">İşçiAğı.</span>
          </Link>
          
          <form action={signOut}>
            <button 
              type="submit" 
              className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-destructive transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Çıkış Yap
            </button>
          </form>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-6 mt-10 grid grid-cols-1 md:grid-cols-12 gap-8">
        
        {/* Sol Kolon - Profil Kartı */}
        <div className="md:col-span-4 flex flex-col gap-6">
          <div className="bg-card border border-border rounded-2xl p-6 shadow-soft">
            <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mb-4">
              {profile?.avatar_url ? (
                <img src={profile.avatar_url} alt="Profil" className="w-full h-full rounded-full object-cover" />
              ) : (
                <User className="w-10 h-10 text-muted-foreground" />
              )}
            </div>
            <h2 className="text-xl font-bold text-primary mb-1">
              {profile?.first_name} {profile?.last_name}
            </h2>
            <p className="text-sm text-muted-foreground mb-6">
              @{profile?.username || `user_${user.id.substring(0, 6)}`}
            </p>

            <div className="flex flex-col gap-3 text-sm">
              <div className="flex items-center gap-3 text-muted-foreground">
                <Briefcase className="w-4 h-4" />
                <span>{profile?.job_title || "Meslek belirtilmedi"}</span>
              </div>
              <div className="flex items-center gap-3 text-muted-foreground">
                <MapPin className="w-4 h-4" />
                <span>{profile?.city || "Şehir belirtilmedi"}</span>
              </div>
            </div>

            <button className="w-full mt-6 bg-secondary text-secondary-foreground font-semibold py-2.5 rounded-lg text-sm hover:bg-secondary/80 transition-colors">
              Profili Düzenle
            </button>
          </div>
        </div>

        {/* Sağ Kolon - İstatistikler ve İçerik */}
        <div className="md:col-span-8 flex flex-col gap-6">
          
          {/* İstatistik Row'u */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-card border border-border rounded-2xl p-5 shadow-soft flex flex-col items-center justify-center text-center">
              <MessageSquare className="w-6 h-6 text-primary mb-2" />
              <span className="text-2xl font-bold text-primary">0</span>
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider mt-1">Yorum</span>
            </div>
            <div className="bg-card border border-border rounded-2xl p-5 shadow-soft flex flex-col items-center justify-center text-center">
              <Bookmark className="w-6 h-6 text-primary mb-2" />
              <span className="text-2xl font-bold text-primary">0</span>
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider mt-1">Kaydedilen</span>
            </div>
            <div className="bg-card border border-border rounded-2xl p-5 shadow-soft flex flex-col items-center justify-center text-center">
              <Award className="w-6 h-6 text-primary mb-2" />
              <span className="text-2xl font-bold text-primary">0</span>
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider mt-1">Rozet</span>
            </div>
          </div>

          {/* Son Aktiviteler */}
          <div className="bg-card border border-border rounded-2xl p-6 shadow-soft min-h-[300px]">
            <h3 className="text-lg font-bold text-primary mb-6 border-b border-border pb-4">
              Son Değerlendirmeleriniz
            </h3>
            
            <div className="flex flex-col items-center justify-center h-48 text-center">
              <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center mb-4">
                <MessageSquare className="w-5 h-5 text-muted-foreground" />
              </div>
              <p className="text-sm font-medium text-primary mb-1">Henüz bir yorum yapmadınız.</p>
              <p className="text-xs text-muted-foreground max-w-[250px]">
                Çalıştığınız veya mülakatına girdiğiniz işletmeleri değerlendirerek diğer işçilere referans olabilirsiniz.
              </p>
              <Link href="/" className="mt-4 text-sm font-semibold text-primary border-b border-primary pb-0.5 hover:opacity-70 transition-opacity">
                İşletme Ara
              </Link>
            </div>
          </div>

        </div>

      </div>
    </main>
  );
}
