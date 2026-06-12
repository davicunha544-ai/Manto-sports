import Link from 'next/link'
import Logo from './Logo'

export default function Footer() {
  return (
    <footer className="bg-[#0a0a0a] text-white mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="md:col-span-2">
            <Logo variant="light" size="md" />
            <p className="mt-4 text-gray-400 text-sm leading-relaxed max-w-xs">
              Vista sua paixão pelo esporte. Camisas de futebol e basquete com qualidade premium,
              incluindo nossa exclusiva linha retrô.
            </p>
            <div className="flex gap-4 mt-6">
              {['Instagram', 'X', 'TikTok'].map(s => (
                <a
                  key={s}
                  href="#"
                  className="text-xs text-gray-500 hover:text-white transition-colors border border-gray-800 hover:border-white px-3 py-1.5 rounded"
                >
                  {s}
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-xs font-semibold tracking-widest text-gray-500 uppercase mb-4">
              Loja
            </h4>
            <ul className="space-y-2.5">
              {[
                { href: '/catalogo', label: 'Catálogo' },
                { href: '/catalogo?esporte=futebol', label: 'Futebol' },
                { href: '/catalogo?esporte=basquete', label: 'Basquete' },
                { href: '/catalogo?categoria=retro', label: 'Linha Retrô' },
              ].map(link => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-gray-400 hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Info */}
          <div>
            <h4 className="text-xs font-semibold tracking-widest text-gray-500 uppercase mb-4">
              Informações
            </h4>
            <ul className="space-y-2.5">
              {[
                'Sobre Nós',
                'Trocas e Devoluções',
                'Política de Privacidade',
                'Perguntas Frequentes',
              ].map(item => (
                <li key={item}>
                  <a href="#" className="text-sm text-gray-400 hover:text-white transition-colors">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-900 mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-600">
            © {new Date().getFullYear()} Manto Sports. Todos os direitos reservados.
          </p>
          <div className="flex items-center gap-2 text-xs text-gray-600">
            <span>Formas de pagamento:</span>
            {['Pix', 'Cartão', 'Boleto'].map(p => (
              <span key={p} className="border border-gray-800 px-2 py-0.5 rounded text-gray-500">
                {p}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
