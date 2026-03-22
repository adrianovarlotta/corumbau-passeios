import type { Metadata } from "next"
import { DM_Sans, Inter, JetBrains_Mono } from "next/font/google"
import { Toaster } from "@/components/ui/sonner"
import { TooltipProvider } from "@/components/ui/tooltip"
import { QueryProvider } from "@/components/providers/QueryProvider"
import "./globals.css"

const dmSans = DM_Sans({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
})

const inter = Inter({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
})

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "Corumbau Passeios — Reserve seus passeios online",
  description: "Passeios de Baleia Jubarte, barco e buggy no paraíso do Corumbau, Bahia. Reserve online com Pix ou cartão.",
  keywords: ["Corumbau", "Baleia Jubarte", "passeios", "barco", "buggy", "Bahia", "ecoturismo"],
  openGraph: {
    title: "Corumbau Passeios",
    description: "Experiências únicas no paraíso do Corumbau",
    type: "website",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR">
      <body className={`${inter.variable} ${dmSans.variable} ${jetbrainsMono.variable} font-sans antialiased`}>
        <QueryProvider>
          <TooltipProvider>
            {children}
          </TooltipProvider>
        </QueryProvider>
        <Toaster richColors position="top-right" />
      </body>
    </html>
  )
}
