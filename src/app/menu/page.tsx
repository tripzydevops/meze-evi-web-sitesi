"use client"

import { useEffect, useState, useMemo, Suspense } from "react"
import Image from "next/image"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import Navigation from "@/components/Navigation"
import Footer from "@/components/Footer"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Loader2, Utensils, Search, X } from "lucide-react"
import { shouldShowPrice } from "@/lib/utils"
import AnimatedSection from "@/components/AnimatedSection"
import JsonLd from "@/components/JsonLd"
import AdBanner from "@/components/AdBanner"

interface Category {
  id: number
  name: string
  displayOrder: number
  hidden: boolean
  items: MenuItem[]
}

interface MenuItem {
  id: number
  categoryId: number
  name: string
  description: string | null
  price: string
  imageUrl: string | null
  popular: boolean
}

function MenuContent() {
  const searchParams = useSearchParams()
  const searchFromUrl = searchParams.get("search") || ""
  
  const [menuCategories, setMenuCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState(searchFromUrl)

  useEffect(() => {
    setSearchQuery(searchFromUrl)
  }, [searchFromUrl])

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    setIsLoading(true)
    try {
      const itemsRes = await fetch("/api/menu-items/by-category")
      if (itemsRes.ok) {
        const itemsData = await itemsRes.json()
        setMenuCategories(itemsData)
      }
    } catch (error) {
      console.error("Error fetching menu:", error)
      setError("Menü yüklenirken bir hata oluştu. Lütfen daha sonra tekrar deneyin.")
    } finally {
      setIsLoading(false)
    }
  }

  const filteredCategories = useMemo(() => {
    if (!searchQuery.trim()) {
      return menuCategories.filter(cat => !cat.hidden)
    }

    const query = searchQuery.toLocaleLowerCase('tr')
    return menuCategories
      .filter(cat => !cat.hidden)
      .map(cat => ({
        ...cat,
        items: cat.items.filter(item => 
          item.name.toLocaleLowerCase('tr').includes(query) || 
          (item.description?.toLocaleLowerCase('tr').includes(query))
        )
      }))
      .filter(cat => cat.items.length > 0)
  }, [menuCategories, searchQuery])

  const scrollToCategory = (categoryId: string) => {
    const element = document.getElementById(categoryId)
    if (element) {
      const offset = 160 // Nav (80px) + Category bar (~80px)
      const bodyRect = document.body.getBoundingClientRect().top
      const elementRect = element.getBoundingClientRect().top
      const elementPosition = elementRect - bodyRect
      const offsetPosition = elementPosition - offset

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      })
    }
  }

  return (
    <div className="min-h-screen">
      <JsonLd type="Restaurant" />
      <JsonLd type="ItemList" data={menuCategories.flatMap(cat => cat.items)} />
      <Navigation />
      
      {/* Hero */}
      <section className="relative h-[300px] flex items-center justify-center overflow-hidden bg-primary/10">
        <div className="relative z-10 text-center px-4">
          <AnimatedSection>
            <h1 className="font-serif text-5xl md:text-6xl font-bold mb-4 text-primary">
              Menümüz
            </h1>
            <p className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto">
              Özenle hazırlanmış geleneksel Türk mezeleri ve Bispecial özel lezzetleri
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* Ad Placement: Menu Top */}
      <AdBanner slot="menu-top" className="container mx-auto px-4" />

      {/* Sticky Category Nav & Search */}
      <div className="sticky top-[80px] z-30 bg-background/80 backdrop-blur-md border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex overflow-x-auto pb-2 md:pb-0 gap-2 no-scrollbar w-full md:w-auto">
              {menuCategories.filter(cat => !cat.hidden && cat.items.length > 0).map(cat => (
                <button
                  key={cat.id}
                  onClick={() => scrollToCategory(cat.name)}
                  className="px-4 py-1.5 rounded-full border border-primary/20 hover:border-primary hover:bg-primary/5 text-sm font-medium transition-all whitespace-nowrap"
                >
                  {cat.name}
                </button>
              ))}
            </div>
            <div className="relative w-full md:w-64 group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <Input
                placeholder="Lezzet ara..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-9 border-primary/20 focus-visible:ring-primary"
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                >
                  <X className="h-4 w-4 text-muted-foreground hover:text-primary" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Menu Content */}
      <section className="py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {isLoading && (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
            </div>
          )}

          {error && (
            <div className="text-center py-20">
              <p className="text-destructive text-lg mb-4">{error}</p>
              <button 
                onClick={fetchData}
                className="px-6 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
              >
                Tekrar deneyin
              </button>
            </div>
          )}

          {!isLoading && !error && filteredCategories.length === 0 && searchQuery && (
            <div className="text-center py-20">
              <Utensils className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" />
              <p className="text-muted-foreground text-lg">
                "{searchQuery}" aramasıyla eşleşen lezzet bulunamadı.
              </p>
            </div>
          )}

          {!isLoading && !error && filteredCategories.map((category, idx) => (
            <div key={category.id} id={category.name} className="mb-20 scroll-mt-40">
              <AnimatedSection>
                <div className="flex items-center gap-4 mb-8">
                  <h2 className="font-serif text-3xl md:text-4xl font-bold whitespace-nowrap">
                    {category.name}
                  </h2>
                  <div className="h-[2px] w-full bg-gradient-to-r from-primary/20 to-transparent" />
                </div>
              </AnimatedSection>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {category.items.map((item, itemIdx) => (
                  <AnimatedSection key={item.id} delay={itemIdx * 0.05}>
                    <Link href={`/menu/${item.id}`}>
                      <Card className="overflow-hidden group hover:shadow-2xl transition-all duration-300 border-primary/10 h-full flex flex-col">
                        <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                          {item.imageUrl ? (
                            <Image
                              src={item.imageUrl}
                              alt={item.name}
                              fill
                              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                              className="object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center">
                              <Utensils className="h-16 w-16 text-primary/30" />
                            </div>
                          )}
                          {item.popular && (
                            <Badge className="absolute top-4 right-4 bg-primary shadow-lg px-3 py-1">
                              Popüler
                            </Badge>
                          )}
                        </div>
                        <div className="p-6 flex-1 flex flex-col">
                          <div className="flex justify-between items-start mb-3">
                            <h3 className="font-serif text-2xl font-bold group-hover:text-primary transition-colors">
                              {item.name}
                            </h3>
                            {shouldShowPrice(item.price) && (
                              <span className="text-primary font-bold text-xl ml-2">{item.price}</span>
                            )}
                          </div>
                          {item.description && (
                            <p className="text-muted-foreground text-sm line-clamp-2 leading-relaxed">
                              {item.description}
                            </p>
                          )}
                        </div>
                      </Card>
                    </Link>
                  </AnimatedSection>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  )
}

export default function MenuPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex justify-center items-center bg-background">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    }>
      <MenuContent />
    </Suspense>
  )
}