"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence, useAnimation } from "motion/react"
import { Send, Mic, MicOff, Volume2, Settings, Sparkles, Brain, Palette, Waves } from "lucide-react"
import { Button } from "./button"
import { Input } from "./input"
import { ScrollArea } from "./scroll-area"

interface Message {
  id: string
  type: 'user' | 'ai'
  content: string
  timestamp: Date
}

interface Mood {
  id: string
  name: string
  icon: React.ReactNode
  color: string
  particles: number
}

const moods: Mood[] = [
  { id: 'happy', name: 'Happy', icon: <Sparkles className="w-5 h-5" />, color: '#f59e0b', particles: 12 },
  { id: 'focused', name: 'Focused', icon: <Brain className="w-5 h-5" />, color: '#3b82f6', particles: 8 },
  { id: 'creative', name: 'Creative', icon: <Palette className="w-5 h-5" />, color: '#8b5cf6', particles: 15 },
  { id: 'calm', name: 'Calm', icon: <Waves className="w-5 h-5" />, color: '#10b981', particles: 6 }
]

const NeuralNetworkBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    
    let animationId: number
    
    const particles: Array<{
      x: number
      y: number
      vx: number
      vy: number
      connections: number[]
    }> = []
    
    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    
    const init = () => {
      particles.length = 0
      const particleCount = Math.min(80, Math.floor((canvas.width * canvas.height) / 20000))
      
      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5,
          connections: []
        })
      }
    }
    
    const animate = () => {
      ctx.fillStyle = 'rgba(10, 10, 10, 0.05)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      
      particles.forEach((particle, i) => {
        particle.x += particle.vx
        particle.y += particle.vy
        
        if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1
        if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1
        
        particle.x = Math.max(0, Math.min(canvas.width, particle.x))
        particle.y = Math.max(0, Math.min(canvas.height, particle.y))
        
        ctx.beginPath()
        ctx.arc(particle.x, particle.y, 1, 0, Math.PI * 2)
        ctx.fillStyle = 'rgba(192, 192, 192, 0.3)'
        ctx.fill()
        
        particle.connections = []
        particles.forEach((other, j) => {
          if (i !== j) {
            const dx = particle.x - other.x
            const dy = particle.y - other.y
            const distance = Math.sqrt(dx * dx + dy * dy)
            
            if (distance < 120) {
              particle.connections.push(j)
              const opacity = (120 - distance) / 120 * 0.15
              ctx.beginPath()
              ctx.moveTo(particle.x, particle.y)
              ctx.lineTo(other.x, other.y)
              ctx.strokeStyle = `rgba(192, 192, 192, ${opacity})`
              ctx.lineWidth = 0.5
              ctx.stroke()
            }
          }
        })
      })
      
      animationId = requestAnimationFrame(animate)
    }
    
    resize()
    init()
    animate()
    
    window.addEventListener('resize', () => {
      resize()
      init()
    })
    
    return () => {
      cancelAnimationFrame(animationId)
      window.removeEventListener('resize', resize)
    }
  }, [])
  
  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none opacity-20"
      style={{ zIndex: 0 }}
    />
  )
}

const TypingIndicator = ({ isVisible }: { isVisible: boolean }) => {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="flex items-center gap-2 p-4 max-w-xs"
        >
          <div className="flex items-center gap-1 bg-surface-1 rounded-2xl px-4 py-3 backdrop-blur-xl border border-glass-overlay">
            <div className="flex gap-1">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  animate={{
                    y: [-2, -8, -2],
                    opacity: [0.4, 1, 0.4]
                  }}
                  transition={{
                    duration: 1.2,
                    repeat: Infinity,
                    delay: i * 0.2,
                    ease: "easeInOut"
                  }}
                  className="w-2 h-2 bg-accent-metallic rounded-full"
                />
              ))}
            </div>
            <span className="text-sm text-text-secondary ml-2">AI is thinking...</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

const MoodSelector = ({ 
  selectedMood, 
  onMoodChange 
}: { 
  selectedMood: string
  onMoodChange: (mood: string) => void 
}) => {
  const [isOpen, setIsOpen] = useState(false)
  
  return (
    <div className="relative">
      <Button
        onClick={() => setIsOpen(!isOpen)}
        variant="outline"
        size="sm"
        className="backdrop-blur-xl bg-surface-1/80 border-glass-overlay hover:bg-surface-2/80 transition-all duration-200"
      >
        {moods.find(m => m.id === selectedMood)?.icon}
        <span className="ml-2">{moods.find(m => m.id === selectedMood)?.name}</span>
      </Button>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 10 }}
            className="absolute bottom-full left-0 mb-2 p-4 bg-surface-1/90 backdrop-blur-xl border border-glass-overlay rounded-lg shadow-xl"
          >
            <div className="grid grid-cols-2 gap-2">
              {moods.map((mood) => (
                <motion.button
                  key={mood.id}
                  onClick={() => {
                    onMoodChange(mood.id)
                    setIsOpen(false)
                  }}
                  className={`p-3 rounded-lg border transition-all duration-200 ${
                    selectedMood === mood.id
                      ? 'bg-primary/20 border-primary'
                      : 'border-glass-overlay hover:bg-surface-2/50'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div className="flex items-center gap-2">
                    <div style={{ color: mood.color }}>
                      {mood.icon}
                    </div>
                    <span className="text-sm font-medium">{mood.name}</span>
                  </div>
                  {selectedMood === mood.id && (
                    <div className="flex gap-1 mt-2 justify-center">
                      {Array.from({ length: mood.particles }).map((_, i) => (
                        <motion.div
                          key={i}
                          animate={{
                            y: [-2, -6, -2],
                            opacity: [0.3, 1, 0.3]
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            delay: i * 0.1,
                            ease: "easeInOut"
                          }}
                          className="w-1 h-1 rounded-full"
                          style={{ backgroundColor: mood.color }}
                        />
                      ))}
                    </div>
                  )}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

const VoiceInputButton = ({ 
  isRecording, 
  onToggleRecording 
}: { 
  isRecording: boolean
  onToggleRecording: () => void 
}) => {
  return (
    <motion.button
      onClick={onToggleRecording}
      className={`p-3 rounded-full border-2 transition-all duration-200 ${
        isRecording 
          ? 'bg-destructive border-destructive text-white' 
          : 'bg-surface-1/80 border-glass-overlay hover:bg-surface-2/80 backdrop-blur-xl'
      }`}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      animate={isRecording ? {
        boxShadow: [
          '0 0 0 0px rgba(239, 68, 68, 0.4)',
          '0 0 0 10px rgba(239, 68, 68, 0)',
          '0 0 0 0px rgba(239, 68, 68, 0)'
        ]
      } : {}}
      transition={isRecording ? {
        boxShadow: {
          duration: 1.5,
          repeat: Infinity,
          ease: "easeOut"
        }
      } : {}}
    >
      {isRecording ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
    </motion.button>
  )
}

const MessageBubble = ({ 
  message, 
  isTyping = false 
}: { 
  message: Message
  isTyping?: boolean 
}) => {
  const [displayedContent, setDisplayedContent] = useState('')
  
  useEffect(() => {
    if (message.type === 'ai' && isTyping) {
      let i = 0
      const timer = setInterval(() => {
        if (i <= message.content.length) {
          setDisplayedContent(message.content.slice(0, i))
          i++
        } else {
          clearInterval(timer)
        }
      }, 30)
      return () => clearInterval(timer)
    } else {
      setDisplayedContent(message.content)
    }
  }, [message.content, message.type, isTyping])
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'} mb-4`}
    >
      <div 
        className={`max-w-md px-4 py-3 rounded-2xl backdrop-blur-xl border ${
          message.type === 'user' 
            ? 'bg-primary/20 border-primary/30 text-white' 
            : 'bg-surface-1/80 border-glass-overlay'
        }`}
      >
        <p className="text-sm leading-relaxed whitespace-pre-wrap">
          {displayedContent}
          {message.type === 'ai' && isTyping && (
            <motion.span
              animate={{ opacity: [0, 1, 0] }}
              transition={{ duration: 1, repeat: Infinity }}
              className="inline-block ml-1 w-2 h-4 bg-accent-metallic rounded-sm"
            />
          )}
        </p>
        <p className="text-xs text-text-secondary mt-2 opacity-70">
          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </p>
      </div>
    </motion.div>
  )
}

export default function AIChatInterface() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'ai',
      content: 'Hello! I\'m your AI assistant. How can I help you today? Feel free to adjust my mood using the selector below to match your preferred interaction style.',
      timestamp: new Date()
    }
  ])
  const [inputValue, setInputValue] = useState('')
  const [isRecording, setIsRecording] = useState(false)
  const [selectedMood, setSelectedMood] = useState('focused')
  const [isTyping, setIsTyping] = useState(false)
  const [typingMessageId, setTypingMessageId] = useState<string | null>(null)
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  
  const scrollToBottom = () => {
    if (scrollAreaRef.current) {
      const scrollElement = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]')
      if (scrollElement) {
        scrollElement.scrollTop = scrollElement.scrollHeight
      }
    }
  }
  
  useEffect(() => {
    scrollToBottom()
  }, [messages, isTyping])
  
  const handleSendMessage = async () => {
    if (!inputValue.trim()) return
    
    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue,
      timestamp: new Date()
    }
    
    setMessages(prev => [...prev, userMessage])
    setInputValue('')
    setIsTyping(true)
    
    // Simulate AI response with typing effect
    setTimeout(() => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: `I understand you're in a ${selectedMood} mood. Here's my response tailored to that mindset: ${generateAIResponse(inputValue, selectedMood)}`,
        timestamp: new Date()
      }
      
      setTypingMessageId(aiMessage.id)
      setMessages(prev => [...prev, aiMessage])
      setIsTyping(false)
      
      // Clear typing indicator after message is fully typed
      setTimeout(() => {
        setTypingMessageId(null)
      }, aiMessage.content.length * 30 + 500)
    }, 2000)
  }
  
  const generateAIResponse = (input: string, mood: string): string => {
    const responses = {
      happy: "That's wonderful! I love your positive energy. Let me help you with that in the most delightful way possible!",
      focused: "I appreciate your direct approach. Let me provide you with a clear, structured response to help you achieve your goals efficiently.",
      creative: "What an interesting perspective! Let me explore some innovative and imaginative solutions that might surprise you.",
      calm: "I sense you prefer a peaceful approach. Let me share some gentle insights that will help you move forward serenely."
    }
    
    return responses[mood as keyof typeof responses] || responses.focused
  }
  
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }
  
  const toggleRecording = () => {
    setIsRecording(!isRecording)
    // In a real app, this would start/stop voice recording
  }
  
  return (
    <div className="h-screen w-full bg-background relative overflow-hidden">
      <NeuralNetworkBackground />
      
      {/* Main Chat Container */}
      <div className="relative z-10 h-full flex flex-col">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between p-6 bg-surface-1/40 backdrop-blur-xl border-b border-glass-overlay"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent-metallic rounded-full flex items-center justify-center">
              <Brain className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-text-primary">AI Assistant</h1>
              <p className="text-sm text-text-secondary">Always here to help</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              className="hover:bg-surface-2/50 backdrop-blur-xl"
            >
              <Volume2 className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="hover:bg-surface-2/50 backdrop-blur-xl"
            >
              <Settings className="w-4 h-4" />
            </Button>
          </div>
        </motion.div>
        
        {/* Chat Messages */}
        <ScrollArea ref={scrollAreaRef} className="flex-1 p-6">
          <div className="max-w-4xl mx-auto">
            {messages.map((message) => (
              <MessageBubble 
                key={message.id} 
                message={message}
                isTyping={typingMessageId === message.id}
              />
            ))}
            <TypingIndicator isVisible={isTyping} />
          </div>
        </ScrollArea>
        
        {/* Input Area */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-6 bg-surface-1/40 backdrop-blur-xl border-t border-glass-overlay"
        >
          <div className="max-w-4xl mx-auto">
            {/* Mood Selector */}
            <div className="mb-4">
              <MoodSelector 
                selectedMood={selectedMood}
                onMoodChange={setSelectedMood}
              />
            </div>
            
            {/* Input Field */}
            <div className="flex items-end gap-3">
              <div className="flex-1 relative">
                <Input
                  ref={inputRef}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your message..."
                  className="min-h-[50px] bg-surface-1/80 backdrop-blur-xl border-glass-overlay focus:border-primary/50 focus:ring-primary/20 resize-none pr-12"
                  style={{ paddingRight: '3rem' }}
                />
              </div>
              
              <VoiceInputButton 
                isRecording={isRecording}
                onToggleRecording={toggleRecording}
              />
              
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim() || isTyping}
                  className="h-12 w-12 rounded-full bg-primary hover:bg-primary/90 disabled:opacity-50 disabled:hover:bg-primary shadow-lg"
                >
                  <Send className="w-5 h-5" />
                </Button>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
      
      {/* Floating Action Buttons */}
      <div className="fixed right-6 top-1/2 transform -translate-y-1/2 flex flex-col gap-3 z-20">
        {[
          { icon: <Sparkles className="w-5 h-5" />, label: "Creative Mode" },
          { icon: <Brain className="w-5 h-5" />, label: "Analysis Mode" },
          { icon: <Palette className="w-5 h-5" />, label: "Visual Mode" }
        ].map((action, index) => (
          <motion.button
            key={index}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.1, rotate: 5 }}
            whileTap={{ scale: 0.9 }}
            className="w-12 h-12 bg-surface-1/80 backdrop-blur-xl border border-glass-overlay rounded-full flex items-center justify-center hover:bg-surface-2/80 transition-all duration-200 shadow-lg"
            title={action.label}
          >
            {action.icon}
          </motion.button>
        ))}
      </div>
    </div>
  )
}