"use client"

import React, { useState, useEffect } from 'react'
import { motion, useMotionValue, useTransform, useAnimation } from 'motion/react'
import { Check, Star, Sparkles } from 'lucide-react'

interface PricingFeature {
  text: string
  included: boolean
}

interface PricingTier {
  name: string
  price: number
  originalPrice?: number
  period: string
  description: string
  features: PricingFeature[]
  buttonText: string
  popular?: boolean
}

interface MetallicPricingCardsProps {
  tiers?: PricingTier[]
  onSelectPlan?: (tierName: string) => void
}

const defaultTiers: PricingTier[] = [
  {
    name: 'Free',
    price: 0,
    period: 'month',
    description: 'Perfect for getting started with AI assistance',
    features: [
      { text: '10 AI conversations per month', included: true },
      { text: 'Basic response speed', included: true },
      { text: 'Standard support', included: true },
      { text: 'Mobile app access', included: true },
      { text: 'Priority support', included: false },
      { text: 'Advanced AI models', included: false }
    ],
    buttonText: 'Get Started'
  },
  {
    name: 'Pro',
    price: 29,
    originalPrice: 49,
    period: 'month',
    description: 'Unlock the full potential of AI assistance',
    features: [
      { text: 'Unlimited AI conversations', included: true },
      { text: 'Lightning-fast responses', included: true },
      { text: 'Priority support', included: true },
      { text: 'Mobile app access', included: true },
      { text: 'Advanced AI models', included: true },
      { text: 'Custom integrations', included: true }
    ],
    buttonText: 'Upgrade to Pro',
    popular: true
  },
  {
    name: 'Enterprise',
    price: 99,
    period: 'month',
    description: 'For teams and organizations that need more',
    features: [
      { text: 'Everything in Pro', included: true },
      { text: 'Team collaboration tools', included: true },
      { text: 'Advanced analytics', included: true },
      { text: 'Custom AI training', included: true },
      { text: 'Dedicated support', included: true },
      { text: 'Enterprise security', included: true }
    ],
    buttonText: 'Contact Sales'
  }
]

const AnimatedCounter: React.FC<{ value: number; duration?: number }> = ({ value, duration = 1000 }) => {
  const [displayValue, setDisplayValue] = useState(0)

  useEffect(() => {
    let startTime: number
    let animationFrame: number

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime
      const elapsed = currentTime - startTime
      const progress = Math.min(elapsed / duration, 1)
      
      const easeOutQuart = 1 - Math.pow(1 - progress, 4)
      const current = Math.floor(easeOutQuart * value)
      
      setDisplayValue(current)
      
      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate)
      }
    }

    animationFrame = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(animationFrame)
  }, [value, duration])

  return <span>{displayValue}</span>
}

const ParticleEffect: React.FC = () => {
  const [isClient, setIsClient] = useState(false)
  const [particles, setParticles] = useState<Array<{
    initialX: string
    initialY: string
    animateX: string[]
    animateY: string[]
  }>>([])

  useEffect(() => {
    setIsClient(true)
    const newParticles = Array.from({ length: 8 }).map(() => ({
      initialX: Math.random() * 100 + '%',
      initialY: Math.random() * 100 + '%',
      animateX: [Math.random() * 100 + '%', Math.random() * 100 + '%'],
      animateY: [Math.random() * 100 + '%', Math.random() * 100 + '%']
    }))
    setParticles(newParticles)
  }, [])

  if (!isClient) {
    return null
  }

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {particles.map((particle, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-accent-metallic rounded-full opacity-60"
          initial={{
            x: particle.initialX,
            y: particle.initialY,
            scale: 0
          }}
          animate={{
            x: particle.animateX,
            y: particle.animateY,
            scale: [0, 1, 0],
            opacity: [0, 0.6, 0]
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            delay: i * 0.4,
            ease: "easeInOut"
          }}
        />
      ))}
    </div>
  )
}

const RippleEffect: React.FC<{ isActive: boolean; onComplete: () => void }> = ({ isActive, onComplete }) => {
  return (
    <>
      {isActive && (
        <motion.div
          className="absolute inset-0 bg-white rounded-lg opacity-20"
          initial={{ scale: 0 }}
          animate={{ scale: 2, opacity: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          onAnimationComplete={onComplete}
        />
      )}
    </>
  )
}

const PricingCard: React.FC<{ 
  tier: PricingTier
  isAnnual: boolean
  onSelect: () => void
}> = ({ tier, isAnnual, onSelect }) => {
  const [isHovered, setIsHovered] = useState(false)
  const [rippleActive, setRippleActive] = useState(false)
  const [featuresVisible, setFeaturesVisible] = useState(false)
  
  const controls = useAnimation()
  const cardY = useMotionValue(0)
  const cardRotateX = useTransform(cardY, [-100, 100], [10, -10])
  const cardScale = useTransform(cardY, [-100, 100], [1.02, 0.98])

  const displayPrice = isAnnual ? Math.round(tier.price * 0.8) : tier.price
  const savings = isAnnual && tier.price > 0 ? tier.price * 12 * 0.2 : 0

  useEffect(() => {
    const timer = setTimeout(() => setFeaturesVisible(true), 200)
    return () => clearTimeout(timer)
  }, [])

  const handleRipple = () => {
    setRippleActive(true)
    onSelect()
  }

  return (
    <motion.div
      className={`relative group ${tier.popular ? 'z-10' : ''}`}
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: tier.popular ? 0.1 : 0.2 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onMouseMove={(e) => {
        const rect = e.currentTarget.getBoundingClientRect()
        const centerY = rect.top + rect.height / 2
        cardY.set(e.clientY - centerY)
      }}
      onMouseLeave={() => cardY.set(0)}
      style={{
        rotateX: cardRotateX,
        scale: cardScale,
        transformStyle: "preserve-3d"
      }}
    >
      {/* Popular Badge */}
      {tier.popular && (
        <motion.div
          className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-20"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, type: "spring", stiffness: 300 }}
        >
          <div className="relative bg-gradient-to-r from-accent-metallic via-white to-accent-metallic p-3 rounded-full shadow-2xl">
            <div className="flex items-center gap-2 px-4 py-1 bg-surface-1 rounded-full">
              <Sparkles className="w-4 h-4 text-accent-metallic" />
              <span className="text-sm font-medium text-accent-metallic font-display">
                Most Popular
              </span>
            </div>
            <ParticleEffect />
          </div>
        </motion.div>
      )}

      {/* Main Card */}
      <motion.div
        className={`relative h-full bg-surface-1 rounded-2xl p-8 overflow-hidden ${
          tier.popular ? 'border-2 border-accent-metallic shadow-2xl shadow-accent-metallic/20' : 'border border-surface-2'
        }`}
        whileHover={{ y: -8 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
      >
        {/* Animated Gradient Border */}
        <div className={`absolute inset-0 rounded-2xl p-0.5 ${
          tier.popular ? 'bg-gradient-to-r from-accent-metallic via-white to-accent-metallic' : 'bg-gradient-to-br from-surface-2 to-surface-1'
        }`}>
          <div className="h-full w-full bg-surface-1 rounded-2xl" />
        </div>

        {/* Glassmorphic Overlay */}
        <motion.div
          className="absolute inset-0 rounded-2xl"
          style={{
            background: isHovered ? 
              'linear-gradient(135deg, rgba(192,192,192,0.05), rgba(255,255,255,0.02))' : 
              'linear-gradient(135deg, rgba(255,255,255,0.02), rgba(255,255,255,0.01))'
          }}
          transition={{ duration: 0.3 }}
        />

        <div className="relative z-10 h-full flex flex-col">
          {/* Header */}
          <div className="text-center mb-8">
            <h3 className="text-xl font-semibold text-text-primary mb-2 font-display">
              {tier.name}
            </h3>
            <p className="text-text-secondary text-sm mb-6">
              {tier.description}
            </p>

            {/* Pricing */}
            <div className="mb-6">
              <div className="flex items-baseline justify-center gap-1">
                <span className="text-text-secondary text-lg">$</span>
                <span className="text-4xl font-bold text-text-primary font-display">
                  <AnimatedCounter value={displayPrice} />
                </span>
                <span className="text-text-secondary">/{tier.period}</span>
              </div>
              
              {tier.originalPrice && isAnnual && (
                <div className="flex items-center justify-center gap-2 mt-2">
                  <span className="text-sm text-text-secondary line-through">
                    ${tier.originalPrice}
                  </span>
                  <span className="text-sm text-green-400 font-medium">
                    Save ${Math.round(savings)}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Features */}
          <div className="flex-1 mb-8">
            <ul className="space-y-4">
              {tier.features.map((feature, index) => (
                <motion.li
                  key={index}
                  className="flex items-center gap-3"
                  initial={{ opacity: 0, x: -20 }}
                  animate={featuresVisible ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: index * 0.1 + 0.3 }}
                >
                  <div className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center ${
                    feature.included ? 'bg-green-500/20' : 'bg-surface-2'
                  }`}>
                    <Check 
                      className={`w-3 h-3 ${
                        feature.included ? 'text-green-400' : 'text-surface-2'
                      }`} 
                    />
                  </div>
                  <span className={`text-sm ${
                    feature.included ? 'text-text-primary' : 'text-text-secondary'
                  }`}>
                    {feature.text}
                  </span>
                </motion.li>
              ))}
            </ul>
          </div>

          {/* CTA Button */}
          <motion.button
            className={`relative w-full py-4 px-6 rounded-xl font-medium text-sm overflow-hidden ${
              tier.popular 
                ? 'bg-gradient-to-r from-primary to-blue-500 text-white shadow-lg shadow-primary/25' 
                : 'bg-surface-2 text-text-primary border border-surface-2 hover:bg-surface-1'
            }`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleRipple}
          >
            <span className="relative z-10">{tier.buttonText}</span>
            <RippleEffect 
              isActive={rippleActive} 
              onComplete={() => setRippleActive(false)} 
            />
            
            {tier.popular && (
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                animate={{ x: ['-100%', '100%'] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
              />
            )}
          </motion.button>
        </div>

        {/* Enhanced glow for popular card */}
        {tier.popular && (
          <motion.div
            className="absolute inset-0 rounded-2xl pointer-events-none"
            style={{
              boxShadow: isHovered 
                ? '0 0 80px rgba(192,192,192,0.3)' 
                : '0 0 40px rgba(192,192,192,0.15)'
            }}
            transition={{ duration: 0.3 }}
          />
        )}
      </motion.div>
    </motion.div>
  )
}

const MetallicPricingCards: React.FC<MetallicPricingCardsProps> = ({ 
  tiers = defaultTiers, 
  onSelectPlan 
}) => {
  const [isAnnual, setIsAnnual] = useState(false)

  const handleSelectPlan = (tierName: string) => {
    onSelectPlan?.(tierName)
  }

  return (
    <div className="w-full bg-background py-20">
      <div className="container mx-auto px-6">
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl font-bold text-text-primary mb-4 font-display">
            Choose Your AI Experience
          </h2>
          <p className="text-text-secondary text-lg max-w-2xl mx-auto">
            Unlock the power of advanced AI assistance with our premium plans designed for every need
          </p>
        </motion.div>

        {/* Billing Toggle */}
        <motion.div
          className="flex items-center justify-center mb-12"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="relative bg-surface-2 p-1 rounded-xl">
            <motion.div
              className="absolute top-1 bottom-1 w-24 bg-gradient-to-r from-accent-metallic to-white rounded-lg"
              animate={{ x: isAnnual ? 96 : 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            />
            <div className="relative flex">
              <button
                className={`px-6 py-3 text-sm font-medium rounded-lg transition-colors duration-200 ${
                  !isAnnual ? 'text-surface-1' : 'text-text-secondary hover:text-text-primary'
                }`}
                onClick={() => setIsAnnual(false)}
              >
                Monthly
              </button>
              <button
                className={`px-6 py-3 text-sm font-medium rounded-lg transition-colors duration-200 ${
                  isAnnual ? 'text-surface-1' : 'text-text-secondary hover:text-text-primary'
                }`}
                onClick={() => setIsAnnual(true)}
              >
                Annual
                <span className="ml-2 text-xs bg-green-500 text-white px-2 py-0.5 rounded-full">
                  Save 20%
                </span>
              </button>
            </div>
          </div>
        </motion.div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {tiers.map((tier) => (
            <PricingCard
              key={tier.name}
              tier={tier}
              isAnnual={isAnnual}
              onSelect={() => handleSelectPlan(tier.name)}
            />
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          className="text-center mt-16"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <p className="text-text-secondary mb-4">
            Not sure which plan is right for you?
          </p>
          <button className="text-primary hover:text-blue-400 font-medium transition-colors duration-200">
            Compare all features →
          </button>
        </motion.div>
      </div>
    </div>
  )
}

export default MetallicPricingCards