// components/PostCard.tsx
"use client";

import Link from "next/link";
import { formatTimeAgo } from "@/lib/dates";

interface PostCardProps {
  post: {
    id: string;
    content: string;
    category: string;
    createdAt: string;
    _count: {
      reactions: number;
      comments: number;
    };
  };
}

const CATEGORY_COLORS: Record<string, { bg: string; text: string; icon: string }> = {
  General: { bg: "bg-blue-100", text: "text-blue-700", icon: "💬" },
  Advice: { bg: "bg-purple-100", text: "text-purple-700", icon: "💡" },
  Workplace: { bg: "bg-amber-100", text: "text-amber-700", icon: "💼" },
  "Mental Health": { bg: "bg-pink-100", text: "text-pink-700", icon: "🧠" },
};

export default function PostCard({ post }: PostCardProps) {
  const categoryConfig = CATEGORY_COLORS[post.category] || CATEGORY_COLORS.General;
  const timeAgo = formatTimeAgo(post.createdAt);

  return (
    <Link href={`/posts/${post.id}`}>
      <div className="card-md hover:shadow-lg hover:border-warm-300 cursor-pointer group transition-all duration-200">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span className={`badge ${categoryConfig.bg} ${categoryConfig.text}`}>
                <span className="mr-1">{categoryConfig.icon}</span>
                {post.category}
              </span>
              <span className="text-xs text-gray-500">• {timeAgo}</span>
            </div>
          </div>
          <span className="text-gray-300 group-hover:text-warm-400 transition-colors">→</span>
        </div>

        {/* Content */}
        <p className="text-gray-700 line-clamp-3 mb-4 leading-relaxed">
          {post.content}
        </p>

        {/* Footer with stats */}
        <div className="flex items-center gap-4 text-sm text-gray-600 pt-4 border-t border-warm-100">
          <button
            className="flex items-center gap-1 hover:text-warm-600 transition-colors"
            onClick={(e) => {
              e.preventDefault();
            }}
          >
            <span>❤️</span>
            <span>{post._count.reactions || "React"}</span>
          </button>
          <div className="flex items-center gap-1 hover:text-warm-600 transition-colors">
            <span>💬</span>
            <span>{post._count.comments || "Comment"}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
