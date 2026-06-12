import Link from 'next/link'
import ProductForm from '@/components/ProductForm'

export default function NewProductPage() {
  return (
    <div className="p-8">
      <div className="mb-8">
        <Link href="/admin/produtos" className="text-xs text-gray-400 hover:text-black flex items-center gap-1 mb-3">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
          Voltar para produtos
        </Link>
        <h1 className="text-2xl font-extrabold">Novo Produto</h1>
      </div>
      <ProductForm />
    </div>
  )
}
