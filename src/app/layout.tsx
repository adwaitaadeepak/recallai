import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "RecallAI — Watch Less. Remember More.",
  description:
    "RecallAI turns YouTube videos into smart flashcards so you can learn faster and retain more. Paste a URL, generate flashcards, and study smarter.",
  keywords: ["flashcards", "YouTube", "learning", "AI", "study", "recall"],
  openGraph: {
    title: "RecallAI — Watch Less. Remember More.",
    description:
      "Turn any YouTube video into smart, study-ready flashcards with RecallAI.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;500;600;700;800&family=Sometype+Mono:wght@400;500;600;700&family=Unbounded:wght@500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
