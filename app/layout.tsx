import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { Plus_Jakarta_Sans, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header";
import { UserSync } from "@/components/UserSync";

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "BesLiving - Co-living That Feels Like Home",
  description: "Find your perfect co-living space. Connect with like-minded people, move in seamlessly, and build community.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider
      signInUrl="/auth"
      signUpUrl="/auth"
      afterSignOutUrl="/"
    >
      <html lang="en">
        <body
          className={`${plusJakarta.variable} ${geistMono.variable} font-sans antialiased`}
        >
          <Header />
        <UserSync />
        {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
