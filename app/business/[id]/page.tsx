import { createClient } from '@/utils/supabase/server';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { 
  Building2, 
  MapPin, 
  Briefcase, 
  ChevronLeft, 
  ThumbsUp, 
  ThumbsDown, 
  CheckCircle2, 
  AlertCircle, 
  User, 
  ShieldCheck,
  Calendar
} from 'lucide-react';
import { submitReview } from './actions';

export default async function BusinessDetailPage({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const supabase = createClient();
  const error = searchParams?.error as string;
  const message = searchParams?.message as string;

  // 1. İşletme bilgilerini çek
  const { data: business, error: businessError } = await supabase
    .from('businesses')
    .select('*')
    .eq('id', params.id)
    .single();

  if (businessError || !business) {
    notFound(); // Eğer ID yanlışsa veya işletme yoksa 404 sayfasına yönlendirir
  }

  // 2. Yorumları ve yorumu yapan kullanıcıların profil bilgilerini çek
  const { data: reviews } = await supabase
    .from('reviews')
    .select(`
      *,
      profiles (
        first_name,
        last_name,
        avatar_url
      )
    `)
    .eq('business_id', params.id)
    .order('created_at', { ascending: false });

  // 3. Kullanıcı oturum durumunu kontrol et (Yorum yapma formunu göstermek için)
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <main className="min-h-screen bg-background pb-16">
      
      {/* Üst Navigasyon */}
      <nav className="bg-card border-b border-border sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-primary" />
            <span className="font-bold text-lg tracking-tight">İşçiAğı.</span>
          </Link>
          {user ? (
            <Link href="/dashboard" className="text-sm font-semibold text-primary hover:opacity-80">
              Profilim
            </Link>
          ) : (
            <Link href="/login" className="text-sm font-semibold border border-border px-4 py-2 rounded-md hover:border-primary transition-colors">
              Giriş Yap
            </Link>
          )}
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-6 mt-8">
        
        <Link href="/" className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors mb-6">
          <ChevronLeft className="w-4 h-4" />
          Aramaya Dön
        </Link>

        {/* İşletme Başlık Kartı */}
        <div className="bg-card border border-border rounded-2xl p-8 shadow-soft mb-8">
          <div className="flex items-start gap-5">
            <div className="p-4 bg-primary/5 rounded-2xl hidden sm:block">
              <Building2 className="w-10 h-10 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-primary mb-2">
                {business.name}
              </h1>
              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4" />
                  {business.city}
                </span>
                <span className="flex items-center gap-1.5">
                  <Briefcase className="w-4 h-4" />
                  {business.industry}
                </span>
                {!business.is_verified && (
                  <span className="bg-muted text-xs font-semibold px-2.5 py-1 rounded-md uppercase tracking-wider">
                    Onay Bekliyor
                  </span>
                )}
              </div>
              <p className="mt-4 text-sm text-foreground/80 max-w-3xl leading-relaxed">
                {business.address}
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Sol Kolon - Yorum Yapma Formu */}
          <div className="lg:col-span-5">
            <div className="bg-card border border-border rounded-2xl p-6 shadow-soft sticky top-24">
              <h2 className="text-lg font-bold text-primary mb-4">Deneyiminizi Aktarın</h2>
              
              {!user ? (
                <div className="flex flex-col items-center justify-center py-8 text-center bg-muted/30 rounded-xl border border-dashed border-border">
                  <ShieldCheck className="w-10 h-10 text-muted-foreground mb-3" />
                  <h3 className="font-semibold text-primary mb-1">Giriş Yapmanız Gerekiyor</h3>
                  <p className="text-xs text-muted-foreground mb-4 max-w-[250px]">
                    Bu işletmeyi değerlendirmek ve diğer işçilere referans olmak için lütfen giriş yapın.
                  </p>
                  <Link href="/login" className="bg-primary text-primary-foreground font-semibold px-6 py-2 rounded-lg text-sm hover:bg-primary/90 transition-colors">
                    Giriş Yap
                  </Link>
                </div>
              ) : (
                <form action={submitReview} className="flex flex-col gap-5">
                  <input type="hidden" name="businessId" value={business.id} />
                  
                  {/* Uyarılar */}
                  {error && (
                    <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 text-destructive shrink-0 mt-0.5" />
                      <p className="text-xs text-destructive font-medium">{error}</p>
                    </div>
                  )}
                  {message && (
                    <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-lg flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0 mt-0.5" />
                      <p className="text-xs text-green-600 font-medium">{message}</p>
                    </div>
                  )}

                  {/* Genel Değerlendirme (Radyo Butonlar) */}
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold">Bu iş yerini öneriyor musunuz? <span className="text-destructive">*</span></label>
                    <div className="grid grid-cols-2 gap-3">
                      <label className="cursor-pointer">
                        <input type="radio" name="rating" value="recommend" className="peer sr-only" required />
                        <div className="flex items-center justify-center gap-2 p-3 border border-border rounded-xl peer-checked:border-green-500 peer-checked:bg-green-500/10 peer-checked:text-green-600 transition-all text-sm font-medium text-muted-foreground">
                          <ThumbsUp className="w-4 h-4" /> Öneriyorum
                        </div>
                      </label>
                      <label className="cursor-pointer">
                        <input type="radio" name="rating" value="not-recommend" className="peer sr-only" required />
                        <div className="flex items-center justify-center gap-2 p-3 border border-border rounded-xl peer-checked:border-destructive peer-checked:bg-destructive/10 peer-checked:text-destructive transition-all text-sm font-medium text-muted-foreground">
                          <ThumbsDown className="w-4 h-4" /> Önermiyorum
                        </div>
                      </label>
                    </div>
                  </div>

                  {/* Çalışma Şartları Checkbox'ları */}
                  <div className="flex flex-col gap-3 py-3 border-y border-border">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input type="checkbox" name="salaryOnTime" className="w-4 h-4 accent-primary rounded cursor-pointer" />
                      <span className="text-sm text-foreground">Maaşlar zamanında yatıyor mu?</span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input type="checkbox" name="overtimePaid" className="w-4 h-4 accent-primary rounded cursor-pointer" />
                      <span className="text-sm text-foreground">Fazla mesai ücreti ödeniyor mu?</span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input type="checkbox" name="insuranceDayOne" className="w-4 h-4 accent-primary rounded cursor-pointer" />
                      <span className="text-sm text-foreground">Sigorta ilk günden başladı mı?</span>
                    </label>
                  </div>

                  {/* Yorum İçeriği */}
                  <div className="flex flex-col gap-2">
                    <label htmlFor="content" className="text-sm font-semibold">Detaylı Değerlendirmeniz <span className="text-destructive">*</span></label>
                    <textarea 
                      id="content" 
                      name="content" 
                      required 
                      rows={4}
                      className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all resize-none"
                      placeholder="Maaş, yöneticilerin tutumu, mola hakları vb. konulardaki deneyimlerinizi aktarın..."
                    ></textarea>
                  </div>

                  {/* Anonimlik ve Submit */}
                  <div className="flex items-center justify-between pt-2">
                    <label className="flex items-center gap-2 cursor-pointer group">
                      <div className="relative flex items-center justify-center w-10 h-5 bg-muted rounded-full transition-colors group-hover:bg-muted/80">
                        <input type="checkbox" name="isAnonymous" className="peer sr-only" />
                        <div className="absolute left-1 w-3.5 h-3.5 bg-white rounded-full transition-all peer-checked:translate-x-4 peer-checked:bg-primary shadow-sm"></div>
                      </div>
                      <span className="text-xs font-semibold text-muted-foreground group-hover:text-foreground transition-colors">Gizli Kimlik</span>
                    </label>
                    
                    <button type="submit" className="bg-primary text-primary-foreground font-semibold px-6 py-2.5 rounded-lg text-sm hover:bg-primary/90 transition-colors flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4" /> Gönder
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>

          {/* Sağ Kolon - Yorumlar Akışı */}
          <div className="lg:col-span-7 flex flex-col gap-5">
            <h2 className="text-lg font-bold text-primary mb-1 flex items-center gap-2">
              <User className="w-5 h-5 text-muted-foreground" />
              Çalışan Değerlendirmeleri <span className="text-sm font-medium text-muted-foreground">({reviews?.length || 0})</span>
            </h2>
            
            {!reviews || reviews.length === 0 ? (
              <div className="bg-card border border-border rounded-2xl p-8 shadow-soft text-center">
                <p className="text-primary font-medium mb-1">Henüz yorum yapılmamış.</p>
                <p className="text-sm text-muted-foreground">İlk değerlendirmeyi siz yaparak diğer işçilere yol gösterin.</p>
              </div>
            ) : (
              reviews.map((review) => (
                <div key={review.id} className="bg-card border border-border rounded-2xl p-6 shadow-soft">
                  
                  {/* Yorum Başlığı (Kullanıcı Bilgisi ve Tarih) */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center overflow-hidden">
                        {review.is_anonymous ? (
                          <ShieldCheck className="w-5 h-5 text-muted-foreground" />
                        ) : review.profiles?.avatar_url ? (
                          <img src={review.profiles.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
                        ) : (
                          <User className="w-5 h-5 text-muted-foreground" />
                        )}
                      </div>
                      <div>
                        <p className="font-semibold text-sm text-primary">
                          {review.is_anonymous ? "Gizli Kullanıcı" : `${review.profiles?.first_name} ${review.profiles?.last_name}`}
                        </p>
                        <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                          <Calendar className="w-3 h-3" />
                          {new Date(review.created_at).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })}
                        </p>
                      </div>
                    </div>
                    
                    {/* Rating Badge */}
                    <div className={`px-3 py-1 rounded-full flex items-center gap-1.5 text-xs font-bold ${
                      review.rating === 'recommend' 
                        ? 'bg-green-500/10 text-green-600' 
                        : 'bg-destructive/10 text-destructive'
                    }`}>
                      {review.rating === 'recommend' ? <ThumbsUp className="w-3.5 h-3.5" /> : <ThumbsDown className="w-3.5 h-3.5" />}
                      {review.rating === 'recommend' ? 'Öneriyor' : 'Önermiyor'}
                    </div>
                  </div>

                  {/* Yorum İçeriği */}
                  <p className="text-sm text-foreground/90 leading-relaxed mb-4 whitespace-pre-line">
                    {review.content}
                  </p>

                  {/* Çalışma Şartları Etiketleri */}
                  <div className="flex flex-wrap gap-2 pt-4 border-t border-border">
                    {review.salary_on_time !== null && (
                      <span className={`text-xs px-2.5 py-1 rounded-md border font-medium ${review.salary_on_time ? 'bg-green-500/5 border-green-500/20 text-green-600' : 'bg-destructive/5 border-destructive/20 text-destructive'}`}>
                        Maaş: {review.salary_on_time ? 'Zamanında' : 'Gecikmeli'}
                      </span>
                    )}
                    {review.overtime_paid !== null && (
                      <span className={`text-xs px-2.5 py-1 rounded-md border font-medium ${review.overtime_paid ? 'bg-green-500/5 border-green-500/20 text-green-600' : 'bg-destructive/5 border-destructive/20 text-destructive'}`}>
                        Mesai: {review.overtime_paid ? 'Ödeniyor' : 'Ödenmiyor'}
                      </span>
                    )}
                    {review.insurance_day_one !== null && (
                      <span className={`text-xs px-2.5 py-1 rounded-md border font-medium ${review.insurance_day_one ? 'bg-green-500/5 border-green-500/20 text-green-600' : 'bg-destructive/5 border-destructive/20 text-destructive'}`}>
                        Sigorta: {review.insurance_day_one ? 'İlk Günden' : 'Gecikmeli'}
                      </span>
                    )}
                  </div>

                </div>
              ))
            )}
          </div>

        </div>
      </div>
    </main>
  );
}
