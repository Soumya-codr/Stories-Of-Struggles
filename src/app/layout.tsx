import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster"
import AppLayout from '@/components/layout/app-layout';

export const metadata: Metadata = {
  title: 'Stories Of Struggles',
  description: 'A place for developers to share the stories behind their projects.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased">
        <div className="fixed top-0 left-0 w-full h-full z-[-1]">
          <div className="absolute top-[-20%] left-[-20%] w-[50vw] h-[50vh] bg-primary/20 rounded-full filter blur-[150px] opacity-40"></div>
          <div className="absolute bottom-[-20%] right-[-20%] w-[50vw] h-[50vh] bg-pink-500/20 rounded-full filter blur-[150px] opacity-40"></div>
        </div>
        <AppLayout>
          {children}
        </AppLayout>
        <Toaster />
      </body>
    </html>
  );
}
