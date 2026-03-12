// app/posts/[postId]/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Header from "@/components/Header";
import Comments from "@/components/Comments";

interface Post {
  id: string;
  content: string;
  category: string;
  createdAt: string;
  reactionCounts: Record<string, number>;
  comments: Array<{
    id: string;
    content: string;
    createdAt: string;
    _count: { reactions: number };
  }>;
}

const REACTIONS = [
  { type: "SUPPORT", emoji: "❤️", label: "Support" },
  { type: "AGREE", emoji: "👍", label: "Agree" },
  { type: "HUG", emoji: "🤗", label: "Hug" },
];

export default function PostPage() {
  const params = useParams();
  const postId = params.postId as string;

  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reactingTo, setReactingTo] = useState<string | null>(null);

  useEffect(() => {
    fetchPost();
  }, [postId]);

  const fetchPost = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/posts/${postId}`);

      if (!response.ok) {
        throw new Error("Post not found");
      }

      const data = await response.json();
      setPost(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load post"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleReaction = async (type: string) => {
    try {
      setReactingTo(type);

      const response = await fetch("/api/reactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, postId }),
      });

      if (!response.ok) {
        throw new Error("Failed to add reaction");
      }

      // Refresh post to get updated reaction counts
      await fetchPost();
    } catch (err) {
      console.error("Error adding reaction:", err);
    } finally {
      setReactingTo(null);
    }
  };

  const handleCommentAdded = () => {
    fetchPost();
  };

  const handleReportPost = async () => {
    const reason = prompt(
      "Why are you reporting this post? (required)"
    );

    if (!reason || reason.trim().length === 0) {
      return;
    }

    try {
      const response = await fetch(`/api/posts/${postId}/report`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reason: reason.trim() }),
      });

      if (!response.ok) {
        throw new Error("Failed to report post");
      }

      alert("Thank you for reporting this post. Our team will review it.");
    } catch (err) {
      alert("Failed to report post. Please try again.");
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-soft-50 via-warm-50 to-soft-100">
        <Header />
        <main className="max-w-2xl mx-auto px-4 py-8">
          <div className="card-lg animate-pulse h-96"></div>
        </main>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-soft-50 via-warm-50 to-soft-100">
        <Header />
        <main className="max-w-2xl mx-auto px-4 py-8">
          <div className="card-lg bg-red-50 border-red-200">
            <h2 className="text-xl font-bold text-red-700 mb-2">⚠️ Error</h2>
            <p className="text-red-600 mb-4">{error || "Post not found"}</p>
            <Link href="/" className="btn-secondary">
              ← Back to feed
            </Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-soft-50 via-warm-50 to-soft-100">
      <Header />

      <main className="max-w-2xl mx-auto px-4 py-8">
        {/* Back button */}
        <Link href="/" className="inline-flex items-center gap-1 text-warm-600 hover:text-warm-700 mb-6">
          ← Back to feed
        </Link>

        {/* Post */}
        <article className="card-lg mb-6">
          {/* Header */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-3">
              <span className="badge badge-primary">
                {post.category}
              </span>
              <button
                onClick={handleReportPost}
                className="text-gray-400 hover:text-red-600 transition-colors"
                title="Report post"
              >
                🚩
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="mb-6 pb-6 border-b border-warm-200">
            <p className="text-lg text-gray-800 whitespace-pre-wrap leading-relaxed">
              {post.content}
            </p>
          </div>

          {/* Reactions */}
          <div className="flex flex-wrap gap-2">
            {REACTIONS.map((reaction) => (
              <button
                key={reaction.type}
                onClick={() => handleReaction(reaction.type)}
                disabled={reactingTo === reaction.type}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-warm-100 text-warm-700 hover:bg-warm-200 transition-colors disabled:opacity-50"
              >
                <span>{reaction.emoji}</span>
                <span className="text-sm font-medium">
                  {post.reactionCounts[reaction.type] || "0"}
                </span>
              </button>
            ))}
          </div>
        </article>

        {/* Comments section */}
        <Comments
          postId={postId}
          comments={post.comments}
          onCommentAdded={handleCommentAdded}
        />
      </main>
    </div>
  );
}
