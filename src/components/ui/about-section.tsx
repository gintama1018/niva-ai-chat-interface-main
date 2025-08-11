"use client"

import { motion } from "motion/react"
import { useState, useEffect } from "react"
import { 
  Brain, 
  Shield, 
  Zap, 
  Users, 
  Award, 
  Globe,
  CheckCircle,
  Sparkles
} from "lucide-react"

interface StatItem {
  number: string
  label: string
  icon: React.ComponentType<{ className?: string }>
}

interface FeatureItem {
  icon: React.ComponentType<{ className?: string }>
  title: string
  description: string
}

const stats: StatItem[] = [
  {
    number: "1M+",
    label: "Active Users",
    icon: Users
  },
  {
    number: "99.9%",
    label: "Uptime",
    icon: Shield
  },
  {
    number: "50+",
    label: "Languages",
    icon: Globe
  },
  {
    number: "24/7",
    label: "Support",
    icon: Award
  }
]

const features: FeatureItem[] = [
  {
    icon: Brain,
    title: "Advanced AI Technology",
    description: "Powered by cutting-edge machine learning algorithms and neural networks for superior performance."
  },
  {
    icon: Shield,
    title: "Privacy & Security",
    description: "Your data is encrypted and protected with enterprise-grade security measures."
  },
  {
    icon: Zap,
    title: "Lightning Fast",
    description: "Optimized for speed with response times under 100ms for seamless interactions."
  },
  {
    icon: Sparkles,
    title: "Continuous Learning",
    description: "Our AI continuously improves and adapts to provide better assistance over time."
  }
]

const FloatingIcon = ({ delay = 0 }: { delay?: number }) => {
  const [isClient, setIsClient] = useState(false)
  const [iconProps, setIconProps] = useState({
    left: 0,
    top: 0,
    rotation: 0
  })

  useEffect(() => {
    setIsClient(true)
    setIconProps({
      left: Math.random() * 80 + 10,
      top: Math.random() * 80 + 10,
      rotation: Math.random() * 360
    })
  }, [])

  if (!isClient) {
    return null
  }

  return (
    <motion.div
      className="absolute w-8 h-8 text-accent-metallic/20"
      initial={{ opacity: 0, scale: 0 }}
      animate={{
        opacity: [0, 0.3, 0],
        scale: [0, 1, 0],
        rotate: [iconProps.rotation, iconProps.rotation + 180]
      }}
      transition={{
        duration: 4,
        delay,
        repeat: Infinity,
        repeatDelay: Math.random() * 2
      }}
      style={{
        left: `${iconProps.left}%`,
        top: `${iconProps.top}%`
      }}
    >
      <Brain className="w-full h-full" />
    </motion.div>
  )
}

export default function AboutSection() {
  return (
    <section id="about" className="relative z-10 py-32 px-4 bg-gradient-to-b from-background to-surface-1/20">
      <div className="container max-w-7xl mx-auto">
        {/* Background floating icons */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {Array.from({ length: 6 }).map((_, i) => (
            <FloatingIcon key={i} delay={i * 0.5} />
          ))}
        </div>

        {/* Header */}
        <motion.div
          className="text-center mb-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-5xl font-bold font-display mb-6 bg-gradient-to-r from-text-primary via-accent-metallic to-text-primary bg-clip-text text-transparent">
            About NAVI AI
          </h2>
          <p className="text-text-secondary text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
            We're revolutionizing the way people interact with artificial intelligence, 
            making advanced AI accessible, intuitive, and genuinely helpful for everyone.
          </p>
        </motion.div>

        {/* Stats Section */}
        <motion.div
          className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
        >
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              className="text-center group"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="relative mb-4 mx-auto w-16 h-16 flex items-center justify-center">
                <div className="absolute inset-0 bg-gradient-to-br from-accent-metallic/20 to-primary/20 rounded-xl group-hover:from-accent-metallic/30 group-hover:to-primary/30 transition-all duration-300" />
                <stat.icon className="w-8 h-8 text-accent-metallic relative z-10" />
              </div>
              <div className="text-3xl md:text-4xl font-bold text-text-primary font-display mb-2">
                {stat.number}
              </div>
              <div className="text-text-secondary text-sm md:text-base">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Mission Statement */}
        <motion.div
          className="relative mb-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
        >
          <div className="relative bg-surface-1/60 backdrop-blur-xl rounded-3xl p-8 md:p-12 border border-surface-2/50">
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-glass-overlay to-transparent opacity-50" />
            <div className="relative z-10">
              <h3 className="text-2xl md:text-3xl font-bold font-display mb-6 text-center">
                Our Mission
              </h3>
              <p className="text-text-secondary text-lg leading-relaxed text-center max-w-4xl mx-auto">
                To democratize artificial intelligence by creating intuitive, powerful, and ethical AI solutions 
                that enhance human capabilities rather than replace them. We believe AI should be a collaborative 
                partner that understands, learns, and grows with you.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-8"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
        >
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              className="group relative"
              whileHover={{ y: -5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="relative h-full p-8 rounded-2xl bg-surface-1/40 backdrop-blur-xl border border-surface-2/30 group-hover:border-accent-metallic/30 transition-all duration-500">
                {/* Glass overlay */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-glass-overlay to-transparent opacity-30" />
                
                {/* Icon */}
                <div className="relative mb-6 w-14 h-14 mx-auto md:mx-0">
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-accent-metallic/20 to-primary/20 group-hover:from-accent-metallic/30 group-hover:to-primary/30 transition-all duration-300" />
                  <div className="relative flex items-center justify-center w-full h-full">
                    <feature.icon className="w-7 h-7 text-accent-metallic" />
                  </div>
                </div>

                {/* Content */}
                <div className="relative text-center md:text-left">
                  <h4 className="text-xl font-semibold text-text-primary font-display mb-3 group-hover:text-accent-metallic transition-colors duration-300">
                    {feature.title}
                  </h4>
                  <p className="text-text-secondary leading-relaxed">
                    {feature.description}
                  </p>
                </div>

                {/* Hover glow */}
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
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Call to Action */}
        <motion.div
          className="text-center mt-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          viewport={{ once: true }}
        >
          <p className="text-text-secondary mb-6 text-lg">
            Ready to experience the future of AI assistance?
          </p>
          <motion.button
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-primary to-blue-500 text-white font-medium rounded-xl shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <CheckCircle className="w-5 h-5" />
            Get Started Today
          </motion.button>
        </motion.div>
      </div>
    </section>
  )
}