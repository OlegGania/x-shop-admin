export type Product = {
  id: number
  title: string
  price: number
  thumbnail: string | null
  rating: number | null
  stock: number | null
  brand: string | null
  category: string | null
  description: string | null
  images: string[] | null
  discountPercentage?: number | null
}
