import { createClient } from '@/utils/supabase/server';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { 
  Search, 
  MapPin, 
  Plus, 
  ShieldCheck, 
  Building2, 
  Briefcase, 
  ChevronRight,
  AlertCircle,
  Globe
} from "lucide-react";

export default async function Home({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) {
  const supabase = createClient();
  const searchQuery = searchParams?.q || '';
  const activeTab = searchParams?.tab || 'system';
  const error = searchParams?.error;

  // Kullanıcı oturumu kontrolü
  const { data: { user } } = await supabase.auth.getUser();

  let systemBusinesses: any[] = [];
  let googlePlaces: any[] = [];
  
  // Vercel panelinden eklenecek olan Google Haritalar API Anahtarı
  const googleApiKey = process.env.GOOGLE_MAPS_API_KEY;

  // 1. Sekmeye Göre Veri Çekme İşlemleri
  if (activeTab === 'system') {
    let query = supabase.from('businesses').select('*').order('created_at', { ascending: false });
    if (searchQuery) {
      query = query.or(`name.ilike.%${searchQuery}%,city.ilike.%${searchQuery}%`);
    }
    const { data } = await query;
    systemBusinesses = data || [];
  } else if (activeTab === 'google' && searchQuery && googleApiKey) {
    try {
      const res = await fetch(
        `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(searchQuery)}&language=tr&key=${googleApiKey}`,
        { next: { revalidate: 3600 } } // Sonuçları 1 saat boyunca Vercel Edge Cache'de tutar (Maliyet düşürür)
      );
      const data = await res.json();
      googlePlaces = data.results || [];
    } catch (e) {
      console.error("Google API Hatası", e);
    }
  }

  // 2. SERVER ACTION: Google'dan gelen işletmeyi veritabanına aktar ve sayfasına git
  async function importGooglePlace(formData: FormData) {
    'use server';
    const placeId = formData.get('placeId') as string;
    const name = formData.get('name') as string;
    const address = formData.get('address') as string;

    if (!placeId || !name) return redirect('/?error=Geçersiz Google İşletmesi');

    const sb = createClient();

    // 2.1 İşletme zaten veritabanımızda var mı? (Gereksiz tekrarı önle)
    const { data: existing } = await sb.from('businesses').select('id').eq('google_place_id', placeId).single();
    
    if (existing) {
      redirect(`/business/${existing.id}`);
    }

    // 2.2 Yoksa yeni işletme olarak Supabase'e ekle
    // Adres metninden tahmini şehri çıkartır (Örn: "Bağcılar/İstanbul" -> "İstanbul")
    const addressParts = address.split(',');
    const possibleCity = addressParts.length > 1 ? addressParts[addressParts.length - 2].trim() : 'Bilinmiyor';

    const { data: newBusiness, error: insertError } = await sb.from('businesses').insert([{
      google_place_id: placeId,
      name: name,
      address: address,
      city: possibleCity,
      industry: 'Genel',
      is_verified: false
    }]).select('id').single();

    if (insertError || !newBusiness) {
      redirect('/?error=Sisteme kaydedilirken hata oluştu');
    }

    redirect(`/business/${newBusiness.id}`);
  }

  return (
    <main className="max-w-4xl mx-auto px-6 py-10 md:py-16">
      
      {/* Navigasyon */}
      <nav className="flex justify-between items-center mb-12 md:mb-20 border-b border-border pb-6">
        <Link href="/" className="flex items-center gap-2 group">
          <ShieldCheck className="w-6 h-6 text-primary group-hover:scale-110 transition-transform" />
          <span className="font-bold text-xl tracking-tight">İşçiAğı.</span>
        </Link>
        <div className="flex items-center gap-4">
          <span className="hidden md:inline-block text-xs font-semibold bg-muted text-muted-foreground px-3 py-1 rounded-full uppercase tracking-wider">
            BETA V2.0
          </span>
          {user ? (
            <Link href="/dashboard" className="text-sm font-semibold border border-border px-4 py-2 rounded-md hover:border-primary transition-colors">
              Profilim
            </Link>
          ) : (
            <Link href="/login" className="text-sm font-semibold border border-border px-4 py-2 rounded-md hover:border-primary transition-colors">
              Giriş Yap
            </Link>
          )}
        </div>
      </nav>

      {/* Hata Uyarıları */}
      {error && (
        <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-lg flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
          <p className="text-sm text-destructive">{error}</p>
        </div>
      )}

      {/* Hero Bölümü */}
      <header className="text-center mb-10 md:mb-14">
        <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-4 text-primary leading-tight">
          Şeffaf Çalışma Ortamı.
        </h1>
        <p className="text-muted-foreground text-sm md:text-lg max-w-lg mx-auto leading-relaxed">
          İş yerlerini inceleyin, çalışma şartlarını görün, isterseniz tamamen anonim kalarak deneyimlerinizi aktarın.
        </p>
      </header>

      {/* Arama ve Sekmeler Bölümü */}
      <section className="bg-card border border-border rounded-2xl p-6 md:p-8 shadow-soft hover:shadow-hover transition-shadow duration-300 mb-10">
        
        {/* URL Parametresi ile Dinamik Sekmeler */}
        <div className="flex flex-wrap gap-4 md:gap-6 border-b border-border mb-6 pb-4">
          <Link 
            href={`/?tab=system${searchQuery ? `&q=${searchQuery}` : ''}`}
            className={`flex items-center gap-2 text-sm font-semibold pb-4 -mb-[17px] relative z-10 ${
              activeTab === 'system' ? 'text-primary border-b-2 border-primary' : 'text-muted-foreground hover:text-primary transition-colors'
            }`}
          >
            <Search className="w-4 h-4" />
            Sistemde Ara
          </Link>
          <Link 
            href={`/?tab=google${searchQuery ? `&q=${searchQuery}` : ''}`}
            className={`flex items-center gap-2 text-sm font-semibold pb-4 -mb-[17px] relative z-10 ${
              activeTab === 'google' ? 'text-primary border-b-2 border-primary' : 'text-muted-foreground hover:text-primary transition-colors'
            }`}
          >
            <Globe className="w-4 h-4" />
            Haritalarda Ara
          </Link>
          <Link href="/add-business" className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors pb-4 ml-auto">
            <Plus className="w-4 h-4" />
            Manuel Ekle
          </Link>
        </div>

        {/* Arama Formu */}
        <form action="/" method="GET" className="relative flex items-center">
          <input type="hidden" name="tab" value={activeTab} />
          <input 
            type="text" 
            name="q"
            defaultValue={searchQuery}
            placeholder={activeTab === 'system' ? "Sistemde kayıtlı işletme adı veya şehir arayın..." : "Google Haritalar üzerinde arayın (Örn: Özkanlar Tekstil)"} 
            className="w-full bg-background border border-border rounded-xl py-4 pl-4 pr-14 text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
            autoComplete="off"
          />
          <button 
            type="submit"
            className="absolute right-2 bg-primary text-primary-foreground p-2.5 rounded-lg hover:bg-primary/90 transition-colors"
            aria-label="Ara"
          >
            <Search className="w-4 h-4" />
          </button>
        </form>
      </section>

      {/* Arama Sonuçları Listesi */}
      <section>
        <h2 className="text-lg font-bold text-primary mb-6 flex items-center gap-2">
          {searchQuery ? `"${searchQuery}" için Sonuçlar` : (activeTab === 'system' ? "Son Eklenen İşletmeler" : "Harita Sonuçları")}
          <span className="text-sm font-medium text-muted-foreground bg-muted px-2 py-0.5 rounded-md">
            {activeTab === 'system' ? systemBusinesses.length : googlePlaces.length}
          </span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* DURUM 1: SİSTEM ARAMASI */}
          {activeTab === 'system' && (
            systemBusinesses.length === 0 ? (
              <div className="col-span-1 md:col-span-2 bg-card border border-border border-dashed rounded-2xl p-10 text-center flex flex-col items-center">
                <Building2 className="w-10 h-10 text-muted-foreground mb-3 opacity-50" />
                <p className="text-primary font-medium mb-1">Sistemimizde bulunamadı.</p>
                <p className="text-sm text-muted-foreground mb-4">Üstteki sekmeden 'Haritalarda Ara' seçeneğini kullanabilirsiniz.</p>
              </div>
            ) : (
              systemBusinesses.map((business) => (
                <Link 
                  href={`/business/${business.id}`} 
                  key={business.id}
                  className="group bg-card border border-border rounded-2xl p-5 shadow-sm hover:shadow-md hover:border-primary/30 transition-all flex items-start gap-4"
                >
                  <div className="p-3 bg-primary/5 rounded-xl group-hover:bg-primary/10 transition-colors shrink-0">
                    <Building2 className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-1">
                      <h3 className="font-bold text-primary truncate pr-2 group-hover:text-primary transition-colors">
                        {business.name}
                      </h3>
                    </div>
                    <div className="flex flex-col gap-1 mt-2 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" />{business.city}</span>
                      <span className="flex items-center gap-1.5"><Briefcase className="w-3.5 h-3.5" />{business.industry}</span>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-muted-foreground opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all shrink-0 self-center" />
                </Link>
              ))
            )
          )}

          {/* DURUM 2: GOOGLE MAPS ARAMASI */}
          {activeTab === 'google' && (
            !googleApiKey ? (
              <div className="col-span-1 md:col-span-2 bg-muted/50 border border-border rounded-2xl p-8 text-center flex flex-col items-center">
                <AlertCircle className="w-10 h-10 text-muted-foreground mb-3" />
                <p className="text-primary font-medium mb-1">Haritalar API Henüz Yapılandırılmadı</p>
                <p className="text-sm text-muted-foreground">
                  Projenin Vercel paneline (Environment Variables) kısmına <strong>GOOGLE_MAPS_API_KEY</strong> eklendiğinde bu özellik aktif olacaktır.
                </p>
              </div>
            ) : googlePlaces.length === 0 && searchQuery ? (
              <div className="col-span-1 md:col-span-2 bg-card border border-border border-dashed rounded-2xl p-10 text-center flex flex-col items-center">
                <Globe className="w-10 h-10 text-muted-foreground mb-3 opacity-50" />
                <p className="text-primary font-medium mb-1">Google Haritalarda bulunamadı.</p>
                <p className="text-sm text-muted-foreground">İşletmeyi 'Manuel Ekle' butonunu kullanarak sisteme dahil edebilirsiniz.</p>
              </div>
            ) : (
              googlePlaces.map((place) => (
                <form action={importGooglePlace} key={place.place_id} className="w-full">
                  <input type="hidden" name="placeId" value={place.place_id} />
                  <input type="hidden" name="name" value={place.name} />
                  <input type="hidden" name="address" value={place.formatted_address} />
                  
                  <button type="submit" className="w-full text-left group bg-card border border-border rounded-2xl p-5 shadow-sm hover:shadow-md hover:border-primary/30 transition-all flex items-start gap-4">
                    <div className="p-3 bg-muted rounded-xl group-hover:bg-primary/5 transition-colors shrink-0">
                      <Globe className="w-6 h-6 text-muted-foreground group-hover:text-primary transition-colors" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-primary truncate pr-2 group-hover:text-primary transition-colors">
                        {place.name}
                      </h3>
                      <p className="mt-2 text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                        {place.formatted_address}
                      </p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-muted-foreground opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all shrink-0 self-center" />
                  </button>
                </form>
              ))
            )
          )}

        </div>
      </section>
      
    </main>
  );
}
