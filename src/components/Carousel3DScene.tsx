'use client'

import { useRef, useMemo, useEffect, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface Promotion {
  id: string
  title: string
  subtitle?: string | null
  color1: string
  color2: string
}

function buildTexture(title: string, subtitle: string, c1: string, c2: string): THREE.CanvasTexture {
  const w = 1024
  const h = 512
  const canvas = document.createElement('canvas')
  canvas.width = w
  canvas.height = h
  const ctx = canvas.getContext('2d')!

  const grad = ctx.createLinearGradient(0, 0, w, h)
  grad.addColorStop(0, c1)
  grad.addColorStop(1, c2)
  ctx.fillStyle = grad
  ctx.fillRect(0, 0, w, h)

  // Decorative rings
  ctx.strokeStyle = 'rgba(255,255,255,0.15)'
  ctx.lineWidth = 2
  for (const r of [280, 200, 120]) {
    ctx.beginPath()
    ctx.arc(880, 256, r, 0, Math.PI * 2)
    ctx.stroke()
  }
  // Diagonal lines
  for (let i = 0; i < 5; i++) {
    ctx.strokeStyle = 'rgba(255,255,255,0.05)'
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.moveTo(0, 150 + i * 100)
    ctx.lineTo(w * 0.75, 0)
    ctx.stroke()
  }

  // Title
  ctx.fillStyle = '#ffffff'
  ctx.font = 'bold 80px Arial Black, sans-serif'
  ctx.textAlign = 'left'
  ctx.fillText(title, 70, 220)

  // Subtitle
  if (subtitle) {
    ctx.font = '32px Arial, sans-serif'
    ctx.fillStyle = 'rgba(255,255,255,0.75)'
    ctx.fillText(subtitle, 70, 285)
  }

  // CTA button
  const btnX = 70, btnY = 330, btnW = 180, btnH = 52
  ctx.fillStyle = 'rgba(255,255,255,0.2)'
  ctx.beginPath()
  ctx.roundRect(btnX, btnY, btnW, btnH, 4)
  ctx.fill()
  ctx.strokeStyle = 'rgba(255,255,255,0.6)'
  ctx.lineWidth = 1.5
  ctx.beginPath()
  ctx.roundRect(btnX, btnY, btnW, btnH, 4)
  ctx.stroke()
  ctx.fillStyle = '#ffffff'
  ctx.font = 'bold 20px Arial, sans-serif'
  ctx.textAlign = 'center'
  ctx.fillText('VER COLEÇÃO', btnX + btnW / 2, btnY + 34)

  // Brand watermark
  ctx.textAlign = 'left'
  ctx.font = '18px Arial, sans-serif'
  ctx.fillStyle = 'rgba(255,255,255,0.4)'
  ctx.fillText('MANTO SPORTS', 70, h - 36)

  return new THREE.CanvasTexture(canvas)
}

interface SlideProps {
  promo: Promotion
  targetPos: [number, number, number]
  targetRotY: number
  targetScale: number
}

function Slide({ promo, targetPos, targetRotY, targetScale }: SlideProps) {
  const meshRef = useRef<THREE.Mesh>(null)
  const matRef = useRef<THREE.MeshBasicMaterial>(null)

  const texture = useMemo(
    () => buildTexture(promo.title, promo.subtitle || '', promo.color1, promo.color2),
    [promo.title, promo.subtitle, promo.color1, promo.color2]
  )

  useEffect(() => {
    if (matRef.current) {
      matRef.current.map = texture
      matRef.current.needsUpdate = true
    }
  }, [texture])

  useFrame(() => {
    const m = meshRef.current
    if (!m) return
    m.position.x += (targetPos[0] - m.position.x) * 0.1
    m.position.y += (targetPos[1] - m.position.y) * 0.1
    m.position.z += (targetPos[2] - m.position.z) * 0.1
    m.rotation.y += (targetRotY - m.rotation.y) * 0.1
    m.scale.x += (targetScale - m.scale.x) * 0.1
    m.scale.y += (targetScale - m.scale.y) * 0.1
  })

  return (
    <mesh ref={meshRef} position={[20, 0, 0]}>
      <planeGeometry args={[8, 4]} />
      <meshBasicMaterial ref={matRef} map={texture} />
    </mesh>
  )
}

interface CamProps {
  mouse: { x: number; y: number }
}

function CameraRig({ mouse }: CamProps) {
  useFrame(state => {
    state.camera.position.x += (mouse.x * 0.4 - state.camera.position.x) * 0.04
    state.camera.position.y += (-mouse.y * 0.25 - state.camera.position.y) * 0.04
    state.camera.lookAt(0, 0, 0)
  })
  return null
}

interface SceneProps {
  promotions: Promotion[]
  current: number
  mouse: { x: number; y: number }
}

function Scene({ promotions, current, mouse }: SceneProps) {
  const n = promotions.length

  return (
    <>
      <CameraRig mouse={mouse} />
      {promotions.map((promo, i) => {
        const offset = ((i - current) % n + n) % n
        const isActive = offset === 0
        const isNext = offset === 1
        const isPrev = offset === n - 1

        const targetPos: [number, number, number] = isActive
          ? [0, 0, 0]
          : isNext
          ? [11, 0, -4]
          : isPrev
          ? [-11, 0, -4]
          : [0, 0, -10]

        const targetRotY = isActive ? 0 : isNext ? -Math.PI / 6 : Math.PI / 6
        const targetScale = isActive ? 1 : 0.72

        return (
          <Slide
            key={promo.id}
            promo={promo}
            targetPos={targetPos}
            targetRotY={targetRotY}
            targetScale={targetScale}
          />
        )
      })}
    </>
  )
}

interface Carousel3DSceneProps {
  promotions: Promotion[]
  current: number
  mouse: { x: number; y: number }
}

export default function Carousel3DScene({ promotions, current, mouse }: Carousel3DSceneProps) {
  return (
    <Canvas
      camera={{ position: [0, 0, 9], fov: 58 }}
      style={{ background: 'transparent' }}
      gl={{ antialias: true }}
    >
      <Scene promotions={promotions} current={current} mouse={mouse} />
    </Canvas>
  )
}
