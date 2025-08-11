"use client"

import { useState, useEffect, useRef } from 'react'
import { motion, useScroll, useTransform } from 'motion/react'
import Link from 'next/link'
import { Menu, X, Sparkles } from 'lucide-react'

interface GlassmorphicNavbarProps {
  onNavigate?: (section: string) => void
  currentSection?: string
  className?: string
}

const navigation = [
  { name: 'Features', href: '#features' },
  { name: 'Pricing', href: '#pricing' },
  { name: 'About', href: '#about' },
  { name: 'Contact', href: '#contact' },
]

export default function GlassmorphicNavbar({ 
  onNavigate, 
  currentSection = '',
  className = ''
}: GlassmorphicNavbarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const navRef = useRef<HTMLElement>(null)
  const cursorRef = useRef<HTMLDivElement>(null)
  
  const { scrollY } = useScroll()
  const navOpacity = useTransform(scrollY, [0, 50], [0.9, 0.95])
  const navBlur = useTransform(scrollY, [0, 50], [8, 16])

  // Track scroll position for enhanced glassmorphism
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Custom cursor effect
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (cursorRef.current) {
        cursorRef.current.style.left = `${e.clientX}px`
        cursorRef.current.style.top = `${e.clientY}px`
      }
    }

    const handleMouseEnter = () => {
      if (cursorRef.current) {
        cursorRef.current.style.opacity = '1'
        cursorRef.current.style.transform = 'scale(1)'
      }
    }

    const handleMouseLeave = () => {
      if (cursorRef.current) {
        cursorRef.current.style.opacity = '0'
        cursorRef.current.style.transform = 'scale(0.8)'
      }
    }

    // Add event listeners to interactive elements
    const interactiveElements = document.querySelectorAll('button, a, [role="button"]')
    
    document.addEventListener('mousemove', handleMouseMove)
    interactiveElements.forEach(el => {
      el.addEventListener('mouseenter', handleMouseEnter)
      el.addEventListener('mouseleave', handleMouseLeave)
    })

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      interactiveElements.forEach(el => {
        el.removeEventListener('mouseenter', handleMouseEnter)
        el.removeEventListener('mouseleave', handleMouseLeave)
      })
    }
  }, [])

  const handleNavigation = (href: string) => {
    const section = href.replace('#', '')
    onNavigate?.(section)
    setIsMobileMenuOpen(false)
  }

  const isActiveSection = (href: string) => {
    const section = href.replace('#', '')
    return currentSection === section
  }

  return (
    <>
      {/* Custom Cursor */}
      <div 
        ref={cursorRef}
        className="fixed w-6 h-6 bg-[#c0c0c0]/20 rounded-full pointer-events-none z-[9999] transition-all duration-300 ease-out opacity-0 scale-80"
        style={{
          boxShadow: '0 0 20px rgba(192, 192, 192, 0.3)',
          backdropFilter: 'blur(10px)',
        }}
      />

      <motion.nav 
        ref={navRef}
        className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-6xl ${className}`}
        style={{
          opacity: navOpacity,
        }}
      >
        <motion.div 
          className={`relative rounded-2xl border transition-all duration-500 ${
            isScrolled 
              ? 'bg-[rgba(26,26,26,0.95)] border-[#c0c0c0]/30' 
              : 'bg-[rgba(26,26,26,0.8)] border-[#c0c0c0]/20'
          }`}
          style={{
            backdropFilter: `blur(${navBlur}px)`,
            boxShadow: isScrolled 
              ? '0 8px 32px rgba(0,0,0,0.4), 0 0 0 1px rgba(192,192,192,0.1), inset 0 1px 0 rgba(192,192,192,0.1)'
              : '0 4px 20px rgba(0,0,0,0.3), 0 0 0 1px rgba(192,192,192,0.08), inset 0 1px 0 rgba(192,192,192,0.08)'
          }}
          whileHover={{
            boxShadow: '0 12px 40px rgba(0,0,0,0.5), 0 0 0 1px rgba(192,192,192,0.15), inset 0 1px 0 rgba(192,192,192,0.15)'
          }}
        >
          {/* Silver glow effect */}
          <div 
            className="absolute inset-0 rounded-2xl opacity-30 pointer-events-none"
            style={{
              background: 'linear-gradient(135deg, rgba(192,192,192,0.1) 0%, transparent 50%, rgba(192,192,192,0.1) 100%)',
            }}
          />

          <div className="relative flex items-center justify-between px-6 py-4">
            {/* Logo */}
            <motion.div 
              className="flex items-center space-x-2 cursor-pointer group"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleNavigation('#home')}
            >
              <motion.div
                className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#3b82f6] to-[#1d4ed8] flex items-center justify-center"
                whileHover={{ 
                  boxShadow: '0 0 20px rgba(59, 130, 246, 0.4)',
                  rotate: [0, -10, 10, 0]
                }}
                transition={{ duration: 0.3 }}
              >
                <Sparkles className="w-4 h-4 text-white" />
              </motion.div>
              <span className="text-lg font-bold bg-gradient-to-r from-[#c0c0c0] to-white bg-clip-text text-transparent">
                NAVI AI
              </span>
            </motion.div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-1">
              {navigation.map((item, index) => (
                <motion.button
                  key={item.name}
                  onClick={() => handleNavigation(item.href)}
                  className={`relative px-6 py-2 rounded-xl text-sm font-medium transition-all duration-300 group ${
                    isActiveSection(item.href)
                      ? 'text-[#c0c0c0]' 
                      : 'text-[#9ca3af] hover:text-[#c0c0c0]'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.3 }}
                >
                  {/* Active indicator */}
                  {isActiveSection(item.href) && (
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-[#c0c0c0]/10 to-[#c0c0c0]/5 rounded-xl border border-[#c0c0c0]/20"
                      layoutId="activeNav"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      style={{
                        boxShadow: 'inset 0 1px 0 rgba(192,192,192,0.1), 0 0 10px rgba(192,192,192,0.1)'
                      }}
                    />
                  )}
                  
                  {/* Hover effect */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-[#c0c0c0]/5 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{
                      boxShadow: 'inset 0 1px 0 rgba(192,192,192,0.05)'
                    }}
                  />
                  
                  <span className="relative z-10">{item.name}</span>
                </motion.button>
              ))}
            </div>

            {/* Get Started Button with Link to Chat */}
            <div className="hidden md:block">
              <Link href="/chat">
                <motion.button
                  className="relative px-6 py-2.5 rounded-xl text-sm font-semibold text-white overflow-hidden group"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  style={{
                    background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 50%, #c0c0c0 100%)',
                  }}
                >
                  {/* Animated gradient overlay */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-[#c0c0c0] via-white to-[#c0c0c0] opacity-0 group-hover:opacity-20"
                    animate={{
                      x: ['-100%', '100%'],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: 'linear'
                    }}
                  />
                  
                  {/* Glow effect */}
                  <div 
                    className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{
                      boxShadow: '0 0 20px rgba(59, 130, 246, 0.4), inset 0 1px 0 rgba(255,255,255,0.2)'
                    }}
                  />
                  
                  <span className="relative z-10">Get Started</span>
                </motion.button>
              </Link>
            </div>

            {/* Mobile menu button */}
            <motion.button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-[#c0c0c0] hover:bg-[rgba(192,192,192,0.1)] transition-colors duration-200"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <motion.div
                animate={{ rotate: isMobileMenuOpen ? 180 : 0 }}
                transition={{ duration: 0.3 }}
              >
                {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </motion.div>
            </motion.button>
          </div>
        </motion.div>

        {/* Mobile Menu */}
        <motion.div
          className="md:hidden mt-2 overflow-hidden"
          initial={false}
          animate={{ 
            height: isMobileMenuOpen ? 'auto' : 0,
            opacity: isMobileMenuOpen ? 1 : 0
          }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
        >
          <motion.div
            className="rounded-2xl border border-[#c0c0c0]/20 bg-[rgba(26,26,26,0.95)] p-4"
            style={{
              backdropFilter: 'blur(16px)',
              boxShadow: '0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(192,192,192,0.1)'
            }}
          >
            <div className="space-y-2">
              {navigation.map((item, index) => (
                <motion.button
                  key={item.name}
                  onClick={() => handleNavigation(item.href)}
                  className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                    isActiveSection(item.href)
                      ? 'text-[#c0c0c0] bg-[rgba(192,192,192,0.1)] border border-[#c0c0c0]/20'
                      : 'text-[#9ca3af] hover:text-[#c0c0c0] hover:bg-[rgba(192,192,192,0.05)]'
                  }`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.3 }}
                  whileHover={{ x: 4 }}
                >
                  {item.name}
                </motion.button>
              ))}
              
              {/* Mobile Get Started Button */}
              <Link href="/chat">
                <motion.button
                  className="w-full mt-4 px-4 py-3 rounded-xl text-sm font-semibold text-white"
                  style={{
                    background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 50%, #c0c0c0 100%)',
                    boxShadow: '0 4px 20px rgba(59, 130, 246, 0.3)'
                  }}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.3 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Get Started
                </motion.button>
              </Link>
            </div>
          </motion.div>
        </motion.div>
      </motion.nav>
    </>
  )
}