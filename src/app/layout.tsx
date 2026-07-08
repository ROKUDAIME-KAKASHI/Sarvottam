import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { HideOnDashboard } from "@/components/hide-on-dashboard";
import { Toaster } from "sonner";
import { auth } from "@/auth";
import { Chatbot } from "@/components/chatbot";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Sarvottam – A New Era in Quality Excellence",
  description: "Bridging academia and industry to solve real-world quality challenges.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} antialiased`} suppressHydrationWarning>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div
            className="flex min-h-screen flex-col bg-background text-foreground"
            suppressHydrationWarning
          >
            <HideOnDashboard>
              <Navbar />
            </HideOnDashboard>
            <main className="flex-1">{children}</main>
            <HideOnDashboard>
              <Footer />
            </HideOnDashboard>
            {session?.user && (
              <Chatbot
                user={{ name: session.user.name, role: (session.user as { role?: string }).role }}
              />
            )}
            <Toaster />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
