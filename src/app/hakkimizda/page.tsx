"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Navigation from "@/components/Navigation"
import Footer from "@/components/Footer"
import { Card } from "@/components/ui/card"
import { Heart, Users, Award, Leaf, ChefHat, Loader2 } from "lucide-react"

interface AboutSection {
  id: number
  title: string
  description: string
  imageUrl: string | null
  buttonText: string | null
  buttonLink: string | null
  imagePosition: string | null
}

export default function AboutPage() {
  const [aboutSection, setAboutSection] = useState<AboutSection | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/homepage-about-section")
        if (response.ok) {
          const data = await response.json()
          setAboutSection(data[0] || null)
        }
      } catch (error) {
        console.error("Error fetching about section:", error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [])

  const values = [
    {
      icon: Heart,
      title: "Tutku",
      description: "Her yemeğimizi sevgi ve özenle hazırlıyoruz. Türk mutfağına olan tutkumuz her lokmada hissediliyor."
    },
    {
      icon: Users,
      title: "Aile",
      description: "Misafirlerimiz bizim ailemizin bir parçası. Sıcak ve samimi ortamımızla kendinizi evinizde hissedeceksiniz."
    },
    {
      icon: Award,
      title: "Kalite",
      description: "En kaliteli ve taze malzemeleri kullanarak geleneksel tariflere sadık kalıyoruz."
    },
    {
      icon: Leaf,
      title: "Doğallık",
      description: "Organik ve yerel ürünler kullanarak sürdürülebilir bir mutfak anlayışını benimsiyoruz."
    }
  ]

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <Navigation />
      
      {/* Hero */}
      <section className="relative h-[400px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src={aboutSection?.imageUrl || "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/57301c9a-a814-4a2b-ba96-680af3e8128d/generated_images/cozy-turkish-restaurant-interior%2c-warm-a6bd77e8-20251014104025.jpg"}
            alt="Bispecial Meze"
            fill
            className="object-cover brightness-50"
            style={{ objectPosition: aboutSection?.imagePosition || 'center' }}
            priority
          />
        </div>
        <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
          <h1 className="font-serif text-5xl md:text-6xl font-bold mb-4">
            Hakkımızda
          </h1>
          <p className="text-xl text-gray-200">
            Geleneksel lezzetlerin modern yorumu
          </p>
        </div>
      </section>

      {/* Story */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <h2 className="font-serif text-4xl font-bold mb-8 text-center">
              {aboutSection?.title || "Hikayemiz"}
            </h2>
            <div className="space-y-6 text-muted-foreground text-lg leading-relaxed whitespace-pre-line">
              {aboutSection?.description || (
                <>
                  <p>
                    Bispecial Meze, Türk mutfak kültürünün en değerli hazinelerinden biri olan meze 
                    geleneğini yaşatmak ve modern bir anlayışla sunmak amacıyla 2020 yılında kuruldu. 
                    Kurucularımızın Anadolu'nun farklı bölgelerinden getirdiği özgün tarifler, 
                    restoranımızın temelini oluşturuyor.
                  </p>
                  <p>
                    Her bir mezemiz, nesiller boyu aktarılan geleneksel yöntemlerle hazırlanıyor. 
                    Ancak biz sadece geçmişin tariflerini takip etmekle kalmıyor, aynı zamanda 
                    modern sunum teknikleri ve yaratıcı yaklaşımlarla bu lezzetleri yeniden yorumluyoruz.
                  </p>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-serif text-4xl font-bold mb-12 text-center">
            Değerlerimiz
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => {
              const Icon = value.icon
              return (
                <Card key={index} className="p-6 text-center hover:shadow-lg transition-shadow">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
                    <Icon className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="font-serif text-xl font-bold mb-3">{value.title}</h3>
                  <p className="text-muted-foreground">{value.description}</p>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-primary text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-serif text-4xl font-bold mb-4">
            Bizi Ziyaret Edin
          </h2>
          <p className="text-xl mb-8 text-white/90">
            Geleneksel Türk mezelerinin benzersiz tatlarını keşfetmeye hazır mısınız?
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/menu"
              className="inline-flex items-center justify-center px-8 py-3 bg-white text-primary rounded-md font-semibold hover:bg-white/90 transition-colors"
            >
              Menüyü İncele
            </a>
            <a
              href="/iletisim"
              className="inline-flex items-center justify-center px-8 py-3 bg-transparent border-2 border-white text-white rounded-md font-semibold hover:bg-white/10 transition-colors"
            >
              İletişime Geç
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
