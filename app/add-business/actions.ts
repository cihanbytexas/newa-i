'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'

export async function addBusiness(formData: FormData) {
  const supabase = createClient()
  
  // Güvenlik: Kullanıcının giriş yapıp yapmadığını kontrol et
  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) {
    return redirect('/login?error=İşletme eklemek için giriş yapmalısınız')
  }

  // Formdan gelen verileri al
  const name = formData.get('name') as string
  const city = formData.get('city') as string
  const industry = formData.get('industry') as string
  const address = formData.get('address') as string
  const phone = formData.get('phone') as string
  const website = formData.get('website') as string

  // Validasyon: Zorunlu alanlar doldurulmuş mu?
  if (!name || !city || !industry || !address) {
    return redirect('/add-business?error=Lütfen tüm zorunlu alanları doldurun')
  }

  // Veritabanına kayıt işlemi (RLS sayesinde sadece giriş yapanlar yazabilir)
  const { error } = await supabase
    .from('businesses')
    .insert([
      {
        name,
        city,
        industry,
        address,
        phone: phone || null,
        website: website || null,
        is_verified: false // Varsayılan olarak onaysız eklenir, admin onaylar
      }
    ])

  if (error) {
    console.error('İşletme ekleme hatası:', error.message)
    return redirect('/add-business?error=İşletme eklenirken bir sistem hatası oluştu. Lütfen tekrar deneyin.')
  }

  // İşlem başarılıysa ana sayfadaki önbelleği temizle ve başarı mesajıyla yönlendir
  revalidatePath('/', 'layout')
  redirect('/add-business?message=İşletme başarıyla eklendi! Teşekkür ederiz.')
}
