import { Outfit } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";
import { Metadata } from "next";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Realtime Chat - Conecta al instante",
  description: "Conecta al instante, en cualquier lugar.",
  icons: {
    icon: "/favicon.ico",
  },
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${outfit.variable} antialiased font-sans`}
      >
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
