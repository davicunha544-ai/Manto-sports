import { prisma } from '@/lib/prisma'
import Link from 'next/link'

async function getStats() {
  const [products, orders, promotions] = await Promise.all([
    prisma.product.count({ where: { active: true } }),
    prisma.order.count(),
    prisma.promotion.count({ where: { active: true } }),
  ])

  const revenue = await prisma.order.aggregate({ _sum: { total: true } })
  const recent = await prisma.order.findMany({
    orderBy: { createdAt: 'desc' },
    take: 5,
    include: { items: true },
  })

  return {
    products,
    orders,
    promotions,
    revenue: revenue._sum.total || 0,
    recent,
  }
}

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-700',
  confirmed: 'bg-blue-100 text-blue-700',
  shipped: 'bg-purple-100 text-purple-700',
  delivered: 'bg-green-100 text-green-700',
}
const statusLabels: Record<string, string> = {
  pending: 'Pendente',
  confirmed: 'Confirmado',
  shipped: 'Enviado',
  delivered: 'Entregue',
}

export default async function AdminDashboard() {
  const stats = await getStats()

  return (
    <div className="p-8">
      <h1 className="text-2xl font-extrabold mb-2">Dashboard</h1>
      <p className="text-gray-400 text-sm mb-8">Visão geral da sua loja</p>

      {/* Stats cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
        {[
          { label: 'Produtos ativos', value: stats.products, icon: '🛍️', href: '/admin/produtos' },
          { label: 'Total de pedidos', value: stats.orders, icon: '📦', href: '/admin/pedidos' },
          { label: 'Promoções ativas', value: stats.promotions, icon: '📣', href: '/admin/promocoes' },
          { label: 'Receita total', value: `R$ ${stats.revenue.toFixed(2).replace('.', ',')}`, icon: '💰', href: '/admin/pedidos' },
        ].map(card => (
          <Link key={card.label} href={card.href}>
            <div className="bg-white rounded shadow-sm p-5 hover:shadow-md transition-shadow cursor-pointer">
              <div className="text-2xl mb-2">{card.icon}</div>
              <p className="text-2xl font-extrabold text-[#0a0a0a]">{card.value}</p>
              <p className="text-xs text-gray-400 mt-0.5">{card.label}</p>
            </div>
          </Link>
        ))}
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded shadow-sm p-6">
          <h2 className="font-bold text-lg mb-4">Ações Rápidas</h2>
          <div className="space-y-2">
            <Link
              href="/admin/produtos/novo"
              className="flex items-center gap-3 p-3 border border-dashed border-gray-200 hover:border-[#0a0a0a] rounded transition-colors group"
            >
              <div className="w-8 h-8 bg-gray-100 rounded flex items-center justify-center group-hover:bg-[#0a0a0a] group-hover:text-white transition-colors text-lg">
                +
              </div>
              <span className="text-sm font-medium">Novo Produto</span>
            </Link>
            <Link
              href="/admin/promocoes/novo"
              className="flex items-center gap-3 p-3 border border-dashed border-gray-200 hover:border-[#0a0a0a] rounded transition-colors group"
            >
              <div className="w-8 h-8 bg-gray-100 rounded flex items-center justify-center group-hover:bg-[#0a0a0a] group-hover:text-white transition-colors text-lg">
                +
              </div>
              <span className="text-sm font-medium">Nova Promoção</span>
            </Link>
            <Link
              href="/admin/pedidos"
              className="flex items-center gap-3 p-3 border border-dashed border-gray-200 hover:border-[#0a0a0a] rounded transition-colors group"
            >
              <div className="w-8 h-8 bg-gray-100 rounded flex items-center justify-center group-hover:bg-[#0a0a0a] group-hover:text-white transition-colors">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
                  <polyline points="14 2 14 8 20 8"/>
                </svg>
              </div>
              <span className="text-sm font-medium">Ver Pedidos</span>
            </Link>
          </div>
        </div>

        {/* Recent orders */}
        <div className="bg-white rounded shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-lg">Pedidos Recentes</h2>
            <Link href="/admin/pedidos" className="text-xs text-gray-400 hover:text-black underline">
              Ver todos
            </Link>
          </div>

          {stats.recent.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-6">Nenhum pedido ainda</p>
          ) : (
            <div className="space-y-3">
              {stats.recent.map(order => (
                <div key={order.id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                  <div>
                    <p className="text-sm font-medium">{order.customerName}</p>
                    <p className="text-xs text-gray-400">
                      {order.items.length} {order.items.length === 1 ? 'item' : 'itens'} ·{' '}
                      {new Date(order.createdAt).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold">R$ {order.total.toFixed(2).replace('.', ',')}</p>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${statusColors[order.status] || 'bg-gray-100 text-gray-600'}`}>
                      {statusLabels[order.status] || order.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
