// components/AdminReportedPosts.tsx
"use client";

import { useState, useEffect } from "react";

interface ReportedPost {
  id: string;
  postId: string;
  reason: string;
  reviewed: boolean;
  action: string | null;
  createdAt: string;
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

interface AdminReportedPostsProps {
  refreshTrigger: number;
}

export default function AdminReportedPosts({ refreshTrigger }: AdminReportedPostsProps) {
  const [reports, setReports] = useState<ReportedPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actioningReport, setActioningReport] = useState<string | null>(null);

  useEffect(() => {
    fetchReports();
  }, [refreshTrigger]);

  const fetchReports = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch("/api/admin/reported-posts");

      if (!response.ok) {
        throw new Error("Failed to fetch reports");
      }

      const data = await response.json();
      setReports(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load reports"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (reportId: string, action: string) => {
    try {
      setActioningReport(reportId);

      const response = await fetch(`/api/admin/reported-posts/${reportId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });

      if (!response.ok) {
        throw new Error("Failed to process report");
      }

      // Remove from list
      setReports(reports.filter((r) => r.id !== reportId));
      alert(`Post ${action.toLowerCase()} successfully`);
    } catch (err) {
      alert(
        `Error: ${err instanceof Error ? err.message : "Failed to process report"}`
      );
    } finally {
      setActioningReport(null);
    }
  };

  if (loading && reports.length === 0) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="card-lg animate-pulse h-32"></div>
        ))}
      </div>
    );
  }

  if (error && reports.length === 0) {
    return (
      <div className="card-lg bg-red-50 border-red-200">
        <p className="text-red-700 font-medium mb-2">⚠️ Error</p>
        <p className="text-red-600 text-sm mb-4">{error}</p>
        <button
          onClick={fetchReports}
          className="btn-secondary"
        >
          Try again
        </button>
      </div>
    );
  }

  if (reports.length === 0) {
    return (
      <div className="card-lg text-center py-12 bg-green-50 border-green-200">
        <p className="text-green-700 font-medium text-lg">✅ All clear!</p>
        <p className="text-green-600 text-sm">No reported posts to moderate.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {reports.map((report) => (
        <div key={report.id} className="card-lg border-warm-300">
          {/* Report header */}
          <div className="flex items-start justify-between mb-4 pb-4 border-b border-warm-200">
            <div>
              <p className="text-xs font-medium text-gray-500 mb-1">
                REPORTED • {new Date(report.createdAt).toLocaleDateString()}
              </p>
              <p className="text-sm font-medium text-gray-700">
                Reason: {report.reason}
              </p>
            </div>
            <span className="badge badge-secondary">
              {report.reviewed ? "Reviewed" : "Pending"}
            </span>
          </div>

          {/* Post content */}
          <div className="mb-6 p-4 rounded-lg bg-gray-50 border border-gray-200">
            <p className="text-sm text-gray-600 mb-2">POST CONTENT:</p>
            <p className="text-gray-800 line-clamp-4 mb-2">{report.post.content}</p>
            <div className="flex gap-2 text-xs text-gray-500">
              <span>{report.post.category}</span>
              <span>• ❤️ {report.post._count.reactions} reactions</span>
              <span>• 💬 {report.post._count.comments} comments</span>
            </div>
          </div>

          {/* Actions */}
          {!report.reviewed ? (
            <div className="flex gap-2">
              <button
                onClick={() => handleAction(report.id, "APPROVED")}
                disabled={actioningReport === report.id}
                className="btn-secondary flex-1"
              >
                ✓ Approve
              </button>
              <button
                onClick={() => handleAction(report.id, "REMOVED")}
                disabled={actioningReport === report.id}
                className="btn-secondary flex-1"
              >
                🗑️ Remove
              </button>
              <button
                onClick={() => handleAction(report.id, "DISMISSED")}
                disabled={actioningReport === report.id}
                className="btn-secondary flex-1"
              >
                ↩️ Dismiss
              </button>
            </div>
          ) : (
            <div className="p-3 rounded-lg bg-blue-50 border border-blue-200">
              <p className="text-blue-700 text-sm font-medium">
                ✓ This report was {report.action?.toLowerCase()} on{" "}
                {new Date(report.createdAt).toLocaleDateString()}
              </p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
