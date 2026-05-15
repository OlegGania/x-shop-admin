import { ConfigDrawer } from '@/components/config-drawer'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'

export function Customers() {
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
          <h2 className='text-2xl font-bold tracking-tight'>Customers</h2>
          <p className='text-muted-foreground'>
            View X-Shop customers, their orders and total spending.
          </p>
        </div>

        <div className='rounded-md border p-6'>
          <p className='text-sm text-muted-foreground'>
            Customers table will be here.
          </p>
        </div>
      </Main>
    </>
  )
}
