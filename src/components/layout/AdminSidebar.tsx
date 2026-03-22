'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard,
  Ship,
  Wallet,
  BarChart3,
  LogOut,
  Menu,
  X,
  Waves,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useState } from 'react'

const navItems = [
  { href: '/admin', label: 'Overview', icon: LayoutDashboard },
  { href: '/admin/tours', label: 'Passeios', icon: Ship },
  { href: '/admin/commissions', label: 'Comissões', icon: Wallet },
  { href: '/admin/reports', label: 'Relatórios', icon: BarChart3 },
]

export function AdminSidebar() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  return (
    <>
      {/* Mobile toggle */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-[#172554] text-white flex items-center h-14 px-4">
        <Button variant="ghost" size="icon" onClick={() => setOpen(!open)} className="text-white hover:bg-white/10">
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
        <Waves className="ml-3 h-5 w-5 text-amber-400" />
        <span className="ml-2 font-display font-bold">Corumbau Admin</span>
      </div>

      {/* Sidebar */}
      <aside className={cn(
        'fixed inset-y-0 left-0 z-40 w-64 bg-[#172554] text-white flex flex-col transition-transform lg:translate-x-0',
        open ? 'translate-x-0' : '-translate-x-full'
      )}>
        <div className="h-14 flex items-center gap-3 px-6 border-b border-white/10">
          <Waves className="h-5 w-5 text-amber-400 shrink-0" />
          <Link href="/admin" className="font-display font-bold text-lg text-white">
            Corumbau Admin
          </Link>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href))
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors',
                  isActive
                    ? 'bg-white/15 text-white font-medium shadow-sm'
                    : 'text-white/60 hover:text-white hover:bg-white/10'
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            )
          })}
        </nav>

        <div className="p-3 border-t border-white/10">
          <button className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-white/60 hover:text-white hover:bg-white/10 w-full transition-colors">
            <LogOut className="h-4 w-4" />
            Sair
          </button>
        </div>
      </aside>

      {/* Mobile overlay */}
      {open && (
        <div className="fixed inset-0 z-30 bg-black/50 lg:hidden" onClick={() => setOpen(false)} />
      )}
    </>
  )
}
