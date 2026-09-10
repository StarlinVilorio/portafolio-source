import type { Metadata } from 'next';
import { Poppins } from 'next/font/google';
import { Analytics } from '@vercel/analytics/next';
import './globals.css';
const poppins = Poppins({ subsets: ['latin'], weight: ['400', '500', '600', '700'], variable: '--font-poppins', display: 'swap' });
const title = 'Starlin Vilorio | Infraestructura, desarrollo e inteligencia artificial';
const description = 'Portafolio de Starlin Vilorio: más de 13 años en tecnología, aplicaciones propias, IA local y creación audiovisual. Desde República Dominicana para proyectos remotos.';
export const metadata: Metadata = { metadataBase: new URL('https://starlinit.com'), icons: { icon: '/icon.svg' }, title, description, authors: [{ name: 'Starlin Vilorio' }], alternates: { canonical: '/' }, keywords: ['Starlin Vilorio', 'StarlinIT', 'soporte técnico', 'administración de sistemas', 'desarrollo web', 'inteligencia artificial', 'Coral Better Graphic', 'República Dominicana'], openGraph: { title, description, url: 'https://starlinit.com', type: 'website', locale: 'es_DO' }, twitter: { card: 'summary_large_image', title, description } };
export default function RootLayout({ children }: Readonly<{
    children: React.ReactNode;
}>) { return <html lang="es" className={poppins.variable}><body>{children}{process.env.VERCEL === '1' && <Analytics />}</body></html>; }
