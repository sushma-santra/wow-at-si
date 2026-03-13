// components/Header.tsx
"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

export default function Header() {
  const { data: session } = useSession();
  const [showMenu, setShowMenu] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur border-b border-warm-200">
      <div className="max-w-2xl mx-auto px-4 py-4 sm:py-5 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
          <Image src="/si-logo.svg" alt="SI Logo" width={56} height={28} priority />
          <span className="hidden sm:inline font-serif font-semibold text-gray-900 text-lg">
            World of Women @ SI
          </span>
        </Link>

        {/* Right side */}
        <div className="flex items-center gap-3">
          {/* Admin link */}
          {session?.user?.isAdmin && (
            <Link
              href="/admin"
              className="btn-ghost text-sm"
            >
              Admin
            </Link>
          )}

          {/* User menu */}
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="btn-secondary text-sm flex items-center gap-1"
            >
              <span>👤</span>
              <span className="hidden sm:inline">Menu</span>
            </button>

            {showMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-warm-200 overflow-hidden">
                <div className="px-4 py-3 border-b border-warm-200">
                  <p className="text-xs text-gray-500">Signed in as</p>
                  <p className="font-medium text-gray-900 truncate">{session?.user?.email}</p>
                </div>
                <button
                  onClick={() => {
                    signOut({ redirect: true, callbackUrl: "/login" });
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-warm-50 text-gray-700 transition-colors"
                >
                  Sign out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Anonymity notice */}
      <div className="bg-warm-50 border-b border-warm-200">
        <div className="max-w-2xl mx-auto px-4 py-2">
          <p className="text-xs text-warm-700 flex items-center gap-1">
            <span>🔒</span>
            All posts and comments on this platform are completely anonymous.
          </p>
        </div>
      </div>
    </header>
  );
}
