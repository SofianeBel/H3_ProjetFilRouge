export interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt: string
  content: string
  published: boolean
  featured: boolean
  viewCount: number
  readTime?: number
  metaTitle?: string
  metaDescription?: string
  coverImage?: string
  ogImage?: string
  categoryId?: string
  tags: string
  publishedAt?: Date
  createdAt: Date
  updatedAt: Date
  category?: {
    id: string
    name: string
    slug: string
    description: string | null
    color: string | null
    createdAt: Date
    updatedAt: Date
  } | null
  author?: {
    id: string
    name: string | null
    email: string
    image: string | null
    role: string
  } | null
} 