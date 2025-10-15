"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import Navigation from "@/components/Navigation"
import Footer from "@/components/Footer"
import { ChefHat, Clock, MapPin, Star, Loader2, Utensils, Heart, Award, Coffee, Users, Sparkles, Instagram, MessageCircle } from "lucide-react"
import * as LucideIcons from "lucide-react"

interface HeroData {
  id: number
  title: string
  subtitle: string | null
  primaryButtonText: string | null
  primaryButtonLink: string | null
  secondaryButtonText: string | null
  secondaryButtonLink: string | null
  backgroundImageUrl: string | null
}

interface Feature {
  id: number
  icon: string
  title: string
  description: string | null
  displayOrder: number
}

interface FeaturedSection {
  id: number
  sectionTitle: string
  sectionDescription: string | null
}

interface FeaturedDish {
  id: number
  menuItemId: number
  displayOrder: number
  menuItem: {
    id: number
    name: string
    description: string | null
    price: string
    imageUrl: string | null
    categoryId: number
    popular: boolean
  }
}

interface AboutSection {
  id: number
  title: string
  description: string
  imageUrl: string | null
  buttonText: string | null
  buttonLink: string | null
}

export default function Home() {
  const [isLoading, setIsLoading] = useState(true)
  const [heroData, setHeroData] = useState<HeroData | null>(null)
  const [features, setFeatures] = useState<Feature[]>([])
  const [featuredSection, setFeaturedSection] = useState<FeaturedSection | null>(null)
  const [featuredDishes, setFeaturedDishes] = useState<FeaturedDish[]>([])
  const [aboutSection, setAboutSection] = useState<AboutSection | null>(null)
  const [imageErrors, setImageErrors] = useState<Set<string>>(new Set())

  useEffect(() => {
    fetchAllData()
  }, [])

  const fetchAllData = async () => {
    setIsLoading(true)
    try {
      const [heroRes, featuresRes, featuredSectionRes, dishesRes, aboutRes] = await Promise.all([
        fetch("/api/homepage-hero"),
        fetch("/api/homepage-features"),
        fetch("/api/homepage-featured-section"),
        fetch("/api/homepage-featured-dishes"),
        fetch("/api/homepage-about-section")
      ])

      if (heroRes.ok) {
        const data = await heroRes.json()
        setHeroData(data[0] || null)
      }

      if (featuresRes.ok) {
        const data = await featuresRes.json()
        setFeatures(data)
      }

      if (featuredSectionRes.ok) {
        const data = await featuredSectionRes.json()
        setFeaturedSection(data[0] || null)
      }

      if (dishesRes.ok) {
        const data = await dishesRes.json()
        setFeaturedDishes(data)
      }

      if (aboutRes.ok) {
        const data = await aboutRes.json()
        setAboutSection(data[0] || null)
      }
    } catch (error) {
      console.error("Error fetching homepage data:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleInstagramMessage = () => {
    window.open('https://ig.me/m/bispecialmeze', '_blank', 'noopener,noreferrer')
  }

  const handleImageError = (imageUrl: string) => {
    setImageErrors(prev => new Set(prev).add(imageUrl))
  }

  const shouldShowPrice = (price: string | null) => {
    if (!price) return false
    const cleanPrice = price.trim().replace(/[₺\s]/g, '')
    return cleanPrice !== '' && cleanPrice !== '0'
  }

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
      
      {/* Hero Section */}
      {heroData && (
        <section className="relative h-[600px] flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 z-0 bg-gradient-to-br from-primary/20 to-primary/5">
            {heroData.backgroundImageUrl && !imageErrors.has(heroData.backgroundImageUrl) ? (
              <Image
                src={heroData.backgroundImageUrl}
                alt="Bispecial Meze Restaurant"
                fill
                className="object-cover brightness-50"
                priority
                onError={() => handleImageError(heroData.backgroundImageUrl!)}
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-primary to-primary/70" />
            )}
          </div>
          <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
            <h1 className="font-serif text-5xl md:text-7xl font-bold mb-6">
              {heroData.title}
            </h1>
            {heroData.subtitle && (
              <p className="text-xl md:text-2xl mb-8 text-gray-200">
                {heroData.subtitle}
              </p>
            )}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {heroData.primaryButtonText && heroData.primaryButtonLink && (
                <Button size="lg" className="bg-primary hover:bg-primary/90 text-lg px-8">
                  <Link href={heroData.primaryButtonLink}>{heroData.primaryButtonText}</Link>
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
          </div>
        </section>
      )}

      {/* Features */}
      {features.length > 0 && (
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {features.map((feature) => {
                const IconComponent = (LucideIcons as any)[feature.icon] || ChefHat
                return (
                  <div key={feature.id} className="text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
                      <IconComponent className="w-8 h-8 text-primary" />
                    </div>
                    <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                    {feature.description && (
                      <p className="text-muted-foreground text-sm">
                        {feature.description}
                      </p>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        </section>
      )}

      {/* Featured Dishes */}
      {featuredDishes.length > 0 && (
        <section className="py-12">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            {featuredSection && (
              <div className="text-center mb-8">
                <h2 className="font-serif text-3xl md:text-4xl font-bold mb-3">
                  {featuredSection.sectionTitle}
                </h2>
                {featuredSection.sectionDescription && (
                  <p className="text-muted-foreground text-base max-w-2xl mx-auto">
                    {featuredSection.sectionDescription}
                  </p>
                )}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {featuredDishes.map((dish) => (
                <Card key={dish.id} className="overflow-hidden group hover:shadow-xl transition-shadow duration-300">
                  {dish.menuItem.imageUrl && !imageErrors.has(dish.menuItem.imageUrl) ? (
                    <div className="relative h-40 overflow-hidden bg-muted">
                      <Image
                        src={dish.menuItem.imageUrl}
                        alt={dish.menuItem.name}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-300"
                        onError={() => handleImageError(dish.menuItem.imageUrl!)}
                      />
                    </div>
                  ) : (
                    <div className="relative h-40 overflow-hidden bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center">
                      <Utensils className="h-12 w-12 text-primary/30" />
                    </div>
                  )}
                  <div className="p-4">
                    <div className="flex justify-between items-start mb-1">
                      <h3 className="font-serif text-xl font-bold">{dish.menuItem.name}</h3>
                      {shouldShowPrice(dish.menuItem.price) && (
                        <span className="text-primary font-bold text-lg">{dish.menuItem.price}</span>
                      )}
                    </div>
                    {dish.menuItem.description && (
                      <p className="text-muted-foreground text-sm">{dish.menuItem.description}</p>
                    )}
                  </div>
                </Card>
              ))}
            </div>

            <div className="text-center mt-8">
              <Button size="lg" className="bg-primary hover:bg-primary/90">
                <Link href="/menu">Tüm Menüyü Görüntüle</Link>
              </Button>
            </div>
          </div>
        </section>
      )}

      {/* About Preview */}
      {aboutSection && (
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {aboutSection.imageUrl && !imageErrors.has(aboutSection.imageUrl) ? (
                <div className="relative h-[400px] rounded-lg overflow-hidden bg-muted">
                  <Image
                    src={aboutSection.imageUrl}
                    alt="Restaurant Interior"
                    fill
                    className="object-cover"
                    onError={() => handleImageError(aboutSection.imageUrl!)}
                  />
                </div>
              ) : (
                <div className="relative h-[400px] rounded-lg overflow-hidden bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center">
                  <ChefHat className="h-24 w-24 text-primary/30" />
                </div>
              )}
              <div>
                <h2 className="font-serif text-4xl md:text-5xl font-bold mb-6">
                  {aboutSection.title}
                </h2>
                <div className="text-muted-foreground text-lg mb-8 leading-relaxed whitespace-pre-line">
                  {aboutSection.description}
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Instagram CTA Section */}
      <section className="py-16 bg-gradient-to-br from-primary/10 to-primary/5">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
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
        </div>
      </section>

      <Footer />
    </div>
  )
}