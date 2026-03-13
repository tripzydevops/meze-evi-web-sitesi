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

  const isPlaceholder = "ca-pub-XXXXXXXXXXXXXXXX" === "ca-pub-XXXXXXXXXXXXXXXX"

  if (isPlaceholder) return null

  return (
    <div className={`w-full overflow-hidden my-8 ${className}`}>
      <span className="text-[10px] uppercase tracking-widest text-muted-foreground block mb-2 text-center">
        Sponsorlu İçerik
      </span>
      <ins
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client="ca-pub-XXXXXXXXXXXXXXXX"
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive={responsive}
      />
    </div>
  )
}
