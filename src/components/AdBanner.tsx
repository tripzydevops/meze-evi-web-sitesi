"use client"

import { useEffect } from "react"

interface AdBannerProps {
  className?: string
  slot?: string
  format?: 'auto' | 'fluid' | 'rectangle'
  responsive?: 'true' | 'false'
}

export default function AdBanner({ 
  className = "", 
  slot = "1234567890", // Placeholder slot
  format = "auto",
  responsive = "true" 
}: AdBannerProps) {
  useEffect(() => {
    try {
      // @ts-ignore
      ;(window.adsbygoogle = window.adsbygoogle || []).push({})
    } catch (err) {
      console.error("AdSense error:", err)
    }
  }, [])

  return (
    <div className={`w-full overflow-hidden my-8 py-4 bg-muted/20 rounded-lg text-center ${className}`}>
      <span className="text-[10px] uppercase tracking-widest text-muted-foreground block mb-2">Sponsorlu İçerik</span>
      {/* Google AdSense Unit */}
      <ins
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client="ca-pub-XXXXXXXXXXXXXXXX"
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive={responsive}
      />
      <div className="h-24 flex items-center justify-center border-2 border-dashed border-muted bg-muted/10">
        <p className="text-sm text-muted-foreground italic">Reklam Alanı</p>
      </div>
    </div>
  )
}
