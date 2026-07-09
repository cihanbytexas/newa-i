import Link from "next/link";
import { ShieldCheck, AlertCircle, CheckCircle2 } from "lucide-react";
import { login, signup } from "./actions";

export default function LoginPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const isRegister = searchParams?.type === "register";
  const error = searchParams?.error as string;
  const message = searchParams?.message as string;

  return (
    <main className="min-h-screen flex items-center justify-center p-6 bg-background">
      <div className="w-full max-w-md bg-card border border-border rounded-2xl p-8 shadow-soft">
        
        {/* Başlık Alanı */}
        <div className="flex flex-col items-center mb-8">
          <Link href="/" className="flex items-center gap-2 mb-6">
            <ShieldCheck className="w-8 h-8 text-primary" />
            <span className="font-bold text-2xl tracking-tight">İşçiAğı.</span>
          </Link>
          <h1 className="text-2xl font-bold text-primary mb-2">
            {isRegister ? "Hesap Oluştur" : "Tekrar Hoş Geldiniz"}
          </h1>
          <p className="text-sm text-muted-foreground text-center">
            {isRegister 
              ? "Deneyimlerinizi paylaşmak için aramıza katılın." 
              : "Devam etmek için hesabınıza giriş yapın."}
          </p>
        </div>

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
        <form action={isRegister ? signup : login} className="flex flex-col gap-5">
          
          {isRegister && (
            <div className="flex gap-4">
              <div className="flex flex-col gap-2 w-full">
                <label htmlFor="firstName" className="text-sm font-semibold">Ad</label>
                <input 
                  type="text" 
                  id="firstName" 
                  name="firstName" 
                  required 
                  className="w-full bg-background border border-border rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  placeholder="Ahmet"
                />
              </div>
              <div className="flex flex-col gap-2 w-full">
                <label htmlFor="lastName" className="text-sm font-semibold">Soyad</label>
                <input 
                  type="text" 
                  id="lastName" 
                  name="lastName" 
                  required 
                  className="w-full bg-background border border-border rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  placeholder="Yılmaz"
                />
              </div>
            </div>
          )}

          <div className="flex flex-col gap-2">
            <label htmlFor="email" className="text-sm font-semibold">E-posta Adresi</label>
            <input 
              type="email" 
              id="email" 
              name="email" 
              required 
              className="w-full bg-background border border-border rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
              placeholder="ornek@posta.com"
            />
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center">
              <label htmlFor="password" className="text-sm font-semibold">Şifre</label>
              {!isRegister && (
                <Link href="/sifremi-unuttum" className="text-xs font-medium text-muted-foreground hover:text-primary transition-colors">
                  Şifremi Unuttum
                </Link>
              )}
            </div>
            <input 
              type="password" 
              id="password" 
              name="password" 
              required 
              className="w-full bg-background border border-border rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
              placeholder="••••••••"
            />
          </div>

          <button 
            type="submit" 
            className="w-full bg-primary text-primary-foreground font-semibold py-3 rounded-lg hover:bg-primary/90 transition-colors mt-2"
          >
            {isRegister ? "Kayıt Ol" : "Giriş Yap"}
          </button>
        </form>

        {/* Alt Bilgi ve Yönlendirme */}
        <div className="mt-8 text-center text-sm text-muted-foreground">
          {isRegister ? (
            <>
              Zaten bir hesabınız var mı?{" "}
              <Link href="/login" className="font-semibold text-primary hover:underline">
                Giriş Yapın
              </Link>
            </>
          ) : (
            <>
              Hesabınız yok mu?{" "}
              <Link href="/login?type=register" className="font-semibold text-primary hover:underline">
                Hesap Oluşturun
              </Link>
            </>
          )}
        </div>

      </div>
    </main>
  );
}
