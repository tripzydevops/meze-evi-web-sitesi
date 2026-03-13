"use client"

import { Button } from "@/components/ui/button"
import { Instagram } from "lucide-react"
import Link from "next/link"

interface HeroButtonsProps {
  primaryText?: string | null
  primaryLink?: string | null
}

export default function HeroButtons({ primaryText, primaryLink }: HeroButtonsProps) {
  const handleInstagramMessage = () => {
    window.open('https://ig.me/m/bispecialmeze', '_blank', 'noopener,noreferrer')
  }

  return (
    <div className="flex flex-col sm:flex-row gap-4 justify-center">
      {primaryText && primaryLink && (
        <Button size="lg" className="bg-primary hover:bg-primary/90 text-lg px-8" asChild>
          <Link href={primaryLink}>{primaryText}</Link>
        </Button>
      )}
      <Button 
        size="lg" 
        className="bg-white/10 backdrop-blur border-white/30 text-white hover:bg-white/20 text-lg px-8"
        onClick={handleInstagramMessage}
      >
        <Instagram className="w-5 h-5 mr-2" />
        Bize Mesaj Gönderin
      </Button>
    </div>
  )
}
