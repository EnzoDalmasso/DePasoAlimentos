import { supabase, SUPABASE_BUCKET } from '../config/supabase'

type ImageFolder = 'products' | 'promotions' | 'food-suggestions'

export async function uploadImage(
  file: File,
  folder: ImageFolder,
): Promise<string> {
  const fileExtension = file.name.split('.').pop()
  const fileName = `${crypto.randomUUID()}.${fileExtension}`
  const filePath = `${folder}/${fileName}`

  const { error } = await supabase.storage
    .from(SUPABASE_BUCKET)
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false,
      contentType: file.type,
    })

  if (error) {
    throw error
  }

  const { data } = supabase.storage
    .from(SUPABASE_BUCKET)
    .getPublicUrl(filePath)

  return data.publicUrl
}