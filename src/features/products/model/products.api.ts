import { supabase } from '@/shared/api/supabaseClient'
import type { Product } from './product.types'

export async function getProducts(): Promise<Product[]> {
  const { data, error } = await supabase
    .from('products_view')
    .select('*')
    .order('id', { ascending: false })

  if (error) {
    throw error
  }

  return data ?? []
}
