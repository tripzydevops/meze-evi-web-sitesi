"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Instagram, MessageCircle, Mail, MapPin, Phone, Clock } from "lucide-react"

// LucideIcons map for dynamic icon rendering
const LucideIconMap: Record<string, React.ComponentType<any>> = {
  Instagram, MessageCircle, Mail, MapPin, Phone, Clock
}
import { Button } from "@/components/ui/button"

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

export default function Footer() {
  const [contactInfos, setContactInfos] = useState<ContactInfo[]>([])

  useEffect(() => {
    fetchContactInfo()
  }, [])

  const fetchContactInfo = async () => {
    try {
      const response = await fetch("/api/contact-info")
      if (response.ok) {
        const data = await response.json()
        setContactInfos(data)
      }
    } catch (error) {
      console.error("Error fetching contact info:", error)
    }
  }

  const handleInstagramMessage = () => {
    window.open('https://ig.me/m/bispecialmeze', '_blank', 'noopener,noreferrer')
  }

  return (
    <footer className="bg-muted/50 border-t border-border mt-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About */}
          <div>
            <h3 className="font-serif text-xl font-bold mb-4 text-primary">
              Bispecial Meze
            </h3>
            <p className="text-muted-foreground text-sm">
              Geleneksel Türk mezelerinin modern sunumu ile benzersiz lezzetler.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">Hızlı Linkler</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/menu" className="text-muted-foreground hover:text-primary transition-colors">
                  Menü
                </Link>
              </li>
              <li>
                <Link href="/catering" className="text-muted-foreground hover:text-primary transition-colors">
                  Catering
                </Link>
              </li>
              <li>
                <Link href="/hakkimizda" className="text-muted-foreground hover:text-primary transition-colors">
                  Hakkımızda
                </Link>
              </li>
              <li>
                <Link href="/iletisim" className="text-muted-foreground hover:text-primary transition-colors">
                  İletişim
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info - Dynamic */}
          <div>
            <h4 className="font-semibold mb-4">İletişim</h4>
            <ul className="space-y-3 text-sm">
              {contactInfos.map((info) => {
                const IconComponent = LucideIconMap[info.icon] || Mail
                return (
                  <li key={info.id} className="flex items-start space-x-2 text-muted-foreground">
                    <IconComponent className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <div>
                      <div>{info.content}</div>
                      {info.subContent && (
                        <div className="text-xs">{info.subContent}</div>
                      )}
                    </div>
                  </li>
                )
              })}
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="font-semibold mb-4">Sosyal Medya</h4>
            <div className="space-y-2">
              <a
                href="https://www.instagram.com/bispecialmeze/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-2 text-primary hover:text-primary/80 transition-colors"
              >
                <Instagram className="w-5 h-5" />
                <span className="text-sm font-medium">@bispecialmeze</span>
              </a>
              <Button 
                size="sm" 
                variant="outline" 
                className="w-full border-primary text-primary hover:bg-primary hover:text-white mt-2"
                onClick={handleInstagramMessage}
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                Mesaj Gönder
              </Button>
            </div>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Bispecial Meze. Tüm hakları saklıdır.</p>
        </div>
      </div>
    </footer>
  )
}