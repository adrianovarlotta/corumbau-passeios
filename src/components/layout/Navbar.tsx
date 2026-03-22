'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { ButtonLink } from '@/components/ui/button-link'
import { Menu, X, Waves } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useState, useEffect } from 'react'

const navLinks = [
  { href: '/passeios', label: 'Passeios' },
  { href: '/passeios?category=WHALE', label: 'Baleias' },
  { href: '/passeios?category=BOAT', label: 'Barcos' },
]

export function Navbar() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header
      className={cn(
        'sticky top-0 z-50 w-full transition-all duration-300',
        scrolled
          ? 'bg-white/90 backdrop-blur-lg shadow-md border-b border-blue-100/50'
          : 'bg-transparent'
      )}
    >
      <div className="container flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center group-hover:scale-105 transition-transform shadow-md">
            <Waves className="h-5 w-5 text-amber-300" />
          </div>
          <div className="flex flex-col">
            <span className="font-display text-xl font-bold text-primary leading-none tracking-tight">
              Corumbau
            </span>
            <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-amber-600">
              Passeios
            </span>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'px-4 py-2 text-sm font-medium rounded-lg transition-colors',
                pathname === link.href
                  ? 'bg-primary/10 text-primary'
                  : 'text-foreground/70 hover:text-primary hover:bg-primary/5'
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <ButtonLink href="/passeios" size="sm" className="bg-accent text-accent-foreground hover:bg-amber-500 font-semibold">
            Reservar Agora
          </ButtonLink>
        </div>

        <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setOpen(!open)}>
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {open && (
        <div className="md:hidden bg-white/95 backdrop-blur-lg border-t border-blue-100/50">
          <nav className="container px-4 py-4 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="block px-4 py-2.5 rounded-lg text-sm font-medium text-foreground/80 hover:bg-primary/5 hover:text-primary transition-colors"
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-2">
              <ButtonLink href="/passeios" className="w-full bg-accent text-accent-foreground hover:bg-amber-500 font-semibold">
                Reservar Agora
              </ButtonLink>
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
