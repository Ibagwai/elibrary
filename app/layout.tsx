import './globals.css'
import type { Metadata } from 'next'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Breadcrumbs from '@/components/Breadcrumbs'
import { Providers } from '@/components/Providers'
import CommandPalette from '@/components/shared/CommandPalette'
import { ToastProvider } from '@/lib/toast'

const appName = process.env.NEXT_PUBLIC_APP_NAME || 'K7 E-Library'
const appTagline = process.env.NEXT_PUBLIC_APP_TAGLINE || 'Digital Knowledge Hub'

export const metadata: Metadata = {
  title: appName,
  description: `${appName} - ${appTagline}`,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900">
        <ToastProvider>
          <Providers>
            <CommandPalette />
            <Header />
            <Breadcrumbs />
            <main className="flex-1">{children}</main>
            <Footer />
          </Providers>
        </ToastProvider>
      </body>
    </html>
  )
}
