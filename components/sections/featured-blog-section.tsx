import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ArrowRight, Clock, Calendar } from 'lucide-react';
import { getLatestPosts } from '@/lib/data/services';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatDate } from '@/lib/utils';

export async function FeaturedBlogSection() {
  const posts = await getLatestPosts(3);

  if (posts.length === 0) return null;

  return (
    <section className="section-padding">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-heading-2 font-heading font-semibold mb-2">
              From the Journal
            </h2>
            <p className="text-muted-foreground">
              Thoughts on training, nutrition, discipline, and the pursuit of excellence.
            </p>
          </div>
          <Button asChild variant="ghost" className="hidden sm:flex group">
            <Link href="/blog">
              Read All
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
        </div>

        {/* Posts Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post, index) => (
            <motion.article
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Link href={`/blog/${post.slug}`} className="block group h-full">
                <div className="h-full flex flex-col bg-card border rounded-xl overflow-hidden hover:border-primary/50 transition-colors">
                  {/* Image */}
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <Image
                      src={post.coverImage}
                      alt={post.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-card/50 to-transparent" />
                    
                    {/* Category Badge */}
                    <div className="absolute top-4 left-4">
                      <Badge>{post.category.name}</Badge>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 flex flex-col p-5">
                    <h3 className="font-heading font-semibold text-lg mb-2 group-hover:text-primary transition-colors line-clamp-2">
                      {post.title}
                    </h3>
                    <p className="text-muted-foreground text-sm line-clamp-2 mb-4 flex-1">
                      {post.excerpt}
                    </p>
                    
                    {/* Meta */}
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {formatDate(post.publishedAt)}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {post.readingTime} min read
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.article>
          ))}
        </div>

        {/* Mobile CTA */}
        <div className="mt-6 sm:hidden">
          <Button asChild variant="outline" className="w-full">
            <Link href="/blog">Read All Articles</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
