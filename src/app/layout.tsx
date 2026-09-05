import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import MobileNavCapsule from "@/components/layout/MobileNavCapsule";
import NotificationStack from '@/components/shared/NotificationStack';
import ChatWidget from '@/components/ChatWidget';
import { JsonLd, getOrganizationSchema, getWebSiteSchema } from "@/components/seo/JsonLd";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL('https://www.athlion.in'),
  title: {
    default: "Athlion | Functional Fitness & Obstacle Course Racing in India",
    template: "%s | Athlion",
  },
  description: "Join India's premier functional fitness & obstacle course racing series. Test your strength, endurance, and performance across 2KM runs and 11 station challenges.",
  keywords: [
    "functional fitness",
    "functional training",
    "athletic performance",
    "strength training",
    "endurance training",
    "conditioning workouts",
    "fitness race India",
    "sports training",
    "gym training",
    "workout programs"
  ],
  alternates: {
    canonical: "https://www.athlion.in",
  },
  openGraph: {
    title: "Athlion | Functional Fitness & Obstacle Course Racing in India",
    description: "Join India's premier functional fitness and obstacle course racing series. 2KM Run. 11 Stations. No Limits.",
    url: "https://www.athlion.in",
    siteName: "Athlion",
    locale: "en_IN",
    type: "website",
    images: [
      {
        url: "/FINAL-ATH-LOGO.png",
        width: 1200,
        height: 630,
        alt: "Athlion - Functional Fitness & Obstacle Course Racing in India",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Athlion | Functional Fitness & Obstacle Course Racing in India",
    description: "Join India's premier functional fitness & obstacle course racing series.",
    images: ["/FINAL-ATH-LOGO.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: "googlee79688fd795f722d",
  },
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Athlion",
  },
  other: {
    "mobile-web-app-capable": "yes",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#000000",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <head>
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      </head>
      <body className={`${inter.className} antialiased`}>
        <JsonLd data={[getOrganizationSchema(), getWebSiteSchema()]} />
        <AuthProvider>
          <div className="flex flex-col min-h-screen min-h-dvh">
            <Navbar />
            <main className="flex-grow pb-0">
              {children}
            </main>
            <NotificationStack />
            <Footer />
            <MobileNavCapsule />
            <ChatWidget />
          </div>
        </AuthProvider>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', () => {
                  navigator.serviceWorker.register('/sw.js').catch(() => {});
                });
              }
              if (window.matchMedia('(display-mode: standalone)').matches) {
                document.body.classList.add('pwa-standalone');
              }
            `,
          }}
        />
      </body>
    </html>
  );
}
