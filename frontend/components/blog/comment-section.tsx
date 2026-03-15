'use client';

import { motion } from 'framer-motion';
import { MessageCircle, Send } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { formatRelativeTime } from '@/lib/utils';
import { useComments, usePostComment } from '@/lib/hooks/use-comments';
import type { Comment } from '@/types';

interface CommentSectionProps {
  entityType: Comment['entityType'];
  entityId: string;
  comments: Comment[];
}

export function CommentSection({
  entityType,
  entityId,
  comments: initialComments,
}: CommentSectionProps) {
  const { data: comments = [], isLoading, isRefetching } = useComments(entityType, entityId, {
    initialData: initialComments,
  });
  const postComment = usePostComment();

  const isSubmitting = postComment.isPending;
  const showSuccess = postComment.isSuccess && !postComment.isPending;
  const error = postComment.isError ? (postComment.error as Error).message : null;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const name = (form.elements.namedItem('name') as HTMLInputElement)?.value?.trim();
    const email = (form.elements.namedItem('email') as HTMLInputElement)?.value?.trim();
    const content = (form.elements.namedItem('content') as HTMLTextAreaElement)?.value?.trim();
    if (!name || !content) return;

    postComment.mutate(
      {
        entityType,
        entityId,
        authorName: name,
        authorEmail: email || undefined,
        content,
      },
      {
        onSuccess: () => {
          form.reset();
        },
      }
    );
  };

  return (
    <section className="container mx-auto px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-heading-3 font-heading font-semibold mb-8 flex items-center gap-2">
          <MessageCircle className="h-6 w-6" />
          Comments ({comments.length})
          {isRefetching && (
            <span className="text-xs text-muted-foreground font-normal">(updating…)</span>
          )}
        </h2>

        <div className="bg-card border rounded-xl p-6 mb-8">
          <h3 className="font-semibold mb-4">Leave a comment</h3>

          {showSuccess && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 p-3 bg-green-500/10 text-green-600 rounded-lg text-sm"
            >
              Your comment has been submitted and is pending approval.
            </motion.div>
          )}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 p-3 bg-destructive/10 text-destructive rounded-lg text-sm"
            >
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Name *</label>
                <Input name="name" placeholder="Your name" required />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Email (optional)</label>
                <Input type="email" name="email" placeholder="your@email.com" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Comment *</label>
              <Textarea
                name="content"
                placeholder="Share your thoughts..."
                rows={4}
                required
              />
            </div>
            <Button
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                'Submitting...'
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  Post Comment
                </>
              )}
            </Button>
          </form>
        </div>

        <div className="space-y-6">
          {isLoading && comments.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">Loading comments…</p>
          ) : comments.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              No comments yet. Be the first to share your thoughts!
            </p>
          ) : (
            comments.map((comment, index) => (
              <motion.article
                key={comment.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="flex gap-4"
              >
                <Avatar className="h-10 w-10 flex-shrink-0">
                  {comment.authorAvatar && (
                    <AvatarImage src={comment.authorAvatar} alt={comment.authorName} />
                  )}
                  <AvatarFallback>
                    {comment.authorName
                      .split(' ')
                      .map((n) => n[0])
                      .join('')}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium">{comment.authorName}</span>
                    <span className="text-xs text-muted-foreground">
                      {formatRelativeTime(comment.createdAt)}
                    </span>
                    {comment.status === 'pending' && (
                      <span className="text-xs text-yellow-600 bg-yellow-100 px-2 py-0.5 rounded">
                        Pending
                      </span>
                    )}
                  </div>
                  <p className="text-muted-foreground">{comment.content}</p>
                  {comment.replies && comment.replies.length > 0 && (
                    <div className="mt-4 space-y-4 pl-4 border-l-2">
                      {comment.replies.map((reply) => (
                        <div key={reply.id} className="flex gap-3">
                          <Avatar className="h-8 w-8">
                            {reply.authorAvatar && (
                              <AvatarImage src={reply.authorAvatar} alt={reply.authorName} />
                            )}
                            <AvatarFallback>{reply.authorName[0]}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-medium text-sm">{reply.authorName}</span>
                              <span className="text-xs text-muted-foreground">
                                {formatRelativeTime(reply.createdAt)}
                              </span>
                            </div>
                            <p className="text-sm text-muted-foreground">{reply.content}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </motion.article>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
