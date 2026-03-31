import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import MobileNavCapsule from "@/components/layout/MobileNavCapsule";
import NotificationStack from '@/components/shared/NotificationStack';
import ChatWidget from '@/components/ChatWidget';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ATHLiON | The Ultimate Fitness Competition",
  description: "Register for India's premier fitness racing series. 1KM Run. 13 Stations. No Limits. Challenge yourself across strength and endurance.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "ATHLiON",
  },
  other: {
    "mobile-web-app-capable": "yes",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
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
