import { Metadata } from "next"
import Link from "next/link"
import Image from "next/image"
import { Calendar, Clock, ArrowRight, Filter, Search } from "lucide-react"
import { prisma } from "@/lib/prisma"

export const metadata: Metadata = {
  title: "Blog cybersécurité | Cyna",
  description: "Actualités cyber, conseils sécurité, tendances cybersécurité pour PME et MSP. Articles d'experts français en cybersécurité.",
}

/**
 * Page principale du blog
 * Affiche la liste des articles publiés avec filtrage par catégorie
 */
export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; page?: string }>
}) {
  const resolvedSearchParams = await searchParams
  // Paramètres de pagination
  const page = parseInt(resolvedSearchParams.page || '1')
  const limit = 12
  const offset = (page - 1) * limit

  // Filtre par catégorie si spécifié
  const categorySlug = resolvedSearchParams.category
  const category = categorySlug 
    ? await prisma.category.findUnique({
        where: { slug: categorySlug }
      })
    : null

  // Récupération des articles avec pagination
  const [posts, totalPosts, categories] = await Promise.all([
    prisma.blogPost.findMany({
      where: {
        published: true,
        ...(category && { categoryId: category.id })
      },
      include: {
        category: true,
        author: {
          select: { name: true, image: true }
        }
      },
      orderBy: { publishedAt: 'desc' },
      take: limit,
      skip: offset
    }),
    prisma.blogPost.count({
      where: {
        published: true,
        ...(category && { categoryId: category.id })
      }
    }),
    prisma.category.findMany({
      include: {
        _count: {
          select: { posts: { where: { published: true } } }
        }
      },
      orderBy: { name: 'asc' }
    })
  ])

  const totalPages = Math.ceil(totalPosts / limit)

  // Article mis en avant (si on est sur la première page)
  const featuredPost = page === 1 && !category 
    ? await prisma.blogPost.findFirst({
        where: { featured: true, published: true },
        include: {
          category: true,
          author: { select: { name: true, image: true } }
        }
      })
    : null

  return (
    <div className="min-h-screen bg-[#111318]">
      {/* Header du blog */}
      <section className="bg-gradient-to-br from-[#6B8DE5] via-[#8E63E5] to-[#A67FFB] py-20">
        <div className="container-cyna text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Blog Cyna
          </h1>
          <p className="text-xl text-indigo-100 max-w-2xl mx-auto">
            Actualités, conseils et analyses en cybersécurité par nos experts
          </p>
        </div>
      </section>

      <div className="container-cyna py-12">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Contenu principal */}
          <main className="lg:w-2/3">
            {/* Article mis en avant */}
            {featuredPost && (
              <section className="mb-16">
                <h2 className="text-2xl font-bold text-white mb-8">Article mis en avant</h2>
                <article className="group bg-[#1A1F28] rounded-2xl overflow-hidden border border-gray-700 hover:border-[#6B8DE5] transition-all duration-300">
                  {featuredPost.coverImage && (
                    <div className="aspect-video bg-gradient-to-r from-[#6B8DE5] to-[#A67FFB] relative overflow-hidden">
                      <Image 
                        src={featuredPost.coverImage} 
                        alt={featuredPost.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      {featuredPost.category && (
                        <div className="absolute top-4 left-4">
                          <span 
                            className="px-3 py-1 rounded-full text-sm font-semibold"
                            style={{ 
                              backgroundColor: featuredPost.category.color || '#6B8DE5',
                              color: '#FFFFFF'
                            }}
                          >
                            {featuredPost.category.name}
                          </span>
                        </div>
                      )}
                    </div>
                  )}
                  <div className="p-8">
                    <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-[#6B8DE5] transition-colors">
                      <Link href={`/blog/${featuredPost.slug}`}>
                        {featuredPost.title}
                      </Link>
                    </h3>
                    <p className="text-gray-400 mb-6 leading-relaxed">
                      {featuredPost.excerpt}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        {featuredPost.author?.name && (
                          <span>{featuredPost.author.name}</span>
                        )}
                        {featuredPost.publishedAt && (
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-1" />
                            {new Date(featuredPost.publishedAt).toLocaleDateString('fr-FR')}
                          </div>
                        )}
                        {featuredPost.readTime && (
                          <div className="flex items-center">
                            <Clock className="h-4 w-4 mr-1" />
                            {featuredPost.readTime} min
                          </div>
                        )}
                      </div>
                      <Link 
                        href={`/blog/${featuredPost.slug}`}
                        className="inline-flex items-center text-[#6B8DE5] hover:text-[#A67FFB] font-semibold"
                      >
                        Lire l&apos;article
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </div>
                  </div>
                </article>
              </section>
            )}

            {/* Liste des articles */}
            <section>
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-bold text-white">
                  {category ? `Articles - ${category.name}` : 'Derniers articles'}
                </h2>
                <span className="text-gray-400">
                  {totalPosts} article{totalPosts !== 1 ? 's' : ''}
                </span>
              </div>

              {posts.length > 0 ? (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                    {posts.map((post) => (
                      <article 
                        key={post.id} 
                        className="group bg-[#1A1F28] rounded-xl overflow-hidden border border-gray-700 hover:border-[#6B8DE5] transition-all duration-300"
                      >
                        {post.coverImage && (
                          <div className="aspect-video bg-gradient-to-r from-gray-600 to-gray-700 relative overflow-hidden">
                            <Image 
                              src={post.coverImage} 
                              alt={post.title}
                              fill
                              className="object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                            {post.category && (
                              <div className="absolute top-3 left-3">
                                <span 
                                  className="px-2 py-1 rounded-full text-xs font-semibold"
                                  style={{ 
                                    backgroundColor: post.category.color || '#6B8DE5',
                                    color: '#FFFFFF'
                                  }}
                                >
                                  {post.category.name}
                                </span>
                              </div>
                            )}
                          </div>
                        )}
                        <div className="p-6">
                          <h3 className="text-xl font-semibold text-white mb-3 group-hover:text-[#6B8DE5] transition-colors">
                            <Link href={`/blog/${post.slug}`}>
                              {post.title}
                            </Link>
                          </h3>
                          <p className="text-gray-400 mb-4 leading-relaxed line-clamp-3">
                            {post.excerpt}
                          </p>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3 text-xs text-gray-500">
                              {post.publishedAt && (
                                <div className="flex items-center">
                                  <Calendar className="h-3 w-3 mr-1" />
                                  {new Date(post.publishedAt).toLocaleDateString('fr-FR')}
                                </div>
                              )}
                              {post.readTime && (
                                <div className="flex items-center">
                                  <Clock className="h-3 w-3 mr-1" />
                                  {post.readTime} min
                                </div>
                              )}
                            </div>
                            <Link 
                              href={`/blog/${post.slug}`}
                              className="text-[#6B8DE5] hover:text-[#A67FFB] font-medium text-sm"
                            >
                              Lire →
                            </Link>
                          </div>
                        </div>
                      </article>
                    ))}
                  </div>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="flex justify-center items-center space-x-2">
                      {page > 1 && (
                        <Link 
                          href={`/blog?${new URLSearchParams({ 
                            ...(category && { category: category.slug }),
                            page: (page - 1).toString() 
                          })}`}
                          className="px-3 py-2 rounded-lg bg-[#1A1F28] text-gray-300 hover:bg-[#6B8DE5] hover:text-white transition-colors"
                        >
                          Précédent
                        </Link>
                      )}
                      
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                        <Link
                          key={pageNum}
                          href={`/blog?${new URLSearchParams({ 
                            ...(category && { category: category.slug }),
                            page: pageNum.toString() 
                          })}`}
                          className={`px-3 py-2 rounded-lg transition-colors ${
                            pageNum === page 
                              ? 'bg-[#6B8DE5] text-white' 
                              : 'bg-[#1A1F28] text-gray-300 hover:bg-[#6B8DE5] hover:text-white'
                          }`}
                        >
                          {pageNum}
                        </Link>
                      ))}
                      
                      {page < totalPages && (
                        <Link 
                          href={`/blog?${new URLSearchParams({ 
                            ...(category && { category: category.slug }),
                            page: (page + 1).toString() 
                          })}`}
                          className="px-3 py-2 rounded-lg bg-[#1A1F28] text-gray-300 hover:bg-[#6B8DE5] hover:text-white transition-colors"
                        >
                          Suivant
                        </Link>
                      )}
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-400 text-lg">
                    {category 
                      ? `Aucun article trouvé dans la catégorie "${category.name}"`
                      : 'Aucun article publié pour le moment'
                    }
                  </p>
                </div>
              )}
            </section>
          </main>

          {/* Sidebar */}
          <aside className="lg:w-1/3">
            <div className="space-y-8">
              {/* Catégories */}
              <div className="bg-[#1A1F28] rounded-xl p-6 border border-gray-700">
                <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                  <Filter className="h-5 w-5 mr-2" />
                  Catégories
                </h3>
                <ul className="space-y-2">
                  <li>
                    <Link 
                      href="/blog"
                      className={`flex justify-between items-center p-2 rounded-lg transition-colors ${
                        !category ? 'bg-[#6B8DE5] text-white' : 'text-gray-300 hover:bg-gray-700'
                      }`}
                    >
                      <span>Toutes les catégories</span>
                      <span className="text-sm">{totalPosts}</span>
                    </Link>
                  </li>
                  {categories.map((cat) => (
                    <li key={cat.id}>
                      <Link 
                        href={`/blog?category=${cat.slug}`}
                        className={`flex justify-between items-center p-2 rounded-lg transition-colors ${
                          category?.id === cat.id 
                            ? 'bg-[#6B8DE5] text-white' 
                            : 'text-gray-300 hover:bg-gray-700'
                        }`}
                      >
                        <div className="flex items-center">
                          {cat.color && (
                            <div 
                              className="w-3 h-3 rounded-full mr-2"
                              style={{ backgroundColor: cat.color }}
                            />
                          )}
                          <span>{cat.name}</span>
                        </div>
                        <span className="text-sm">{cat._count.posts}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Newsletter */}
              <div className="bg-gradient-to-r from-[#6B8DE5] to-[#A67FFB] rounded-xl p-6">
                <h3 className="text-xl font-semibold text-white mb-4">
                  Newsletter Cybersécurité
                </h3>
                <p className="text-indigo-100 mb-4">
                  Recevez nos dernières analyses et conseils en cybersécurité directement dans votre boîte mail.
                </p>
                <form className="space-y-3">
                  <input 
                    type="email" 
                    placeholder="Votre email"
                    className="w-full px-3 py-2 rounded-lg bg-white/20 text-white placeholder-indigo-200 border border-white/30 focus:border-white focus:outline-none"
                  />
                  <button 
                    type="submit"
                    className="w-full px-4 py-2 bg-white text-[#6B8DE5] font-semibold rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    S&apos;inscrire
                  </button>
                </form>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
} 