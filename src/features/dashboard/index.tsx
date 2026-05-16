// import { Button } from '@/components/ui/button'
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from '@/components/ui/card'
// import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
// import { ConfigDrawer } from '@/components/config-drawer'
// import { Header } from '@/components/layout/header'
// import { Main } from '@/components/layout/main'
// import { TopNav } from '@/components/layout/top-nav'
// import { ProfileDropdown } from '@/components/profile-dropdown'
// import { Search } from '@/components/search'
// import { ThemeSwitch } from '@/components/theme-switch'
// import { Analytics } from './components/analytics'
// import { Overview } from './components/overview'
// import { RecentSales } from './components/recent-sales'
// export function Dashboard() {
//   return (
//     <>
//       {/* ===== Top Heading ===== */}
//       <Header>
//         <TopNav links={topNav} className='me-auto' />
//         <Search />
//         <ThemeSwitch />
//         <ConfigDrawer />
//         <ProfileDropdown />
//       </Header>
//       {/* ===== Main ===== */}
//       <Main>
//         <div className='mb-2 flex items-center justify-between space-y-2'>
//           <h1 className='text-2xl font-bold tracking-tight'>Dashboard</h1>
//           <div className='flex items-center space-x-2'>
//             <Button>Download</Button>
//           </div>
//         </div>
//         <Tabs
//           orientation='vertical'
//           defaultValue='overview'
//           className='space-y-4'
//         >
//           <div className='w-full overflow-x-auto pb-2'>
//             <TabsList>
//               <TabsTrigger value='overview'>Overview</TabsTrigger>
//               <TabsTrigger value='analytics'>Analytics</TabsTrigger>
//               <TabsTrigger value='reports' disabled>
//                 Reports
//               </TabsTrigger>
//               <TabsTrigger value='notifications' disabled>
//                 Notifications
//               </TabsTrigger>
//             </TabsList>
//           </div>
//           <TabsContent value='overview' className='space-y-4'>
//             <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-4'>
//               <Card>
//                 <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
//                   <CardTitle className='text-sm font-medium'>
//                     Total Revenue
//                   </CardTitle>
//                   <svg
//                     xmlns='http://www.w3.org/2000/svg'
//                     viewBox='0 0 24 24'
//                     fill='none'
//                     stroke='currentColor'
//                     strokeLinecap='round'
//                     strokeLinejoin='round'
//                     strokeWidth='2'
//                     className='h-4 w-4 text-muted-foreground'
//                   >
//                     <path d='M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6' />
//                   </svg>
//                 </CardHeader>
//                 <CardContent>
//                   <div className='text-2xl font-bold'>$45,231.89</div>
//                   <p className='text-xs text-muted-foreground'>
//                     +20.1% from last month
//                   </p>
//                 </CardContent>
//               </Card>
//               <Card>
//                 <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
//                   <CardTitle className='text-sm font-medium'>
//                     Subscriptions
//                   </CardTitle>
//                   <svg
//                     xmlns='http://www.w3.org/2000/svg'
//                     viewBox='0 0 24 24'
//                     fill='none'
//                     stroke='currentColor'
//                     strokeLinecap='round'
//                     strokeLinejoin='round'
//                     strokeWidth='2'
//                     className='h-4 w-4 text-muted-foreground'
//                   >
//                     <path d='M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2' />
//                     <circle cx='9' cy='7' r='4' />
//                     <path d='M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75' />
//                   </svg>
//                 </CardHeader>
//                 <CardContent>
//                   <div className='text-2xl font-bold'>+2350</div>
//                   <p className='text-xs text-muted-foreground'>
//                     +180.1% from last month
//                   </p>
//                 </CardContent>
//               </Card>
//               <Card>
//                 <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
//                   <CardTitle className='text-sm font-medium'>Sales</CardTitle>
//                   <svg
//                     xmlns='http://www.w3.org/2000/svg'
//                     viewBox='0 0 24 24'
//                     fill='none'
//                     stroke='currentColor'
//                     strokeLinecap='round'
//                     strokeLinejoin='round'
//                     strokeWidth='2'
//                     className='h-4 w-4 text-muted-foreground'
//                   >
//                     <rect width='20' height='14' x='2' y='5' rx='2' />
//                     <path d='M2 10h20' />
//                   </svg>
//                 </CardHeader>
//                 <CardContent>
//                   <div className='text-2xl font-bold'>+12,234</div>
//                   <p className='text-xs text-muted-foreground'>
//                     +19% from last month
//                   </p>
//                 </CardContent>
//               </Card>
//               <Card>
//                 <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
//                   <CardTitle className='text-sm font-medium'>
//                     Active Now
//                   </CardTitle>
//                   <svg
//                     xmlns='http://www.w3.org/2000/svg'
//                     viewBox='0 0 24 24'
//                     fill='none'
//                     stroke='currentColor'
//                     strokeLinecap='round'
//                     strokeLinejoin='round'
//                     strokeWidth='2'
//                     className='h-4 w-4 text-muted-foreground'
//                   >
//                     <path d='M22 12h-4l-3 9L9 3l-3 9H2' />
//                   </svg>
//                 </CardHeader>
//                 <CardContent>
//                   <div className='text-2xl font-bold'>+573</div>
//                   <p className='text-xs text-muted-foreground'>
//                     +201 since last hour
//                   </p>
//                 </CardContent>
//               </Card>
//             </div>
//             <div className='grid grid-cols-1 gap-4 lg:grid-cols-7'>
//               <Card className='col-span-1 lg:col-span-4'>
//                 <CardHeader>
//                   <CardTitle>Overview</CardTitle>
//                 </CardHeader>
//                 <CardContent className='ps-2'>
//                   <Overview />
//                 </CardContent>
//               </Card>
//               <Card className='col-span-1 lg:col-span-3'>
//                 <CardHeader>
//                   <CardTitle>Recent Sales</CardTitle>
//                   <CardDescription>
//                     You made 265 sales this month.
//                   </CardDescription>
//                 </CardHeader>
//                 <CardContent>
//                   <RecentSales />
//                 </CardContent>
//               </Card>
//             </div>
//           </TabsContent>
//           <TabsContent value='analytics' className='space-y-4'>
//             <Analytics />
//           </TabsContent>
//         </Tabs>
//       </Main>
//     </>
//   )
// }
// const topNav = [
//   {
//     title: 'Overview',
//     href: 'dashboard/overview',
//     isActive: true,
//     disabled: false,
//   },
//   {
//     title: 'Customers',
//     href: 'dashboard/customers',
//     isActive: false,
//     disabled: true,
//   },
//   {
//     title: 'Products',
//     href: 'dashboard/products',
//     isActive: false,
//     disabled: true,
//   },
//   {
//     title: 'Settings',
//     href: 'dashboard/settings',
//     isActive: false,
//     disabled: true,
//   },
// ]
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

type Profile = {
  id: string
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
