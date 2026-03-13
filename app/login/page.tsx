// app/login/page.tsx
"use client";

import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";

function LoginForm() {
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const callbackUrl = searchParams.get("callbackUrl") || "/";

  useEffect(() => {
    const errorParam = searchParams.get("error");
    if (errorParam === "access_denied") {
      setError("Your email is not authorized to access this application.");
    }
  }, [searchParams]);

  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const result = await signIn("google", {
        redirect: true,
        callbackUrl,
      });

      if (result?.error) {
        setError(result.error);
      }
    } catch (err) {
      console.error("Sign-in error:", err);
      setError("An error occurred during sign-in. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-soft-50 via-warm-50 to-soft-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-warm-200 mb-4">
            <span className="text-3xl">🌸</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-gray-900 mb-2">
            World of Women @ SI
          </h1>
          <p className="text-gray-600 text-base sm:text-lg">
            A safe, anonymous space for support and connection
          </p>
        </div>

        {/* Card */}
        <div className="card-lg">
          {/* Features */}
          <div className="mb-6 space-y-3">
            <div className="flex items-start gap-3">
              <span className="text-2xl">🔒</span>
              <div>
                <h3 className="font-semibold text-gray-900">Completely Anonymous</h3>
                <p className="text-sm text-gray-600">Your posts are never linked to your identity</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-2xl">💬</span>
              <div>
                <h3 className="font-semibold text-gray-900">Safe & Supportive</h3>
                <p className="text-sm text-gray-600">A moderated community focused on wellbeing</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-2xl">🤝</span>
              <div>
                <h3 className="font-semibold text-gray-900">Community Driven</h3>
                <p className="text-sm text-gray-600">Share, ask, and support fellow women</p>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-warm-200 my-6"></div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-4 rounded-lg bg-red-50 border border-red-200">
              <p className="text-red-700 text-sm font-medium">{error}</p>
              <p className="text-red-600 text-xs mt-1">
                If you believe this is an error, please contact your administrator.
              </p>
            </div>
          )}

          {/* Sign-in Button */}
          <button
            onClick={handleGoogleSignIn}
            disabled={isLoading}
            className="btn-primary w-full flex items-center justify-center gap-2 text-lg py-3.5 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="currentColor"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="currentColor"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="currentColor"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            {isLoading ? "Signing in..." : "Sign in with Google"}
          </button>

          {/* Info */}
          <p className="text-center text-xs text-gray-500 mt-4">
            We only access your email to verify you're authorized to use this space.
            <br />
            Your posts will be completely anonymous.
          </p>
        </div>

        {/* Footer */}
        <div className="mt-6 text-center text-xs text-gray-500">
          <p>This is a private community for authorized members only.</p>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gradient-to-br from-soft-50 via-warm-50 to-soft-100 flex items-center justify-center">
          <div className="text-center">
            <div className="inline-flex justify-center w-16 h-16 rounded-full bg-warm-200 mb-4 animate-pulse">
              <span className="text-3xl">🌸</span>
            </div>
            <p className="text-gray-600">Loading...</p>
          </div>
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
