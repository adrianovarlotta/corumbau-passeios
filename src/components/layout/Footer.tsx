import Link from 'next/link'
import { Waves } from 'lucide-react'

export function Footer() {
  return (
    <footer className="bg-sky-950 text-blue-200/80">
      <div className="container px-4 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-amber-400 flex items-center justify-center">
                <Waves className="h-4 w-4 text-sky-950" />
              </div>
              <span className="font-display text-xl font-bold text-white">Corumbau Passeios</span>
            </div>
            <p className="text-sm leading-relaxed max-w-sm">
              Experiências únicas no paraíso do Corumbau, Bahia.
              Passeios de baleia jubarte, barco e buggy com reserva online.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-display text-sm font-bold text-amber-300 uppercase tracking-wider mb-4">Passeios</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/passeios?category=WHALE" className="hover:text-white transition-colors">Baleia Jubarte</Link></li>
              <li><Link href="/passeios?category=BOAT" className="hover:text-white transition-colors">Barco</Link></li>
              <li><Link href="/passeios?category=BUGGY" className="hover:text-white transition-colors">Buggy</Link></li>
              <li><Link href="/passeios?category=EXPERIENCE" className="hover:text-white transition-colors">Vivências</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-display text-sm font-bold text-amber-300 uppercase tracking-wider mb-4">Contato</h4>
            <ul className="space-y-2 text-sm">
              <li>📍 Corumbau, Prado — BA</li>
              <li>📱 (73) 99900-1234</li>
              <li>✉️ contato@corumbau.com</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 mt-10 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-blue-300/50">
            © {new Date().getFullYear()} Corumbau Passeios. Todos os direitos reservados.
          </p>
          <div className="flex gap-4 text-xs text-blue-300/50">
            <Link href="#" className="hover:text-white transition-colors">Termos</Link>
            <Link href="#" className="hover:text-white transition-colors">Privacidade</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
