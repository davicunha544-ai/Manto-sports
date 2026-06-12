interface LogoProps {
  size?: 'sm' | 'md' | 'lg'
  variant?: 'dark' | 'light'
}

export default function Logo({ size = 'md', variant = 'dark' }: LogoProps) {
  const scales = { sm: 0.7, md: 1, lg: 1.5 }
  const s = scales[size]
  const color = variant === 'dark' ? '#0a0a0a' : '#ffffff'
  const accent = '#e63946'

  return (
    <div className="flex items-center gap-2.5">
      <svg
        width={Math.round(44 * s)}
        height={Math.round(44 * s)}
        viewBox="0 0 44 44"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Outer square with cut corner */}
        <path
          d="M4 4 H40 V40 H4 Z"
          fill={color}
        />
        {/* Red accent stripe */}
        <rect x="0" y="36" width="44" height="8" fill={accent} />
        {/* MS monogram */}
        <text
          x="22"
          y="29"
          fontFamily="Space Grotesk, Arial Black, sans-serif"
          fontSize="18"
          fontWeight="800"
          fill="#ffffff"
          textAnchor="middle"
          dominantBaseline="auto"
          letterSpacing="-1"
        >
          MS
        </text>
      </svg>
      <div className="flex flex-col leading-none">
        <span
          style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontWeight: 800,
            fontSize: `${Math.round(15 * s)}px`,
            color,
            letterSpacing: '0.08em',
            lineHeight: 1,
          }}
        >
          MANTO
        </span>
        <span
          style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontWeight: 400,
            fontSize: `${Math.round(10 * s)}px`,
            color,
            letterSpacing: '0.25em',
            lineHeight: 1.4,
          }}
        >
          SPORTS
        </span>
      </div>
    </div>
  )
}
