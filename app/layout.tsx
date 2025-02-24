import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import '../styles/globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Football Emissions Calculator',
  description: 'Track and analyze carbon emissions from football team travel',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  )
}

<header className="border-b">
  <div className="container mx-auto py-4 px-4 flex items-center justify-between">
    <div className="flex items-center">
      <Link href="/" className="font-bold text-lg mr-6">Football Emissions</Link>
      <nav className="flex space-x-4">
        <Link href="/dashboard" className="hover:text-primary">Dashboard</Link>
        <Link href="/matches" className="hover:text-primary">Matches</Link>
      </nav>
    </div>
  </div>
</header>
