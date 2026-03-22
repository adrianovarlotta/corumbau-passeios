import Image from 'next/image'
import { ButtonLink } from '@/components/ui/button-link'
import { Anchor, Shield, Smartphone, Star } from 'lucide-react'

const TOURS_PREVIEW = [
  {
    name: 'Baleia Jubarte',
    slug: 'baleia-jubarte',
    image: '/images/baleia-jubarte.jpg',
    price: 250,
    tag: 'Mais Popular',
    description: 'Observe as majestosas baleias jubarte em seu habitat natural',
  },
  {
    name: 'Praia do Espelho',
    slug: 'barco-espelho',
    image: '/images/barco-espelho.jpg',
    price: 180,
    tag: 'Imperdível',
    description: 'Navegue até a praia mais bonita da Bahia',
  },
  {
    name: 'Buggy Costa das Baleias',
    slug: 'buggy-costa',
    image: '/images/buggy-costa.jpg',
    price: 320,
    tag: 'Aventura',
    description: 'Explore praias desertas e cenários únicos',
  },
  {
    name: 'Vivência com Pescadores',
    slug: 'vivencia-pescadores',
    image: '/images/vivencia-pescadores.jpg',
    price: 150,
    tag: 'Exclusivo',
    description: 'Viva um dia na rotina dos pescadores artesanais',
  },
]

export default function LandingPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <Image
            src="/images/hero-corumbau.jpg"
            alt="Praia de Corumbau"
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-sky-950/80 via-sky-900/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-sky-950/40 via-transparent to-transparent" />
        </div>

        <div className="relative container px-4 py-20 lg:py-32">
          <div className="max-w-2xl">
            {/* Tag */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-400/20 backdrop-blur-sm border border-amber-400/30 mb-6">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
              <span className="text-sm font-semibold text-amber-200 tracking-wide">
                Temporada de Baleias Jubarte — Jul a Nov
              </span>
            </div>

            <h1 className="font-display text-5xl lg:text-7xl font-bold text-white leading-[1.1] tracking-tight">
              Experiências únicas no
              <span className="block text-amber-300 mt-1">
                paraíso do Corumbau
              </span>
            </h1>

            <p className="mt-6 text-lg lg:text-xl text-blue-100/90 max-w-lg leading-relaxed">
              Reserve online seus passeios de baleia jubarte, barco e buggy.
              Sem filas, sem espera — garanta seu lugar na aventura.
            </p>

            <div className="mt-10 flex flex-col sm:flex-row gap-4">
              <ButtonLink
                href="/passeios"
                size="lg"
                className="bg-amber-400 text-sky-950 hover:bg-amber-300 text-lg px-8 font-bold shadow-lg shadow-amber-400/25 transition-all hover:shadow-amber-400/40 hover:scale-[1.02]"
              >
                Ver Passeios
              </ButtonLink>
              <ButtonLink
                href="/passeios?category=WHALE"
                size="lg"
                variant="outline"
                className="border-white/30 text-white hover:bg-white/10 backdrop-blur-sm text-lg px-8"
              >
                🐋 Baleias Jubarte
              </ButtonLink>
            </div>

            {/* Social proof */}
            <div className="mt-12 flex items-center gap-6">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div
                    key={i}
                    className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-300 to-amber-500 border-2 border-white/30 flex items-center justify-center text-xs font-bold text-sky-950"
                  >
                    {['JS', 'MA', 'PO', 'AC', 'RF'][i - 1]}
                  </div>
                ))}
              </div>
              <div>
                <div className="flex gap-0.5">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-sm text-blue-200/80 mt-0.5">
                  +500 turistas satisfeitos
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tours Preview */}
      <section className="py-20 lg:py-28 bg-warm-gradient">
        <div className="container px-4">
          <div className="text-center mb-14">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-amber-600 mb-3">
              Nossos Passeios
            </p>
            <h2 className="font-display text-4xl lg:text-5xl font-bold text-primary tracking-tight">
              Escolha sua próxima aventura
            </h2>
            <p className="mt-4 text-muted-foreground text-lg max-w-xl mx-auto">
              Do avistamento de baleias às praias mais bonitas da Bahia
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {TOURS_PREVIEW.map((tour) => (
              <a
                key={tour.slug}
                href={`/passeios/${tour.slug}`}
                className="group relative bg-white rounded-2xl overflow-hidden shadow-card hover:shadow-xl transition-all duration-500 hover:-translate-y-2"
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image
                    src={tour.image}
                    alt={tour.name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                    sizes="(max-width: 768px) 100vw, 25vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                  <span className="absolute top-3 left-3 px-3 py-1 bg-amber-400 text-sky-950 text-xs font-bold rounded-full shadow-sm">
                    {tour.tag}
                  </span>
                </div>
                <div className="p-5">
                  <h3 className="font-display text-xl font-bold text-primary group-hover:text-sky-700 transition-colors">
                    {tour.name}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                    {tour.description}
                  </p>
                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">A partir de</span>
                    <span className="font-display text-2xl font-bold text-primary">
                      R$ {tour.price}<span className="text-sm font-normal text-muted-foreground">/pessoa</span>
                    </span>
                  </div>
                </div>
              </a>
            ))}
          </div>

          <div className="text-center mt-12">
            <ButtonLink href="/passeios" size="lg" className="px-10 font-semibold">
              Ver Todos os Passeios →
            </ButtonLink>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 lg:py-28 relative overflow-hidden">
        <div className="absolute inset-0 bg-ocean-gradient" />
        <div className="absolute inset-0 grain-overlay opacity-30" />

        <div className="relative container px-4">
          <div className="text-center mb-14">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-amber-300 mb-3">
              Por que reservar online?
            </p>
            <h2 className="font-display text-4xl lg:text-5xl font-bold text-white tracking-tight">
              Simples, rápido e seguro
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <FeatureCard
              icon={<Anchor className="h-7 w-7" />}
              title="Reserva Instantânea"
              description="Escolha a data, pague com Pix ou cartão e receba seu voucher digital na hora."
            />
            <FeatureCard
              icon={<Smartphone className="h-7 w-7" />}
              title="Voucher Digital"
              description="QR Code no celular. Sem papel, sem complicação no dia do embarque."
            />
            <FeatureCard
              icon={<Shield className="h-7 w-7" />}
              title="Garantia de Vaga"
              description="Compre com antecedência e garanta seu lugar na temporada de baleias."
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 lg:py-28 bg-warm-gradient">
        <div className="container px-4 text-center">
          <h2 className="font-display text-4xl lg:text-5xl font-bold text-primary tracking-tight">
            Pronto para a aventura?
          </h2>
          <p className="text-muted-foreground text-lg mt-4 max-w-md mx-auto">
            Explore nosso catálogo e reserve seu passeio em poucos cliques.
          </p>
          <div className="mt-10">
            <ButtonLink
              href="/passeios"
              size="lg"
              className="bg-accent text-accent-foreground hover:bg-amber-500 text-lg px-10 font-bold shadow-gold transition-all hover:scale-[1.02]"
            >
              Explorar Passeios →
            </ButtonLink>
          </div>
        </div>
      </section>
    </>
  )
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="text-center p-8 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all duration-300">
      <div className="w-14 h-14 rounded-xl bg-amber-400/20 flex items-center justify-center mx-auto mb-5 text-amber-300">
        {icon}
      </div>
      <h3 className="font-display text-xl font-bold text-white mb-2">{title}</h3>
      <p className="text-sm text-blue-200/80 leading-relaxed">{description}</p>
    </div>
  )
}
