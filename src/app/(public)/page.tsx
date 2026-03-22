import { Badge } from '@/components/ui/badge'
import { ButtonLink } from '@/components/ui/button-link'

export default function LandingPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary/10 via-background to-secondary/20 py-20 lg:py-32">
        <div className="container px-4 text-center">
          <Badge className="mb-4 bg-blue-900/10 text-blue-900 border-0">
            🐋 Temporada de Baleias Jubarte — Jul a Nov
          </Badge>
          <h1 className="text-4xl lg:text-6xl font-bold tracking-tight">
            Experiências únicas no
            <span className="text-primary block">paraíso do Corumbau</span>
          </h1>
          <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto">
            Reserve online seus passeios de Baleia Jubarte, barco e buggy.
            Sem filas, sem espera. Garanta seu lugar na aventura.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <ButtonLink href="/passeios" size="lg" className="text-lg px-8">
              Ver Passeios
            </ButtonLink>
            <ButtonLink href="/passeios?category=WHALE" size="lg" variant="outline" className="text-lg px-8">
              🐋 Baleias Jubarte
            </ButtonLink>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-muted/30">
        <div className="container px-4">
          <h2 className="text-2xl font-bold text-center mb-12">Por que reservar online?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard icon="⚡" title="Reserva instantânea" description="Escolha data, pague com Pix ou cartão e receba seu voucher na hora." />
            <FeatureCard icon="📱" title="Voucher digital" description="QR Code no celular. Sem papel, sem complicação no dia do embarque." />
            <FeatureCard icon="🔒" title="Garantia de vaga" description="Compre com antecedência e garanta seu lugar na temporada de baleias." />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16">
        <div className="container px-4 text-center">
          <h2 className="text-2xl font-bold mb-4">Pronto para a aventura?</h2>
          <p className="text-muted-foreground mb-8">
            Explore nosso catálogo e reserve seu passeio em poucos cliques.
          </p>
          <ButtonLink href="/passeios" size="lg">Explorar Passeios →</ButtonLink>
        </div>
      </section>
    </>
  )
}

function FeatureCard({ icon, title, description }: { icon: string; title: string; description: string }) {
  return (
    <div className="text-center p-6 rounded-xl bg-background border shadow-sm">
      <div className="text-4xl mb-4">{icon}</div>
      <h3 className="font-semibold text-lg mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  )
}
