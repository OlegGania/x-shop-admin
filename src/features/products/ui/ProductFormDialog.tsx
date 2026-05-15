import { useEffect, useState } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useCreateProduct } from '../hooks/useCreateProduct'
import { useUpdateProduct } from '../hooks/useUpdateProduct'
import type { Product } from '../model/product.types'

const productFormSchema = z.object({
  title: z.string().min(2, 'Title must be at least 2 characters.'),
  price: z.number().positive('Price must be greater than 0.'),
  stock: z.number().int().min(0, 'Stock cannot be negative.'),
  brand: z.string().min(1, 'Brand is required.'),
  category: z.string().min(1, 'Category is required.'),
  description: z.string().min(5, 'Description must be at least 5 characters.'),
  thumbnail: z.url('Thumbnail must be a valid URL.'),
  rating: z.number().min(0).max(5),
})

type ProductFormValues = z.infer<typeof productFormSchema>

const defaultValues: ProductFormValues = {
  title: '',
  price: 0,
  stock: 0,
  brand: '',
  category: '',
  description: '',
  thumbnail: '',
  rating: 0,
}

function getProductFormValues(product: Product): ProductFormValues {
  return {
    title: product.title,
    price: product.price,
    stock: product.stock ?? 0,
    brand: product.brand ?? '',
    category: product.category ?? '',
    description: product.description ?? '',
    thumbnail: product.thumbnail ?? '',
    rating: product.rating ?? 0,
  }
}

type ProductFormDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  product?: Product | null
}

export function ProductFormDialog({
  open,
  onOpenChange,
  product,
}: ProductFormDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const createProductMutation = useCreateProduct()
  const updateProductMutation = useUpdateProduct()

  const isEditMode = Boolean(product)

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema),
    defaultValues,
  })

  useEffect(() => {
    if (!open) {
      form.reset(defaultValues)
      return
    }

    if (product) {
      form.reset(getProductFormValues(product))
      return
    }

    form.reset(defaultValues)
  }, [form, open, product])

  async function onSubmit(values: ProductFormValues) {
    try {
      setIsSubmitting(true)

      if (product) {
        await updateProductMutation.mutateAsync({
          productId: product.id,
          product: values,
        })

        toast.success('Product updated successfully')
      } else {
        await createProductMutation.mutateAsync(values)

        toast.success('Product created successfully')
      }

      form.reset(defaultValues)
      onOpenChange(false)
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Failed to save product'

      toast.error(message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-w-2xl'>
        <DialogHeader>
          <DialogTitle>
            {isEditMode ? 'Edit product' : 'Add product'}
          </DialogTitle>
          <DialogDescription>
            {isEditMode
              ? 'Update product details in X-Shop catalog.'
              : 'Create a new product in X-Shop catalog.'}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='grid gap-4'>
            <FormField
              control={form.control}
              name='title'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder='iPhone 15 Pro' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className='grid gap-4 sm:grid-cols-2'>
              <FormField
                control={form.control}
                name='price'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price ($)</FormLabel>
                    <FormControl>
                      <Input
                        type='number'
                        placeholder='999'
                        value={field.value}
                        onChange={(event) =>
                          field.onChange(Number(event.target.value))
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='stock'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Stock</FormLabel>
                    <FormControl>
                      <Input
                        type='number'
                        placeholder='20'
                        value={field.value}
                        onChange={(event) =>
                          field.onChange(Number(event.target.value))
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className='grid gap-4 sm:grid-cols-2'>
              <FormField
                control={form.control}
                name='brand'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Brand</FormLabel>
                    <FormControl>
                      <Input placeholder='Apple' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='category'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <FormControl>
                      <Input placeholder='smartphones' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name='description'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Input placeholder='Product description' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='thumbnail'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Thumbnail URL</FormLabel>
                  <FormControl>
                    <Input
                      placeholder='https://example.com/image.jpg'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='rating'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Rating</FormLabel>
                  <FormControl>
                    <Input
                      type='number'
                      step='0.1'
                      placeholder='4.5'
                      value={field.value}
                      onChange={(event) =>
                        field.onChange(Number(event.target.value))
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className='flex justify-end gap-2'>
              <Button
                type='button'
                variant='outline'
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>

              <Button type='submit' disabled={isSubmitting}>
                {isSubmitting
                  ? isEditMode
                    ? 'Saving...'
                    : 'Creating...'
                  : isEditMode
                    ? 'Save changes'
                    : 'Create product'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
