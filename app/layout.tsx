// app/layout.tsx
import type { Metadata, Viewport } from "next";
import Providers from "@/components/Providers";
import "./globals.css";

export const metadata: Metadata = {
  title: "Women Community - Safe Anonymous Space",
  description: "A safe, anonymous community space for women to share thoughts, ask questions, and support each other.",
  keywords: ["community", "women", "anonymous", "support", "safe"],
  robots: "index, follow",
  icons: {
    icon: "/favicon.ico",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <meta charSet="utf-8" />
        <meta name="theme-color" content="#e89d6f" />
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
