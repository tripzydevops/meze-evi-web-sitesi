"use client"

import { Star } from "lucide-react"
import AnimatedSection from "./AnimatedSection"
import { Card } from "./ui/card"

interface Testimonial {
  id: number
  name: string
  content: string
  rating: number
  imageUrl: string | null
}

interface TestimonialsProps {
  testimonials: Testimonial[]
}

export default function Testimonials({ testimonials }: TestimonialsProps) {
  if (!testimonials || testimonials.length === 0) return null

  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection className="text-center mb-12">
          <h2 className="font-serif text-4xl md:text-5xl font-bold mb-4">Müşteri Yorumları</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Misafirlerimizin Bispecial Meze deneyimleri hakkında söyledikleri.
          </p>
        </AnimatedSection>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, idx) => (
            <AnimatedSection key={testimonial.id} delay={idx * 0.1}>
              <Card className="p-8 h-full flex flex-col hover:shadow-xl transition-shadow duration-300 border-primary/5">
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      className={`w-5 h-5 ${i < testimonial.rating ? "text-primary fill-primary" : "text-gray-300"}`} 
                    />
                  ))}
                </div>
                <p className="text-muted-foreground italic mb-6 flex-1">
                  "{testimonial.content}"
                </p>
                <div className="flex items-center gap-4">
                  {testimonial.imageUrl ? (
                    <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-primary/20">
                      <img 
                        src={testimonial.imageUrl} 
                        alt={testimonial.name} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center border-2 border-primary/20">
                      <span className="text-primary font-bold">{testimonial.name.charAt(0)}</span>
                    </div>
                  )}
                  <div className="font-serif font-bold text-lg">{testimonial.name}</div>
                </div>
              </Card>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  )
}
