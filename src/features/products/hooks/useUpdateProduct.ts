import { useMutation, useQueryClient } from '@tanstack/react-query'
import { updateProduct } from '../model/products.api'
import type { UpdateProductDto } from './../model/products.api'

type UpdateProductParams = {
  productId: number
  product: UpdateProductDto
}

export function useUpdateProduct() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ productId, product }: UpdateProductParams) =>
      updateProduct(productId, product),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] })
    },
  })
}
