import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { ConfigDrawer } from '@/components/config-drawer'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { useProducts } from './hooks/useProducts'
import type { Product } from './model/product.types'
import { ProductFormDialog } from './ui/ProductFormDialog'
import { ProductsTable } from './ui/ProductsTable'

export function Products() {
  const [isProductDialogOpen, setIsProductDialogOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)

  const { data: products = [], isLoading, isError, error } = useProducts()

  function handleOpenCreateDialog() {
    setSelectedProduct(null)
    setIsProductDialogOpen(true)
  }

  function handleOpenEditDialog(product: Product) {
    setSelectedProduct(product)
    setIsProductDialogOpen(true)
  }

  function handleProductDialogOpenChange(open: boolean) {
    setIsProductDialogOpen(open)

    if (!open) {
      setSelectedProduct(null)
    }
  }

  return (
    <>
      <Header fixed>
        <Search className='me-auto' />
        <ThemeSwitch />
        <ConfigDrawer />
        <ProfileDropdown />
      </Header>

      <Main className='flex flex-1 flex-col gap-4 sm:gap-6'>
        <div className='flex flex-wrap items-end justify-between gap-2'>
          <div>
            <h2 className='text-2xl font-bold tracking-tight'>Products</h2>
            <p className='text-muted-foreground'>
              Manage X-Shop products, prices, stock and categories.
            </p>
          </div>

          <Button onClick={handleOpenCreateDialog}>Add product</Button>
        </div>

        {isLoading && <p>Loading products...</p>}

        {isError && (
          <p className='text-red-500'>
            Error loading products: {error.message}
          </p>
        )}

        {!isLoading && !isError && (
          <ProductsTable
            products={products}
            onEditProduct={handleOpenEditDialog}
          />
        )}
      </Main>

      <ProductFormDialog
        open={isProductDialogOpen}
        onOpenChange={handleProductDialogOpenChange}
        product={selectedProduct}
      />
    </>
  )
}
