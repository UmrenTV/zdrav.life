'use client';

import {
  useQuery,
  useMutation,
  useQueryClient,
  type UseQueryOptions,
} from '@tanstack/react-query';
import type { Comment } from '@/types';

const COMMENTS_QUERY_KEY = 'comments';

function getCommentsQueryKey(entityType: string, entityId: string): [string, string, string] {
  return [COMMENTS_QUERY_KEY, entityType, entityId];
}

async function fetchComments(
  entityType: string,
  entityId: string
): Promise<Comment[]> {
  const params = new URLSearchParams({ entityType, entityId });
  const res = await fetch(`/api/comments?${params.toString()}`);
  if (!res.ok) throw new Error('Failed to fetch comments');
  const data = await res.json();
  return data.comments ?? [];
}

export function useComments(
  entityType: string,
  entityId: string,
  options?: {
    initialData?: Comment[];
    enabled?: boolean;
  }
) {
  const queryKey = getCommentsQueryKey(entityType, entityId);
  return useQuery({
    queryKey,
    queryFn: () => fetchComments(entityType, entityId),
    initialData: options?.initialData,
    enabled: options?.enabled ?? Boolean(entityType && entityId),
  });
}

interface PostCommentVariables {
  entityType: string;
  entityId: string;
  authorName: string;
  authorEmail?: string;
  authorWebsite?: string;
  content: string;
}

async function postComment(vars: PostCommentVariables): Promise<Comment> {
  const res = await fetch('/api/comments', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      entityType: vars.entityType,
      entityId: vars.entityId,
      authorName: vars.authorName,
      authorEmail: vars.authorEmail,
      authorWebsite: vars.authorWebsite,
      content: vars.content,
    }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error((data.error as string) || 'Failed to post comment');
  if (!data.comment) throw new Error('No comment returned');
  return data.comment as Comment;
}

export function usePostComment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: postComment,
    onSuccess: (newComment, variables) => {
      const queryKey = getCommentsQueryKey(variables.entityType, variables.entityId);
      queryClient.setQueryData<Comment[]>(queryKey, (old) =>
        old ? [newComment, ...old] : [newComment]
      );
      queryClient.invalidateQueries({ queryKey });
    },
  });
}

interface LikeCommentVariables {
  commentId: string;
  entityType: string;
  entityId: string;
}

async function likeComment(vars: LikeCommentVariables): Promise<{ liked: boolean; likes: number }> {
  const res = await fetch(`/api/comments/${vars.commentId}/like`, { method: 'POST' });
  const data = await res.json();
  if (!res.ok) throw new Error((data.error as string) || 'Failed to toggle like');
  return data as { liked: boolean; likes: number };
}

export function useLikeComment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: likeComment,
    onMutate: async (vars) => {
      const queryKey = getCommentsQueryKey(vars.entityType, vars.entityId);
      await queryClient.cancelQueries({ queryKey });
      const previous = queryClient.getQueryData<Comment[]>(queryKey);
      queryClient.setQueryData<Comment[]>(queryKey, (old) =>
        old?.map((c) =>
          c.id === vars.commentId
            ? { ...c, likedByMe: !c.likedByMe, likes: c.likedByMe ? c.likes - 1 : c.likes + 1 }
            : c,
        ),
      );
      return { previous };
    },
    onError: (_err, vars, context) => {
      if (context?.previous) {
        const queryKey = getCommentsQueryKey(vars.entityType, vars.entityId);
        queryClient.setQueryData(queryKey, context.previous);
      }
    },
    onSettled: (_data, _err, vars) => {
      const queryKey = getCommentsQueryKey(vars.entityType, vars.entityId);
      queryClient.invalidateQueries({ queryKey });
    },
  });
}
