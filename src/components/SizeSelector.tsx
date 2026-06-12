'use client'

interface Props {
  sizes: string[]
  stock: Record<string, number>
  selected: string | null
  onChange: (size: string) => void
}

export default function SizeSelector({ sizes, stock, selected, onChange }: Props) {
  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-medium text-gray-700">Tamanho</span>
        {selected && (
          <span className="text-xs text-gray-400">
            {stock[selected] > 0 ? `${stock[selected]} em estoque` : 'Esgotado'}
          </span>
        )}
      </div>
      <div className="flex gap-2 flex-wrap">
        {sizes.map(size => {
          const inStock = (stock[size] ?? 0) > 0
          const isSelected = selected === size
          return (
            <button
              key={size}
              onClick={() => inStock && onChange(size)}
              disabled={!inStock}
              className={`
                min-w-[52px] h-12 px-3 border text-sm font-semibold transition-all duration-150
                ${isSelected
                  ? 'bg-[#0a0a0a] border-[#0a0a0a] text-white'
                  : inStock
                  ? 'border-gray-300 text-gray-700 hover:border-[#0a0a0a] hover:text-black'
                  : 'border-gray-100 text-gray-300 cursor-not-allowed line-through bg-gray-50'
                }
              `}
            >
              {size}
            </button>
          )
        })}
      </div>
    </div>
  )
}
