import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "বিশ্বাস পরিবার বংশলতিকা | Bishaws Family Heritage Tree",
  description: "পারিবারিক বংশলতিকা ও স্মৃতি অ্যালবাম - আব্দুল ওদুশ বিশ্বাস ও ফেরেজা বেগম পরিবার",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="bn" className="h-full antialiased scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Hind+Siliguri:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full flex flex-col bg-slate-50 text-slate-800 selection:bg-amber-100 selection:text-amber-900">
        {children}
      </body>
    </html>
  );
}
