import Link from 'next/link'

export function Footer() {
  return (
    <footer className="border-t bg-muted/50">
      <div className="container px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="font-bold text-primary text-lg mb-3">Corumbau Passeios</h3>
            <p className="text-sm text-muted-foreground">
              Experiências únicas no paraíso do Corumbau. Baleias Jubarte, passeios de barco e buggy.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-3">Passeios</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/passeios?category=WHALE" className="hover:text-foreground transition-colors">Baleia Jubarte</Link></li>
              <li><Link href="/passeios?category=BOAT" className="hover:text-foreground transition-colors">Barcos</Link></li>
              <li><Link href="/passeios?category=BUGGY" className="hover:text-foreground transition-colors">Buggy</Link></li>
              <li><Link href="/passeios?category=EXPERIENCE" className="hover:text-foreground transition-colors">Vivências</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-3">Contato</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>📍 Corumbau, Prado — Bahia</li>
              <li>📞 (73) 9977-5402</li>
              <li>
                <a
                  href="https://wa.me/557399775402"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-foreground transition-colors"
                >
                  💬 WhatsApp
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t mt-8 pt-4 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} Corumbau Passeios. Todos os direitos reservados.
        </div>
      </div>
    </footer>
  )
}
