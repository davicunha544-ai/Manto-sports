'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function NewPromoPage() {
  const router = useRouter()
  const [form, setForm] = useState({
    title: '',
    subtitle: '',
    link: '',
    color1: '#0a0a2e',
    color2: '#e63946',
    active: true,
    sortOrder: '0',
  })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const update = <K extends keyof typeof form>(k: K, v: (typeof form)[K]) =>
    setForm(f => ({ ...f, [k]: v }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.title) { setError('Título é obrigatório'); return }
    setSaving(true)
    setError('')

    const res = await fetch('/api/admin/promotions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, sortOrder: Number(form.sortOrder) }),
    })

    if (res.ok) {
      router.push('/admin/promocoes')
    } else {
      const data = await res.json()
      setError(data.error || 'Erro ao salvar')
    }
    setSaving(false)
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <Link href="/admin/promocoes" className="text-xs text-gray-400 hover:text-black flex items-center gap-1 mb-3">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
          Voltar para promoções
        </Link>
        <h1 className="text-2xl font-extrabold">Nova Promoção</h1>
      </div>

      <form onSubmit={handleSubmit} className="max-w-xl space-y-6">
        {error && <p className="text-sm text-red-500 bg-red-50 px-4 py-3 rounded">{error}</p>}

        <div className="bg-white rounded shadow-sm p-6 space-y-5">
          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">Título *</label>
            <input
              required
              value={form.title}
              onChange={e => update('title', e.target.value)}
              className="w-full border border-gray-200 px-3 py-2.5 text-sm focus:border-[#0a0a0a] focus:outline-none rounded"
              placeholder="ex: MEGA SALE"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">Subtítulo</label>
            <input
              value={form.subtitle}
              onChange={e => update('subtitle', e.target.value)}
              className="w-full border border-gray-200 px-3 py-2.5 text-sm focus:border-[#0a0a0a] focus:outline-none rounded"
              placeholder="ex: Até 50% OFF em camisas selecionadas"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">Link (destino do CTA)</label>
            <input
              value={form.link}
              onChange={e => update('link', e.target.value)}
              className="w-full border border-gray-200 px-3 py-2.5 text-sm focus:border-[#0a0a0a] focus:outline-none rounded"
              placeholder="ex: /catalogo?categoria=retro"
            />
          </div>

          {/* Colors */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">Cor inicial</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={form.color1}
                  onChange={e => update('color1', e.target.value)}
                  className="w-10 h-10 cursor-pointer border-0 rounded"
                />
                <input
                  value={form.color1}
                  onChange={e => update('color1', e.target.value)}
                  className="flex-1 border border-gray-200 px-2 py-2 text-sm focus:border-[#0a0a0a] focus:outline-none rounded font-mono"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">Cor final</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={form.color2}
                  onChange={e => update('color2', e.target.value)}
                  className="w-10 h-10 cursor-pointer border-0 rounded"
                />
                <input
                  value={form.color2}
                  onChange={e => update('color2', e.target.value)}
                  className="flex-1 border border-gray-200 px-2 py-2 text-sm focus:border-[#0a0a0a] focus:outline-none rounded font-mono"
                />
              </div>
            </div>
          </div>

          {/* Preview */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">Preview</label>
            <div
              className="w-full h-24 rounded flex flex-col justify-center px-6"
              style={{ background: `linear-gradient(135deg, ${form.color1}, ${form.color2})` }}
            >
              <p className="text-white font-extrabold text-xl">{form.title || 'Título'}</p>
              {form.subtitle && <p className="text-white/70 text-sm">{form.subtitle}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">Ordem</label>
              <input
                type="number"
                min="0"
                value={form.sortOrder}
                onChange={e => update('sortOrder', e.target.value)}
                className="w-full border border-gray-200 px-3 py-2.5 text-sm focus:border-[#0a0a0a] focus:outline-none rounded"
              />
            </div>
            <div className="flex items-end pb-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.active}
                  onChange={e => update('active', e.target.checked)}
                  className="w-4 h-4"
                />
                <span className="text-sm text-gray-700">Ativa</span>
              </label>
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-3 bg-[#0a0a0a] text-white font-bold text-sm tracking-wider hover:bg-[#e63946] transition-colors disabled:opacity-50"
          >
            {saving ? 'Salvando...' : 'CRIAR PROMOÇÃO'}
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="px-6 py-3 border border-gray-200 text-sm font-medium hover:border-gray-400 transition-colors"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  )
}
