import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { connectToDatabase } from "@/lib/db";
import { SiteSettings } from "@/lib/models";

import Script from 'next/script';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export async function generateMetadata(): Promise<Metadata> {
  try {
    await connectToDatabase();
    const settings = await SiteSettings.findOne();
    const title = settings?.siteName || 'Tectoflow';
    const favicon = settings?.faviconUrl || '/favicon.ico';
    return {
      title: {
        default: title,
        template: `%s | ${title}`
      },
      description: 'Tectoflow Digital Agency - Web Development, Cybersecurity, SEO, DevOps/Deployment, and UI/UX Design services.',
      icons: {
        icon: favicon,
      }
    };
  } catch (e) {
    return {
      title: 'Tectoflow',
      description: 'Tectoflow Digital Agency',
      icons: {
        icon: '/favicon.ico'
      }
    };
  }
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <Script
          id="theme-initializer"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('theme') || 'light';
                  document.documentElement.setAttribute('data-theme', theme);
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-bg text-text-primary">
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
