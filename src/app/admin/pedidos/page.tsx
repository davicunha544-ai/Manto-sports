'use client'

import { useState, useEffect } from 'react'

interface OrderItem {
  id: string
  size: string
  quantity: number
  price: number
  product: { name: string }
}

interface Order {
  id: string
  customerName: string
  email: string
  phone?: string
  address: string
  city: string
  state: string
  zipCode: string
  total: number
  status: string
  items: OrderItem[]
  createdAt: string
}

const STATUS_COLORS: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-700',
  confirmed: 'bg-blue-100 text-blue-700',
  shipped: 'bg-purple-100 text-purple-700',
  delivered: 'bg-green-100 text-green-700',
}
const STATUS_LABELS: Record<string, string> = {
  pending: 'Pendente',
  confirmed: 'Confirmado',
  shipped: 'Enviado',
  delivered: 'Entregue',
}

export default function AdminPedidosPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [expanded, setExpanded] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/admin/orders')
      .then(r => r.json())
      .then(data => { setOrders(data); setLoading(false) })
  }, [])

  const updateStatus = async (id: string, status: string) => {
    await fetch('/api/admin/orders', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status }),
    })
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o))
  }

  const totalRevenue = orders.reduce((s, o) => s + o.total, 0)

  return (
    <div className="p-8">
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-2xl font-extrabold">Pedidos</h1>
          <p className="text-gray-400 text-sm mt-0.5">
            {orders.length} pedido(s) · Receita total: R$ {totalRevenue.toFixed(2).replace('.', ',')}
          </p>
        </div>
      </div>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-16 bg-gray-100 animate-pulse rounded" />
          ))}
        </div>
      ) : orders.length === 0 ? (
        <div className="bg-white rounded shadow-sm p-12 text-center text-gray-400">
          <p className="text-lg font-medium">Nenhum pedido ainda</p>
          <p className="text-sm mt-1">Os pedidos aparecem aqui conforme os clientes finalizam compras</p>
        </div>
      ) : (
        <div className="space-y-3">
          {orders.map(order => (
            <div key={order.id} className="bg-white rounded shadow-sm overflow-hidden">
              {/* Header row */}
              <div
                className="flex items-center gap-4 p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => setExpanded(expanded === order.id ? null : order.id)}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-sm">{order.customerName}</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${STATUS_COLORS[order.status] || 'bg-gray-100 text-gray-600'}`}>
                      {STATUS_LABELS[order.status] || order.status}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 mt-0.5">
                    #{order.id.slice(-8).toUpperCase()} · {order.email} ·{' '}
                    {new Date(order.createdAt).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="font-bold text-sm">R$ {order.total.toFixed(2).replace('.', ',')}</p>
                  <p className="text-xs text-gray-400">{order.items.length} {order.items.length === 1 ? 'item' : 'itens'}</p>
                </div>
                <svg
                  className={`text-gray-400 transition-transform flex-shrink-0 ${expanded === order.id ? 'rotate-180' : ''}`}
                  width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                >
                  <polyline points="6 9 12 15 18 9"/>
                </svg>
              </div>

              {/* Expanded details */}
              {expanded === order.id && (
                <div className="border-t border-gray-100 p-4 bg-gray-50">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Items */}
                    <div>
                      <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Itens do Pedido</h4>
                      <div className="space-y-2">
                        {order.items.map(item => (
                          <div key={item.id} className="flex justify-between text-sm">
                            <span className="text-gray-700">
                              {item.product.name} <span className="text-gray-400">({item.size})</span> ×{item.quantity}
                            </span>
                            <span className="font-medium">R$ {(item.price * item.quantity).toFixed(2).replace('.', ',')}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Customer + Status */}
                    <div>
                      <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Entrega</h4>
                      <p className="text-sm text-gray-700">{order.address}</p>
                      <p className="text-sm text-gray-700">{order.city} — {order.state}, {order.zipCode}</p>
                      {order.phone && <p className="text-sm text-gray-500 mt-1">{order.phone}</p>}

                      <div className="mt-4">
                        <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Status</h4>
                        <select
                          value={order.status}
                          onChange={e => updateStatus(order.id, e.target.value)}
                          className="border border-gray-200 text-sm px-3 py-2 rounded focus:border-[#0a0a0a] focus:outline-none bg-white"
                        >
                          <option value="pending">Pendente</option>
                          <option value="confirmed">Confirmado</option>
                          <option value="shipped">Enviado</option>
                          <option value="delivered">Entregue</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
