import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/layout/theme-provider";
import { AuthSessionProvider } from "@/components/layout/session-provider";
import { Toaster } from "@/components/ui/toaster";
import { LanguageProvider } from "@/components/layout/language-provider";

export const metadata: Metadata = {
  title: {
    default: "Hafif Saputra — Web & Fullstack Developer",
    template: "%s | Hafif Saputra",
  },
  description:
    "Web & Fullstack Developer yang fokus membangun backend yang kuat, API yang rapi, dan arsitektur database yang solid. Berbasis di Pekanbaru, Indonesia.",
  keywords: [
    "Hafif Saputra",
    "Web Developer",
    "Fullstack Developer",
    "Laravel Developer",
    "Backend Developer",
    "PHP Developer",
    "Pekanbaru",
    "Indonesia",
    "MySQL",
  ],
  authors: [{ name: "Hafif Saputra" }],
  creator: "Hafif Saputra",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://hafifsaputra.dev",
    title: "Hafif Saputra — Web & Fullstack Developer",
    description:
      "Web & Fullstack Developer yang fokus membangun backend yang kuat, API yang rapi, dan arsitektur database yang solid.",
    siteName: "Hafif Saputra Portfolio",
  },
  twitter: {
    card: "summary_large_image",
    title: "Hafif Saputra — Web & Fullstack Developer",
    description:
      "Web & Fullstack Developer yang fokus membangun backend yang kuat, API yang rapi, dan arsitektur database yang solid.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" suppressHydrationWarning>
      <head />
      <body>
        <AuthSessionProvider>
          <LanguageProvider>
            <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange={false}>
              {children}
              <Toaster />
            </ThemeProvider>
          </LanguageProvider>
        </AuthSessionProvider>
      </body>
    </html>
  );
}
