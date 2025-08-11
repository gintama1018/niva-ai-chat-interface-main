"use client"

import { motion } from "motion/react"
import { useState, useEffect } from "react"
import { 
  Brain,
  Mail,
  Phone,
  MapPin,
  Twitter,
  Github,
  Linkedin,
  Globe,
  Heart,
  ArrowUp,
  Sparkles
} from "lucide-react"

interface FooterLink {
  name: string
  href: string
}

interface FooterSection {
  title: string
  links: FooterLink[]
}

const footerSections: FooterSection[] = [
  {
    title: "Product",
    links: [
      { name: "Features", href: "#features" },
      { name: "Pricing", href: "#pricing" },
      { name: "API Documentation", href: "/docs" },
      { name: "Integrations", href: "/integrations" }
    ]
  },
  {
    title: "Company",
    links: [
      { name: "About", href: "#about" },
      { name: "Contact", href: "#contact" },
      { name: "Careers", href: "/careers" },
      { name: "Blog", href: "/blog" }
    ]
  },
  {
    title: "Resources",
    links: [
      { name: "Help Center", href: "/help" },
      { name: "Community", href: "/community" },
      { name: "Tutorials", href: "/tutorials" },
      { name: "Status", href: "/status" }
    ]
  },
  {
    title: "Legal",
    links: [
      { name: "Privacy Policy", href: "/privacy" },
      { name: "Terms of Service", href: "/terms" },
      { name: "Cookie Policy", href: "/cookies" },
      { name: "GDPR", href: "/gdpr" }
    ]
  }
]

const socialLinks = [
  {
    icon: Twitter,
    name: "Twitter",
    href: "https://twitter.com/navi-ai",
    color: "hover:text-blue-400"
  },
  {
    icon: Github,
    name: "GitHub",
    href: "https://github.com/navi-ai",
    color: "hover:text-gray-400"
  },
  {
    icon: Linkedin,
    name: "LinkedIn",
    href: "https://linkedin.com/company/navi-ai",
    color: "hover:text-blue-600"
  },
  {
    icon: Globe,
    name: "Website",
    href: "https://navi-ai.com",
    color: "hover:text-accent-metallic"
  }
]

const FloatingSparkle = ({ delay = 0 }: { delay?: number }) => {
  const [isClient, setIsClient] = useState(false)
  const [sparkleProps, setSparkleProps] = useState({
    left: 0,
    top: 0,
    scale: 0
  })

  useEffect(() => {
    setIsClient(true)
    setSparkleProps({
      left: Math.random() * 100,
      top: Math.random() * 50,
      scale: Math.random() * 0.5 + 0.5
    })
  }, [])

  if (!isClient) {
    return null
  }

  return (
    <motion.div
      className="absolute text-accent-metallic/20"
      initial={{ opacity: 0, scale: 0 }}
      animate={{
        opacity: [0, 0.6, 0],
        scale: [0, sparkleProps.scale, 0],
        rotate: [0, 180, 360]
      }}
      transition={{
        duration: 3,
        delay,
        repeat: Infinity,
        repeatDelay: Math.random() * 2
      }}
      style={{
        left: `${sparkleProps.left}%`,
        top: `${sparkleProps.top}%`
      }}
    >
      <Sparkles className="w-4 h-4" />
    </motion.div>
  )
}

export default function Footer() {
  const [showScrollTop, setShowScrollTop] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <footer className="relative bg-gradient-to-b from-background to-surface-1/30 border-t border-surface-2/50">
      {/* Background sparkles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 12 }).map((_, i) => (
          <FloatingSparkle key={i} delay={i * 0.2} />
        ))}
      </div>

      <div className="relative z-10">
        {/* Main Footer Content */}
        <div className="container max-w-7xl mx-auto px-4 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
            {/* Brand Section */}
            <div className="lg:col-span-2">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                {/* Logo */}
                <div className="flex items-center gap-3 mb-6">
                  <div className="relative">
                    <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent-metallic rounded-xl flex items-center justify-center">
                      <Brain className="w-6 h-6 text-white" />
                    </div>
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-br from-primary to-accent-metallic rounded-xl opacity-50"
                      animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.5, 0.8, 0.5]
                      }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                  </div>
                  <span className="text-2xl font-bold font-display text-text-primary">
                    NAVI AI
                  </span>
                </div>

                <p className="text-text-secondary mb-6 leading-relaxed">
                  Revolutionizing the way people interact with artificial intelligence. 
                  Making advanced AI accessible, intuitive, and genuinely helpful for everyone.
                </p>

                {/* Contact Info */}
                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-3 text-text-secondary">
                    <Mail className="w-4 h-4 text-accent-metallic" />
                    <span className="text-sm">support@navi-ai.com</span>
                  </div>
                  <div className="flex items-center gap-3 text-text-secondary">
                    <Phone className="w-4 h-4 text-accent-metallic" />
                    <span className="text-sm">+1 (555) 123-4567</span>
                  </div>
                  <div className="flex items-center gap-3 text-text-secondary">
                    <MapPin className="w-4 h-4 text-accent-metallic" />
                    <span className="text-sm">San Francisco, CA</span>
                  </div>
                </div>

                {/* Social Links */}
                <div className="flex gap-3">
                  {socialLinks.map((social, index) => (
                    <motion.a
                      key={social.name}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`w-10 h-10 rounded-lg bg-surface-1/60 backdrop-blur-xl border border-surface-2/50 flex items-center justify-center text-text-secondary ${social.color} transition-all duration-300`}
                      whileHover={{ scale: 1.1, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <social.icon className="w-4 h-4" />
                    </motion.a>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Footer Links */}
            {footerSections.map((section, index) => (
              <motion.div
                key={section.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <h3 className="font-semibold text-text-primary mb-4 font-display">
                  {section.title}
                </h3>
                <ul className="space-y-3">
                  {section.links.map((link) => (
                    <li key={link.name}>
                      <a
                        href={link.href}
                        className="text-text-secondary hover:text-accent-metallic transition-colors duration-300 text-sm"
                      >
                        {link.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Newsletter Section */}
        <div className="border-t border-surface-2/50">
          <div className="container max-w-7xl mx-auto px-4 py-8">
            <motion.div
              className="flex flex-col md:flex-row items-center justify-between gap-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <div>
                <h3 className="font-semibold text-text-primary mb-2 font-display">
                  Stay Updated
                </h3>
                <p className="text-text-secondary text-sm">
                  Get the latest updates on AI technology and product releases.
                </p>
              </div>
              <div className="flex gap-3 w-full md:w-auto">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 md:w-64 px-4 py-2 bg-surface-2/50 border border-surface-2 rounded-lg text-text-primary placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-accent-metallic/50 focus:border-accent-metallic transition-all duration-300"
                />
                <motion.button
                  className="px-6 py-2 bg-gradient-to-r from-primary to-blue-500 text-white font-medium rounded-lg shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all duration-300"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Subscribe
                </motion.button>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-surface-2/50">
          <div className="container max-w-7xl mx-auto px-4 py-6">
            <motion.div
              className="flex flex-col md:flex-row items-center justify-between gap-4"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center gap-2 text-text-secondary text-sm">
                <span>© 2024 NAVI AI. Made with</span>
                <Heart className="w-4 h-4 text-red-400" />
                <span>in San Francisco</span>
              </div>
              <div className="flex items-center gap-6 text-text-secondary text-sm">
                <span>All rights reserved</span>
                <span>•</span>
                <span>Powered by AI</span>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Scroll to Top Button */}
      <motion.button
        className={`fixed bottom-8 right-8 w-12 h-12 bg-gradient-to-r from-primary to-blue-500 text-white rounded-full shadow-lg shadow-primary/25 flex items-center justify-center z-50 ${
          showScrollTop ? 'pointer-events-auto' : 'pointer-events-none'
        }`}
        initial={{ opacity: 0, scale: 0 }}
        animate={{ 
          opacity: showScrollTop ? 1 : 0, 
          scale: showScrollTop ? 1 : 0 
        }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={scrollToTop}
      >
        <ArrowUp className="w-5 h-5" />
      </motion.button>
    </footer>
  )
}