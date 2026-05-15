import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createProduct } from '../model/products.api'
import type { CreateProductDto } from './../model/products.api'

export function useCreateProduct() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (product: CreateProductDto) => createProduct(product),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] })
    },
  })
}
