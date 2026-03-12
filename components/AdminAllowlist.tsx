// components/AdminAllowlist.tsx
"use client";

import { useState, useRef } from "react";

interface AdminAllowlistProps {
  onUpload: () => void;
}

export default function AdminAllowlist({ onUpload }: AdminAllowlistProps) {
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];

    if (selectedFile) {
      if (!selectedFile.name.endsWith(".csv")) {
        setError("Please select a CSV file");
        setFile(null);
        return;
      }

      if (selectedFile.size > 5 * 1024 * 1024) {
        // 5MB limit
        setError("File must be smaller than 5MB");
        setFile(null);
        return;
      }

      setFile(selectedFile);
      setError(null);
      setSuccess(null);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError("Please select a file");
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/admin/upload-allowlist", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to upload");
      }

      const data = await response.json();
      setSuccess(`✓ Successfully uploaded ${data.count} email addresses`);
      setFile(null);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      onUpload();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to upload allowlist"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Instructions */}
      <div className="card-lg bg-blue-50 border-blue-200">
        <h3 className="font-semibold text-blue-900 mb-3">📋 CSV Format</h3>
        <p className="text-blue-800 text-sm mb-4">
          Upload a CSV file with an "email" column containing authorized email addresses.
        </p>
        <pre className="bg-white p-3 rounded border border-blue-200 text-xs overflow-auto mb-4">
{`email
user1@company.com
user2@company.com
user3@company.com`}
        </pre>
        <p className="text-blue-700 text-xs font-medium">
          ⚠️ Uploading a new file will replace the current allowlist.
        </p>
      </div>

      {/* Upload form */}
      <div className="card-lg">
        <div
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-warm-300 rounded-lg p-8 text-center cursor-pointer hover:border-warm-400 hover:bg-warm-50 transition-all"
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv"
            onChange={handleFileSelect}
            className="hidden"
          />

          <div className="text-5xl mb-3">📁</div>
          <p className="font-medium text-gray-900 mb-1">
            {file ? file.name : "Click to select CSV file"}
          </p>
          <p className="text-sm text-gray-600">
            or drag and drop (max 5MB)
          </p>
        </div>

        {/* Status messages */}
        {error && (
          <div className="mt-4 p-4 rounded-lg bg-red-50 border border-red-200">
            <p className="text-red-700 font-medium">⚠️ Error</p>
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        {success && (
          <div className="mt-4 p-4 rounded-lg bg-green-50 border border-green-200">
            <p className="text-green-700 font-medium">{success}</p>
          </div>
        )}

        {/* Upload button */}
        {file && (
          <button
            onClick={handleUpload}
            disabled={isLoading}
            className="w-full btn-primary mt-4"
          >
            {isLoading ? "Uploading..." : "Upload & Replace Allowlist"}
          </button>
        )}
      </div>

      {/* Info */}
      <div className="card-md bg-warm-50 border-warm-200">
        <p className="text-sm text-warm-900">
          💡 <strong>Tip:</strong> Users with emails in this list will be able to access
          the community after Google authentication.
        </p>
      </div>
    </div>
  );
}
