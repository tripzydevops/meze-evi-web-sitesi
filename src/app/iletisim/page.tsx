"use client"

import { useState, useEffect } from "react"
import Navigation from "@/components/Navigation"
import Footer from "@/components/Footer"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Instagram, MessageCircle, Loader2, Mail, MapPin, Phone, Clock } from "lucide-react"

// LucideIcons map for dynamic icon rendering
const LucideIconMap: Record<string, React.ComponentType<any>> = {
  Instagram, MessageCircle, Loader2, Mail, MapPin, Phone, Clock
}

interface ContactInfo {
  id: number
  type: string
  title: string
  content: string
  subContent: string | null
  icon: string
  displayOrder: number
  hidden: boolean
}

export default function ContactPage() {
  const [contactInfos, setContactInfos] = useState<ContactInfo[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchContactInfo()
  }, [])

  const fetchContactInfo = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/contact-info")
      if (response.ok) {
        const data = await response.json()
        setContactInfos(data)
      }
    } catch (error) {
      console.error("Error fetching contact info:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleInstagramMessage = () => {
    window.open('https://ig.me/m/bispecialmeze', '_blank', 'noopener,noreferrer')
  }

  return (
    <div className="min-h-screen">
      <Navigation />
      
      {/* Hero */}
      <section className="relative h-[300px] flex items-center justify-center overflow-hidden bg-primary/10">
        <div className="relative z-10 text-center px-4">
          <h1 className="font-serif text-5xl md:text-6xl font-bold mb-4">
            İletişim
          </h1>
          <p className="text-muted-foreground text-lg md:text-xl">
            Bize ulaşın, sizinle tanışmak isteriz
          </p>
        </div>
      </section>

      {/* Instagram Message CTA */}
      <section className="py-12 bg-gradient-to-br from-primary/10 to-primary/5">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="p-8 text-center max-w-2xl mx-auto border-primary/20 shadow-lg">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-primary/10 rounded-full mb-6">
              <MessageCircle className="w-10 h-10 text-primary" />
            </div>
            <h2 className="font-serif text-3xl md:text-4xl font-bold mb-4">
              Hızlı İletişim İçin
            </h2>
            <p className="text-muted-foreground text-lg mb-6">
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
            <p className="text-sm text-muted-foreground mt-4">
              @bispecialmeze
            </p>
          </Card>
        </div>
      </section>

      {/* Contact Info */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {isLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {contactInfos.map((info) => {
                const IconComponent = LucideIconMap[info.icon] || Mail
                return (
                  <Card key={info.id} className="p-6 text-center hover:shadow-lg transition-shadow">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
                      <IconComponent className="w-8 h-8 text-primary" />
                    </div>
                    <h3 className="font-semibold text-lg mb-2">{info.title}</h3>
                    <p className="text-foreground font-medium mb-1">{info.content}</p>
                    {info.subContent && (
                      <p className="text-muted-foreground text-sm">{info.subContent}</p>
                    )}
                  </Card>
                )
              })}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  )
}