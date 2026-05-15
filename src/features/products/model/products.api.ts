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

export type CreateProductDto = {
  title: string
  price: number
  stock: number
  brand: string
  category: string
  description: string
  thumbnail: string
  rating: number
}

export async function createProduct(product: CreateProductDto): Promise<void> {
  const payload = {
    ...product,
    images: [product.thumbnail],
  }

  const { error } = await supabase.from('products').insert(payload)

  if (error) {
    throw new Error(error.message)
  }
}

export async function deleteProduct(productId: number): Promise<void> {
  const { error } = await supabase.from('products').delete().eq('id', productId)

  if (error) {
    throw new Error(error.message)
  }
}
