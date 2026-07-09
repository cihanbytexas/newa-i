import { Search, MapPin, Plus, ShieldCheck, ChevronRight } from "lucide-react";

export default function Home() {
  return (
    <main className="max-w-3xl mx-auto px-6 py-16">
      
      {/* Navigasyon (Basit Versiyon) */}
      <nav className="flex justify-between items-center mb-24 border-b border-border pb-6">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-6 h-6 text-primary" />
          <span className="font-bold text-xl tracking-tight">İşçiAğı.</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-xs font-semibold bg-muted text-muted-foreground px-3 py-1 rounded-full uppercase tracking-wider">
            BETA V2.0
          </span>
          <button className="text-sm font-semibold border border-border px-4 py-2 rounded-md hover:border-primary transition-colors">
            Giriş Yap
          </button>
        </div>
      </nav>

      {/* Hero Bölümü */}
      <header className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 text-primary">
          Şeffaf Çalışma Ortamı.
        </h1>
        <p className="text-muted-foreground text-base md:text-lg max-w-lg mx-auto leading-relaxed">
          İş yerlerini inceleyin, çalışma şartlarını görün, isterseniz tamamen anonim kalarak deneyimlerinizi aktarın.
        </p>
      </header>

      {/* Arama ve Sekmeler Bölümü */}
      <section className="bg-card border border-border rounded-2xl p-8 shadow-sm">
        
        {/* Sekmeler */}
        <div className="flex flex-wrap gap-6 border-b border-border mb-8 pb-4">
          <button className="flex items-center gap-2 text-sm font-semibold text-primary border-b-2 border-primary pb-4 -mb-[17px]">
            <Search className="w-4 h-4" />
            Sistemde Ara
          </button>
          <button className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors pb-4">
            <MapPin className="w-4 h-4" />
            Haritalarda Ara
          </button>
          <button className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors pb-4">
            <Plus className="w-4 h-4" />
            Manuel Ekle
          </button>
        </div>

        {/* Arama Kutusu */}
        <div className="relative flex items-center">
          <input 
            type="text" 
            placeholder="Sistemimizde kayıtlı iş yerlerini arayın..." 
            className="w-full bg-background border border-border rounded-xl py-4 pl-4 pr-12 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
          />
          <button className="absolute right-3 p-2 text-muted-foreground hover:text-primary transition-colors">
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

      </section>
      
    </main>
  );
}
