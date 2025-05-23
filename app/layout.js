import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/header";
import { ClerkProvider } from "@clerk/nextjs";
import CreateEventDrawer from "@/components/create-event";
import { Suspense } from "react";
export const metadata = {
  title: "Booking",
  description: "Booking app",
};

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>

      <html lang="en">
        <body
          className={inter.className}
        >
          <Header />
          <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white">{children}</main>
          <footer className="bg-blue-100 py-12">
            <div className="container mx-auto px-4">
              <p className="text-center text-sm text-gray-500">
                Made with ❤️ by Alex
              </p>
            </div>
          </footer>
          <Suspense>
            <CreateEventDrawer />
          </Suspense>
        </body>
      </html>
    </ClerkProvider>
  );
}
