'use client'

import { useState } from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { useCart } from '@/components/CartProvider'
import { useRouter } from 'next/navigation'

interface FormData {
  name: string
  email: string
  phone: string
  address: string
  city: string
  state: string
  zipCode: string
  paymentMethod: 'pix' | 'credit' | 'boleto'
}

export default function CheckoutPage() {
  const { items, total, clear } = useCart()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [orderId, setOrderId] = useState('')

  const [form, setForm] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    paymentMethod: 'pix',
  })

  const update = (k: keyof FormData, v: string) =>
    setForm(f => ({ ...f, [k]: v }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!items.length) return

    setLoading(true)
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: form.name,
          email: form.email,
          phone: form.phone,
          address: form.address,
          city: form.city,
          state: form.state,
          zipCode: form.zipCode,
          total,
          items: items.map(i => ({
            productId: i.productId,
            size: i.size,
            quantity: i.quantity,
            price: i.price,
          })),
        }),
      })
      const data = await res.json()
      if (data.id) {
        setOrderId(data.id)
        setSuccess(true)
        clear()
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  if (!items.length && !success) {
    return (
      <>
        <Header />
        <main className="flex-1 pt-24 flex items-center justify-center">
          <div className="text-center">
            <p className="text-xl font-bold text-gray-700">Carrinho vazio</p>
            <button onClick={() => router.push('/catalogo')} className="mt-4 text-sm underline text-gray-400">
              Ver catálogo
            </button>
          </div>
        </main>
        <Footer />
      </>
    )
  }

  if (success) {
    return (
      <>
        <Header />
        <main className="flex-1 pt-24 flex items-center justify-center">
          <div className="text-center px-4 max-w-md">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="text-green-600" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
            </div>
            <h2 className="text-3xl font-extrabold text-[#0a0a0a] mb-2">Pedido confirmado!</h2>
            <p className="text-gray-500 mb-2">
              Obrigado pela sua compra. Você receberá um e-mail de confirmação em breve.
            </p>
            <p className="text-sm text-gray-400">Pedido: #{orderId.slice(-8).toUpperCase()}</p>
            <button
              onClick={() => router.push('/')}
              className="mt-8 px-8 py-3 bg-[#0a0a0a] text-white text-sm font-bold tracking-wider hover:bg-[#e63946] transition-colors"
            >
              VOLTAR À HOME
            </button>
          </div>
        </main>
        <Footer />
      </>
    )
  }

  return (
    <>
      <Header />
      <main className="flex-1 pt-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <h1 className="text-3xl font-extrabold mb-10">Finalizar Compra</h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* Form */}
            <form onSubmit={handleSubmit} className="lg:col-span-2 space-y-6">
              <div className="border border-gray-100 rounded p-6">
                <h2 className="font-bold text-lg mb-5">Dados Pessoais</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-medium text-gray-700 mb-1">Nome completo *</label>
                    <input
                      required
                      value={form.name}
                      onChange={e => update('name', e.target.value)}
                      className="w-full border border-gray-200 px-3 py-2.5 text-sm focus:border-[#0a0a0a] focus:outline-none transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">E-mail *</label>
                    <input
                      required type="email"
                      value={form.email}
                      onChange={e => update('email', e.target.value)}
                      className="w-full border border-gray-200 px-3 py-2.5 text-sm focus:border-[#0a0a0a] focus:outline-none transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Telefone</label>
                    <input
                      value={form.phone}
                      onChange={e => update('phone', e.target.value)}
                      className="w-full border border-gray-200 px-3 py-2.5 text-sm focus:border-[#0a0a0a] focus:outline-none transition-colors"
                    />
                  </div>
                </div>
              </div>

              <div className="border border-gray-100 rounded p-6">
                <h2 className="font-bold text-lg mb-5">Endereço de Entrega</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-medium text-gray-700 mb-1">Endereço *</label>
                    <input
                      required
                      value={form.address}
                      onChange={e => update('address', e.target.value)}
                      className="w-full border border-gray-200 px-3 py-2.5 text-sm focus:border-[#0a0a0a] focus:outline-none transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Cidade *</label>
                    <input
                      required
                      value={form.city}
                      onChange={e => update('city', e.target.value)}
                      className="w-full border border-gray-200 px-3 py-2.5 text-sm focus:border-[#0a0a0a] focus:outline-none transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Estado *</label>
                    <input
                      required maxLength={2}
                      value={form.state}
                      onChange={e => update('state', e.target.value.toUpperCase())}
                      className="w-full border border-gray-200 px-3 py-2.5 text-sm focus:border-[#0a0a0a] focus:outline-none transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">CEP *</label>
                    <input
                      required
                      value={form.zipCode}
                      onChange={e => update('zipCode', e.target.value)}
                      className="w-full border border-gray-200 px-3 py-2.5 text-sm focus:border-[#0a0a0a] focus:outline-none transition-colors"
                    />
                  </div>
                </div>
              </div>

              <div className="border border-gray-100 rounded p-6">
                <h2 className="font-bold text-lg mb-5">Forma de Pagamento</h2>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { value: 'pix', label: 'Pix', desc: '5% OFF' },
                    { value: 'credit', label: 'Cartão', desc: '3x sem juros' },
                    { value: 'boleto', label: 'Boleto', desc: '3% OFF' },
                  ].map(opt => (
                    <label
                      key={opt.value}
                      className={`cursor-pointer border rounded p-3 text-center transition-all ${
                        form.paymentMethod === opt.value
                          ? 'border-[#0a0a0a] bg-[#0a0a0a] text-white'
                          : 'border-gray-200 hover:border-gray-400'
                      }`}
                    >
                      <input
                        type="radio"
                        name="payment"
                        value={opt.value}
                        checked={form.paymentMethod === opt.value as FormData['paymentMethod']}
                        onChange={() => update('paymentMethod', opt.value)}
                        className="sr-only"
                      />
                      <p className="font-semibold text-sm">{opt.label}</p>
                      <p className={`text-xs mt-0.5 ${form.paymentMethod === opt.value ? 'text-gray-300' : 'text-gray-400'}`}>
                        {opt.desc}
                      </p>
                    </label>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-[#0a0a0a] text-white font-bold tracking-wider hover:bg-[#e63946] transition-colors disabled:opacity-50"
              >
                {loading ? 'PROCESSANDO...' : 'CONFIRMAR PEDIDO'}
              </button>

              <p className="text-center text-xs text-gray-400">
                🔒 Ambiente simulado — nenhum dado real é processado
              </p>
            </form>

            {/* Summary */}
            <div className="lg:col-span-1">
              <div className="border border-gray-100 rounded p-6 sticky top-24">
                <h2 className="font-bold text-lg mb-4">Seu pedido</h2>
                <div className="space-y-2 text-sm">
                  {items.map(item => (
                    <div key={item.id} className="flex justify-between text-gray-600">
                      <span className="truncate mr-2">
                        {item.name} ({item.size}) ×{item.quantity}
                      </span>
                      <span className="flex-shrink-0 font-medium">
                        R$ {(item.price * item.quantity).toFixed(2).replace('.', ',')}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="h-px bg-gray-100 my-4" />
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>R$ {total.toFixed(2).replace('.', ',')}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
