import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/components/providers/auth-provider";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "700", "900"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: {
    default: "Cyna - Pure player en cybersécurité pour PME et MSP",
    template: "%s | Cyna"
  },
  description: "Cyna protège les entreprises contre les cyberattaques. SOC 24/7, audit de sécurité, pentest et réponse à incident pour PME et MSP.",
  keywords: ["cybersécurité", "SOC", "audit sécurité", "pentest", "PME", "MSP", "CERT", "protection cyberattaque"],
  authors: [{ name: "Cyna IT" }],
  creator: "Cyna IT",
  publisher: "Cyna IT",
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "https://cyna-it.fr"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: "https://cyna-it.fr",
    title: "Cyna - Pure player en cybersécurité pour PME et MSP",
    description: "Cyna protège les entreprises contre les cyberattaques. SOC 24/7, audit de sécurité, pentest et réponse à incident.",
    siteName: "Cyna",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Cyna - Cybersécurité pour PME et MSP",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Cyna - Pure player en cybersécurité pour PME et MSP",
    description: "Cyna protège les entreprises contre les cyberattaques. SOC 24/7, audit de sécurité, pentest.",
    images: ["/og-image.png"],
  },
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
  verification: {
    google: "your-google-verification-code",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr" className="dark">
      <body 
        className={`${inter.variable} font-sans antialiased bg-[#111318] text-white min-h-screen`}
        style={{ fontFamily: "var(--font-inter), \"Noto Sans\", sans-serif" }}
      >
        <AuthProvider>
          <div className="relative flex size-full min-h-screen flex-col overflow-x-hidden">
            {children}
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
