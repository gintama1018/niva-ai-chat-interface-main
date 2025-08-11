"use client"

import { motion } from "motion/react"
import { useState, useEffect } from "react"
import { 
  Mail, 
  Phone, 
  MapPin, 
  Clock,
  Send,
  MessageCircle,
  Twitter,
  Github,
  Linkedin,
  Globe
} from "lucide-react"

interface ContactInfo {
  icon: React.ComponentType<{ className?: string }>
  title: string
  details: string[]
  accent: string
}

interface SocialLink {
  icon: React.ComponentType<{ className?: string }>
  name: string
  url: string
  color: string
}

const contactInfo: ContactInfo[] = [
  {
    icon: Mail,
    title: "Email Us",
    details: ["support@navi-ai.com", "hello@navi-ai.com"],
    accent: "from-blue-400/30 to-cyan-400/30"
  },
  {
    icon: Phone,
    title: "Call Us",
    details: ["+1 (555) 123-4567", "+1 (555) 987-6543"],
    accent: "from-green-400/30 to-emerald-400/30"
  },
  {
    icon: MapPin,
    title: "Visit Us",
    details: ["123 AI Street", "San Francisco, CA 94105"],
    accent: "from-purple-400/30 to-pink-400/30"
  },
  {
    icon: Clock,
    title: "Business Hours",
    details: ["Mon - Fri: 9:00 AM - 6:00 PM", "Sat - Sun: 10:00 AM - 4:00 PM"],
    accent: "from-orange-400/30 to-red-400/30"
  }
]

const socialLinks: SocialLink[] = [
  {
    icon: Twitter,
    name: "Twitter",
    url: "https://twitter.com/navi-ai",
    color: "hover:text-blue-400"
  },
  {
    icon: Github,
    name: "GitHub",
    url: "https://github.com/navi-ai",
    color: "hover:text-gray-400"
  },
  {
    icon: Linkedin,
    name: "LinkedIn",
    url: "https://linkedin.com/company/navi-ai",
    color: "hover:text-blue-600"
  },
  {
    icon: Globe,
    name: "Website",
    url: "https://navi-ai.com",
    color: "hover:text-accent-metallic"
  }
]

const FloatingMessage = ({ delay = 0 }: { delay?: number }) => {
  const [isClient, setIsClient] = useState(false)
  const [messageProps, setMessageProps] = useState({
    left: 0,
    top: 0,
    rotation: 0
  })

  useEffect(() => {
    setIsClient(true)
    setMessageProps({
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
      className="absolute w-6 h-6 text-accent-metallic/20"
      initial={{ opacity: 0, scale: 0 }}
      animate={{
        opacity: [0, 0.4, 0],
        scale: [0, 1, 0],
        rotate: [messageProps.rotation, messageProps.rotation + 180]
      }}
      transition={{
        duration: 3,
        delay,
        repeat: Infinity,
        repeatDelay: Math.random() * 2
      }}
      style={{
        left: `${messageProps.left}%`,
        top: `${messageProps.top}%`
      }}
    >
      <MessageCircle className="w-full h-full" />
    </motion.div>
  )
}

export default function ContactSection() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // Reset form
    setFormData({
      name: '',
      email: '',
      subject: '',
      message: ''
    })
    setIsSubmitting(false)
    
    // You would typically send this to your backend here
    console.log('Form submitted:', formData)
  }

  return (
    <section id="contact" className="relative z-10 py-32 px-4 bg-gradient-to-b from-surface-1/20 to-background">
      <div className="container max-w-7xl mx-auto">
        {/* Background floating messages */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {Array.from({ length: 8 }).map((_, i) => (
            <FloatingMessage key={i} delay={i * 0.3} />
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
            Get In Touch
          </h2>
          <p className="text-text-secondary text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
            Have questions about NAVI AI? We'd love to hear from you. 
            Send us a message and we'll respond as soon as possible.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <h3 className="text-2xl font-bold font-display mb-8 text-text-primary">
              Contact Information
            </h3>
            
            <div className="space-y-6 mb-12">
              {contactInfo.map((info, index) => (
                <motion.div
                  key={info.title}
                  className="group flex items-start gap-4"
                  whileHover={{ x: 5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className={`flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br ${info.accent} backdrop-blur-sm flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                    <info.icon className="w-6 h-6 text-text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-text-primary mb-2 group-hover:text-accent-metallic transition-colors duration-300">
                      {info.title}
                    </h4>
                    {info.details.map((detail, i) => (
                      <p key={i} className="text-text-secondary text-sm">
                        {detail}
                      </p>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Social Links */}
            <div>
              <h4 className="font-semibold text-text-primary mb-4">Follow Us</h4>
              <div className="flex gap-4">
                {socialLinks.map((social, index) => (
                  <motion.a
                    key={social.name}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`w-10 h-10 rounded-lg bg-surface-1/60 backdrop-blur-xl border border-surface-2/50 flex items-center justify-center text-text-secondary ${social.color} transition-all duration-300`}
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <social.icon className="w-5 h-5" />
                  </motion.a>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
          >
            <div className="relative bg-surface-1/60 backdrop-blur-xl rounded-3xl p-8 border border-surface-2/50">
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-glass-overlay to-transparent opacity-50" />
              
              <div className="relative z-10">
                <h3 className="text-2xl font-bold font-display mb-6 text-text-primary">
                  Send us a Message
                </h3>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-text-primary mb-2">
                        Name
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 bg-surface-2/50 border border-surface-2 rounded-xl text-text-primary placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-accent-metallic/50 focus:border-accent-metallic transition-all duration-300"
                        placeholder="Your name"
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-text-primary mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 bg-surface-2/50 border border-surface-2 rounded-xl text-text-primary placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-accent-metallic/50 focus:border-accent-metallic transition-all duration-300"
                        placeholder="your@email.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-text-primary mb-2">
                      Subject
                    </label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 bg-surface-2/50 border border-surface-2 rounded-xl text-text-primary placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-accent-metallic/50 focus:border-accent-metallic transition-all duration-300"
                      placeholder="What's this about?"
                    />
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-text-primary mb-2">
                      Message
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      required
                      rows={5}
                      className="w-full px-4 py-3 bg-surface-2/50 border border-surface-2 rounded-xl text-text-primary placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-accent-metallic/50 focus:border-accent-metallic transition-all duration-300 resize-none"
                      placeholder="Tell us more about your inquiry..."
                    />
                  </div>

                  <motion.button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-primary to-blue-500 text-white font-medium rounded-xl shadow-lg shadow-primary/25 hover:shadow-primary/40 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                    whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
                    whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
                  >
                    {isSubmitting ? (
                      <>
                        <motion.div
                          className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5" />
                        Send Message
                      </>
                    )}
                  </motion.button>
                </form>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}