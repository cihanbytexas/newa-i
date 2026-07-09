'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'

export async function submitReview(formData: FormData) {
  const supabase = createClient()
  
  // 1. Güvenlik: Yorum yapacak kişinin giriş yaptığından emin ol
  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) {
    return redirect('/login?error=Değerlendirme yapabilmek için önce giriş yapmalısınız')
  }

  // 2. Formdan gelen verileri al
  const businessId = formData.get('businessId') as string
  const rating = formData.get('rating') as string // 'recommend' veya 'not-recommend'
  const content = formData.get('content') as string
  
  // Checkbox verileri (Eğer işaretliyse 'on' değeri gelir, bunu boolean'a çeviriyoruz)
  const isAnonymous = formData.get('isAnonymous') === 'on'
  const salaryOnTime = formData.has('salaryOnTime') ? formData.get('salaryOnTime') === 'on' : null
  const overtimePaid = formData.has('overtimePaid') ? formData.get('overtimePaid') === 'on' : null
  const insuranceDayOne = formData.has('insuranceDayOne') ? formData.get('insuranceDayOne') === 'on' : null

  // 3. Validasyon kontrolleri
  if (!businessId) {
    return redirect('/?error=Geçersiz işletme kaydı')
  }

  if (!rating || !content) {
    return redirect(`/business/${businessId}?error=Lütfen genel değerlendirme durumunu seçin ve yorumunuzu yazın`)
  }

  if (content.trim().length < 10) {
    return redirect(`/business/${businessId}?error=Yorumunuz çok kısa. Lütfen deneyimlerinizi biraz daha detaylandırın`)
  }

  // 4. Veritabanına Yorum Ekleme İşlemi
  const { error } = await supabase
    .from('reviews')
    .insert([
      {
        business_id: businessId,
        user_id: user.id,
        rating: rating,
        content: content.trim(),
        is_anonymous: isAnonymous,
        salary_on_time: salaryOnTime,
        overtime_paid: overtimePaid,
        insurance_day_one: insuranceDayOne
      }
    ])

  if (error) {
    console.error('Yorum kayıt hatası:', error.message)
    // Eğer aynı kullanıcı aynı işletmeye ikinci kez yorum yapmaya çalışırsa (Unique constraint varsa) hata yakalanabilir
    return redirect(`/business/${businessId}?error=Değerlendirmeniz sisteme işlenirken bir sorun oluştu.`)
  }

  // 5. Başarılı İşlem: İşletme sayfasının önbelleğini temizle ve sayfayı yenile
  revalidatePath(`/business/${businessId}`, 'page')
  redirect(`/business/${businessId}?message=Değerlendirmeniz başarıyla eklendi ve platforma katkı sağladınız!`)
}
