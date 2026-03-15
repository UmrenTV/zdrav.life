'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import type { Post } from '@/types';

interface RelatedPostsProps {
  posts: Post[];
}

export function RelatedPosts({ posts }: RelatedPostsProps) {
  if (posts.length === 0) return null;

  return (
    <section className="container mx-auto px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-heading-3 font-heading font-semibold mb-8">
          Related Articles
        </h2>

        <div className="grid md:grid-cols-3 gap-6">
          {posts.map((post, index) => (
            <motion.article
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Link href={`/blog/${post.slug}`} className="block group">
                <div className="flex gap-4">
                  <div className="relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden bg-muted">
                    {post.coverImage ? (
                      <Image
                        src={post.coverImage}
                        alt={post.title}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                        sizes="80px"
                      />
                    ) : (
                      <div
                        className="w-full h-full flex items-center justify-center text-muted-foreground text-xs"
                        aria-hidden
                      >
                        —
                      </div>
                    )}
                  </div>
                  <div>
                    <span className="text-xs text-muted-foreground">
                      {post.category.name}
                    </span>
                    <h3 className="font-heading font-semibold text-sm line-clamp-2 group-hover:text-primary transition-colors">
                      {post.title}
                    </h3>
                  </div>
                </div>
              </Link>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
