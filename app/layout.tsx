import type { Metadata } from 'next'
import { Poppins } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const poppins = Poppins({
  subsets: ["latin"],
  weight: ['300', '400', '500', '600', '700', '800'],
  variable: '--font-poppins',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Starlin Vilorio — IT Support Specialist | System Administrator | Media Server Developer',
  description: 'IT Support Specialist and System Administrator with 13+ years of experience. Expert in networking, Windows/Linux administration, Docker, cloud technologies, and self-hosted media infrastructure. Open to remote roles worldwide.',
  keywords: ['IT Support Specialist', 'System Administrator', 'Help Desk', 'DNS Technician', 'Docker', 'Jellyfin', 'Cloudflare', 'Remote IT', 'Sysadmin', 'Network Engineer', 'Next.js', 'Dominican Republic'],
  authors: [{ name: 'Starlin Vilorio' }],
  openGraph: {
    title: 'Starlin Vilorio — IT Support & Sysadmin',
    description: 'Building reliable infrastructure, self-hosted platforms, and cloud deployments. 13+ years in IT support and system administration.',
    url: 'https://starlinit.com',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Starlin Vilorio — IT Support & Sysadmin',
    description: 'Building reliable infrastructure, self-hosted platforms, and cloud deployments.',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${poppins.variable} bg-background`}>
      <body className="font-sans antialiased">
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
