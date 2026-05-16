import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/shared/api/supabaseClient'
import { toast } from 'sonner'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { ConfigDrawer } from '@/components/config-drawer'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'

type OrderStatus = 'pending' | 'paid' | 'shipped' | 'completed' | 'cancelled'

const orderStatuses: OrderStatus[] = [
  'pending',
  'paid',
  'shipped',
  'completed',
  'cancelled',
]

type OrderItem = {
  id: number
  title?: string
  price?: number
  quantity?: number
  size?: string
  color?: string
  discount_percentage?: number
}

type Profile = {
  id: string
  name: string | null
  email: string | null
}

type Order = {
  id: number
  user_id: string | null
  items: OrderItem[]
  shipping_address: {
    city?: string
    address?: string
  } | null
  payment_method: string | null
  subtotal: number | null
  discount: number | null
  shipping: number | null
  total: number | null
  status: OrderStatus | null
  created_at: string
  profile?: Profile | null
}

async function getOrders() {
  const { data: orders, error: ordersError } = await supabase
    .from('orders')
    .select('*')
    .order('id', { ascending: false })

  if (ordersError) {
    throw ordersError
  }

  const userIds = Array.from(
    new Set(
      orders
        .map((order) => order.user_id)
        .filter((userId): userId is string => Boolean(userId))
    )
  )

  if (userIds.length === 0) {
    return orders.map((order) => ({
      ...order,
      profile: null,
    })) as Order[]
  }

  const { data: profiles, error: profilesError } = await supabase
    .from('profiles')
    .select('id, name, email')
    .in('id', userIds)

  if (profilesError) {
    throw profilesError
  }

  const profilesMap = new Map(profiles.map((profile) => [profile.id, profile]))

  return orders.map((order) => ({
    ...order,
    profile: order.user_id ? (profilesMap.get(order.user_id) ?? null) : null,
  })) as Order[]
}

type UpdateOrderStatusParams = {
  orderId: number
  status: OrderStatus
}

async function updateOrderStatus({
  orderId,
  status,
}: UpdateOrderStatusParams): Promise<void> {
  const { error } = await supabase
    .from('orders')
    .update({ status })
    .eq('id', orderId)

  if (error) {
    throw new Error(error.message)
  }
}

function useUpdateOrderStatus() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: updateOrderStatus,

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] })
    },
  })
}

function normalizeItems(items: unknown): OrderItem[] {
  if (Array.isArray(items)) {
    return items as OrderItem[]
  }

  return []
}

function formatPrice(value: number | null | undefined) {
  if (typeof value !== 'number') {
    return '-'
  }

  return `$${value.toFixed(2)}`
}

function getOrderStatus(order: Order): OrderStatus {
  return order.status ?? 'pending'
}

export function Orders() {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const updateOrderStatusMutation = useUpdateOrderStatus()

  const {
    data: orders = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['orders'],
    queryFn: getOrders,
  })

  async function handleChangeOrderStatus(orderId: number, status: OrderStatus) {
    try {
      await updateOrderStatusMutation.mutateAsync({ orderId, status })
      toast.success('Order status updated successfully')
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Failed to update order status'

      toast.error(message)
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
        <div>
          <h2 className='text-2xl font-bold tracking-tight'>Orders</h2>
          <p className='text-muted-foreground'>
            Manage customer orders from X-Shop.
          </p>
        </div>

        {isLoading && <p>Loading orders...</p>}

        {isError && (
          <p className='text-red-500'>Error loading orders: {error.message}</p>
        )}

        {!isLoading && !isError && (
          <div className='overflow-x-auto rounded-md border'>
            <table className='w-full text-sm'>
              <thead className='bg-muted'>
                <tr>
                  <th className='px-4 py-3 text-left'>Order ID</th>
                  <th className='px-4 py-3 text-left'>Customer</th>
                  <th className='px-4 py-3 text-left'>Payment</th>
                  <th className='px-4 py-3 text-left'>Shipping</th>
                  <th className='px-4 py-3 text-left'>Items</th>
                  <th className='px-4 py-3 text-left'>Total</th>
                  <th className='px-4 py-3 text-left'>Status</th>
                  <th className='px-4 py-3 text-left'>Actions</th>
                </tr>
              </thead>

              <tbody>
                {orders.map((order) => {
                  const items = normalizeItems(order.items)

                  return (
                    <tr key={order.id} className='border-t align-top'>
                      <td className='px-4 py-3 font-medium'>#{order.id}</td>

                      <td className='px-4 py-3'>
                        <div className='font-medium'>
                          {order.profile?.name ?? 'Unknown customer'}
                        </div>
                        <div className='text-muted-foreground'>
                          {order.profile?.email ?? '-'}
                        </div>
                      </td>

                      <td className='px-4 py-3'>{order.payment_method}</td>

                      <td className='px-4 py-3'>
                        <div>{order.shipping_address?.city}</div>
                        <div className='text-muted-foreground'>
                          {order.shipping_address?.address}
                        </div>
                      </td>

                      <td className='px-4 py-3'>
                        <div className='space-y-2'>
                          {items.map((item, index) => (
                            <div key={`${item.id}-${index}`}>
                              <div className='font-medium'>
                                {item.title ?? `Product ID: ${item.id}`}
                              </div>
                              <div className='text-muted-foreground'>
                                Qty: {item.quantity ?? 1}
                                {item.size && ` / Size: ${item.size}`}
                                {item.color && ` / Color: ${item.color}`}
                              </div>
                            </div>
                          ))}
                        </div>
                      </td>

                      <td className='px-4 py-3'>{formatPrice(order.total)}</td>

                      <td className='px-4 py-3'>
                        <select
                          value={getOrderStatus(order)}
                          disabled={updateOrderStatusMutation.isPending}
                          onChange={(event) =>
                            handleChangeOrderStatus(
                              order.id,
                              event.target.value as OrderStatus
                            )
                          }
                          className='rounded-md border bg-background px-2 py-1 text-sm'
                        >
                          {orderStatuses.map((status) => (
                            <option key={status} value={status}>
                              {status}
                            </option>
                          ))}
                        </select>
                      </td>

                      <td className='px-4 py-3'>
                        <button
                          type='button'
                          className='rounded-md border px-3 py-1 text-sm hover:bg-muted'
                          onClick={() => setSelectedOrder(order)}
                        >
                          Details
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </Main>

      <OrderDetailsDialog
        order={selectedOrder}
        onOpenChange={(open) => {
          if (!open) {
            setSelectedOrder(null)
          }
        }}
      />
    </>
  )
}

type OrderDetailsDialogProps = {
  order: Order | null
  onOpenChange: (open: boolean) => void
}

function OrderDetailsDialog({ order, onOpenChange }: OrderDetailsDialogProps) {
  const items = normalizeItems(order?.items)

  return (
    <Dialog open={Boolean(order)} onOpenChange={onOpenChange}>
      <DialogContent className='max-w-2xl'>
        <DialogHeader>
          <DialogTitle>Order #{order?.id}</DialogTitle>
          <DialogDescription>
            Full order details from X-Shop checkout.
          </DialogDescription>
        </DialogHeader>

        {order && (
          <div className='space-y-6'>
            <div className='grid gap-4 sm:grid-cols-2'>
              <div className='rounded-md border p-4'>
                <h3 className='font-semibold'>Customer</h3>
                <p className='mt-2 text-sm text-muted-foreground'>
                  Name: {order.profile?.name ?? 'Unknown customer'}
                </p>
                <p className='text-sm text-muted-foreground'>
                  Email: {order.profile?.email ?? '-'}
                </p>
                <p className='text-sm text-muted-foreground'>
                  User ID: {order.user_id}
                </p>
              </div>

              <div className='rounded-md border p-4'>
                <h3 className='font-semibold'>Payment</h3>
                <p className='mt-2 text-sm text-muted-foreground'>
                  Method: {order.payment_method}
                </p>
              </div>

              <div className='rounded-md border p-4'>
                <h3 className='font-semibold'>Shipping address</h3>
                <p className='mt-2 text-sm text-muted-foreground'>
                  City: {order.shipping_address?.city}
                </p>
                <p className='text-sm text-muted-foreground'>
                  Address: {order.shipping_address?.address}
                </p>
              </div>

              <div className='rounded-md border p-4'>
                <h3 className='font-semibold'>Status</h3>
                <p className='mt-2 text-sm text-muted-foreground'>
                  {order.status ?? 'pending'}
                </p>
              </div>
            </div>

            <div className='rounded-md border'>
              <div className='border-b px-4 py-3 font-semibold'>Items</div>

              <div className='space-y-3 p-4'>
                {items.map((item, index) => (
                  <div
                    key={`${item.id}-${index}`}
                    className='rounded-md bg-muted/50 p-3'
                  >
                    <div className='font-medium'>
                      {item.title ?? `Product ID: ${item.id}`}
                    </div>

                    <div className='mt-1 text-sm text-muted-foreground'>
                      Quantity: {item.quantity ?? 1}
                    </div>

                    {item.price && (
                      <div className='text-sm text-muted-foreground'>
                        Price: {formatPrice(item.price)}
                      </div>
                    )}

                    {item.size && (
                      <div className='text-sm text-muted-foreground'>
                        Size: {item.size}
                      </div>
                    )}

                    {item.color && (
                      <div className='text-sm text-muted-foreground'>
                        Color: {item.color}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className='ml-auto w-full max-w-xs space-y-2 rounded-md border p-4'>
              <div className='flex justify-between text-sm'>
                <span>Subtotal</span>
                <span>{formatPrice(order.subtotal)}</span>
              </div>

              <div className='flex justify-between text-sm'>
                <span>Discount</span>
                <span>{formatPrice(order.discount)}</span>
              </div>

              <div className='flex justify-between text-sm'>
                <span>Shipping</span>
                <span>{formatPrice(order.shipping)}</span>
              </div>

              <div className='flex justify-between border-t pt-2 font-semibold'>
                <span>Total</span>
                <span>{formatPrice(order.total)}</span>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
