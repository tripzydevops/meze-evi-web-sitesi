"use client"

import { Instagram, MessageCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import AnimatedSection from "@/components/AnimatedSection"

export default function InstagramCTA() {
  const handleInstagramMessage = () => {
    window.open('https://ig.me/m/bispecialmeze', '_blank', 'noopener,noreferrer')
  }

  return (
    <section className="py-16 bg-gradient-to-br from-primary/10 to-primary/5">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <AnimatedSection>
          <MessageCircle className="w-16 h-16 text-primary mx-auto mb-6" />
          <h2 className="font-serif text-3xl md:text-4xl font-bold mb-4">
            Sorularınız mı var?
          </h2>
          <p className="text-muted-foreground text-lg mb-8 max-w-2xl mx-auto">
            Instagram üzerinden bize mesaj gönderin, anında yanıt verelim!
          </p>
          <Button 
            size="lg" 
            className="bg-primary hover:bg-primary/90 text-lg px-8"
            onClick={handleInstagramMessage}
          >
            <Instagram className="w-5 h-5 mr-2" />
            Instagram'dan Mesaj Gönder
          </Button>
        </AnimatedSection>
      </div>
    </section>
  )
}
