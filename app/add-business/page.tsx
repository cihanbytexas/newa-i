import Link from "next/link";
import { 
  ShieldCheck, 
  AlertCircle, 
  CheckCircle2, 
  Building2, 
  MapPin, 
  Briefcase, 
  Phone, 
  Globe,
  ChevronLeft
} from "lucide-react";
import { addBusiness } from "./actions";

export default function AddBusinessPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const error = searchParams?.error as string;
  const message = searchParams?.message as string;

  return (
    <main className="min-h-screen bg-background py-10 px-6">
      <div className="max-w-2xl mx-auto">
        
        {/* Üst Navigasyon / Geri Dönüş */}
        <Link href="/" className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors mb-8">
          <ChevronLeft className="w-4 h-4" />
          Ana Sayfaya Dön
        </Link>

        <div className="bg-card border border-border rounded-2xl p-8 shadow-soft">
          
          {/* Başlık */}
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2.5 bg-primary/5 rounded-xl">
              <Building2 className="w-6 h-6 text-primary" />
            </div>
            <h1 className="text-2xl font-bold text-primary tracking-tight">Yeni İşletme Ekle</h1>
          </div>
          <p className="text-sm text-muted-foreground mb-8">
            Sistemde veya haritalarda bulamadığınız işletmeleri manuel olarak ekleyerek diğer işçilerin deneyimlerini paylaşmasına yardımcı olun.
          </p>

          {/* Uyarı Mesajları */}
          {error && (
            <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-lg flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
              <p className="text-sm text-destructive">{error}</p>
            </div>
          )}
          
          {message && (
            <div className="mb-6 p-4 bg-green-500/10 border border-green-500/20 rounded-lg flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
              <p className="text-sm text-green-600">{message}</p>
            </div>
          )}

          {/* Form */}
          <form action={addBusiness} className="flex flex-col gap-6">
            
            {/* İşletme Adı */}
            <div className="flex flex-col gap-2">
              <label htmlFor="name" className="text-sm font-semibold flex items-center gap-2">
                İşletme Adı <span className="text-destructive">*</span>
              </label>
              <input 
                type="text" 
                id="name" 
                name="name" 
                required 
                className="w-full bg-background border border-border rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                placeholder="Örn: Özkanlar Tekstil Sanayi"
              />
            </div>

            {/* Şehir ve Sektör */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-2">
                <label htmlFor="city" className="text-sm font-semibold flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                  Şehir <span className="text-destructive">*</span>
                </label>
                <input 
                  type="text" 
                  id="city" 
                  name="city" 
                  required 
                  className="w-full bg-background border border-border rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  placeholder="Örn: İstanbul"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="industry" className="text-sm font-semibold flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-muted-foreground" />
                  Sektör <span className="text-destructive">*</span>
                </label>
                <input 
                  type="text" 
                  id="industry" 
                  name="industry" 
                  required 
                  className="w-full bg-background border border-border rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  placeholder="Örn: Tekstil / Üretim"
                />
              </div>
            </div>

            {/* Açık Adres */}
            <div className="flex flex-col gap-2">
              <label htmlFor="address" className="text-sm font-semibold flex items-center gap-2">
                Açık Adres <span className="text-destructive">*</span>
              </label>
              <textarea 
                id="address" 
                name="address" 
                required 
                rows={3}
                className="w-full bg-background border border-border rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all resize-none"
                placeholder="İşletmenin tam adresini yazın..."
              ></textarea>
            </div>

            {/* İletişim Bilgileri (İsteğe Bağlı) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-border">
              <div className="flex flex-col gap-2">
                <label htmlFor="phone" className="text-sm font-semibold flex items-center gap-2 text-muted-foreground">
                  <Phone className="w-4 h-4" />
                  Telefon (İsteğe Bağlı)
                </label>
                <input 
                  type="tel" 
                  id="phone" 
                  name="phone" 
                  className="w-full bg-background border border-border rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  placeholder="0212 000 00 00"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="website" className="text-sm font-semibold flex items-center gap-2 text-muted-foreground">
                  <Globe className="w-4 h-4" />
                  Web Sitesi (İsteğe Bağlı)
                </label>
                <input 
                  type="url" 
                  id="website" 
                  name="website" 
                  className="w-full bg-background border border-border rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  placeholder="https://www.ornek.com"
                />
              </div>
            </div>

            {/* Gönder Butonu */}
            <button 
              type="submit" 
              className="w-full bg-primary text-primary-foreground font-semibold py-3.5 rounded-lg hover:bg-primary/90 transition-colors mt-4 flex justify-center items-center gap-2"
            >
              <ShieldCheck className="w-5 h-5" />
              Sisteme Ekle
            </button>
            <p className="text-xs text-center text-muted-foreground mt-1">
              Eklenen işletmeler admin onayından geçtikten sonra herkese açık olarak listelenir.
            </p>

          </form>
        </div>
      </div>
    </main>
  );
}
