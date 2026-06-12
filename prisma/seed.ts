import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'
import { hashSync } from 'bcryptjs'
import * as fs from 'fs'
import * as path from 'path'

const pool = new Pool({ connectionString: process.env.DATABASE_URL! })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter } as ConstructorParameters<typeof PrismaClient>[0])

function generateJerseyPNG(
  primaryColor: string,
  secondaryColor: string,
  stripeColor: string,
  number: string,
  outputPath: string
): void {
  const width = 600
  const height = 700

  // Build SVG representing a jersey
  const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:${primaryColor};stop-opacity:1" />
      <stop offset="100%" style="stop-color:${secondaryColor};stop-opacity:1" />
    </linearGradient>
  </defs>
  <!-- Background -->
  <rect width="${width}" height="${height}" fill="url(#bg)"/>
  <!-- Jersey shape -->
  <polygon points="150,80 60,180 120,210 120,580 480,580 480,210 540,180 450,80 370,120 300,100 230,120" fill="${primaryColor}" stroke="${secondaryColor}" stroke-width="3"/>
  <!-- Collar -->
  <path d="M230,120 Q300,160 370,120 Q355,180 300,190 Q245,180 230,120Z" fill="${secondaryColor}"/>
  <!-- Sleeve stripes -->
  <polygon points="60,180 90,210 120,210 120,190" fill="${stripeColor}"/>
  <polygon points="540,180 510,210 480,210 480,190" fill="${stripeColor}"/>
  <!-- Center stripe -->
  <rect x="280" y="200" width="40" height="280" fill="${stripeColor}" opacity="0.6"/>
  <!-- Number -->
  <text x="300" y="430" font-family="Arial Black, sans-serif" font-size="120" font-weight="900" text-anchor="middle" fill="${secondaryColor}" opacity="0.9">${number}</text>
  <!-- Brand tag -->
  <text x="300" y="640" font-family="Arial, sans-serif" font-size="22" font-weight="bold" text-anchor="middle" fill="white" opacity="0.7">MANTO SPORTS</text>
</svg>`

  fs.writeFileSync(outputPath, svgContent, 'utf-8')
}

function generatePromoBanner(
  title: string,
  subtitle: string,
  color1: string,
  color2: string,
  accentColor: string,
  outputPath: string
): void {
  const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="500" viewBox="0 0 1200 500">
  <defs>
    <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:${color1};stop-opacity:1" />
      <stop offset="100%" style="stop-color:${color2};stop-opacity:1" />
    </linearGradient>
  </defs>
  <rect width="1200" height="500" fill="url(#grad)"/>
  <!-- Decorative circles -->
  <circle cx="1000" cy="250" r="300" fill="none" stroke="${accentColor}" stroke-width="2" opacity="0.3"/>
  <circle cx="1000" cy="250" r="220" fill="none" stroke="${accentColor}" stroke-width="2" opacity="0.3"/>
  <circle cx="1000" cy="250" r="140" fill="${accentColor}" opacity="0.15"/>
  <!-- Diagonal accent line -->
  <line x1="0" y1="400" x2="800" y2="0" stroke="${accentColor}" stroke-width="1" opacity="0.2"/>
  <line x1="0" y1="500" x2="900" y2="0" stroke="${accentColor}" stroke-width="1" opacity="0.15"/>
  <!-- Title -->
  <text x="80" y="220" font-family="Arial Black, sans-serif" font-size="72" font-weight="900" fill="white">${title}</text>
  <!-- Subtitle -->
  <text x="80" y="295" font-family="Arial, sans-serif" font-size="32" fill="${accentColor}">${subtitle}</text>
  <!-- CTA Bar -->
  <rect x="80" y="340" width="200" height="60" rx="4" fill="${accentColor}"/>
  <text x="180" y="378" font-family="Arial, sans-serif" font-size="20" font-weight="bold" text-anchor="middle" fill="white">VER COLEÇÃO</text>
  <!-- Brand -->
  <text x="80" y="460" font-family="Arial, sans-serif" font-size="18" fill="white" opacity="0.6">MANTO SPORTS — VISTA SUA PAIXÃO</text>
</svg>`

  fs.writeFileSync(outputPath, svgContent, 'utf-8')
}

async function main() {
  // Ensure directories exist
  const productsDir = path.join(process.cwd(), 'public', 'images', 'products')
  const promosDir = path.join(process.cwd(), 'public', 'images', 'promos')
  fs.mkdirSync(productsDir, { recursive: true })
  fs.mkdirSync(promosDir, { recursive: true })

  // Generate product images
  const jerseyConfigs = [
    { primary: '#c8102e', secondary: '#ffffff', stripe: '#c8102e', number: '10', file: 'jersey-football-1' },
    { primary: '#003087', secondary: '#ffffff', stripe: '#ffd700', number: '7', file: 'jersey-football-2' },
    { primary: '#1c6b30', secondary: '#ffffff', stripe: '#f5f5f5', number: '9', file: 'jersey-football-3' },
    { primary: '#1a1a2e', secondary: '#e63946', stripe: '#e63946', number: '11', file: 'jersey-football-retro-1' },
    { primary: '#8b4513', secondary: '#f5deb3', stripe: '#f5deb3', number: '8', file: 'jersey-football-retro-2' },
    { primary: '#5b2d8e', secondary: '#ffd700', stripe: '#ffd700', number: '23', file: 'jersey-basketball-1' },
    { primary: '#c8102e', secondary: '#000000', stripe: '#ffffff', number: '3', file: 'jersey-basketball-2' },
    { primary: '#007a33', secondary: '#ffd700', stripe: '#ffd700', number: '6', file: 'jersey-basketball-retro' },
  ]

  for (const cfg of jerseyConfigs) {
    generateJerseyPNG(
      cfg.primary,
      cfg.secondary,
      cfg.stripe,
      cfg.number,
      path.join(productsDir, `${cfg.file}-front.svg`)
    )
    // Generate back image (swap colors)
    generateJerseyPNG(
      cfg.secondary,
      cfg.primary,
      cfg.stripe,
      cfg.number,
      path.join(productsDir, `${cfg.file}-back.svg`)
    )
  }

  // Generate promo images
  generatePromoBanner('MEGA SALE', 'Até 50% OFF em Camisas Selecionadas', '#0a0a2e', '#1a1a4e', '#e63946', path.join(promosDir, 'promo-sale.svg'))
  generatePromoBanner('NOVA COLEÇÃO', 'Temporada 2024 Chegou', '#1a2e1a', '#2d5a2d', '#4ade80', path.join(promosDir, 'promo-new.svg'))
  generatePromoBanner('LINHA RETRÔ', 'Clássicos que Nunca Envelhecem', '#2e1a0a', '#5a3010', '#f97316', path.join(promosDir, 'promo-retro.svg'))

  console.log('✓ Images generated')

  // Clean up existing data
  await prisma.orderItem.deleteMany()
  await prisma.order.deleteMany()
  await prisma.product.deleteMany()
  await prisma.promotion.deleteMany()
  await prisma.admin.deleteMany()

  // Create admin
  const hashedPassword = hashSync('admin123', 12)
  await prisma.admin.create({
    data: {
      email: 'admin@mantosports.com',
      password: hashedPassword,
    },
  })
  console.log('✓ Admin created')

  // Create promotions
  await prisma.promotion.createMany({
    data: [
      {
        title: 'MEGA SALE',
        subtitle: 'Até 50% OFF em camisas selecionadas',
        image: '/images/promos/promo-sale.svg',
        link: '/catalogo',
        color1: '#0a0a2e',
        color2: '#1a1a4e',
        active: true,
        sortOrder: 1,
      },
      {
        title: 'NOVA COLEÇÃO',
        subtitle: 'Temporada 2024 — As melhores já chegaram',
        image: '/images/promos/promo-new.svg',
        link: '/catalogo?categoria=atual',
        color1: '#1a2e1a',
        color2: '#2d5a2d',
        active: true,
        sortOrder: 2,
      },
      {
        title: 'LINHA RETRÔ',
        subtitle: 'Clássicos que nunca envelhecem',
        image: '/images/promos/promo-retro.svg',
        link: '/catalogo?categoria=retro',
        color1: '#2e1a0a',
        color2: '#5a3010',
        active: true,
        sortOrder: 3,
      },
    ],
  })
  console.log('✓ Promotions created')

  // Create products
  const products = [
    {
      name: 'Camisa Clássica Vermelha — Futebol',
      description: 'A icônica camisa vermelha com detalhes em branco. Tecido respirável de alta performance, perfeita para campo ou arquibancada.',
      price: 189.90,
      sport: 'futebol',
      category: 'atual',
      sizes: JSON.stringify(['P', 'M', 'G', 'GG']),
      images: JSON.stringify(['/images/products/jersey-football-1-front.svg', '/images/products/jersey-football-1-back.svg']),
      stock: JSON.stringify({ P: 10, M: 15, G: 8, GG: 5 }),
      active: true,
      featured: true,
    },
    {
      name: 'Camisa Azul Royal — Futebol',
      description: 'Camisa azul royal com detalhes dourados. Corte moderno slim fit, ideal para quem quer estilo dentro e fora de campo.',
      price: 199.90,
      sport: 'futebol',
      category: 'atual',
      sizes: JSON.stringify(['P', 'M', 'G', 'GG']),
      images: JSON.stringify(['/images/products/jersey-football-2-front.svg', '/images/products/jersey-football-2-back.svg']),
      stock: JSON.stringify({ P: 12, M: 20, G: 10, GG: 4 }),
      active: true,
      featured: true,
    },
    {
      name: 'Camisa Verde Esmeralda — Futebol',
      description: 'Camisa verde vibrante com lista branca. Tecido dryCool de secagem rápida, aprovada para todos os climas.',
      price: 179.90,
      sport: 'futebol',
      category: 'atual',
      sizes: JSON.stringify(['P', 'M', 'G', 'GG']),
      images: JSON.stringify(['/images/products/jersey-football-3-front.svg', '/images/products/jersey-football-3-back.svg']),
      stock: JSON.stringify({ P: 8, M: 18, G: 12, GG: 6 }),
      active: true,
      featured: false,
    },
    {
      name: 'Retrô Noturna — Futebol',
      description: 'Edição especial retrô inspirada nos anos 90. Azul escuro com detalhes em vermelho, numeração bordada. Edição limitada.',
      price: 249.90,
      sport: 'futebol',
      category: 'retro',
      sizes: JSON.stringify(['P', 'M', 'G', 'GG']),
      images: JSON.stringify(['/images/products/jersey-football-retro-1-front.svg', '/images/products/jersey-football-retro-1-back.svg']),
      stock: JSON.stringify({ P: 5, M: 8, G: 6, GG: 3 }),
      active: true,
      featured: true,
    },
    {
      name: 'Retrô Terrosa — Futebol',
      description: 'Um clássico dos anos 70. Tons terrosos com numeração vintage bordada. Para os verdadeiros colecionadores.',
      price: 259.90,
      sport: 'futebol',
      category: 'retro',
      sizes: JSON.stringify(['P', 'M', 'G', 'GG']),
      images: JSON.stringify(['/images/products/jersey-football-retro-2-front.svg', '/images/products/jersey-football-retro-2-back.svg']),
      stock: JSON.stringify({ P: 4, M: 7, G: 5, GG: 2 }),
      active: true,
      featured: false,
    },
    {
      name: 'Camisa Roxa Élite — Basquete',
      description: 'Regata de basquete em roxo royal com detalhes dourados. Corte atlético, tecido ultraleve com malha micro perfurada.',
      price: 169.90,
      sport: 'basquete',
      category: 'atual',
      sizes: JSON.stringify(['P', 'M', 'G', 'GG']),
      images: JSON.stringify(['/images/products/jersey-basketball-1-front.svg', '/images/products/jersey-basketball-1-back.svg']),
      stock: JSON.stringify({ P: 9, M: 14, G: 11, GG: 5 }),
      active: true,
      featured: true,
    },
    {
      name: 'Camisa Vermelha Power — Basquete',
      description: 'Regata vermelha com contraste em preto e branco. Design agressivo e moderno, tecido com tecnologia anti-odor.',
      price: 159.90,
      sport: 'basquete',
      category: 'atual',
      sizes: JSON.stringify(['P', 'M', 'G', 'GG']),
      images: JSON.stringify(['/images/products/jersey-basketball-2-front.svg', '/images/products/jersey-basketball-2-back.svg']),
      stock: JSON.stringify({ P: 11, M: 16, G: 9, GG: 4 }),
      active: true,
      featured: false,
    },
    {
      name: 'Retrô Verde Ouro — Basquete',
      description: 'Regata retrô inspirada nos grandes campeões dos anos 80. Verde floresta com detalhes dourados e numeração clássica.',
      price: 229.90,
      sport: 'basquete',
      category: 'retro',
      sizes: JSON.stringify(['P', 'M', 'G', 'GG']),
      images: JSON.stringify(['/images/products/jersey-basketball-retro-front.svg', '/images/products/jersey-basketball-retro-back.svg']),
      stock: JSON.stringify({ P: 6, M: 9, G: 7, GG: 3 }),
      active: true,
      featured: true,
    },
  ]

  for (const product of products) {
    await prisma.product.create({ data: product })
  }
  console.log('✓ Products created')

  console.log('\n✅ Seed complete!')
  console.log('\n📋 Admin credentials:')
  console.log('   Email: admin@mantosports.com')
  console.log('   Password: admin123')
  console.log('   URL: http://localhost:3000/admin')
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
