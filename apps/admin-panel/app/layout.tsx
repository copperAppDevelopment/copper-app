import type { Metadata, Viewport } from 'next';
import { RegistrarServiceWorker } from '@/components/pwa/RegistrarServiceWorker';
import './globals.css';

export const metadata: Metadata = {
  title: 'Copper - Panel Administrativo',
  description: 'Gestión integrada de copropiedades en Colombia',
  // Safari no lee el manifest para esto: el nombre y el ícono de la pantalla de inicio van aparte.
  appleWebApp: { capable: true, title: 'Copper', statusBarStyle: 'default' },
  icons: { icon: '/icons/icon-192.png', apple: '/icons/apple-touch-icon.png' },
};

export const viewport: Viewport = {
  themeColor: '#8A1C14',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className="antialiased bg-white dark:bg-slate-950 text-zinc-900 dark:text-slate-100 min-h-screen">
        {children}
        <RegistrarServiceWorker />
      </body>
    </html>
  );
}
