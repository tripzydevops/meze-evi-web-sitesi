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

  const isPlaceholder = "ca-pub-XXXXXXXXXXXXXXXX" === "ca-pub-XXXXXXXXXXXXXXXX" // This would be dynamic in a real env

  // We only show the banner if a real client ID is provided
  // For now, we'll keep the structural div but remove the 'Reklam Alanı' box to hide the 'blank space'
  return (
    <div className={`w-full overflow-hidden ${className}`}>
      {/* Google AdSense Unit */}
      <ins
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client="ca-pub-XXXXXXXXXXXXXXXX"
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive={responsive}
      />
      
      {/* Only show label if it's not a placeholder (ads are actually loading) */}
      {!isPlaceholder && (
        <span className="text-[10px] uppercase tracking-widest text-muted-foreground block mb-2 text-center">
          Sponsorlu İçerik
        </span>
      )}
    </div>
  )
}
