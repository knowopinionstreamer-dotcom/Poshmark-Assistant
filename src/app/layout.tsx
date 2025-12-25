import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster"
import { Sidebar } from "@/components/sidebar";

export const metadata: Metadata = {
  title: 'Poshmark Assistant ver1.0',
  description: 'Your AI-powered assistant for faster, smarter reselling.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased flex">
        <Sidebar />
        <main className="flex-1 md:ml-64 p-8 bg-background min-h-screen">
            {children}
        </main>
        <Toaster />
      </body>
    </html>
  );
}
