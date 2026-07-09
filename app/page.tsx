import { createClient } from '@/utils/supabase/server';
import Link from 'next/link';
import { 
  Search, 
  MapPin, 
  Plus, 
  ShieldCheck, 
  Building2, 
  Briefcase, 
  ChevronRight 
} from "lucide-react";

export default async function Home({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) {
  const supabase = createClient();
  const searchQuery = searchParams?.q || '';

  // Kullanıcı giriş yapmış mı kontrol et (Sağ üst menü için)
  const { data: { user } } = await supabase.auth.getUser();

  // İşletmeleri veritabanından çek (Arama yapıldıysa filtrele)
  let query = supabase.from('businesses').select('*').order('created_at', { ascending: false });
  
  if (searchQuery) {
    // İşletme adına VEYA şehre göre arama yapar
    query = query.or(`name.ilike.%${searchQuery}%,city.ilike.%${searchQuery}%`);
  }

  const { data: businesses } = await query;

  return (
    <main className="max-w-4xl mx-auto px-6 py-10 md:py-16">
      
      {/* Navigasyon */}
      <nav className="flex justify-between items-center mb-16 md:mb-24 border-b border-border pb-6">
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

      {/* Hero Bölümü */}
      <header className="text-center mb-12 md:mb-16">
        <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-4 text-primary leading-tight">
          Şeffaf Çalışma Ortamı.
        </h1>
        <p className="text-muted-foreground text-sm md:text-lg max-w-lg mx-auto leading-relaxed">
          İş yerlerini inceleyin, çalışma şartlarını görün, isterseniz tamamen anonim kalarak deneyimlerinizi aktarın.
        </p>
      </header>

      {/* Arama ve Sekmeler Bölümü */}
      <section className="bg-card border border-border rounded-2xl p-6 md:p-8 shadow-soft hover:shadow-hover transition-shadow duration-300 mb-10">
        
        {/* Sekmeler */}
        <div className="flex flex-wrap gap-4 md:gap-6 border-b border-border mb-6 pb-4">
          <button className="flex items-center gap-2 text-sm font-semibold text-primary border-b-2 border-primary pb-4 -mb-[17px] relative z-10">
            <Search className="w-4 h-4" />
            Sistemde Ara
          </button>
          <button className="flex items-center gap-2 text-sm font-medium text-muted-foreground opacity-50 cursor-not-allowed pb-4" title="Yakında Eklenecek">
            <MapPin className="w-4 h-4" />
            Haritalarda Ara (Yakında)
          </button>
          <Link href="/add-business" className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors pb-4 ml-auto">
            <Plus className="w-4 h-4" />
            Manuel Ekle
          </Link>
        </div>

        {/* Arama Formu (Next.js server-side form) */}
        <form action="/" method="GET" className="relative flex items-center">
          <input 
            type="text" 
            name="q"
            defaultValue={searchQuery}
            placeholder="İşletme adı veya şehir (Örn: İstanbul) arayın..." 
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

      {/* İşletme Listesi (Arama Sonuçları) */}
      <section>
        <h2 className="text-lg font-bold text-primary mb-6 flex items-center gap-2">
          {searchQuery ? `"${searchQuery}" için Sonuçlar` : "Son Eklenen İşletmeler"}
          <span className="text-sm font-medium text-muted-foreground bg-muted px-2 py-0.5 rounded-md">
            {businesses?.length || 0}
          </span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {!businesses || businesses.length === 0 ? (
            <div className="col-span-1 md:col-span-2 bg-card border border-border border-dashed rounded-2xl p-10 text-center flex flex-col items-center">
              <Building2 className="w-10 h-10 text-muted-foreground mb-3 opacity-50" />
              <p className="text-primary font-medium mb-1">Aradığınız işletme bulunamadı.</p>
              <p className="text-sm text-muted-foreground mb-4">Sistemde olmayan bir işletmeyi hemen ekleyebilirsiniz.</p>
              <Link href="/add-business" className="text-sm font-semibold bg-primary text-primary-foreground px-5 py-2.5 rounded-lg hover:bg-primary/90 transition-colors">
                Yeni İşletme Ekle
              </Link>
            </div>
          ) : (
            businesses.map((business) => (
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
                    <span className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5" />
                      {business.city}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Briefcase className="w-3.5 h-3.5" />
                      {business.industry}
                    </span>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-muted-foreground opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all shrink-0 self-center" />
              </Link>
            ))
          )}
        </div>
      </section>
      
    </main>
  );
}
