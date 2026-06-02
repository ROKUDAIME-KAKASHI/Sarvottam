import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { HideOnDashboard } from "@/components/hide-on-dashboard";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Sarvottam – A New Era in Quality Excellence",
  description: "Bridging academia and industry to solve real-world quality challenges.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} antialiased`} suppressHydrationWarning>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="flex min-h-screen flex-col bg-background text-foreground" suppressHydrationWarning>
            <HideOnDashboard>
              <Navbar />
            </HideOnDashboard>
            <main className="flex-1">{children}</main>
            <HideOnDashboard>
              <Footer />
            </HideOnDashboard>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
