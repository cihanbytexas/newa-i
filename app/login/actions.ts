'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'

export async function login(formData: FormData) {
  const supabase = createClient()
  
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  if (!email || !password) {
    return redirect('/login?error=Lütfen tüm alanları doldurun')
  }

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    return redirect('/login?error=E-posta veya şifre hatalı')
  }

  revalidatePath('/', 'layout')
  redirect('/')
}

export async function signup(formData: FormData) {
  const supabase = createClient()
  
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const firstName = formData.get('firstName') as string
  const lastName = formData.get('lastName') as string

  if (!email || !password || !firstName || !lastName) {
    return redirect('/login?error=Lütfen tüm alanları doldurun&type=register')
  }

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        first_name: firstName,
        last_name: lastName,
        avatar_url: '',
      },
    },
  })

  if (error) {
    return redirect(`/login?error=${error.message}&type=register`)
  }

  revalidatePath('/', 'layout')
  redirect('/login?message=Kayıt başarılı! Lütfen giriş yapın.')
}
