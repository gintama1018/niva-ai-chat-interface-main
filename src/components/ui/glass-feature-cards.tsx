"use client"

import { motion } from "motion/react"
import { useEffect, useState } from "react"
import {
  MessageCircle,
  Heart,
  Bot,
  TrendingUp,
  Sparkles,
  Brain,
  Target,
  Zap
} from "lucide-react"

interface FeatureCard {
  icon: React.ComponentType<{ className?: string }>
  title: string
  description: string
  accent: string
}

const features: FeatureCard[] = [
  {
    icon: MessageCircle,
    title: "Smart Conversations",
    description: "Engage in natural, context-aware conversations that adapt to your communication style and preferences.",
    accent: "from-blue-400/30 to-cyan-400/30"
  },
  {
    icon: Heart,
    title: "Mood Intelligence",
    description: "Advanced emotional AI that understands and responds to your emotional state with empathy and care.",
    accent: "from-pink-400/30 to-rose-400/30"
  },
  {
    icon: Bot,
    title: "Personal Assistant",
    description: "Your dedicated AI companion that helps organize your life, manage tasks, and boost productivity.",
    accent: "from-emerald-400/30 to-teal-400/30"
  },
  {
    icon: TrendingUp,
    title: "Learning & Growth",
    description: "Continuous learning capabilities that evolve with you, providing personalized insights and recommendations.",
    accent: "from-amber-400/30 to-orange-400/30"
  }
]

const FloatingParticle = ({ delay = 0 }: { delay?: number }) => {
  const [isClient, setIsClient] = useState(false)
  const [particleProps, setParticleProps] = useState({
    left: 0,
    top: 0,
    xMovement: 0,
    yMovement: 0,
    repeatDelay: 0
  })

  useEffect(() => {
    setIsClient(true)
    setParticleProps({
      left: Math.random() * 100,
      top: Math.random() * 100,
      xMovement: Math.random() * 100 - 50,
      yMovement: Math.random() * 100 - 50,
      repeatDelay: Math.random() * 3
    })
  }, [])

  if (!isClient) {
    return null
  }

  return (
    <motion.div
      className="absolute w-1 h-1 bg-accent-metallic/40 rounded-full"
      initial={{ opacity: 0, scale: 0 }}
      animate={{
        opacity: [0, 1, 0],
        scale: [0, 1, 0],
        x: [0, particleProps.xMovement],
        y: [0, particleProps.yMovement],
      }}
      transition={{
        duration: 2,
        delay,
        repeat: Infinity,
        repeatDelay: particleProps.repeatDelay,
      }}
      style={{
        left: `${particleProps.left}%`,
        top: `${particleProps.top}%`,
      }}
    />
  )
}

export default function GlassFeatureCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-6 w-full">
      {features.map((feature, index) => (
        <motion.div
          key={feature.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: index * 0.1 }}
          whileHover={{ y: -8, scale: 1.02 }}
          className="group relative overflow-hidden"
        >
          {/* Background particles */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
            {Array.from({ length: 8 }).map((_, i) => (
              <FloatingParticle key={i} delay={i * 0.1} />
            ))}
          </div>

          {/* Main card */}
          <div className="relative h-full p-6 rounded-2xl bg-surface-1/60 backdrop-blur-xl border border-surface-2/50 group-hover:border-accent-metallic/30 transition-all duration-500">
            {/* Glass overlay */}
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-glass-overlay to-transparent opacity-50" />
            
            {/* Silver glow effect */}
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-accent-metallic/10 via-transparent to-accent-metallic/5 opacity-0 group-hover:opacity-100 transition-all duration-500" />
            
            {/* Floating icon container */}
            <motion.div
              className="relative mb-6 w-16 h-16 mx-auto"
              whileHover={{ rotateY: 15, rotateX: 15 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <div className={`absolute inset-0 rounded-xl bg-gradient-to-br ${feature.accent} backdrop-blur-sm`} />
              <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-accent-metallic/20 to-transparent group-hover:from-accent-metallic/30 transition-all duration-300" />
              <div className="relative flex items-center justify-center w-full h-full">
                <feature.icon className="w-8 h-8 text-text-primary group-hover:text-accent-metallic transition-colors duration-300" />
              </div>
            </motion.div>

            {/* Content */}
            <div className="relative text-center space-y-3">
              <h3 className="text-lg font-semibold text-text-primary font-display group-hover:text-accent-metallic transition-colors duration-300">
                {feature.title}
              </h3>
              <p className="text-sm text-text-secondary leading-relaxed group-hover:text-text-secondary/90 transition-colors duration-300">
                {feature.description}
              </p>
            </div>

            {/* Animated glow */}
            <motion.div
              className="absolute -inset-0.5 rounded-2xl bg-gradient-to-br from-accent-metallic/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10"
              animate={{
                boxShadow: [
                  "0 0 0 rgba(192, 192, 192, 0)",
                  "0 0 20px rgba(192, 192, 192, 0.1)",
                  "0 0 0 rgba(192, 192, 192, 0)"
                ]
              }}
              transition={{ duration: 2, repeat: Infinity }}
            />

            {/* Shimmer effect */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100">
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-accent-metallic/10 to-transparent"
                animate={{
                  x: [-100, 300],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  repeatDelay: 2,
                }}
                style={{
                  transform: "skewX(-45deg)",
                }}
              />
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  )
}