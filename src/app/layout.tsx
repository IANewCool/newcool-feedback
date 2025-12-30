import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'NewCool Feedback | Encuestas y NPS',
  description: 'Sistema de feedback, encuestas y Net Promoter Score para la comunidad NewCool',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body className="antialiased">{children}</body>
    </html>
  )
}
