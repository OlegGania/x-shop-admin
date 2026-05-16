import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/shared/api/supabaseClient'
import { ConfigDrawer } from '@/components/config-drawer'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'

type Profile = {
  id: string
  name: string | null
  email: string | null
}

type Order = {
  id: number
  user_id: string | null
  total: number | null
  created_at: string
}

type Customer = {
  id: string
  name: string | null
  email: string | null
  ordersCount: number
  totalSpent: number
  lastOrderDate: string | null
}

async function getCustomers(): Promise<Customer[]> {
  const { data: profiles, error: profilesError } = await supabase
    .from('profiles')
    .select('id, name, email')

  if (profilesError) {
    throw profilesError
  }

  const { data: orders, error: ordersError } = await supabase
    .from('orders')
    .select('id, user_id, total, created_at')

  if (ordersError) {
    throw ordersError
  }

  return (profiles ?? []).map((profile: Profile) => {
    const customerOrders = (orders ?? []).filter(
      (order: Order) => order.user_id === profile.id
    )

    const totalSpent = customerOrders.reduce((sum, order) => {
      return sum + (order.total ?? 0)
    }, 0)

    const lastOrder = [...customerOrders].sort((a, b) => {
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    })[0]

    return {
      id: profile.id,
      name: profile.name,
      email: profile.email,
      ordersCount: customerOrders.length,
      totalSpent,
      lastOrderDate: lastOrder?.created_at ?? null,
    }
  })
}

function formatPrice(value: number) {
  return `$${value.toFixed(2)}`
}

function formatDate(value: string | null) {
  if (!value) {
    return '-'
  }

  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
  }).format(new Date(value))
}

export function Customers() {
  const {
    data: customers = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['customers'],
    queryFn: getCustomers,
  })

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

        {isLoading && <p>Loading customers...</p>}

        {isError && (
          <p className='text-red-500'>
            Error loading customers: {error.message}
          </p>
        )}

        {!isLoading && !isError && (
          <div className='overflow-x-auto rounded-md border'>
            <table className='w-full text-sm'>
              <thead className='bg-muted'>
                <tr>
                  <th className='px-4 py-3 text-left'>Customer</th>
                  <th className='px-4 py-3 text-left'>Email</th>
                  <th className='px-4 py-3 text-left'>Orders</th>
                  <th className='px-4 py-3 text-left'>Total spent</th>
                  <th className='px-4 py-3 text-left'>Last order</th>
                </tr>
              </thead>

              <tbody>
                {customers.map((customer) => (
                  <tr key={customer.id} className='border-t'>
                    <td className='px-4 py-3 font-medium'>
                      {customer.name ?? 'Unknown customer'}
                    </td>

                    <td className='px-4 py-3'>{customer.email ?? '-'}</td>

                    <td className='px-4 py-3'>{customer.ordersCount}</td>

                    <td className='px-4 py-3'>
                      {formatPrice(customer.totalSpent)}
                    </td>

                    <td className='px-4 py-3'>
                      {formatDate(customer.lastOrderDate)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Main>
    </>
  )
}
