import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import NotificationStack from '@/components/shared/NotificationStack';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ATHLiON | The Ultimate Fitness Competition",
  description: "Register for the world's premier fitness racing series. Challenge yourself across strength and endurance.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <body className={`${inter.className} antialiased`}>
        <AuthProvider>
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-grow">
              {children}
            </main>
            <NotificationStack />
            <Footer />
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
