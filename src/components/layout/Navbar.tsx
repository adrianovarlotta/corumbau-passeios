'use client'

import Link from 'next/link'
import { Menu, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ButtonLink } from '@/components/ui/button-link'
import { useState } from 'react'

export function Navbar() {
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
      <div className="container flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-xl font-bold text-primary">Corumbau</span>
          <span className="text-xl font-light text-muted-foreground">Passeios</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-6">
          <Link href="/passeios" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            Passeios
          </Link>
          <Link href="/passeios?category=WHALE" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            Baleias
          </Link>
          <ButtonLink href="/passeios">Reservar Agora</ButtonLink>
        </nav>

        {/* Mobile menu button */}
        <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setOpen(!open)}>
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {/* Mobile nav */}
      {open && (
        <nav className="md:hidden border-t px-4 py-4 space-y-3 bg-background">
          <Link href="/passeios" className="block text-sm font-medium py-2" onClick={() => setOpen(false)}>
            Passeios
          </Link>
          <Link href="/passeios?category=WHALE" className="block text-sm font-medium py-2" onClick={() => setOpen(false)}>
            Baleias
          </Link>
          <ButtonLink href="/passeios" className="w-full" onClick={() => setOpen(false)}>
            Reservar Agora
          </ButtonLink>
        </nav>
      )}
    </header>
  )
}
