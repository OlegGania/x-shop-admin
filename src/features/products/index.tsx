import { ConfigDrawer } from '@/components/config-drawer'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { useProducts } from './hooks/useProducts'
import { ProductsTable } from './ui/ProductsTable'

export function Products() {
  const { data: products = [], isLoading, isError, error } = useProducts()

  return (
    <>
      <Header fixed>
        <Search className='me-auto' />
        <ThemeSwitch />
        <ConfigDrawer />
        <ProfileDropdown />
      </Header>

      <Main className='flex flex-1 flex-col gap-4 sm:gap-6'>
        <div>
          <h2 className='text-2xl font-bold tracking-tight'>Products</h2>
          <p className='text-muted-foreground'>
            Manage X-Shop products, prices, stock and categories.
          </p>
        </div>

        {isLoading && <p>Loading products...</p>}

        {isError && (
          <p className='text-red-500'>
            Error loading products: {error.message}
          </p>
        )}

        {!isLoading && !isError && <ProductsTable products={products} />}
      </Main>
    </>
  )
}
