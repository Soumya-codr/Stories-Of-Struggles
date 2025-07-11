import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster"
import AppLayout from '@/components/layout/app-layout';
import { inter } from './fonts';
import { cn } from '@/lib/utils';
import { AuthProvider } from '@/context/auth-context';

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
    <html lang="en" suppressHydrationWarning>
      <body className={cn("font-body antialiased dark", inter.variable)}>
        <AuthProvider>
          <div className="fixed top-0 left-0 w-full h-full z-[-1] opacity-50">
            <div className="absolute top-[-20%] left-[-20%] w-[50vw] h-[50vh] bg-primary/20 rounded-full filter blur-[150px] opacity-40"></div>
            <div className="absolute bottom-[-20%] right-[-20%] w-[50vw] h-[50vh] bg-blue-500/20 rounded-full filter blur-[150px] opacity-40"></div>
          </div>
          <AppLayout>
            {children}
          </AppLayout>
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}
