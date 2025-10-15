"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Navigation from "@/components/Navigation"
import Footer from "@/components/Footer"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Loader2 } from "lucide-react"

interface Category {
  id: number
  name: string
  displayOrder: number
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

export default function MenuPage() {
  const [menuCategories, setMenuCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    setIsLoading(true)
    try {
      const [categoriesRes, itemsRes] = await Promise.all([
        fetch("/api/categories"),
        fetch("/api/menu-items/by-category")
      ])

      if (categoriesRes.ok) {
        const categoriesData = await categoriesRes.json()
        setMenuCategories(categoriesData)
      }

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

  const shouldShowPrice = (price: string | null) => {
    if (!price) return false
    const cleanPrice = price.trim().replace(/[₺\s]/g, '')
    return cleanPrice !== '' && cleanPrice !== '0'
  }

  return (
    <div className="min-h-screen">
      <Navigation />
      
      {/* Hero */}
      <section className="relative h-[300px] flex items-center justify-center overflow-hidden bg-primary/10">
        <div className="relative z-10 text-center px-4">
          <h1 className="font-serif text-5xl md:text-6xl font-bold mb-4">
            Menümüz
          </h1>
          <p className="text-muted-foreground text-lg md:text-xl">
            Özenle hazırlanmış geleneksel Türk mezeleri
          </p>
        </div>
      </section>

      {/* Menu */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {isLoading && (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          )}

          {error && (
            <div className="text-center py-20">
              <p className="text-destructive text-lg mb-4">{error}</p>
              <button 
                onClick={fetchData}
                className="text-primary hover:underline"
              >
                Tekrar deneyin
              </button>
            </div>
          )}

          {!isLoading && !error && menuCategories.length === 0 && (
            <div className="text-center py-20">
              <p className="text-muted-foreground text-lg">
                Henüz menü öğesi eklenmemiş.
              </p>
            </div>
          )}

          {!isLoading && !error && menuCategories.map((category, categoryIndex) => (
            <div key={categoryIndex} className="mb-16">
              <h2 className="font-serif text-3xl md:text-4xl font-bold mb-8 text-center">
                {category.name}
              </h2>
              
              {!category.items || category.items.length === 0 ? (
                <p className="text-center text-muted-foreground">
                  Bu kategoride henüz öğe yok.
                </p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {category.items.map((item, itemIndex) => (
                    <Card key={itemIndex} className="overflow-hidden group hover:shadow-xl transition-shadow duration-300">
                      <div className="relative h-48 overflow-hidden">
                        {item.imageUrl ? (
                          <Image
                            src={item.imageUrl}
                            alt={item.name}
                            fill
                            className="object-cover group-hover:scale-110 transition-transform duration-300"
                          />
                        ) : (
                          <div className="w-full h-full bg-muted flex items-center justify-center">
                            <span className="text-muted-foreground">Resim yok</span>
                          </div>
                        )}
                        {item.popular && (
                          <Badge className="absolute top-3 right-3 bg-primary">
                            Popüler
                          </Badge>
                        )}
                      </div>
                      <div className="p-5">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-serif text-xl font-bold">{item.name}</h3>
                          {shouldShowPrice(item.price) && (
                            <span className="text-primary font-bold text-lg ml-2">{item.price}</span>
                          )}
                        </div>
                        {item.description && (
                          <p className="text-muted-foreground text-sm">{item.description}</p>
                        )}
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  )
}