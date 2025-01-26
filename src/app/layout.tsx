import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import Header from "@/components/home/header";
import { Inter } from "next/font/google"
import {
  ClerkProvider
} from '@clerk/nextjs'
import { dark } from '@clerk/themes'
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: "WeSprints",
  description: "Project Management App",
};

const inter  = Inter({ subsets: ["latin"] })

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {


  return (
    <ClerkProvider appearance={{
      baseTheme: dark
    }}>
    <html lang="en" className="dark" suppressHydrationWarning>
      <body
        className={`${inter.className} antialiased`}
      >
        <ThemeProvider attribute="class" forcedTheme="dark" defaultTheme="dark">
          <Toaster/>
          <main>
            {children}
          </main>
    </ThemeProvider>
          
        
      </body>
    </html>
    </ClerkProvider>
  );
}
