import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "NextResume AI — Smart ATS-Friendly Resume Builder",
  description: "Create, polish, and audit professional ATS-optimized resumes with real-time preview and AI intelligence.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-slate-50 text-slate-900 font-sans">
        {children}
      </body>
    </html>
  );
}
