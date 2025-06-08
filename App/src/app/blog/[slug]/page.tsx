import Link from "next/link"
import Image from "next/image"
import { notFound } from "next/navigation"
import { Calendar, Clock, ArrowLeft, Share2, Eye } from "lucide-react"
import { prisma } from "@/lib/prisma"

/**
 * Page d'affichage d'un article de blog individuel
 * Route dynamique basée sur le slug de l'article
 */
export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const resolvedParams = await params
  // Récupération de l'article avec ses relations
  const post = await prisma.blogPost.findUnique({
    where: { 
      slug: resolvedParams.slug,
      published: true 
    },
    include: {
      category: true,
      author: {
        select: { name: true, image: true, email: true }
      }
    }
  })

  // Si l'article n'existe pas, afficher 404
  if (!post) {
    notFound()
  }

  // Incrémentation du compteur de vues
  await prisma.blogPost.update({
    where: { id: post.id },
    data: { viewCount: { increment: 1 } }
  })

  // Articles similaires (même catégorie)
  const relatedPosts = await prisma.blogPost.findMany({
    where: {
      published: true,
      categoryId: post.categoryId,
      id: { not: post.id }
    },
    include: {
      category: true,
      author: { select: { name: true } }
    },
    take: 3,
    orderBy: { publishedAt: 'desc' }
  })

  return (
    <div className="min-h-screen bg-[#111318]">
      {/* Navigation */}
      <nav className="border-b border-gray-800">
        <div className="container-cyna py-4">
          <Link 
            href="/blog"
            className="inline-flex items-center text-[#6B8DE5] hover:text-[#A67FFB] font-medium"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour au blog
          </Link>
        </div>
      </nav>

      <article className="container-cyna py-12">
        <div className="max-w-4xl mx-auto">
          {/* Header de l'article */}
          <header className="mb-12">
            {post.category && (
              <div className="mb-4">
                <Link
                  href={`/blog?category=${post.category.slug}`}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold"
                  style={{ 
                    backgroundColor: post.category.color || '#6B8DE5',
                    color: '#FFFFFF'
                  }}
                >
                  {post.category.name}
                </Link>
              </div>
            )}

            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
              {post.title}
            </h1>

            <p className="text-xl text-gray-400 mb-8 leading-relaxed">
              {post.excerpt}
            </p>

            {/* Métadonnées */}
            <div className="flex flex-wrap items-center gap-6 text-gray-500 mb-8">
              {post.author && (
                <div className="flex items-center">
                  {post.author.image && (
                    <Image 
                      src={post.author.image} 
                      alt={post.author.name || ''}
                      width={40}
                      height={40}
                      className="rounded-full mr-3"
                    />
                  )}
                  <span className="font-medium text-gray-300">{post.author.name}</span>
                </div>
              )}
              
              {post.publishedAt && (
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2" />
                  <span>{new Date(post.publishedAt).toLocaleDateString('fr-FR', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}</span>
                </div>
              )}
              
              {post.readTime && (
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-2" />
                  <span>{post.readTime} min de lecture</span>
                </div>
              )}
              
              <div className="flex items-center">
                <Eye className="h-4 w-4 mr-2" />
                <span>{post.viewCount} vue{post.viewCount !== 1 ? 's' : ''}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-4 pb-8 border-b border-gray-800">
              <button className="inline-flex items-center px-4 py-2 bg-[#1A1F28] text-gray-300 rounded-lg hover:bg-gray-700 transition-colors">
                <Share2 className="h-4 w-4 mr-2" />
                Partager
              </button>
            </div>
          </header>

          {/* Image de couverture */}
          {post.coverImage && (
            <div className="mb-12">
              <Image 
                src={post.coverImage} 
                alt={post.title}
                width={800}
                height={400}
                className="w-full h-64 md:h-96 object-cover rounded-2xl"
              />
            </div>
          )}

          {/* Contenu de l'article */}
          <div className="prose prose-lg prose-invert max-w-none mb-16">
            <div 
              className="text-gray-300 leading-relaxed"
              dangerouslySetInnerHTML={{ 
                __html: post.content.replace(/\n/g, '<br>') 
              }}
            />
          </div>

          {/* Tags */}
          {post.tags && (
            <div className="mb-12 pb-8 border-b border-gray-800">
              <h4 className="text-lg font-semibold text-white mb-4">Tags</h4>
              <div className="flex flex-wrap gap-2">
                {JSON.parse(post.tags || '[]').map((tag: string, index: number) => (
                  <span 
                    key={index}
                    className="px-3 py-1 bg-[#1A1F28] text-gray-300 rounded-full text-sm"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Auteur */}
          {post.author && (
            <div className="mb-16 p-6 bg-[#1A1F28] rounded-xl border border-gray-700">
              <h4 className="text-lg font-semibold text-white mb-4">À propos de l&apos;auteur</h4>
              <div className="flex items-start">
                {post.author.image && (
                  <Image 
                    src={post.author.image} 
                    alt={post.author.name || ''}
                    width={64}
                    height={64}
                    className="rounded-full mr-4 flex-shrink-0"
                  />
                )}
                <div>
                  <h5 className="font-semibold text-white">{post.author.name}</h5>
                  <p className="text-gray-400 mt-2">
                    Expert en cybersécurité chez Cyna, spécialisé dans les solutions SOC et la gestion d&apos;incidents.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </article>

      {/* Articles similaires */}
      {relatedPosts.length > 0 && (
        <section className="bg-[#161A22] py-16">
          <div className="container-cyna">
            <h3 className="text-3xl font-bold text-white mb-8 text-center">
              Articles similaires
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {relatedPosts.map((relatedPost) => (
                <article 
                  key={relatedPost.id}
                  className="group bg-[#1A1F28] rounded-xl overflow-hidden border border-gray-700 hover:border-[#6B8DE5] transition-all duration-300"
                >
                  {relatedPost.coverImage && (
                    <div className="aspect-video bg-gradient-to-r from-gray-600 to-gray-700 relative overflow-hidden">
                      <Image 
                        src={relatedPost.coverImage} 
                        alt={relatedPost.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      {relatedPost.category && (
                        <div className="absolute top-3 left-3">
                          <span 
                            className="px-2 py-1 rounded-full text-xs font-semibold"
                            style={{ 
                              backgroundColor: relatedPost.category.color || '#6B8DE5',
                              color: '#FFFFFF'
                            }}
                          >
                            {relatedPost.category.name}
                          </span>
                        </div>
                      )}
                    </div>
                  )}
                  
                  <div className="p-6">
                    <h4 className="text-lg font-semibold text-white mb-3 group-hover:text-[#6B8DE5] transition-colors">
                      <Link href={`/blog/${relatedPost.slug}`}>
                        {relatedPost.title}
                      </Link>
                    </h4>
                    <p className="text-gray-400 mb-4 leading-relaxed line-clamp-2">
                      {relatedPost.excerpt}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3 text-xs text-gray-500">
                        {relatedPost.author?.name && (
                          <span>{relatedPost.author.name}</span>
                        )}
                        {relatedPost.publishedAt && (
                          <div className="flex items-center">
                            <Calendar className="h-3 w-3 mr-1" />
                            {new Date(relatedPost.publishedAt).toLocaleDateString('fr-FR')}
                          </div>
                        )}
                      </div>
                      <Link 
                        href={`/blog/${relatedPost.slug}`}
                        className="text-[#6B8DE5] hover:text-[#A67FFB] font-medium text-sm"
                      >
                        Lire →
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="py-16 bg-gradient-to-r from-[#6B8DE5] to-[#A67FFB]">
        <div className="container-cyna text-center">
          <h3 className="text-3xl font-bold text-white mb-6">
            Besoin d&apos;Aide en Cybersécurité ?
          </h3>
          <p className="text-xl text-indigo-100 mb-8 max-w-2xl mx-auto">
            Nos experts sont là pour vous accompagner dans la sécurisation de votre entreprise.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/contact"
              className="inline-flex items-center px-8 py-4 bg-white text-[#6B8DE5] font-semibold rounded-lg hover:bg-gray-100 transition-colors"
            >
              Contactez-nous
            </Link>
            <Link 
              href="/services"
              className="inline-flex items-center px-8 py-4 border-2 border-white text-white font-semibold rounded-lg hover:bg-white/10 transition-colors"
            >
              Découvrir nos services
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

/**
 * Génération des métadonnées pour le SEO
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const resolvedParams = await params
  const post = await prisma.blogPost.findUnique({
    where: { 
      slug: resolvedParams.slug,
      published: true 
    },
    include: { category: true }
  })

  if (!post) {
    return {
      title: 'Article non trouvé',
    }
  }

  return {
    title: post.metaTitle || post.title,
    description: post.metaDescription || post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: 'article',
      publishedTime: post.publishedAt?.toISOString(),
      authors: ['Cyna'],
      tags: post.tags ? JSON.parse(post.tags) : [],
      images: post.ogImage ? [{ url: post.ogImage }] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt,
      images: post.ogImage ? [post.ogImage] : [],
    },
  }
} 