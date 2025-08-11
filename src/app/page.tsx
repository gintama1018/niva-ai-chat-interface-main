import { Suspense } from "react"
import GlassmorphicNavbar from "@/components/ui/glassmorphic-navbar"
import Hero3DAvatar from "@/components/ui/hero-3d-avatar"
import GlassFeatureCards from "@/components/ui/glass-feature-cards"
import MetallicPricingCards from "@/components/ui/metallic-pricing-cards"
import AboutSection from "@/components/ui/about-section"
import ContactSection from "@/components/ui/contact-section"
import Footer from "@/components/ui/footer"
import NeuralParticleBackground from "@/components/ui/neural-particle-background"

export default function Page() {
  return (
    <main className="relative min-h-screen bg-background text-text-primary overflow-x-hidden">
      {/* Neural Network Background */}
      <Suspense fallback={null}>
        <NeuralParticleBackground />
      </Suspense>

      {/* Navigation */}
      <GlassmorphicNavbar />

      {/* Hero Section */}
      <section id="home" className="relative z-10">
        <Hero3DAvatar />
      </section>

      {/* Features Section */}
      <section id="features" className="relative z-10 py-32 px-4">
        <div className="container max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold font-display mb-6">
              Powerful AI Features
            </h2>
            <p className="text-text-secondary text-lg max-w-2xl mx-auto">
              Experience the next generation of AI assistance with advanced capabilities designed to enhance your productivity and creativity.
            </p>
          </div>
          <GlassFeatureCards />
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="relative z-10">
        <MetallicPricingCards />
      </section>

      {/* About Section */}
      <AboutSection />

      {/* Contact Section */}
      <ContactSection />

      {/* Footer */}
      <Footer />
    </main>
  )
}