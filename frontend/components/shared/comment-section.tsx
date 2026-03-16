'use client';

import { motion } from 'framer-motion';
import { MessageCircle, Send, Heart } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { formatRelativeTime } from '@/lib/utils';
import { useComments, usePostComment, useLikeComment } from '@/lib/hooks/use-comments';
import type { Comment } from '@/types';

interface CommentSectionProps {
  entityType: Comment['entityType'];
  entityId: string;
  comments?: Comment[];
  compact?: boolean;
}

function LikeButton({ comment }: { comment: Comment }) {
  const likeComment = useLikeComment();

  const handleLike = () => {
    likeComment.mutate({ commentId: comment.id, entityType: comment.entityType, entityId: comment.entityId });
  };

  return (
    <button
      type="button"
      onClick={handleLike}
      disabled={likeComment.isPending}
      className="flex items-center gap-1 text-xs text-muted-foreground hover:text-red-500 transition-colors"
    >
      <Heart
        className={`h-3.5 w-3.5 transition-colors ${comment.likedByMe ? 'fill-red-500 text-red-500' : ''}`}
      />
      {comment.likes > 0 && <span>{comment.likes}</span>}
    </button>
  );
}

function CommentItem({ comment, compact }: { comment: Comment; compact?: boolean }) {
  return (
    <div className="flex gap-3">
      <Avatar className={compact ? 'h-8 w-8' : 'h-10 w-10 flex-shrink-0'}>
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
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className={compact ? 'font-medium text-sm' : 'font-medium'}>{comment.authorName}</span>
          <span className="text-xs text-muted-foreground">
            {formatRelativeTime(comment.createdAt)}
          </span>
          {comment.status === 'pending' && (
            <span className="text-xs text-yellow-600 bg-yellow-100 px-2 py-0.5 rounded">
              Pending
            </span>
          )}
        </div>
        <p className={compact ? 'text-sm text-muted-foreground' : 'text-muted-foreground'}>
          {comment.content}
        </p>
        <div className="mt-1">
          <LikeButton comment={comment} />
        </div>
        {comment.replies && comment.replies.length > 0 && (
          <div className="mt-3 space-y-3 pl-4 border-l-2">
            {comment.replies.map((reply) => (
              <CommentItem key={reply.id} comment={reply} compact />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export function CommentSection({
  entityType,
  entityId,
  comments: initialComments,
  compact = false,
}: CommentSectionProps) {
  const { data: comments = [], isLoading, isRefetching } = useComments(entityType, entityId, {
    initialData: initialComments,
    enabled: Boolean(entityType && entityId),
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
      { entityType, entityId, authorName: name, authorEmail: email || undefined, content },
      { onSuccess: () => { form.reset(); } },
    );
  };

  if (compact) {
    return (
      <div className="space-y-4">
        <h3 className="text-sm font-semibold flex items-center gap-1.5">
          <MessageCircle className="h-4 w-4" />
          Comments ({comments.length})
          {isRefetching && (
            <span className="text-xs text-muted-foreground font-normal">(updating…)</span>
          )}
        </h3>

        <div className="bg-muted/50 rounded-lg p-4 space-y-3">
          {showSuccess && (
            <p className="text-xs text-green-600 bg-green-500/10 p-2 rounded">
              Comment submitted — pending approval.
            </p>
          )}
          {error && (
            <p className="text-xs text-destructive bg-destructive/10 p-2 rounded">{error}</p>
          )}
          <form onSubmit={handleSubmit} className="space-y-2">
            <div className="grid grid-cols-2 gap-2">
              <Input name="name" placeholder="Name *" required className="h-8 text-sm" />
              <Input type="email" name="email" placeholder="Email" className="h-8 text-sm" />
            </div>
            <Textarea name="content" placeholder="Your comment..." rows={2} required className="text-sm resize-none" />
            <Button type="submit" size="sm" disabled={isSubmitting}>
              {isSubmitting ? 'Posting...' : (<><Send className="h-3 w-3 mr-1" /> Post</>)}
            </Button>
          </form>
        </div>

        <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
          {isLoading && comments.length === 0 ? (
            <p className="text-center text-muted-foreground text-sm py-4">Loading…</p>
          ) : comments.length === 0 ? (
            <p className="text-center text-muted-foreground text-sm py-4">
              No comments yet.
            </p>
          ) : (
            comments.map((comment) => (
              <CommentItem key={comment.id} comment={comment} compact />
            ))
          )}
        </div>
      </div>
    );
  }

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
              <Textarea name="content" placeholder="Share your thoughts..." rows={4} required />
            </div>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Submitting...' : (<><Send className="h-4 w-4 mr-2" /> Post Comment</>)}
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
              >
                <CommentItem comment={comment} />
              </motion.article>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
