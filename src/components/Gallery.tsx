"use client"

import Image from "next/image"
import { motion } from "framer-motion"
import AnimatedSection from "./AnimatedSection"

interface GalleryImage {
  id: number
  url: string
  alt: string | null
}

interface GalleryProps {
  images: GalleryImage[]
}

export default function Gallery({ images }: GalleryProps) {
  if (!images || images.length === 0) return null

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection className="text-center mb-12">
          <h2 className="font-serif text-4xl md:text-5xl font-bold mb-4">Mutfak Atölyemizden Kareler</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Hergün taze hazırlanan mezelerimizin ve restoranımızın atmosferinden kesitler.
          </p>
        </AnimatedSection>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((image, idx) => (
            <AnimatedSection key={image.id} delay={idx * 0.05}>
              <motion.div 
                className="relative aspect-square rounded-xl overflow-hidden cursor-pointer group"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
                <Image
                  src={image.url}
                  alt={image.alt || "Gallery Image"}
                  fill
                  sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </motion.div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  )
}
