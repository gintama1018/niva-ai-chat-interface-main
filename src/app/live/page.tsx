import { Suspense } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Home, MessageCircle, Settings } from "lucide-react"
import { LiveConversationInterface } from "@/components/ui/enhanced-live-interface"
import NeuralParticleBackground from "@/components/ui/neural-particle-background"

export default function LivePage() {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Neural Network Background */}
      <Suspense fallback={null}>
        <NeuralParticleBackground />
      </Suspense>

      {/* Enhanced Live Interface */}
      <div className="relative z-10">
        <LiveConversationInterface />
      </div>

      {/* Floating Navigation */}
      <div className="fixed top-4 left-4 z-50 flex gap-2">
        <Link href="/">
          <Button 
            variant="ghost" 
            size="icon" 
            className="bg-surface-1/80 backdrop-blur-md border border-glass-overlay hover:bg-surface-2/80 text-text-primary transition-all duration-300 hover:scale-110"
          >
            <Home className="h-5 w-5" />
          </Button>
        </Link>
        <Link href="/chat">
          <Button 
            variant="ghost" 
            size="icon" 
            className="bg-surface-1/80 backdrop-blur-md border border-glass-overlay hover:bg-surface-2/80 text-text-primary transition-all duration-300 hover:scale-110"
          >
            <MessageCircle className="h-5 w-5" />
          </Button>
        </Link>
        <Button 
          variant="ghost" 
          size="icon"
          className="bg-surface-1/80 backdrop-blur-md border border-glass-overlay hover:bg-surface-2/80 text-text-primary transition-all duration-300 hover:scale-110"
        >
          <Settings className="h-5 w-5" />
        </Button>
      </div>
    </div>
  )
}