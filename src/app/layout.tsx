import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "AM News - Quality Journalism & News",
    template: "%s | AM News",
  },
  description:
    "Delivering quality journalism and in-depth analysis on Politics, Technology, Business, Sports, Culture, Science, World News, and Opinion. Stay informed with AM News.",
  keywords: [
    "news",
    "journalism",
    "politics",
    "technology",
    "business",
    "sports",
    "culture",
    "science",
    "world news",
    "opinion",
    "breaking news",
    "analysis",
  ],
  authors: [{ name: "AM News" }],
  creator: "AM News",
  publisher: "AM News",

  // Open Graph (for Facebook, WhatsApp, LinkedIn, etc.)
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://yourdomain.com", // Replace with your actual domain
    siteName: "AM News",
    title: "AM News - Quality Journalism & News",
    description:
      "Delivering quality journalism and in-depth analysis on the stories that matter most. Read breaking news, expert opinions, and comprehensive coverage.",
    images: [
      {
        url: "https://yourdomain.com/og-image.jpg", // Replace with your actual OG image URL
        width: 1200,
        height: 630,
        alt: "AM News - News & Journalism",
      },
    ],
  },

  // Twitter Card
  twitter: {
    card: "summary_large_image",
    title: "AM News - Quality Journalism & News",
    description:
      "Delivering quality journalism and in-depth analysis on the stories that matter most.",
    images: ["https://yourdomain.com/og-image.jpg"], // Replace with your actual image URL
    creator: "@apocalypsemedia", // Replace with your Twitter handle
    site: "@apocalypsemedia", // Replace with your Twitter handle
  },

  // Additional metadata
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  // Verification tags (add these when you have them)
  // verification: {
  //   google: "your-google-verification-code",
  //   yandex: "your-yandex-verification-code",
  // },

  // App-specific metadata
  applicationName: "AM News",
  category: "news",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Favicon - multiple sizes for different devices */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />

        {/* Theme color for mobile browsers */}
        <meta name="theme-color" content="#1E2124" />
        <meta
          name="theme-color"
          media="(prefers-color-scheme: light)"
          content="#ffffff"
        />
        <meta
          name="theme-color"
          media="(prefers-color-scheme: dark)"
          content="#1E2124"
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
