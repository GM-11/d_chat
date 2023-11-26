import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'DChat',
  description: 'A decentralized open chat app',
  icons: {
    // '/favicon.png': 'any',
    icon: '/favicon.png',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <link rel="icon" href="./favicon.png" sizes="any" />
      <body className={inter.className}>{children}</body>
    </html>
  )
}
