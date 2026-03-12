// app/admin/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Header from "@/components/Header";
import AdminReportedPosts from "@/components/AdminReportedPosts";
import AdminAllowlist from "@/components/AdminAllowlist";

type AdminTab = "reported" | "allowlist";

export default function AdminPage() {
  const { data: session, status } = useSession();
  const [activeTab, setActiveTab] = useState<AdminTab>("reported");
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-warm-200 mb-4 animate-pulse-slow">
            <span className="text-3xl">🔒</span>
          </div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!session?.user?.isAdmin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-soft-50 via-warm-50 to-soft-100">
        <Header />
        <main className="max-w-2xl mx-auto px-4 py-8">
          <div className="card-lg bg-red-50 border-red-200 text-center py-12">
            <p className="text-red-700 font-bold text-lg mb-2">Access Denied</p>
            <p className="text-red-600">You don't have admin access.</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-soft-50 via-warm-50 to-soft-100">
      <Header />

      <main className="max-w-4xl mx-auto px-4 py-8 sm:py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-gray-900 mb-2">
            Admin Dashboard
          </h1>
          <p className="text-gray-600">Manage moderation and community settings</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-8 border-b border-warm-200">
          <button
            onClick={() => setActiveTab("reported")}
            className={`pb-3 font-medium transition-colors ${
              activeTab === "reported"
                ? "border-b-2 border-warm-600 text-warm-600"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Reported Posts
          </button>
          <button
            onClick={() => setActiveTab("allowlist")}
            className={`pb-3 font-medium transition-colors ${
              activeTab === "allowlist"
                ? "border-b-2 border-warm-600 text-warm-600"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Email Allowlist
          </button>
        </div>

        {/* Content */}
        {activeTab === "reported" && (
          <AdminReportedPosts refreshTrigger={refreshTrigger} />
        )}
        {activeTab === "allowlist" && (
          <AdminAllowlist
            onUpload={() => setRefreshTrigger((prev) => prev + 1)}
          />
        )}
      </main>
    </div>
  );
}
