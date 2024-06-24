import type { Metadata } from "next";
import { Toaster } from "@/components/ui/sonner"
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider"
import Nav from "@/components/nav"

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Dash",
  description: "Crypto Dashboard & Analytics",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <Nav/>
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
