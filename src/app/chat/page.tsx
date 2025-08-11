import { Suspense } from 'react'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { ArrowLeft, Settings, Video } from "lucide-react"
import { EnhancedChatInterface } from "@/components/ui/enhanced-chat-interface"
import NeuralParticleBackground from "@/components/ui/neural-particle-background"

export default function ChatPage() {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Neural Network Background */}
      <Suspense fallback={null}>
        <NeuralParticleBackground />
      </Suspense>

      {/* Enhanced Chat Interface */}
      <div className="relative z-10">
        <EnhancedChatInterface />
      </div>

      {/* Floating Navigation */}
      <div className="fixed top-4 left-4 z-50">
        <Link href="/">
          <Button 
            variant="ghost" 
            size="icon" 
            className="bg-surface-1/80 backdrop-blur-md border border-glass-overlay hover:bg-surface-2/80 text-text-primary transition-all duration-300 hover:scale-110"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
      </div>

      <div className="fixed top-4 right-4 z-50 flex gap-2">
        <Link href="/live">
          <Button 
            className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white px-4 py-2 rounded-full border border-pink-400/30 hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-pink-500/25 backdrop-blur-md"
          >
            <Video className="h-4 w-4 mr-2" />
            Live Mood
          </Button>
        </Link>
        <Button 
          variant="ghost" 
          size="icon"
          className="bg-surface-1/80 backdrop-blur-md border border-glass-overlay hover:bg-surface-2/80 text-text-primary transition-all duration-300 hover:scale-110"
        >
          <Settings className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}