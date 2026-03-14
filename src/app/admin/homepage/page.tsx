"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"
import { 
  Loader2, Plus, Pencil, Trash2, AlertCircle, LogOut, Upload, X, ArrowLeft, Shield,
  ChefHat, Star, Clock, MapPin, Utensils, Heart, Award, Coffee, Users, Sparkles, Mail
} from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import Image from "next/image"
import Link from "next/link"
// LucideIcons map for dynamic icon rendering
const LucideIconMap: Record<string, React.ComponentType<any>> = {
  ChefHat, Star, Clock, MapPin, Utensils, Heart, Award, Coffee, Users, Sparkles, Mail,
  Loader2, Plus, Pencil, Trash2, AlertCircle, LogOut, Upload, X, ArrowLeft, Shield
}

interface HeroSection {
  id: number
  title: string
  subtitle: string | null
  primaryButtonText: string | null
  primaryButtonLink: string | null
  secondaryButtonText: string | null
  secondaryButtonLink: string | null
  backgroundImageUrl: string | null
  titleStyle: string | null
  subtitleStyle: string | null
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

interface MenuItem {
  id: number
  categoryId: number
  name: string
  description: string | null
  price: string
  imageUrl: string | null
  popular: boolean
  category?: {
    id: number
    name: string
  }
}

interface AboutSection {
  id: number
  title: string
  description: string
  imageUrl: string | null
  buttonText: string | null
  buttonLink: string | null
  titleStyle: string | null
  descriptionStyle: string | null
}

const iconList = ['ChefHat', 'Star', 'Clock', 'MapPin', 'Utensils', 'Heart', 'Award', 'Coffee', 'Users', 'Sparkles']

interface GalleryImage {
  id: number
  url: string
  alt: string | null
}

const StyleControls = ({ 
  prefix, 
  value, 
  onChange 
}: { 
  prefix: string, 
  value: string, 
  onChange: (val: string) => void 
}) => {
  const parts = value.split(' ')
  
  const getFamily = () => parts.find(p => p.startsWith('font-')) || 'font-serif'
  const getSize = () => parts.find(p => p.startsWith('text-')) || 'text-4xl'
  const getWeight = () => parts.find(p => p.startsWith('font-') && p !== getFamily()) || 'font-bold'
  const getAlign = () => parts.find(p => p.startsWith('text-') && p !== getSize()) || 'text-left'
  const getMargin = () => parts.find(p => p.startsWith('mb-')) || 'mb-6'
  const getColor = () => parts.find(p => p.startsWith('text-') && !p.startsWith('text-left') && !p.startsWith('text-center') && !p.startsWith('text-right') && !p.startsWith('text-4xl') && !p.startsWith('text-5xl') && !p.startsWith('text-6xl') && !p.startsWith('text-7xl') && !p.startsWith('text-xl') && !p.startsWith('text-lg') && !p.startsWith('text-base') && !p.startsWith('text-sm') && !p.includes('xs')) || 'none'

  const updateStyle = (newParts: Partial<{ family: string, size: string, weight: string, align: string, margin: string, color: string }>) => {
    const current = {
      family: getFamily(),
      size: getSize(),
      weight: getWeight(),
      align: getAlign(),
      margin: getMargin(),
      color: getColor()
    }
    const final = { ...current, ...newParts }
    onChange(Object.values(final).filter(v => v && v !== 'none' && v !== '').join(' '))
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-2 p-3 border rounded-md bg-muted/20">
      <div className="space-y-1">
        <span className="text-xs font-medium">{prefix} Yazı Tipi</span>
        <Select value={getFamily()} onValueChange={(val) => updateStyle({ family: val })}>
          <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="font-serif">Serif (Zarif)</SelectItem>
            <SelectItem value="font-sans">Sans (Modern)</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-1">
        <span className="text-xs font-medium">Boyut</span>
        <Select value={getSize()} onValueChange={(val) => updateStyle({ size: val })}>
          <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="text-sm">SM</SelectItem>
            <SelectItem value="text-base">M</SelectItem>
            <SelectItem value="text-lg">LG</SelectItem>
            <SelectItem value="text-xl">XL</SelectItem>
            <SelectItem value="text-2xl">2XL</SelectItem>
            <SelectItem value="text-3xl">3XL</SelectItem>
            <SelectItem value="text-4xl">4XL</SelectItem>
            <SelectItem value="text-5xl">5XL</SelectItem>
            <SelectItem value="text-6xl">6XL</SelectItem>
            <SelectItem value="text-7xl">7XL</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-1">
        <span className="text-xs font-medium">Kalınlık</span>
        <Select value={getWeight()} onValueChange={(val) => updateStyle({ weight: val })}>
          <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="font-light">İnce</SelectItem>
            <SelectItem value="font-normal">Normal</SelectItem>
            <SelectItem value="font-medium">Orta</SelectItem>
            <SelectItem value="font-semibold">Yarı Kalın</SelectItem>
            <SelectItem value="font-bold">Kalın</SelectItem>
            <SelectItem value="font-extrabold">Çok Kalın</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-1">
        <span className="text-xs font-medium">Hizalama</span>
        <Select value={getAlign()} onValueChange={(val) => updateStyle({ align: val })}>
          <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="text-left">Sol</SelectItem>
            <SelectItem value="text-center">Orta</SelectItem>
            <SelectItem value="text-right">Sağ</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-1">
        <span className="text-xs font-medium">Renk</span>
        <Select value={getColor() || "none"} onValueChange={(val) => updateStyle({ color: val })}>
          <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="none">Varsayılan</SelectItem>
            <SelectItem value="text-primary">Bordo (Tema)</SelectItem>
            <SelectItem value="text-amber-600">Kehribar</SelectItem>
            <SelectItem value="text-gray-500">Gri</SelectItem>
            <SelectItem value="text-white">Beyaz</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}

export default function HomepageAdminPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  
  // Data states
  const [heroData, setHeroData] = useState<HeroSection | null>(null)
  const [features, setFeatures] = useState<Feature[]>([])
  const [featuredSection, setFeaturedSection] = useState<FeaturedSection | null>(null)
  const [featuredDishes, setFeaturedDishes] = useState<FeaturedDish[]>([])
  const [aboutSection, setAboutSection] = useState<AboutSection | null>(null)
  const [menuItems, setMenuItems] = useState<MenuItem[]>([])

  // Dialog states
  const [editingFeature, setEditingFeature] = useState<Feature | null>(null)
  const [editingDish, setEditingDish] = useState<FeaturedDish | null>(null)
  const [isFeatureDialogOpen, setIsFeatureDialogOpen] = useState(false)
  const [isDishDialogOpen, setIsDishDialogOpen] = useState(false)

  // Image upload states per section
  const [heroImage, setHeroImage] = useState<{ file: File | null, preview: string }>({ file: null, preview: "" })
  const [aboutImage, setAboutImage] = useState<{ file: File | null, preview: string }>({ file: null, preview: "" })
  const [dishPreview, setDishPreview] = useState<string>("")
  const [uploadingImage, setUploadingImage] = useState(false)
  const [gallery, setGallery] = useState<GalleryImage[]>([])
  const [isGalleryOpen, setIsGalleryOpen] = useState(false)
  const [galleryTarget, setGalleryTarget] = useState<"hero" | "about" | null>(null)

  const [isPasswordVerified, setIsPasswordVerified] = useState(false)
  const [passwordInput, setPasswordInput] = useState("")

  useEffect(() => {
    const savedAuth = localStorage.getItem("admin_auth")
    if (savedAuth === "true") {
      setIsPasswordVerified(true)
    }
  }, [])

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (passwordInput === "1234") {
      setIsPasswordVerified(true)
      localStorage.setItem("admin_auth", "true")
      toast.success("Giriş başarılı")
      fetchAllData()
    } else {
      toast.error("Hatalı şifre")
    }
  }

  // Redirect disabled for direct access fix
  /*
  useEffect(() => {
    if (!isPending && !session?.user) {
      router.push("/sign-in?redirect=/admin/homepage")
    }
  }, [session, isPending, router])
  */

  const isAdmin = true 

  useEffect(() => {
    if (isPasswordVerified || localStorage.getItem("admin_auth") === "true") {
      fetchAllData()
    }
  }, [isPasswordVerified])

  const fetchAllData = async () => {
    setIsLoading(true)
    try {
      const [heroRes, featuresRes, featuredSectionRes, dishesRes, aboutRes, menuItemsRes] = await Promise.all([
        fetch("/api/homepage-hero"),
        fetch("/api/homepage-features"),
        fetch("/api/homepage-featured-section"),
        fetch("/api/homepage-featured-dishes"),
        fetch("/api/homepage-about-section"),
        fetch("/api/menu-items")
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

      if (menuItemsRes.ok) {
        const data = await menuItemsRes.json()
        setMenuItems(data)
      }

      const galleryRes = await fetch("/api/gallery")
      if (galleryRes.ok) {
        const data = await galleryRes.json()
        setGallery(data)
      }
    } catch (error) {
      toast.error("Veriler yüklenirken hata oluştu")
    } finally {
      setIsLoading(false)
    }
  }

  const handleHeroImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith("image/")) {
      toast.error("Lütfen bir resim dosyası seçin")
      return
    }
    const reader = new FileReader()
    reader.onloadend = () => setHeroImage({ file, preview: reader.result as string })
    reader.readAsDataURL(file)
  }

  const handleAboutImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith("image/")) {
      toast.error("Lütfen bir resim dosyası seçin")
      return
    }
    const reader = new FileReader()
    reader.onloadend = () => setAboutImage({ file, preview: reader.result as string })
    reader.readAsDataURL(file)
  }

  const handleSignOut = async () => {
    localStorage.removeItem("admin_auth")
    window.location.href = "/"
  }

  const handleUploadImage = async (file: File) => {
    setUploadingImage(true)
    try {
      const formData = new FormData()
      formData.append("file", file)

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        throw new Error("Upload failed")
      }

      const data = await response.json()
      return data.url
    } catch (error) {
      toast.error("Resim yüklenirken hata oluştu")
      return null
    } finally {
      setUploadingImage(false)
    }
  }

  // Hero Section Handlers
  const handleHeroUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    
    try {
      let imageUrl = formData.get("backgroundImageUrl") as string
      
      if (heroImage.file) {
        const uploadedUrl = await handleUploadImage(heroImage.file)
        if (uploadedUrl) {
          imageUrl = uploadedUrl
        } else {
          return
        }
      }

      const payload = {
        title: formData.get("title"),
        subtitle: formData.get("subtitle"),
        primaryButtonText: formData.get("primaryButtonText"),
        primaryButtonLink: formData.get("primaryButtonLink"),
        secondaryButtonText: formData.get("secondaryButtonText"),
        secondaryButtonLink: formData.get("secondaryButtonLink"),
        backgroundImageUrl: imageUrl,
        titleStyle: formData.get("titleStyle"),
        subtitleStyle: formData.get("subtitleStyle"),
      }

      const response = await fetch(`/api/homepage-hero?id=${heroData?.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      })

      if (response.ok) {
        toast.success("Hero bölümü güncellendi")
        setHeroImage({ file: null, preview: "" })
        fetchAllData()
      } else {
        toast.error("Güncelleme başarısız")
      }
    } catch (error) {
      toast.error("Bir hata oluştu")
    }
  }

  // Feature Handlers
  const openFeatureDialog = (feature?: Feature) => {
    setEditingFeature(feature || null)
    setIsFeatureDialogOpen(true)
  }

  const handleFeatureSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)

    const payload = {
      icon: formData.get("icon"),
      title: formData.get("title"),
      description: formData.get("description"),
      displayOrder: parseInt(formData.get("displayOrder") as string)
    }

    try {
      let response
      if (editingFeature) {
        response = await fetch(`/api/homepage-features?id=${editingFeature.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        })
      } else {
        response = await fetch("/api/homepage-features", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        })
      }

      if (response.ok) {
        toast.success(editingFeature ? "Özellik güncellendi" : "Özellik eklendi")
        setIsFeatureDialogOpen(false)
        setEditingFeature(null)
        fetchAllData()
      } else {
        toast.error("İşlem başarısız")
      }
    } catch (error) {
      toast.error("Bir hata oluştu")
    }
  }

  const handleFeatureDelete = async (id: number) => {
    if (!confirm("Bu özelliği silmek istediğinizden emin misiniz?")) return

    try {
      const response = await fetch(`/api/homepage-features?id=${id}`, {
        method: "DELETE"
      })

      if (response.ok) {
        toast.success("Özellik silindi")
        fetchAllData()
      } else {
        toast.error("Silme işlemi başarısız")
      }
    } catch (error) {
      toast.error("Bir hata oluştu")
    }
  }

  // Featured Section Handlers
  const handleFeaturedSectionUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)

    const payload = {
      sectionTitle: formData.get("sectionTitle"),
      sectionDescription: formData.get("sectionDescription")
    }

    try {
      const response = await fetch(`/api/homepage-featured-section?id=${featuredSection?.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      })

      if (response.ok) {
        toast.success("Öne çıkan bölüm güncellendi")
        fetchAllData()
      } else {
        toast.error("Güncelleme başarısız")
      }
    } catch (error) {
      toast.error("Bir hata oluştu")
    }
  }

  // Featured Dish Handlers
  const openDishDialog = (dish?: FeaturedDish) => {
    setEditingDish(dish || null)
    setDishPreview("")
    setIsDishDialogOpen(true)
  }

  const handleDishSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)

    const menuItemId = formData.get("menuItemId") as string
    const displayOrder = formData.get("displayOrder") as string

    if (!menuItemId) {
      toast.error("Lütfen bir menü öğesi seçin")
      return
    }

    try {
      const payload = {
        menuItemId: parseInt(menuItemId),
        displayOrder: parseInt(displayOrder)
      }

      let response
      if (editingDish) {
        response = await fetch(`/api/homepage-featured-dishes?id=${editingDish.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        })
      } else {
        response = await fetch("/api/homepage-featured-dishes", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        })
      }

      if (response.ok) {
        toast.success(editingDish ? "Yemek güncellendi" : "Yemek eklendi")
        setIsDishDialogOpen(false)
        setEditingDish(null)
        setDishPreview("")
        fetchAllData()
      } else {
        const error = await response.json()
        toast.error(error.error || "İşlem başarısız")
      }
    } catch (error) {
      toast.error("Bir hata oluştu")
    }
  }

  const handleDishDelete = async (id: number) => {
    if (!confirm("Bu yemeği silmek istediğinizden emin misiniz?")) return

    try {
      const response = await fetch(`/api/homepage-featured-dishes?id=${id}`, {
        method: "DELETE"
      })

      if (response.ok) {
        toast.success("Yemek silindi")
        fetchAllData()
      } else {
        toast.error("Silme işlemi başarısız")
      }
    } catch (error) {
      toast.error("Bir hata oluştu")
    }
  }

  // About Section Handlers
  const handleAboutUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)

    try {
      let imageUrl = formData.get("imageUrl") as string
      
      if (aboutImage.file) {
        const uploadedUrl = await handleUploadImage(aboutImage.file)
        if (uploadedUrl) {
          imageUrl = uploadedUrl
        } else {
          return
        }
      }

      const payload = {
        title: formData.get("title"),
        description: formData.get("description"),
        imageUrl: imageUrl,
        buttonText: formData.get("buttonText"),
        buttonLink: formData.get("buttonLink"),
        titleStyle: aboutSection?.titleStyle,
        descriptionStyle: aboutSection?.descriptionStyle,
      }

      const response = await fetch(`/api/homepage-about-section?id=${aboutSection?.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      })

      if (response.ok) {
        toast.success("Hakkımızda bölümü güncellendi")
        setAboutImage({ file: null, preview: "" })
        fetchAllData()
      } else {
        toast.error("Güncelleme başarısız")
      }
    } catch (error) {
      toast.error("Bir hata oluştu")
    }
  }

  if (!isPasswordVerified) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/30 px-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <Shield className="h-12 w-12 text-primary" />
            </div>
            <CardTitle>Yönetim Paneli Girişi</CardTitle>
            <CardDescription>Devam etmek için şifreyi girin</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="admin-password">Şifre</Label>
                <Input
                  id="admin-password"
                  type="password"
                  placeholder="••••"
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  autoFocus
                />
              </div>
              <Button type="submit" className="w-full">
                Giriş Yap
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/admin">
                <Button variant="ghost" size="icon">
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-serif font-bold">Ana Sayfa Yönetimi</h1>
                <p className="text-sm text-muted-foreground">Hoş geldiniz, Yönetici</p>
              </div>
            </div>
            <Button variant="outline" onClick={handleSignOut}>
              <LogOut className="mr-2 h-4 w-4" />
              Çıkış Yap
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="hero" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="hero">Hero</TabsTrigger>
            <TabsTrigger value="features">Özellikler</TabsTrigger>
            <TabsTrigger value="featured">Öne Çıkanlar</TabsTrigger>
            <TabsTrigger value="dishes">Yemekler</TabsTrigger>
            <TabsTrigger value="about">Hakkımızda</TabsTrigger>
          </TabsList>

          {/* Hero Section */}
          <TabsContent value="hero">
            <Card>
              <CardHeader>
                <CardTitle>Hero Bölümü</CardTitle>
                <CardDescription>Ana sayfa hero bölümünü düzenleyin</CardDescription>
              </CardHeader>
              <CardContent>
                {heroData && (
                  <form onSubmit={handleHeroUpdate} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="title">Başlık *</Label>
                      <Input
                        id="title"
                        name="title"
                        defaultValue={heroData.title}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="subtitle">Alt Başlık</Label>
                      <Textarea
                        id="subtitle"
                        name="subtitle"
                        defaultValue={heroData.subtitle || ""}
                        rows={2}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="primaryButtonText">Birincil Buton Metni</Label>
                        <Input
                          id="primaryButtonText"
                          name="primaryButtonText"
                          defaultValue={heroData.primaryButtonText || ""}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="primaryButtonLink">Birincil Buton Linki</Label>
                        <Input
                          id="primaryButtonLink"
                          name="primaryButtonLink"
                          defaultValue={heroData.primaryButtonLink || ""}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="secondaryButtonText">İkincil Buton Metni</Label>
                        <Input
                          id="secondaryButtonText"
                          name="secondaryButtonText"
                          defaultValue={heroData.secondaryButtonText || ""}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="secondaryButtonLink">İkincil Buton Linki</Label>
                        <Input
                          id="secondaryButtonLink"
                          name="secondaryButtonLink"
                          defaultValue={heroData.secondaryButtonLink || ""}
                        />
                      </div>
                    </div>

                    <div className="space-y-4">
                      <StyleControls 
                        prefix="Başlık" 
                        value={heroData.titleStyle || "font-serif text-5xl md:text-7xl font-bold mb-6"} 
                        onChange={(val) => setHeroData({...heroData, titleStyle: val})} 
                      />
                      <StyleControls 
                        prefix="Alt Başlık" 
                        value={heroData.subtitleStyle || "text-xl md:text-2xl mb-8 text-gray-200"} 
                        onChange={(val) => setHeroData({...heroData, subtitleStyle: val})} 
                      />
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <Label>Arka Plan Resmi</Label>
                        <Button 
                          type="button" 
                          variant="outline" 
                          size="sm"
                          onClick={() => {
                            setGalleryTarget("hero")
                            setIsGalleryOpen(true)
                          }}
                        >
                          Galleriden Seç
                        </Button>
                      </div>
                      {heroImage.preview || heroData.backgroundImageUrl ? (
                        <div className="relative w-full h-48 border rounded-lg overflow-hidden">
                          <Image
                            src={heroImage.preview || heroData.backgroundImageUrl || ""}
                            alt="Background"
                            fill
                            className="object-cover"
                          />
                          <Button
                            type="button"
                            variant="destructive"
                            size="icon"
                            className="absolute top-2 right-2"
                            onClick={() => {
                              setHeroImage({ file: null, preview: "" })
                            }}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ) : (
                        <div className="border-2 border-dashed rounded-lg p-8 text-center">
                          <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                          <Input
                            type="file"
                            accept="image/*"
                            onChange={handleHeroImageSelect}
                          />
                        </div>
                      )}
                      <Input
                        id="backgroundImageUrl"
                        name="backgroundImageUrl"
                        defaultValue={heroData.backgroundImageUrl || ""}
                        placeholder="Veya resim URL'si girin"
                        onChange={(e) => {
                          if (e.target.value) {
                            setHeroImage({ file: null, preview: e.target.value })
                          }
                        }}
                      />
                    </div>

                    <Button type="submit" disabled={uploadingImage}>
                      {uploadingImage ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                      Kaydet
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Features Section */}
          <TabsContent value="features">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Özellikler</CardTitle>
                    <CardDescription>Ana sayfa özelliklerini yönetin</CardDescription>
                  </div>
                  <Button onClick={() => openFeatureDialog()}>
                    <Plus className="mr-2 h-4 w-4" />
                    Yeni Özellik
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {features.map(feature => {
                    const IconComponent = LucideIconMap[feature.icon]
                    return (
                      <div key={feature.id} className="flex items-center gap-4 p-4 border rounded-lg">
                        <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                          {IconComponent && <IconComponent className="w-6 h-6 text-primary" />}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold">{feature.title}</h3>
                          <p className="text-sm text-muted-foreground">{feature.description}</p>
                          <p className="text-xs text-muted-foreground mt-1">Sıra: {feature.displayOrder}</p>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" onClick={() => openFeatureDialog(feature)}>
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => handleFeatureDelete(feature.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Featured Section Header */}
          <TabsContent value="featured">
            <Card>
              <CardHeader>
                <CardTitle>Öne Çıkan Bölüm Başlığı</CardTitle>
                <CardDescription>Öne çıkan yemekler bölümünün başlığını düzenleyin</CardDescription>
              </CardHeader>
              <CardContent>
                {featuredSection && (
                  <form onSubmit={handleFeaturedSectionUpdate} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="sectionTitle">Bölüm Başlığı *</Label>
                      <Input
                        id="sectionTitle"
                        name="sectionTitle"
                        defaultValue={featuredSection.sectionTitle}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="sectionDescription">Bölüm Açıklaması</Label>
                      <Textarea
                        id="sectionDescription"
                        name="sectionDescription"
                        defaultValue={featuredSection.sectionDescription || ""}
                        rows={3}
                      />
                    </div>

                    <Button type="submit">Kaydet</Button>
                  </form>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Featured Dishes */}
          <TabsContent value="dishes">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Öne Çıkan Yemekler</CardTitle>
                    <CardDescription>Ana sayfada gösterilecek yemekleri yönetin</CardDescription>
                  </div>
                  <Button onClick={() => openDishDialog()}>
                    <Plus className="mr-2 h-4 w-4" />
                    Yeni Yemek
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {featuredDishes.map(dish => (
                    <div key={dish.id} className="border rounded-lg overflow-hidden">
                      {dish.menuItem.imageUrl && (
                        <div className="relative h-40">
                          <Image
                            src={dish.menuItem.imageUrl}
                            alt={dish.menuItem.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                      )}
                      <div className="p-4 space-y-2">
                        <div className="flex justify-between items-start">
                          <h3 className="font-semibold">{dish.menuItem.name}</h3>
                          <span className="text-primary font-bold">{dish.menuItem.price}</span>
                        </div>
                        <p className="text-sm text-muted-foreground">{dish.menuItem.description}</p>
                        <p className="text-xs text-muted-foreground">Sıra: {dish.displayOrder}</p>
                        <div className="flex gap-2 pt-2">
                          <Button variant="outline" size="sm" onClick={() => openDishDialog(dish)} className="flex-1">
                            <Pencil className="h-4 w-4 mr-1" />
                            Düzenle
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => handleDishDelete(dish.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* About Section */}
          <TabsContent value="about">
            <Card>
              <CardHeader>
                <CardTitle>Hakkımızda Bölümü</CardTitle>
                <CardDescription>Ana sayfa hakkımızda bölümünü düzenleyin</CardDescription>
              </CardHeader>
              <CardContent>
                {aboutSection && (
                  <form onSubmit={handleAboutUpdate} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="aboutTitle">Başlık *</Label>
                      <Input
                        id="aboutTitle"
                        name="title"
                        value={aboutSection.title}
                        onChange={(e) => setAboutSection({ ...aboutSection, title: e.target.value })}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="aboutDescription">Açıklama *</Label>
                      <Textarea
                        id="aboutDescription"
                        name="description"
                        value={aboutSection.description}
                        onChange={(e) => setAboutSection({ ...aboutSection, description: e.target.value })}
                        rows={6}
                        required
                      />
                    </div>

                    <div className="space-y-4">
                      <StyleControls 
                        prefix="Başlık" 
                        value={aboutSection.titleStyle || "font-serif text-4xl md:text-5xl font-bold mb-6"} 
                        onChange={(val) => setAboutSection({...aboutSection, titleStyle: val})} 
                      />
                      <StyleControls 
                        prefix="Açıklama" 
                        value={aboutSection.descriptionStyle || "text-muted-foreground text-lg mb-8 leading-relaxed whitespace-pre-line"} 
                        onChange={(val) => setAboutSection({...aboutSection, descriptionStyle: val})} 
                      />
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <Label>Resim</Label>
                        <Button 
                          type="button" 
                          variant="outline" 
                          size="sm"
                          onClick={() => {
                            setGalleryTarget("about")
                            setIsGalleryOpen(true)
                          }}
                        >
                          Galleriden Seç
                        </Button>
                      </div>
                      {aboutImage.preview || aboutSection.imageUrl ? (
                        <div className="relative w-full h-48 border rounded-lg overflow-hidden">
                          <Image
                            src={aboutImage.preview || aboutSection.imageUrl || ""}
                            alt="About"
                            fill
                            className="object-cover"
                          />
                          <Button
                            type="button"
                            variant="destructive"
                            size="icon"
                            className="absolute top-2 right-2"
                            onClick={() => {
                              setAboutImage({ file: null, preview: "" })
                              setAboutSection({ ...aboutSection, imageUrl: null })
                            }}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ) : (
                        <div className="border-2 border-dashed rounded-lg p-8 text-center">
                          <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                          <Input
                            type="file"
                            accept="image/*"
                            onChange={handleAboutImageSelect}
                          />
                        </div>
                      )}
                      <Input
                        id="aboutImageUrl"
                        name="imageUrl"
                        value={aboutSection.imageUrl || ""}
                        onChange={(e) => setAboutSection({ ...aboutSection, imageUrl: e.target.value })}
                        placeholder="Veya resim URL'si girin"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="aboutButtonText">Buton Metni</Label>
                        <Input
                          id="aboutButtonText"
                          name="buttonText"
                          value={aboutSection.buttonText || ""}
                          onChange={(e) => setAboutSection({ ...aboutSection, buttonText: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="aboutButtonLink">Buton Linki</Label>
                        <Input
                          id="aboutButtonLink"
                          name="buttonLink"
                          value={aboutSection.buttonLink || ""}
                          onChange={(e) => setAboutSection({ ...aboutSection, buttonLink: e.target.value })}
                        />
                      </div>
                    </div>

                    <Button type="submit" disabled={uploadingImage}>
                      {uploadingImage ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                      Kaydet
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      {/* Feature Dialog */}
      <Dialog open={isFeatureDialogOpen} onOpenChange={setIsFeatureDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingFeature ? "Özelliği Düzenle" : "Yeni Özellik Ekle"}</DialogTitle>
            <DialogDescription>Özellik bilgilerini girin</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleFeatureSubmit}>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="icon">İkon *</Label>
                <Select name="icon" defaultValue={editingFeature?.icon || "ChefHat"} required>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {iconList.map(icon => {
                      const IconComponent = (LucideIconMap as any)[icon]
                      return (
                        <SelectItem key={icon} value={icon}>
                          <div className="flex items-center gap-2">
                            {IconComponent && <IconComponent className="w-4 h-4" />}
                            {icon}
                          </div>
                        </SelectItem>
                      )
                    })}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="featureTitle">Başlık *</Label>
                <Input
                  id="featureTitle"
                  name="title"
                  defaultValue={editingFeature?.title}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="featureDescription">Açıklama</Label>
                <Textarea
                  id="featureDescription"
                  name="description"
                  defaultValue={editingFeature?.description || ""}
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="displayOrder">Sıra</Label>
                <Input
                  id="displayOrder"
                  name="displayOrder"
                  type="number"
                  defaultValue={editingFeature?.displayOrder || 0}
                  required
                />
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsFeatureDialogOpen(false)}>
                İptal
              </Button>
              <Button type="submit">
                {editingFeature ? "Güncelle" : "Ekle"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Dish Dialog */}
      <Dialog open={isDishDialogOpen} onOpenChange={setIsDishDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingDish ? "Yemeği Düzenle" : "Yeni Yemek Ekle"}</DialogTitle>
            <DialogDescription>
              Mevcut menü öğelerinden bir yemek seçin ve sırasını belirleyin
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleDishSubmit}>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="menuItemId">Menü Öğesi Seç *</Label>
                <Select
                  name="menuItemId"
                  defaultValue={editingDish?.menuItemId.toString()}
                  required
                  onValueChange={(value) => {
                    const selectedItem = menuItems.find(item => item.id === parseInt(value))
                    if (selectedItem?.imageUrl) {
                      setDishPreview(selectedItem.imageUrl)
                    } else {
                      setDishPreview("")
                    }
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Bir menü öğesi seçin" />
                  </SelectTrigger>
                  <SelectContent>
                    {menuItems.map(item => (
                      <SelectItem key={item.id} value={item.id.toString()}>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{item.name}</span>
                          {item.price && <span className="text-muted-foreground text-sm">- {item.price}</span>}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {dishPreview && (
                <div className="space-y-2">
                  <Label>Önizleme</Label>
                  <div className="relative w-full h-48 border rounded-lg overflow-hidden">
                    <Image
                      src={dishPreview}
                      alt="Preview"
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="dishDisplayOrder">Sıra *</Label>
                <Input
                  id="dishDisplayOrder"
                  name="displayOrder"
                  type="number"
                  defaultValue={editingDish?.displayOrder || 0}
                  required
                />
                <p className="text-xs text-muted-foreground">
                  Ana sayfada gösterilme sırası (küçükten büyüğe)
                </p>
              </div>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsDishDialogOpen(false)
                  setEditingDish(null)
                  setDishPreview("")
                }}
              >
                İptal
              </Button>
              <Button type="submit">
                {editingDish ? "Güncelle" : "Ekle"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}