import { useQuery } from '@tanstack/react-query'
import type { Product } from '../model/product.types'
import { getProducts } from '../model/products.api'

export function useProducts() {
  return useQuery<Product[], Error>({
    queryKey: ['products'],
    queryFn: getProducts,
  })
}
