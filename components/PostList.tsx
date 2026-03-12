// components/PostList.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import PostCard from "@/components/PostCard";

interface Post {
  id: string;
  content: string;
  category: string;
  createdAt: string;
  _count: {
    reactions: number;
    comments: number;
  };
}

interface PostsResponse {
  posts: Post[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    pages: number;
  };
}

export default function PostList() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState<PostsResponse["pagination"] | null>(null);

  useEffect(() => {
    fetchPosts();
  }, [page]);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/posts?page=${page}`);

      if (!response.ok) {
        throw new Error("Failed to fetch posts");
      }

      const data: PostsResponse = await response.json();
      setPosts(data.posts);
      setPagination(data.pagination);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load posts"
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading && posts.length === 0) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="card-lg animate-pulse">
            <div className="h-24 bg-warm-100 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  if (error && posts.length === 0) {
    return (
      <div className="card-lg bg-red-50 border-red-200 text-center">
        <p className="text-red-700 font-medium mb-2">⚠️ Unable to load posts</p>
        <p className="text-red-600 text-sm mb-4">{error}</p>
        <button
          onClick={() => {
            setPage(1);
            fetchPosts();
          }}
          className="btn-secondary"
        >
          Try again
        </button>
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="card-lg text-center py-12">
        <div className="text-5xl mb-4">📭</div>
        <h3 className="text-xl font-serif font-bold text-gray-900 mb-2">
          No posts yet
        </h3>
        <p className="text-gray-600 mb-4">
          Be the first to share something. You can start a conversation!
        </p>
      </div>
    );
  }

  return (
    <div>
      {/* Posts */}
      <div className="space-y-4">
        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>

      {/* Pagination */}
      {pagination && pagination.pages > 1 && (
        <div className="flex justify-center gap-2 mt-8">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            ← Previous
          </button>

          <div className="flex items-center gap-2">
            {[...Array(pagination.pages)].map((_, i) => (
              <button
                key={i + 1}
                onClick={() => setPage(i + 1)}
                className={`px-3 py-2 rounded-lg transition-all ${
                  page === i + 1
                    ? "btn-primary"
                    : "btn-secondary hover:bg-warm-200"
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>

          <button
            onClick={() => setPage((p) => Math.min(pagination.pages, p + 1))}
            disabled={page === pagination.pages}
            className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next →
          </button>
        </div>
      )}

      {/* Total count */}
      {pagination && (
        <p className="text-center text-sm text-gray-500 mt-6">
          Showing {posts.length} of {pagination.total} posts
        </p>
      )}
    </div>
  );
}
