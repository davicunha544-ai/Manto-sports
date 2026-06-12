'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

interface ProductData {
  id?: string
  name: string
  description: string
  price: string
  sport: string
  category: string
  sizes: string[]
  images: string[]
  stock: Record<string, number>
  active: boolean
  featured: boolean
}

interface Props {
  initial?: ProductData
  isEdit?: boolean
}

const DEFAULT: ProductData = {
  name: '',
  description: '',
  price: '',
  sport: 'futebol',
  category: 'atual',
  sizes: ['P', 'M', 'G', 'GG'],
  images: [],
  stock: { P: 0, M: 0, G: 0, GG: 0 },
  active: true,
  featured: false,
}

export default function ProductForm({ initial, isEdit }: Props) {
  const router = useRouter()
  const [form, setForm] = useState<ProductData>(initial || DEFAULT)
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const update = <K extends keyof ProductData>(k: K, v: ProductData[K]) =>
    setForm(f => ({ ...f, [k]: v }))

  const toggleSize = (size: string) => {
    setForm(f => {
      const sizes = f.sizes.includes(size) ? f.sizes.filter(s => s !== size) : [...f.sizes, size]
      const stock = { ...f.stock }
      if (!sizes.includes(size)) delete stock[size]
      else if (!stock[size]) stock[size] = 0
      return { ...f, sizes, stock }
    })
  }

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files?.length) return
    setUploading(true)

    for (const file of Array.from(files)) {
      const fd = new FormData()
      fd.append('file', file)
      const res = await fetch('/api/upload', { method: 'POST', body: fd })
      const data = await res.json()
      if (data.url) setForm(f => ({ ...f, images: [...f.images, data.url] }))
    }
    setUploading(false)
  }

  const removeImage = (idx: number) =>
    setForm(f => ({ ...f, images: f.images.filter((_, i) => i !== idx) }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name || !form.price) { setError('Nome e preço são obrigatórios'); return }
    setSaving(true)
    setError('')

    const body = {
      ...form,
      price: parseFloat(form.price),
      stock: form.stock,
    }

    const url = isEdit && form.id ? `/api/admin/products/${form.id}` : '/api/admin/products'
    const method = isEdit ? 'PUT' : 'POST'

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })

    if (res.ok) {
      router.push('/admin/produtos')
      router.refresh()
    } else {
      const data = await res.json()
      setError(data.error || 'Erro ao salvar')
    }
    setSaving(false)
  }

  const Label = ({ children }: { children: React.ReactNode }) => (
    <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
      {children}
    </label>
  )

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
      {error && (
        <p className="text-sm text-red-500 bg-red-50 px-4 py-3 rounded border border-red-100">{error}</p>
      )}

      <div className="bg-white rounded shadow-sm p-6 space-y-5">
        <div>
          <Label>Nome do produto *</Label>
          <input
            required
            value={form.name}
            onChange={e => update('name', e.target.value)}
            className="w-full border border-gray-200 px-3 py-2.5 text-sm focus:border-[#0a0a0a] focus:outline-none transition-colors rounded"
          />
        </div>

        <div>
          <Label>Descrição</Label>
          <textarea
            rows={3}
            value={form.description}
            onChange={e => update('description', e.target.value)}
            className="w-full border border-gray-200 px-3 py-2.5 text-sm focus:border-[#0a0a0a] focus:outline-none transition-colors rounded resize-none"
          />
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <Label>Preço (R$) *</Label>
            <input
              required
              type="number"
              step="0.01"
              min="0"
              value={form.price}
              onChange={e => update('price', e.target.value)}
              className="w-full border border-gray-200 px-3 py-2.5 text-sm focus:border-[#0a0a0a] focus:outline-none transition-colors rounded"
            />
          </div>
          <div>
            <Label>Esporte</Label>
            <select
              value={form.sport}
              onChange={e => update('sport', e.target.value)}
              className="w-full border border-gray-200 px-3 py-2.5 text-sm focus:border-[#0a0a0a] focus:outline-none rounded"
            >
              <option value="futebol">Futebol</option>
              <option value="basquete">Basquete</option>
            </select>
          </div>
          <div>
            <Label>Categoria</Label>
            <select
              value={form.category}
              onChange={e => update('category', e.target.value)}
              className="w-full border border-gray-200 px-3 py-2.5 text-sm focus:border-[#0a0a0a] focus:outline-none rounded"
            >
              <option value="atual">Atual</option>
              <option value="retro">Retrô</option>
            </select>
          </div>
        </div>

        {/* Sizes + Stock */}
        <div>
          <Label>Tamanhos e Estoque</Label>
          <div className="flex gap-3 flex-wrap">
            {['P', 'M', 'G', 'GG'].map(size => {
              const active = form.sizes.includes(size)
              return (
                <div key={size} className="flex flex-col items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => toggleSize(size)}
                    className={`w-12 h-10 border text-sm font-semibold transition-all ${
                      active ? 'bg-[#0a0a0a] border-[#0a0a0a] text-white' : 'border-gray-200 text-gray-400'
                    }`}
                  >
                    {size}
                  </button>
                  {active && (
                    <input
                      type="number"
                      min="0"
                      value={form.stock[size] ?? 0}
                      onChange={e => update('stock', { ...form.stock, [size]: parseInt(e.target.value) || 0 })}
                      className="w-12 border border-gray-200 text-center text-xs py-1 focus:border-[#0a0a0a] focus:outline-none rounded"
                      placeholder="0"
                    />
                  )}
                </div>
              )
            })}
          </div>
          <p className="text-xs text-gray-400 mt-2">Clique para ativar o tamanho, então defina o estoque</p>
        </div>

        {/* Flags */}
        <div className="flex gap-6">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={form.active}
              onChange={e => update('active', e.target.checked)}
              className="w-4 h-4"
            />
            <span className="text-sm text-gray-700">Produto ativo</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={form.featured}
              onChange={e => update('featured', e.target.checked)}
              className="w-4 h-4"
            />
            <span className="text-sm text-gray-700">Produto em destaque</span>
          </label>
        </div>
      </div>

      {/* Images */}
      <div className="bg-white rounded shadow-sm p-6">
        <Label>Imagens do produto</Label>
        <div className="flex flex-wrap gap-3 mb-3">
          {form.images.map((img, i) => (
            <div key={i} className="relative w-20 h-20 bg-gray-100 rounded overflow-hidden group">
              <Image src={img} alt="" fill className="object-contain p-1" unoptimized />
              <button
                type="button"
                onClick={() => removeImage(i)}
                className="absolute top-0 right-0 w-5 h-5 bg-red-500 text-white text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              >
                ×
              </button>
            </div>
          ))}
          <label className={`w-20 h-20 border-2 border-dashed border-gray-200 flex flex-col items-center justify-center text-gray-400 hover:border-gray-400 cursor-pointer transition-colors rounded ${uploading ? 'opacity-50 cursor-wait' : ''}`}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
              <polyline points="17 8 12 3 7 8"/>
              <line x1="12" y1="3" x2="12" y2="15"/>
            </svg>
            <span className="text-[10px] mt-1">{uploading ? 'Enviando...' : 'Upload'}</span>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleUpload}
              disabled={uploading}
              className="sr-only"
            />
          </label>
        </div>
        <p className="text-xs text-gray-400">JPG, PNG, WebP ou SVG. A primeira imagem é a principal.</p>
      </div>

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={saving || uploading}
          className="px-6 py-3 bg-[#0a0a0a] text-white font-bold text-sm tracking-wider hover:bg-[#e63946] transition-colors disabled:opacity-50"
        >
          {saving ? 'Salvando...' : isEdit ? 'SALVAR ALTERAÇÕES' : 'CRIAR PRODUTO'}
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
  )
}
