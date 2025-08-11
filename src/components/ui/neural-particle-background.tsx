"use client"

import { useEffect, useRef, useCallback } from 'react'

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  size: number
  opacity: number
  color: string
  active: boolean
}

interface Connection {
  from: number
  to: number
  opacity: number
}

export default function NeuralParticleBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationIdRef = useRef<number | undefined>(undefined)
  const particlesRef = useRef<Particle[]>([])
  const connectionsRef = useRef<Connection[]>([])
  const scrollYRef = useRef(0)

  // Performance-optimized particle pool
  const createParticlePool = useCallback((count: number, width: number, height: number): Particle[] => {
    // Check if we're in a browser environment
    if (typeof window === 'undefined') return []
    
    const particles: Particle[] = []
    const colors = ['#c0c0c0', '#3b82f6']
    
    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        size: Math.random() * 3 + 1,
        opacity: Math.random() * 0.3 + 0.1,
        color: colors[Math.floor(Math.random() * colors.length)],
        active: true
      })
    }
    
    return particles
  }, [])

  // Optimized distance calculation with early bailout
  const getDistance = useCallback((x1: number, y1: number, x2: number, y2: number): number => {
    const dx = x2 - x1
    const dy = y2 - y1
    return Math.sqrt(dx * dx + dy * dy)
  }, [])

  // Efficient connection detection
  const updateConnections = useCallback((particles: Particle[]) => {
    const connections: Connection[] = []
    const maxDistance = 120
    
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const distance = getDistance(
          particles[i].x, particles[i].y,
          particles[j].x, particles[j].y
        )
        
        if (distance < maxDistance) {
          const opacity = (1 - distance / maxDistance) * 0.2
          connections.push({
            from: i,
            to: j,
            opacity
          })
        }
      }
    }
    
    connectionsRef.current = connections
  }, [getDistance])

  // Optimized render function
  const render = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const { width, height } = canvas
    
    // Clear canvas with fade effect
    ctx.fillStyle = 'rgba(10, 10, 10, 0.05)'
    ctx.fillRect(0, 0, width, height)

    const particles = particlesRef.current
    const connections = connectionsRef.current

    // Apply subtle parallax effect
    const parallaxOffset = scrollYRef.current * 0.1

    // Render connections with glow
    ctx.save()
    ctx.translate(0, -parallaxOffset)
    
    for (const connection of connections) {
      const fromParticle = particles[connection.from]
      const toParticle = particles[connection.to]
      
      if (!fromParticle?.active || !toParticle?.active) continue

      // Create gradient for connection line
      const gradient = ctx.createLinearGradient(
        fromParticle.x, fromParticle.y,
        toParticle.x, toParticle.y
      )
      gradient.addColorStop(0, fromParticle.color.replace(')', `, ${connection.opacity})`).replace('#', 'rgba(').replace('c0c0c0', '192,192,192').replace('3b82f6', '59,130,246'))
      gradient.addColorStop(1, toParticle.color.replace(')', `, ${connection.opacity})`).replace('#', 'rgba(').replace('c0c0c0', '192,192,192').replace('3b82f6', '59,130,246'))

      ctx.strokeStyle = gradient
      ctx.lineWidth = 0.5
      ctx.globalCompositeOperation = 'lighten'
      
      ctx.beginPath()
      ctx.moveTo(fromParticle.x, fromParticle.y)
      ctx.lineTo(toParticle.x, toParticle.y)
      ctx.stroke()
    }

    // Render particles with glow effect
    ctx.globalCompositeOperation = 'source-over'
    
    for (const particle of particles) {
      if (!particle.active) continue

      const colorRgba = particle.color === '#c0c0c0' 
        ? `rgba(192, 192, 192, ${particle.opacity})`
        : `rgba(59, 130, 246, ${particle.opacity})`

      // Create radial gradient for glow effect
      const gradient = ctx.createRadialGradient(
        particle.x, particle.y, 0,
        particle.x, particle.y, particle.size * 3
      )
      gradient.addColorStop(0, colorRgba)
      gradient.addColorStop(0.3, colorRgba.replace(particle.opacity.toString(), (particle.opacity * 0.5).toString()))
      gradient.addColorStop(1, colorRgba.replace(particle.opacity.toString(), '0'))

      // Draw glow
      ctx.fillStyle = gradient
      ctx.beginPath()
      ctx.arc(particle.x, particle.y, particle.size * 3, 0, Math.PI * 2)
      ctx.fill()

      // Draw core particle
      ctx.fillStyle = colorRgba
      ctx.beginPath()
      ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
      ctx.fill()
    }

    ctx.restore()
  }, [])

  // Optimized animation loop
  const animate = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const { width, height } = canvas
    const particles = particlesRef.current

    // Update particle positions
    for (const particle of particles) {
      if (!particle.active) continue

      particle.x += particle.vx
      particle.y += particle.vy

      // Bounce off edges
      if (particle.x <= 0 || particle.x >= width) {
        particle.vx *= -1
        particle.x = Math.max(0, Math.min(width, particle.x))
      }
      if (particle.y <= 0 || particle.y >= height) {
        particle.vy *= -1
        particle.y = Math.max(0, Math.min(height, particle.y))
      }

      // Subtle opacity variation
      particle.opacity += (Math.random() - 0.5) * 0.002
      particle.opacity = Math.max(0.05, Math.min(0.4, particle.opacity))
    }

    // Update connections less frequently for performance
    if (Math.random() < 0.1) {
      updateConnections(particles)
    }

    render()
    animationIdRef.current = requestAnimationFrame(animate)
  }, [render, updateConnections])

  // Handle canvas resize
  const handleResize = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const dpr = window.devicePixelRatio || 1
    
    canvas.width = rect.width * dpr
    canvas.height = rect.height * dpr
    
    const ctx = canvas.getContext('2d')
    if (ctx) {
      ctx.scale(dpr, dpr)
    }
    
    canvas.style.width = `${rect.width}px`
    canvas.style.height = `${rect.height}px`

    // Recreate particles for new dimensions
    const particleCount = Math.min(80, Math.floor((rect.width * rect.height) / 8000))
    particlesRef.current = createParticlePool(particleCount, rect.width, rect.height)
  }, [createParticlePool])

  // Handle scroll for parallax
  const handleScroll = useCallback(() => {
    scrollYRef.current = window.scrollY
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    // Initial setup
    handleResize()
    
    // Start animation
    animate()

    // Event listeners
    window.addEventListener('resize', handleResize)
    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => {
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current)
      }
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('scroll', handleScroll)
    }
  }, [animate, handleResize, handleScroll])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none z-0"
      style={{
        background: 'transparent',
        opacity: 0.6
      }}
    />
  )
}