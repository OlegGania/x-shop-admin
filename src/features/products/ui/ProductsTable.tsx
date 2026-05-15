import { toast } from 'sonner'
import { useDeleteProduct } from '../hooks/useDeleteProduct'
import type { Product } from '../model/product.types'

type ProductsTableProps = {
  products: Product[]
}

function formatPrice(price: number) {
  return `$${price.toFixed(2)}`
}

export function ProductsTable({ products }: ProductsTableProps) {
  const deleteProductMutation = useDeleteProduct()

  async function handleDeleteProduct(product: Product) {
    const isConfirmed = window.confirm(`Delete product "${product.title}"?`)

    if (!isConfirmed) {
      return
    }

    try {
      await deleteProductMutation.mutateAsync(product.id)
      toast.success('Product deleted successfully')
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Failed to delete product'

      toast.error(message)
    }
  }

  if (products.length === 0) {
    return (
      <div className='rounded-md border p-6'>
        <p className='text-sm text-muted-foreground'>No products found.</p>
      </div>
    )
  }

  return (
    <div className='overflow-x-auto rounded-md border'>
      <table className='w-full text-sm'>
        <thead className='bg-muted'>
          <tr>
            <th className='px-4 py-3 text-left'>Product</th>
            <th className='px-4 py-3 text-left'>Category</th>
            <th className='px-4 py-3 text-left'>Brand</th>
            <th className='px-4 py-3 text-left'>Price</th>
            <th className='px-4 py-3 text-left'>Stock</th>
            <th className='px-4 py-3 text-left'>Rating</th>
            <th className='px-4 py-3 text-left'>Actions</th>
          </tr>
        </thead>

        <tbody>
          {products.map((product) => (
            <tr key={product.id} className='border-t align-middle'>
              <td className='px-4 py-3'>
                <div className='flex items-center gap-3'>
                  {product.thumbnail && (
                    <img
                      src={product.thumbnail}
                      alt={product.title}
                      className='h-12 w-12 rounded-md border object-cover'
                    />
                  )}

                  <div>
                    <div className='font-medium'>{product.title}</div>
                    <div className='text-muted-foreground'>
                      ID: {product.id}
                    </div>
                  </div>
                </div>
              </td>

              <td className='px-4 py-3'>{product.category ?? '-'}</td>
              <td className='px-4 py-3'>{product.brand ?? '-'}</td>
              <td className='px-4 py-3'>{formatPrice(product.price)}</td>
              <td className='px-4 py-3'>{product.stock ?? '-'}</td>
              <td className='px-4 py-3'>{product.rating ?? '-'}</td>

              <td className='px-4 py-3'>
                <div className='flex gap-2'>
                  <button
                    type='button'
                    className='rounded-md border px-3 py-1 text-sm hover:bg-muted'
                  >
                    Edit
                  </button>

                  <button
                    type='button'
                    className='rounded-md border px-3 py-1 text-sm hover:bg-muted'
                    disabled={deleteProductMutation.isPending}
                    onClick={() => handleDeleteProduct(product)}
                  >
                    {deleteProductMutation.isPending ? 'Deleting...' : 'Delete'}
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
