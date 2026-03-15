import { notFound } from 'next/navigation';
import Image from 'next/image';
import { getPostBySlug, getRelatedPosts, getCommentsByEntity, getSiteConfig } from '@/lib/data/data-source';
import { generateMetadata as generateSEOMetadata, generateArticleSchema } from '@/lib/seo/metadata';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { BlogContent } from '@/components/blog/blog-content';
import { RelatedPosts } from '@/components/blog/related-posts';
import { CommentSection } from '@/components/blog/comment-section';
import { formatDate } from '@/lib/utils';
import { Calendar, Clock, MessageCircle } from 'lucide-react';

export const dynamic = 'force-dynamic'; // so comments (and related posts) are always fresh

interface BlogPostPageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({ params }: BlogPostPageProps) {
  const [post, config] = await Promise.all([getPostBySlug(params.slug), getSiteConfig()]);

  if (!post) {
    return generateSEOMetadata(
      { title: 'Post Not Found', description: 'The requested blog post could not be found.' },
      config
    );
  }

  return generateSEOMetadata(
    {
      title: post.title,
      description: post.excerpt,
      keywords: post.tags.map((tag) => tag.name),
      ogImage: post.coverImage,
      ogType: 'article',
      canonicalUrl: `/blog/${post.slug}`,
    },
    config
  );
}

export async function generateStaticParams() {
  const { getAllPosts } = await import('@/lib/data/services');
  const posts = await getAllPosts();
  
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const post = await getPostBySlug(params.slug);

  if (!post) {
    notFound();
  }

  const [relatedPosts, comments, config] = await Promise.all([
    getRelatedPosts(post.id, 3),
    getCommentsByEntity('post', post.slug),
    getSiteConfig(),
  ]);

  const jsonLd = generateArticleSchema(post, config);

  return (
    <>
      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <article className="pt-24 pb-16">
        {/* Hero Section */}
        <header className="container mx-auto px-4 sm:px-6 lg:px-8 mb-12">
          <div className="max-w-4xl mx-auto">
            {/* Breadcrumbs */}
            <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
              <a href="/" className="hover:text-foreground transition-colors">
                Home
              </a>
              <span>/</span>
              <a href="/blog" className="hover:text-foreground transition-colors">
                Blog
              </a>
              <span>/</span>
              <span className="text-foreground truncate">{post.title}</span>
            </nav>

            {/* Category */}
            <Badge className="mb-4">{post.category.name}</Badge>

            {/* Title */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-heading font-bold mb-4">
              {post.title}
            </h1>

            {/* Subtitle */}
            {post.subtitle && (
              <p className="text-xl text-muted-foreground mb-6">
                {post.subtitle}
              </p>
            )}

            {/* Meta */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={post.author.avatar} alt={post.author.name} />
                  <AvatarFallback>{post.author.name[0]}</AvatarFallback>
                </Avatar>
                <span className="font-medium text-foreground">
                  {post.author.name}
                </span>
              </div>
              <span className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                {formatDate(post.publishedAt)}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {post.readingTime} min read
              </span>
              <span className="flex items-center gap-1">
                <MessageCircle className="h-4 w-4" />
                {post.commentCount} comments
              </span>
            </div>
          </div>
        </header>

        {/* Cover Image */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 mb-12">
          <div className="max-w-5xl mx-auto">
            <div className="relative aspect-[21/9] rounded-2xl overflow-hidden">
              <Image
                src={post.coverImage}
                alt={post.title}
                fill
                className="object-cover"
                sizes="(max-width: 1280px) 100vw, 1280px"
                priority
              />
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <BlogContent content={post.content} />

            {/* Tags */}
            <div className="mt-12 pt-8 border-t">
              <h3 className="text-sm font-medium mb-3">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <a
                    key={tag.id}
                    href={`/blog?tag=${tag.slug}`}
                    className="px-3 py-1 rounded-full text-sm bg-muted hover:bg-muted/80 transition-colors"
                  >
                    {tag.name}
                  </a>
                ))}
              </div>
            </div>

            {/* Author Box */}
            <div className="mt-12 p-6 bg-muted/50 rounded-xl">
              <div className="flex items-start gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={post.author.avatar} alt={post.author.name} />
                  <AvatarFallback>{post.author.name[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-heading font-semibold text-lg">
                    Written by {post.author.name}
                  </h3>
                  <p className="text-muted-foreground text-sm mt-1">
                    {post.author.bio}
                  </p>
                  <div className="flex gap-3 mt-3">
                    {post.author.socialLinks.map((link) => (
                      <a
                        key={link.platform}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-primary hover:underline"
                      >
                        {link.label}
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <Separator className="my-16" />

        {/* Related Posts */}
        <RelatedPosts posts={relatedPosts} />

        <Separator className="my-16" />

        {/* Comments */}
        <CommentSection
          entityType="post"
          entityId={post.slug}
          comments={comments}
        />
      </article>
    </>
  );
}
