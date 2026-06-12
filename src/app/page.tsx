import { prisma } from '@/lib/prisma'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Carousel3D from '@/components/Carousel3D'
import ProductCard from '@/components/ProductCard'
import ScrollReveal from '@/components/ScrollReveal'
import Link from 'next/link'

async function getData() {
  const [promotions, featured, retro] = await Promise.all([
    prisma.promotion.findMany({ where: { active: true }, orderBy: { sortOrder: 'asc' } }),
    prisma.product.findMany({ where: { active: true, featured: true }, take: 8 }),
    prisma.product.findMany({
      where: { active: true, category: 'retro' },
      orderBy: { createdAt: 'desc' },
      take: 4,
    }),
  ])
  return { promotions, featured, retro }
}

export default async function HomePage() {
  const { promotions, featured, retro } = await getData()

  const promoData = promotions.map(p => ({
    id: p.id,
    title: p.title,
    subtitle: p.subtitle,
    link: p.link,
    color1: p.color1,
    color2: p.color2,
  }))

  return (
    <>
      <Header />
      <main className="flex-1 pt-16">
        {/* Carousel */}
        <Carousel3D promotions={promoData} />

        {/* Featured section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <ScrollReveal>
            <div className="flex items-end justify-between mb-10">
              <div>
                <p className="text-xs font-semibold tracking-widest text-[#e63946] uppercase mb-2">
                  Destaques
                </p>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0a0a0a]">
                  Escolhas da Temporada
                </h2>
              </div>
              <Link
                href="/catalogo"
                className="hidden sm:inline-flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-black transition-colors"
              >
                Ver tudo
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </Link>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 sm:gap-8">
            {featured.map((product, i) => (
              <ScrollReveal key={product.id} delay={i * 80}>
                <ProductCard product={product} />
              </ScrollReveal>
            ))}
          </div>
        </section>

        {/* Retro section */}
        <section className="bg-[#0a0a0a] py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <ScrollReveal>
              <div className="flex items-end justify-between mb-10">
                <div>
                  <p className="text-xs font-semibold tracking-widest text-[#e63946] uppercase mb-2">
                    Exclusivo
                  </p>
                  <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
                    Linha Retrô
                  </h2>
                  <p className="mt-2 text-gray-400 text-sm max-w-sm">
                    Clássicos que nunca envelhecem. Designs icônicos das décadas de 70, 80 e 90.
                  </p>
                </div>
                <Link
                  href="/catalogo?categoria=retro"
                  className="hidden sm:inline-flex items-center gap-2 text-sm font-semibold text-gray-400 hover:text-white transition-colors"
                >
                  Ver coleção
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                </Link>
              </div>
            </ScrollReveal>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-5 sm:gap-8">
              {retro.map((product, i) => (
                <ScrollReveal key={product.id} delay={i * 100}>
                  <div className="bg-[#111111] rounded-sm p-1">
                    <ProductCard product={product} />
                  </div>
                </ScrollReveal>
              ))}
            </div>

            <ScrollReveal delay={200}>
              <div className="text-center mt-10">
                <Link
                  href="/catalogo?categoria=retro"
                  className="inline-flex items-center gap-3 px-8 py-4 border border-white/20 text-white text-sm font-semibold tracking-wider hover:bg-white hover:text-black transition-all duration-300"
                >
                  EXPLORAR COLEÇÃO RETRÔ
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                </Link>
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* Sports categories */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <ScrollReveal>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-center mb-12">
              Escolha seu Esporte
            </h2>
          </ScrollReveal>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { sport: 'futebol', label: 'Futebol', color: '#e63946', desc: 'Camisas oficiais e retrô do futebol mundial' },
              { sport: 'basquete', label: 'Basquete', color: '#0a0a0a', desc: 'Regatas e camisas das grandes franquias NBA' },
            ].map(({ sport, label, color, desc }, i) => (
              <ScrollReveal key={sport} delay={i * 120}>
                <Link href={`/catalogo?esporte=${sport}`}>
                  <div
                    className="relative overflow-hidden rounded-sm group cursor-pointer"
                    style={{ background: color, height: '240px' }}
                  >
                    <div className="absolute inset-0 flex flex-col justify-end p-8 bg-gradient-to-t from-black/60 to-transparent">
                      <p className="text-white/60 text-xs tracking-widest uppercase mb-1">{desc}</p>
                      <h3 className="text-white text-3xl font-extrabold group-hover:translate-x-2 transition-transform duration-300">
                        {label}
                      </h3>
                    </div>
                    <div className="absolute top-6 right-6 opacity-10 text-white text-[8rem] font-black leading-none select-none">
                      {label[0]}
                    </div>
                  </div>
                </Link>
              </ScrollReveal>
            ))}
          </div>
        </section>

        {/* Banner strip */}
        <ScrollReveal>
          <div className="bg-[#e63946] py-10">
            <div className="max-w-7xl mx-auto px-4 text-center">
              <p className="text-white text-xs tracking-widest uppercase mb-1">Frete grátis acima de R$ 299</p>
              <h3 className="text-white text-2xl font-extrabold">Vista sua paixão pelo esporte</h3>
              <Link
                href="/catalogo"
                className="inline-block mt-4 px-8 py-3 bg-white text-[#e63946] text-sm font-bold tracking-wider hover:bg-[#0a0a0a] hover:text-white transition-all duration-300"
              >
                COMPRAR AGORA
              </Link>
            </div>
          </div>
        </ScrollReveal>
      </main>
      <Footer />
    </>
  )
}
