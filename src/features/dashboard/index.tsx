import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/shared/api/supabaseClient'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { ConfigDrawer } from '@/components/config-drawer'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'

type Order = {
  id: number
  user_id: string | null
  total: number | null
  status: string | null
  created_at: string
}

type DashboardStats = {
  totalRevenue: number
  totalOrders: number
  pendingOrders: number
  customersCount: number
  latestOrders: Order[]
}

async function getDashboardStats(): Promise<DashboardStats> {
  const { data: orders, error: ordersError } = await supabase
    .from('orders')
    .select('id, user_id, total, status, created_at')
    .order('id', { ascending: false })

  if (ordersError) {
    throw ordersError
  }

  const { data: profiles, error: profilesError } = await supabase
    .from('profiles')
    .select('id')

  if (profilesError) {
    throw profilesError
  }

  const safeOrders = orders ?? []
  const safeProfiles = profiles ?? []

  const totalRevenue = safeOrders.reduce((sum: number, order: Order) => {
    return sum + (order.total ?? 0)
  }, 0)

  const pendingOrders = safeOrders.filter((order: Order) => {
    return (order.status ?? 'pending') === 'pending'
  }).length

  return {
    totalRevenue,
    totalOrders: safeOrders.length,
    pendingOrders,
    customersCount: safeProfiles.length,
    latestOrders: safeOrders.slice(0, 5),
  }
}

function formatPrice(value: number) {
  return `$${value.toFixed(2)}`
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
  }).format(new Date(value))
}

export function Dashboard() {
  const {
    data: stats,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: getDashboardStats,
  })

  return (
    <>
      <Header>
        <Search className='me-auto' />
        <ThemeSwitch />
        <ConfigDrawer />
        <ProfileDropdown />
      </Header>

      <Main className='flex flex-1 flex-col gap-4 sm:gap-6'>
        <div>
          <h1 className='text-2xl font-bold tracking-tight'>Dashboard</h1>
          <p className='text-muted-foreground'>
            Overview of X-Shop sales, orders and customers.
          </p>
        </div>

        {isLoading && <p>Loading dashboard...</p>}

        {isError && (
          <p className='text-red-500'>
            Error loading dashboard: {error.message}
          </p>
        )}

        {!isLoading && !isError && stats && (
          <>
            <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-4'>
              <Card>
                <CardHeader>
                  <CardTitle className='text-sm font-medium'>
                    Total revenue
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className='text-2xl font-bold'>
                    {formatPrice(stats.totalRevenue)}
                  </div>
                  <p className='text-xs text-muted-foreground'>
                    Revenue from all orders
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className='text-sm font-medium'>
                    Total orders
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className='text-2xl font-bold'>{stats.totalOrders}</div>
                  <p className='text-xs text-muted-foreground'>
                    All customer orders
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className='text-sm font-medium'>
                    Pending orders
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className='text-2xl font-bold'>
                    {stats.pendingOrders}
                  </div>
                  <p className='text-xs text-muted-foreground'>
                    Orders waiting for processing
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className='text-sm font-medium'>
                    Customers
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className='text-2xl font-bold'>
                    {stats.customersCount}
                  </div>
                  <p className='text-xs text-muted-foreground'>
                    Registered customers
                  </p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Latest orders</CardTitle>
                <CardDescription>
                  Most recent orders from X-Shop checkout.
                </CardDescription>
              </CardHeader>

              <CardContent>
                {stats.latestOrders.length === 0 ? (
                  <p className='text-sm text-muted-foreground'>
                    No orders found.
                  </p>
                ) : (
                  <div className='overflow-x-auto rounded-md border'>
                    <table className='w-full text-sm'>
                      <thead className='bg-muted'>
                        <tr>
                          <th className='px-4 py-3 text-left'>Order ID</th>
                          <th className='px-4 py-3 text-left'>Date</th>
                          <th className='px-4 py-3 text-left'>Status</th>
                          <th className='px-4 py-3 text-left'>Total</th>
                        </tr>
                      </thead>

                      <tbody>
                        {stats.latestOrders.map((order) => (
                          <tr key={order.id} className='border-t'>
                            <td className='px-4 py-3 font-medium'>
                              #{order.id}
                            </td>
                            <td className='px-4 py-3'>
                              {formatDate(order.created_at)}
                            </td>
                            <td className='px-4 py-3'>
                              <span className='rounded-md bg-muted px-2 py-1'>
                                {order.status ?? 'pending'}
                              </span>
                            </td>
                            <td className='px-4 py-3'>
                              {formatPrice(order.total ?? 0)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>
          </>
        )}
      </Main>
    </>
  )
}
