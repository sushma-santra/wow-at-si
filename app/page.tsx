// app/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { Suspense } from "react";
import Header from "@/components/Header";
import PostList from "@/components/PostList";
import CreatePostButton from "@/components/CreatePostButton";
import CreatePostModal from "@/components/CreatePostModal";

function FeedContent() {
  const { data: session, status } = useSession();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-warm-200 mb-4 animate-pulse-slow">
            <span className="text-3xl">🌸</span>
          </div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  const handlePostCreated = () => {
    setShowCreateModal(false);
    // Trigger feed refresh
    setRefreshTrigger((prev) => prev + 1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-soft-50 via-warm-50 to-soft-100">
      <Header />

      <main className="max-w-2xl mx-auto px-4 py-8 sm:py-12">
        {/* Hero section */}
        <div className="mb-8">
          <h1 className="text-4xl sm:text-5xl font-serif font-bold text-gray-900 mb-3">
            Community
          </h1>
          <p className="text-gray-600 text-lg">
            Share your thoughts, ask questions, and support one another.
            <br className="hidden sm:block" />
            <span className="text-warm-600 font-medium">Everything here is completely anonymous.</span>
          </p>
        </div>

        {/* Create post button */}
        <CreatePostButton onClick={() => setShowCreateModal(true)} />

        {/* Posts feed */}
        <Suspense fallback={<div className="text-center py-8">Loading posts...</div>}>
          <PostList key={refreshTrigger} />
        </Suspense>
      </main>

      {/* Create post modal */}
      <CreatePostModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSuccess={handlePostCreated}
      />
    </div>
  );
}

export default function HomePage() {
  return <FeedContent />;
}
