// components/Comments.tsx
"use client";

import { useState } from "react";

interface Comment {
  id: string;
  content: string;
  createdAt: string;
  _count: { reactions: number };
}

interface CommentsProps {
  postId: string;
  comments: Comment[];
  onCommentAdded: () => void;
}

export default function Comments({
  postId,
  comments,
  onCommentAdded,
}: CommentsProps) {
  const [newComment, setNewComment] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!newComment.trim()) {
      setError("Please write a comment");
      return;
    }

    try {
      setIsLoading(true);

      const response = await fetch(`/api/posts/${postId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: newComment.trim() }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to add comment");
      }

      setNewComment("");
      onCommentAdded();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to add comment"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section>
      {/* Comment form */}
      <div className="card-lg mb-6">
        <h2 className="text-lg font-serif font-bold text-gray-900 mb-4">
          Comments ({comments.length})
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Anonymity reminder */}
          <div className="p-3 rounded-lg bg-warm-50 border border-warm-200">
            <p className="text-xs text-warm-700">
              🔒 Your comment will also be anonymous
            </p>
          </div>

          {/* Textarea */}
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Share your thoughts anonymously..."
            className="input-field resize-none h-24"
            disabled={isLoading}
          />

          {/* Character count */}
          <div className="flex items-center justify-between">
            <p className="text-xs text-gray-500">
              {newComment.length} / 2000 characters
            </p>
          </div>

          {/* Error message */}
          {error && (
            <div className="p-3 rounded-lg bg-red-50 border border-red-200">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          {/* Submit button */}
          <button
            type="submit"
            disabled={isLoading || !newComment.trim()}
            className="btn-primary w-full"
          >
            {isLoading ? "Posting..." : "Add Comment"}
          </button>
        </form>
      </div>

      {/* Comments list */}
      {comments.length > 0 ? (
        <div className="space-y-4">
          {comments.map((comment) => (
            <div key={comment.id} className="card-md">
              <p className="text-gray-700 mb-3">{comment.content}</p>
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>Just now</span>
                <span>👍 {comment._count.reactions}</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="card-md text-center py-8 bg-warm-50">
          <p className="text-gray-600">
            No comments yet. Be the first to share your thoughts!
          </p>
        </div>
      )}
    </section>
  );
}
