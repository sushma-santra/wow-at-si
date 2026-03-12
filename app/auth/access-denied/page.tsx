// app/auth/access-denied/page.tsx
import Link from "next/link";

export default function AccessDeniedPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-soft-50 via-warm-50 to-soft-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md text-center">
        {/* Icon */}
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-red-100 mb-6">
          <span className="text-5xl">🚫</span>
        </div>

        {/* Heading */}
        <h1 className="text-3xl sm:text-4xl font-serif font-bold text-gray-900 mb-3">
          Access Denied
        </h1>

        {/* Description */}
        <p className="text-gray-600 text-base sm:text-lg mb-8">
          Your email is not authorized to access this community. This space is reserved for approved members only.
        </p>

        {/* Info Box */}
        <div className="card-md mb-8 bg-blue-50 border-blue-200">
          <p className="text-sm text-blue-700">
            If you believe you should have access, please contact your organization administrator.
          </p>
        </div>

        {/* Action */}
        <Link
          href="/login"
          className="btn-primary inline-flex"
        >
          ← Return to Login
        </Link>
      </div>
    </div>
  );
}
