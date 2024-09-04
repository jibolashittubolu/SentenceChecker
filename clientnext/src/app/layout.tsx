import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
// import { ReactQueryClientProvider } from "@/providers/ReactQueryClient.provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Sentence/Text Checker Web App by JibolaDev",
  description: "You can write any text it and it will automatically help you to fix your grammatical errors. Developed by Moboluwarin Jibola-Shittu, https:jiboladev.com",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // <ReactQueryClientProvider >
      <html lang="en">
        <body className={inter.className}>{children}</body>
      </html>
    // </ReactQueryClientProvider>
  );
}
