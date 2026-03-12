"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import Navigation from "@/components/Navigation"
import Footer from "@/components/Footer"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Loader2, ArrowLeft, Utensils, Package } from "lucide-react"
import { shouldShowPrice } from "@/lib/utils"

interface MenuItem {
  id: number
  categoryId: number
  name: string
  description: string | null
  price: string
  imageUrl: string | null
  popular: boolean
  servingSize: string | null
  category: {
    id: number
    name: string
  }
}

export default function MenuItemPage() {
  const params = useParams()
  const router = useRouter()
  const [menuItem, setMenuItem] = useState<MenuItem | null>(null)
  const [relatedItems, setRelatedItems] = useState<MenuItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [imageError, setImageError] = useState(false)

  useEffect(() => {
    if (params.id) {
      fetchMenuItem()
    }
  }, [params.id])

  const fetchMenuItem = async () => {
    setIsLoading(true)
    setError(null)
    
    try {
      // Fetch the specific menu item
      const itemRes = await fetch(`/api/menu-items?id=${params.id}`)
      
      if (!itemRes.ok) {
        if (itemRes.status === 404) {
          setError("Menü öğesi bulunamadı")
        } else {
          setError("Menü öğesi yüklenirken bir hata oluştu")
        }
        setIsLoading(false)
        return
      }

      const itemData = await itemRes.json()
      setMenuItem(itemData)

      // Fetch related items from the same category
      if (itemData.categoryId) {
        const relatedRes = await fetch(`/api/menu-items?category_id=${itemData.categoryId}&limit=3`)
        if (relatedRes.ok) {
          const relatedData = await relatedRes.json()
          // Filter out the current item
          setRelatedItems(relatedData.filter((item: MenuItem) => item.id !== itemData.id).slice(0, 3))
        }
      }
    } catch (error) {
      console.error("Error fetching menu item:", error)
      setError("Bir hata oluştu. Lütfen daha sonra tekrar deneyin.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleImageError = () => {
    setImageError(true)
  }

  const handleInstagramOrder = () => {
    const url = 'https://ig.me/m/bispecialmeze'
    const isInIframe = window.self !== window.top
    
    if (isInIframe) {
      window.parent.postMessage({ type: "OPEN_EXTERNAL_URL", data: { url } }, "*")
    } else {
      window.open(url, "_blank", "noopener,noreferrer")
    }
  }


  if (isLoading) {
    return (
      <div className="min-h-screen">
        <Navigation />
        <div className="flex justify-center items-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
        <Footer />
      </div>
    )
  }

  if (error || !menuItem) {
    return (
      <div className="min-h-screen">
        <Navigation />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-4">{error || "Menü öğesi bulunamadı"}</h1>
            <p className="text-muted-foreground mb-8">
              Aradığınız menü öğesi mevcut değil veya kaldırılmış olabilir.
            </p>
            <Button onClick={() => router.push("/menu")}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Menüye Dön
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <Navigation />
      
      {/* Back Button */}
      <section className="py-6 border-b">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <Button variant="ghost" onClick={() => router.push("/menu")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Menüye Dön
          </Button>
        </div>
      </section>

      {/* Product Details */}
      <section className="py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
            {/* Image */}
            <div className="relative aspect-square rounded-lg overflow-hidden bg-muted group">
              {menuItem.imageUrl && !imageError ? (
                <Image
                  src={menuItem.imageUrl}
                  alt={menuItem.name}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                  priority
                  onError={handleImageError}
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center">
                  <Utensils className="h-24 w-24 text-primary/30" />
                </div>
              )}
            </div>

            {/* Details */}
            <div className="flex flex-col justify-center">
              <div className="mb-4">
                <Link 
                  href={`/menu#${menuItem.category.name}`}
                  className="text-sm text-primary hover:underline mb-2 inline-block"
                >
                  {menuItem.category.name}
                </Link>
                {menuItem.popular && (
                  <Badge className="ml-2 bg-primary">Popüler</Badge>
                )}
              </div>

              <h1 className="font-serif text-4xl md:text-5xl font-bold mb-4">
                {menuItem.name}
              </h1>

              {shouldShowPrice(menuItem.price) && (
                <div className="mb-6">
                  <span className="text-3xl font-bold text-primary">
                    {menuItem.price}
                  </span>
                </div>
              )}

              {menuItem.servingSize && (
                <div className="flex items-center gap-2 mb-6">
                  <Package className="h-5 w-5 text-muted-foreground" />
                  <span className="text-lg text-muted-foreground">
                    Porsiyon: <span className="font-semibold text-foreground">{menuItem.servingSize}</span>
                  </span>
                </div>
              )}

              <Separator className="my-6" />

              {menuItem.description ? (
                <div className="mb-8">
                  <h2 className="text-xl font-semibold mb-3">Açıklama</h2>
                  <p className="text-muted-foreground text-lg leading-relaxed">
                    {menuItem.description}
                  </p>
                </div>
              ) : (
                <div className="mb-8">
                  <p className="text-muted-foreground italic">
                    Bu ürün için henüz açıklama eklenmemiş.
                  </p>
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  size="lg" 
                  className="flex-1"
                  onClick={handleInstagramOrder}
                >
                  Sipariş Ver
                </Button>
                <Button 
                  variant="outline" 
                  size="lg"
                  onClick={() => router.push("/menu")}
                >
                  Menüye Dön
                </Button>
              </div>
            </div>
          </div>

          {/* Related Items */}
          {relatedItems.length > 0 && (
            <div className="mt-16">
              <h2 className="font-serif text-3xl font-bold mb-8 text-center">
                {menuItem.category.name} Kategorisinden Diğer Ürünler
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {relatedItems.map((item) => (
                  <Link key={item.id} href={`/menu/${item.id}`}>
                    <Card className="overflow-hidden group hover:shadow-xl transition-shadow duration-300 cursor-pointer h-full">
                      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                        {item.imageUrl ? (
                          <Image
                            src={item.imageUrl}
                            alt={item.name}
                            fill
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            className="object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center">
                            <Utensils className="h-12 w-12 text-primary/30" />
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
                          <p className="text-muted-foreground text-sm line-clamp-2">{item.description}</p>
                        )}
                      </div>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  )
}