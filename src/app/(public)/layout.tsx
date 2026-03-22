import Image from 'next/image'
import { TideIndicator } from '@/components/tide/TideIndicator'

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-muted/30">
      {/* App bar — ocean blue */}
      <header className="sticky top-0 z-50 bg-primary">
        <div className="flex items-center justify-between px-4 h-14">
          <div className="flex items-center gap-2.5">
            <Image
              src="/images/logo.avif"
              alt="Corumbau Passeios"
              width={32}
              height={32}
              className="rounded-full"
            />
            <span className="font-display text-base font-bold text-white tracking-tight">
              Corumbau Passeios
            </span>
          </div>

          {/* Tide indicator */}
          <TideIndicator />
        </div>
      </header>

      <main className="flex-1">{children}</main>
    </div>
  )
}
