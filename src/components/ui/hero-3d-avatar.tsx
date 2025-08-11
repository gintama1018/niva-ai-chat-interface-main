"use client"

import { useEffect, useRef, useState } from "react"
import { motion, useScroll, useTransform, useMotionValue, useSpring } from "motion/react"
import Link from "next/link"
import { Play, Sparkles, Zap, Brain } from "lucide-react"

interface Particle {
  id: number
  x: number
  y: number
  vx: number
  vy: number
  size: number
  opacity: number
  connections: number[]
}

const backgroundVideos = [
  "https://assets.mixkit.co/videos/preview/mixkit-neural-network-animation-background-4138-large.mp4",
  "https://assets.mixkit.co/videos/preview/mixkit-digital-particles-wave-4142-large.mp4", 
  "https://assets.mixkit.co/videos/preview/mixkit-data-network-digital-background-4140-large.mp4",
  "https://assets.mixkit.co/videos/preview/mixkit-futuristic-city-hologram-4139-large.mp4"
]

const aiCapabilities = [
  "Schedule your meetings",
  "Analyze complex data",
  "Write compelling content", 
  "Automate workflows",
  "Research any topic",
  "Generate creative ideas"
]

export default function Hero3DAvatar() {
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0)
  const [currentCapability, setCurrentCapability] = useState(0)
  const particles = useRef<Particle[]>([])
  const animationId = useRef<number | undefined>(undefined)

  const { scrollY } = useScroll()
  const y = useTransform(scrollY, [0, 500], [0, -100])
  const opacity = useTransform(scrollY, [0, 300], [1, 0])
  
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const springX = useSpring(mouseX, { stiffness: 100, damping: 30 })
  const springY = useSpring(mouseY, { stiffness: 100, damping: 30 })

  // Initialize particle system
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    const initParticles = () => {
      particles.current = []
      const particleCount = Math.min(80, Math.floor((canvas.width * canvas.height) / 15000))
      
      for (let i = 0; i < particleCount; i++) {
        particles.current.push({
          id: i,
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5,
          size: Math.random() * 3 + 1,
          opacity: Math.random() * 0.8 + 0.2,
          connections: []
        })
      }
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      
      // Update particles
      particles.current.forEach(particle => {
        particle.x += particle.vx
        particle.y += particle.vy
        
        if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1
        if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1
        
        particle.x = Math.max(0, Math.min(canvas.width, particle.x))
        particle.y = Math.max(0, Math.min(canvas.height, particle.y))
      })
      
      // Draw connections
      particles.current.forEach((particle, i) => {
        particles.current.slice(i + 1).forEach((otherParticle, j) => {
          const dx = particle.x - otherParticle.x
          const dy = particle.y - otherParticle.y
          const distance = Math.sqrt(dx * dx + dy * dy)
          
          if (distance < 120) {
            const opacity = (1 - distance / 120) * 0.3
            ctx.strokeStyle = `rgba(192, 192, 192, ${opacity})`
            ctx.lineWidth = 0.8
            ctx.beginPath()
            ctx.moveTo(particle.x, particle.y)
            ctx.lineTo(otherParticle.x, otherParticle.y)
            ctx.stroke()
          }
        })
      })
      
      // Draw particles
      particles.current.forEach(particle => {
        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(192, 192, 192, ${particle.opacity})`
        ctx.fill()
        
        // Add glow effect
        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.size + 2, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(59, 130, 246, ${particle.opacity * 0.3})`
        ctx.fill()
      })
      
      animationId.current = requestAnimationFrame(animate)
    }

    resizeCanvas()
    initParticles()
    animate()

    window.addEventListener('resize', () => {
      resizeCanvas()
      initParticles()
    })

    return () => {
      if (animationId.current) {
        cancelAnimationFrame(animationId.current)
      }
      window.removeEventListener('resize', resizeCanvas)
    }
  }, [])

  // Cycle through videos
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentVideoIndex((prev) => (prev + 1) % backgroundVideos.length)
    }, 8000)

    return () => clearInterval(interval)
  }, [])

  // Cycle through AI capabilities
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentCapability((prev) => (prev + 1) % aiCapabilities.length)
    }, 2500)

    return () => clearInterval(interval)
  }, [])

  // Mouse tracking for parallax
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX - window.innerWidth / 2) / 50
      const y = (e.clientY - window.innerHeight / 2) / 50
      mouseX.set(x)
      mouseY.set(y)
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [mouseX, mouseY])

  return (
    <div ref={containerRef} className="relative min-h-screen overflow-hidden bg-background">
      {/* Video Background */}
      <div className="absolute inset-0 z-0">
        {backgroundVideos.map((video, index) => (
          <video
            key={video}
            ref={index === currentVideoIndex ? videoRef : undefined}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-2000 ${
              index === currentVideoIndex ? 'opacity-30' : 'opacity-0'
            }`}
            autoPlay
            muted
            loop
            playsInline
          >
            <source src={video} type="video/mp4" />
          </video>
        ))}
        
        {/* Video overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/60 to-background/90" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/40 to-transparent" />
      </div>

      {/* Neural Network Particles */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 z-10 pointer-events-none"
      />

      {/* Main Content */}
      <motion.div
        style={{ y, opacity }}
        className="relative z-20 min-h-screen flex items-center"
      >
        <div className="container max-w-7xl mx-auto px-4 grid lg:grid-cols-2 gap-12 items-center">
          {/* Content Side */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="space-y-8"
          >
            {/* Glassmorphic Content Card */}
            <div className="backdrop-blur-xl bg-glass-overlay border border-white/10 rounded-2xl p-8 shadow-2xl">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="space-y-6"
              >
                {/* Title */}
                <div className="space-y-4">
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    className="flex items-center gap-3"
                  >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-primary to-accent-metallic flex items-center justify-center">
                      <Sparkles className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-sm font-medium text-accent-metallic uppercase tracking-wider">
                      Powered by AI
                    </span>
                  </motion.div>
                  
                  <h1 className="text-5xl lg:text-6xl font-bold font-display leading-tight">
                    Meet Your
                    <br />
                    <span className="bg-gradient-to-r from-primary via-accent-metallic to-primary bg-clip-text text-transparent">
                      Personal AI
                    </span>
                    <br />
                    <span className="text-accent-metallic">NAVI</span>
                  </h1>
                </div>

                {/* Subtitle */}
                <p className="text-xl text-text-secondary leading-relaxed max-w-lg">
                  Your intelligent companion that understands, learns, and adapts to help you achieve more than ever before.
                </p>

                {/* Animated Typing Effect */}
                <div className="space-y-3">
                  <p className="text-sm text-accent-metallic uppercase tracking-wider font-medium">
                    I can help you...
                  </p>
                  <div className="h-8 flex items-center">
                    <motion.span
                      key={currentCapability}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.5 }}
                      className="text-lg font-medium text-primary font-mono"
                    >
                      {aiCapabilities[currentCapability]}
                    </motion.span>
                    <motion.span
                      animate={{ opacity: [1, 0] }}
                      transition={{ duration: 1, repeat: Infinity, repeatType: "reverse" }}
                      className="ml-1 text-primary font-mono"
                    >
                      |
                    </motion.span>
                  </div>
                </div>

                {/* CTAs */}
                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                  <Link href="/chat">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="px-8 py-4 bg-gradient-to-r from-primary via-accent-metallic to-primary bg-size-200 bg-pos-0 hover:bg-pos-100 transition-all duration-500 rounded-lg font-semibold text-white shadow-lg hover:shadow-xl"
                    >
                      Get Started
                      <Zap className="inline-block w-5 h-5 ml-2" />
                    </motion.button>
                  </Link>
                  
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="px-8 py-4 backdrop-blur-xl bg-white/5 border border-white/20 rounded-lg font-semibold text-white hover:bg-white/10 transition-all duration-300 shadow-lg hover:shadow-xl"
                  >
                    <Play className="inline-block w-5 h-5 mr-2" />
                    Watch Demo
                  </motion.button>
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* 3D Avatar Side */}
          <motion.div
            style={{ x: springX, y: springY }}
            className="relative flex items-center justify-center"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.8 }}
              className="relative"
            >
              {/* Floating Avatar Container */}
              <motion.div
                animate={{ 
                  rotateY: [0, 360],
                  y: [0, -20, 0]
                }}
                transition={{ 
                  rotateY: { duration: 20, repeat: Infinity, ease: "linear" },
                  y: { duration: 4, repeat: Infinity, ease: "easeInOut" }
                }}
                className="relative w-80 h-80 lg:w-96 lg:h-96"
                style={{ transformStyle: "preserve-3d" }}
              >
                {/* Avatar Sphere */}
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary/20 via-accent-metallic/30 to-primary/20 backdrop-blur-xl border border-white/20 shadow-2xl">
                  {/* Inner Glow */}
                  <div className="absolute inset-4 rounded-full bg-gradient-to-br from-primary/40 to-accent-metallic/40 blur-xl" />
                  
                  {/* Avatar Icon */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                      className="w-32 h-32 rounded-full bg-gradient-to-br from-primary to-accent-metallic flex items-center justify-center shadow-inner"
                    >
                      <Brain className="w-16 h-16 text-white" />
                    </motion.div>
                  </div>
                </div>

                {/* Orbiting Elements */}
                {[...Array(6)].map((_, i) => (
                  <motion.div
                    key={i}
                    animate={{ rotate: 360 }}
                    transition={{ 
                      duration: 10 + i * 2, 
                      repeat: Infinity, 
                      ease: "linear",
                      delay: i * 0.5
                    }}
                    className="absolute inset-0"
                    style={{ transformOrigin: "50% 50%" }}
                  >
                    <div 
                      className="absolute w-4 h-4 bg-gradient-to-r from-primary to-accent-metallic rounded-full shadow-lg"
                      style={{
                        top: "20%",
                        left: "50%",
                        transform: "translate(-50%, -50%)"
                      }}
                    />
                  </motion.div>
                ))}

                {/* Pulse Rings */}
                {[...Array(3)].map((_, i) => (
                  <motion.div
                    key={i}
                    animate={{ 
                      scale: [1, 1.5, 1],
                      opacity: [0.6, 0, 0.6]
                    }}
                    transition={{ 
                      duration: 3,
                      repeat: Infinity,
                      delay: i * 1
                    }}
                    className="absolute inset-0 rounded-full border border-primary/50"
                  />
                ))}
              </motion.div>

              {/* Floating Data Points */}
              {[...Array(8)].map((_, i) => (
                <motion.div
                  key={i}
                  animate={{
                    x: [0, Math.sin(i) * 100, 0],
                    y: [0, Math.cos(i) * 100, 0],
                    opacity: [0.3, 0.8, 0.3]
                  }}
                  transition={{
                    duration: 4 + i,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: i * 0.3
                  }}
                  className="absolute w-2 h-2 bg-accent-metallic rounded-full shadow-lg"
                  style={{
                    top: `${20 + i * 10}%`,
                    left: `${20 + i * 10}%`
                  }}
                />
              ))}
            </motion.div>
          </motion.div>
        </div>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center"
        >
          <motion.div
            animate={{ y: [0, 16, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-1 h-3 bg-accent-metallic rounded-full mt-2"
          />
        </motion.div>
      </motion.div>
    </div>
  )
}