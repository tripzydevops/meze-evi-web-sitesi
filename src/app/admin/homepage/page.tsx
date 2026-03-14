"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "sonner"
import { ArrowLeft, LogOut, Shield } from "lucide-react"
import Link from "next/link"

// Modular components
import { HeroTab } from "@/components/admin/homepage/HeroTab"
import { FeaturesTab } from "@/components/admin/homepage/FeaturesTab"
import { FeaturedHeaderTab } from "@/components/admin/homepage/FeaturedHeaderTab"
import { DishesTab } from "@/components/admin/homepage/DishesTab"
import { AboutTab } from "@/components/admin/homepage/AboutTab"
import { GalleryPicker } from "@/components/admin/homepage/GalleryDialog"
import { FeatureDialog } from "@/components/admin/homepage/FeatureDialog"
import { DishDialog } from "@/components/admin/homepage/DishDialog"

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

interface GalleryImage {
  id: number
  url: string
  alt: string | null
}

export default function HomepageAdminPage() {
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

  useEffect(() => {
    if (isPasswordVerified || localStorage.getItem("admin_auth") === "true") {
      fetchAllData()
    }
  }, [isPasswordVerified])

  const fetchAllData = async () => {
    setIsLoading(true)
    try {
      const [heroRes, featuresRes, featuredSectionRes, dishesRes, aboutRes, menuItemsRes, galleryRes] = await Promise.all([
        fetch("/api/homepage-hero"),
        fetch("/api/homepage-features"),
        fetch("/api/homepage-featured-section"),
        fetch("/api/homepage-featured-dishes"),
        fetch("/api/homepage-about-section"),
        fetch("/api/menu-items"),
        fetch("/api/gallery")
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

      if (galleryRes && galleryRes.ok) {
        const data = await galleryRes.json()
        setGallery(data)
      }

      if (aboutRes.ok) {
        const data = await aboutRes.json()
        setAboutSection(data[0] || null)
      }

      if (menuItemsRes.ok) {
        const data = await menuItemsRes.json()
        setMenuItems(data)
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
    const reader = new FileReader()
    reader.onloadend = () => setHeroImage({ file, preview: reader.result as string })
    reader.readAsDataURL(file)
  }

  const handleAboutImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
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
      const response = await fetch("/api/upload", { method: "POST", body: formData })
      if (!response.ok) throw new Error("Upload failed")
      const data = await response.json()
      return data.url
    } catch (error) {
      toast.error("Resim yüklenirken hata oluştu")
      return null
    } finally {
      setUploadingImage(false)
    }
  }

  const handleHeroUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    try {
      let imageUrl = formData.get("backgroundImageUrl") as string
      if (heroImage.file) {
        const uploadedUrl = await handleUploadImage(heroImage.file)
        if (uploadedUrl) imageUrl = uploadedUrl
        else return
      }
      const payload = {
        title: formData.get("title"),
        subtitle: formData.get("subtitle"),
        primaryButtonText: formData.get("primaryButtonText"),
        primaryButtonLink: formData.get("primaryButtonLink"),
        secondaryButtonText: formData.get("secondaryButtonText"),
        secondaryButtonLink: formData.get("secondaryButtonLink"),
        backgroundImageUrl: imageUrl,
        imagePosition: heroData?.imagePosition || 'center',
        titleStyle: heroData?.titleStyle,
        subtitleStyle: heroData?.subtitleStyle,
      }
      const response = await fetch(`/api/homepage-hero?id=${heroData?.id}`, {
        method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload)
      })
      if (response.ok) {
        toast.success("Hero bölümü güncellendi")
        setHeroImage({ file: null, preview: "" })
        fetchAllData()
      }
    } catch (error) {
      toast.error("Bir hata oluştu")
    }
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
      const resp = await fetch(editingFeature ? `/api/homepage-features?id=${editingFeature.id}` : "/api/homepage-features", {
        method: editingFeature ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      })
      if (resp.ok) {
        toast.success(editingFeature ? "Güncellendi" : "Eklendi")
        setIsFeatureDialogOpen(false)
        setEditingFeature(null)
        fetchAllData()
      }
    } catch (error) { toast.error("Hata") }
  }

  const handleFeatureDelete = async (id: number) => {
    if (!confirm("Emin misiniz?")) return
    try {
      const resp = await fetch(`/api/homepage-features?id=${id}`, { method: "DELETE" })
      if (resp.ok) { toast.success("Silindi"); fetchAllData() }
    } catch (error) { toast.error("Hata") }
  }

  const handleFeaturedSectionUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const payload = {
      sectionTitle: formData.get("sectionTitle"),
      sectionDescription: formData.get("sectionDescription")
    }
    try {
      const response = await fetch(`/api/homepage-featured-section?id=${featuredSection?.id}`, {
        method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload)
      })
      if (response.ok) { toast.success("Güncellendi"); fetchAllData() }
    } catch (error) { toast.error("Hata") }
  }

  const handleDishSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    try {
      const payload = {
        menuItemId: parseInt(formData.get("menuItemId") as string),
        displayOrder: parseInt(formData.get("displayOrder") as string)
      }
      const resp = await fetch(editingDish ? `/api/homepage-featured-dishes?id=${editingDish.id}` : "/api/homepage-featured-dishes", {
        method: editingDish ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      })
      if (resp.ok) {
        setIsDishDialogOpen(false); setEditingDish(null); setDishPreview(""); fetchAllData()
      }
    } catch (error) { toast.error("Hata") }
  }

  const handleDishDelete = async (id: number) => {
    if (!confirm("Emin misiniz?")) return
    try {
      const resp = await fetch(`/api/homepage-featured-dishes?id=${id}`, { method: "DELETE" })
      if (resp.ok) { toast.success("Silindi"); fetchAllData() }
    } catch (error) { toast.error("Hata") }
  }

  const handleAboutUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    try {
      let imageUrl = formData.get("imageUrl") as string
      if (aboutImage.file) {
        const uploadedUrl = await handleUploadImage(aboutImage.file)
        if (uploadedUrl) imageUrl = uploadedUrl
        else return
      }
      const payload = {
        title: formData.get("title"),
        description: formData.get("description"),
        imageUrl: imageUrl,
        imagePosition: aboutSection?.imagePosition || 'center',
        buttonText: formData.get("buttonText"),
        buttonLink: formData.get("buttonLink"),
        titleStyle: aboutSection?.titleStyle,
        descriptionStyle: aboutSection?.descriptionStyle,
      }
      const response = await fetch(`/api/homepage-about-section?id=${aboutSection?.id}`, {
        method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload)
      })
      if (response.ok) {
        toast.success("Güncellendi"); setAboutImage({ file: null, preview: "" }); fetchAllData()
      }
    } catch (error) { toast.error("Hata") }
  }

  if (!isPasswordVerified) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/30 px-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <Shield className="h-12 w-12 text-primary mx-auto mb-4" />
            <CardTitle>Yönetim Paneli Girişi</CardTitle>
            <CardDescription>Devam etmek için şifreyi girin</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <Input
                 type="password" placeholder="••••"
                 value={passwordInput} onChange={(e) => setPasswordInput(e.target.value)}
                 autoFocus
              />
              <Button type="submit" className="w-full">Giriş Yap</Button>
            </form>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <header className="bg-white border-b sticky top-0 z-10 transition-all duration-300">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/admin">
              <Button variant="ghost" size="icon"><ArrowLeft className="h-5 w-5" /></Button>
            </Link>
            <div>
              <h1 className="text-2xl font-serif font-bold">Ana Sayfa Yönetimi</h1>
              <p className="text-xs text-muted-foreground uppercase tracking-widest font-medium">Hoş geldiniz, Yönetici</p>
            </div>
          </div>
          <Button variant="outline" onClick={handleSignOut}><LogOut className="mr-2 h-4 w-4" /> Çıkış </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 animate-in fade-in duration-500">
        <Tabs defaultValue="hero" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 p-1 bg-white/50 backdrop-blur rounded-xl border">
            <TabsTrigger value="hero" className="rounded-lg">Hero</TabsTrigger>
            <TabsTrigger value="features" className="rounded-lg">Özellikler</TabsTrigger>
            <TabsTrigger value="featured" className="rounded-lg">Öne Çıkanlar</TabsTrigger>
            <TabsTrigger value="dishes" className="rounded-lg">Yemekler</TabsTrigger>
            <TabsTrigger value="about" className="rounded-lg">Hakkımızda</TabsTrigger>
          </TabsList>

          <TabsContent value="hero" className="space-y-4">
            <HeroTab 
              heroData={heroData} 
              heroImage={heroImage} 
              uploadingImage={uploadingImage}
              onHeroUpdate={handleHeroUpdate}
              onStyleChange={(field, val) => heroData && setHeroData({ ...heroData, [field]: val })}
              onGalleryOpen={() => { setGalleryTarget("hero"); setIsGalleryOpen(true) }}
              onImageSelect={handleHeroImageSelect}
              onImageClear={() => setHeroImage({ file: null, preview: "" })}
              onUrlChange={(url) => setHeroImage({ file: null, preview: url })}
              onPositionChange={(pos) => heroData && setHeroData({ ...heroData, imagePosition: pos })}
            />
          </TabsContent>

          <TabsContent value="features">
            <FeaturesTab 
              features={features}
              onAdd={() => { setEditingFeature(null); setIsFeatureDialogOpen(true) }}
              onEdit={(f) => { setEditingFeature(f); setIsFeatureDialogOpen(true) }}
              onDelete={handleFeatureDelete}
            />
          </TabsContent>

          <TabsContent value="featured" className="space-y-4">
            <FeaturedHeaderTab 
              featuredSection={featuredSection}
              onSubmit={handleFeaturedSectionUpdate}
            />
          </TabsContent>

          <TabsContent value="dishes">
            <DishesTab 
              featuredDishes={featuredDishes}
              onAdd={() => { setEditingDish(null); setDishPreview(""); setIsDishDialogOpen(true) }}
              onEdit={(d) => { setEditingDish(d); setDishPreview(d.menuItem.imageUrl || ""); setIsDishDialogOpen(true) }}
              onDelete={handleDishDelete}
            />
          </TabsContent>

          <TabsContent value="about">
            <AboutTab 
              aboutSection={aboutSection}
              aboutImage={aboutImage}
              uploadingImage={uploadingImage}
              onAboutUpdate={handleAboutUpdate}
              onAboutChange={setAboutSection}
              onStyleChange={(field, val) => aboutSection && setAboutSection({ ...aboutSection, [field]: val })}
              onGalleryOpen={() => { setGalleryTarget("about"); setIsGalleryOpen(true) }}
              onImageSelect={handleAboutImageSelect}
              onImageClear={() => setAboutImage({ file: null, preview: "" })}
            />
          </TabsContent>
        </Tabs>
      </main>

      <FeatureDialog 
        isOpen={isFeatureDialogOpen} onOpenChange={setIsFeatureDialogOpen}
        editingFeature={editingFeature} onSubmit={handleFeatureSubmit}
      />

      <DishDialog 
        isOpen={isDishDialogOpen} onOpenChange={setIsDishDialogOpen}
        editingDish={editingDish} menuItems={menuItems} dishPreview={dishPreview}
        onMenuItemChange={(val) => {
          const item = menuItems.find(i => i.id === parseInt(val))
          setDishPreview(item?.imageUrl || "")
        }}
        onSubmit={handleDishSubmit}
        onCancel={() => { setIsDishDialogOpen(false); setEditingDish(null); setDishPreview("") }}
      />

      <GalleryPicker 
        isOpen={isGalleryOpen} onOpenChange={setIsGalleryOpen}
        gallery={gallery} target={galleryTarget}
        onSelect={(url) => {
          if (galleryTarget === "hero") {
            setHeroImage({ file: null, preview: url })
            if (heroData) setHeroData({ ...heroData, backgroundImageUrl: url })
          } else {
            setAboutImage({ file: null, preview: url })
            if (aboutSection) setAboutSection({ ...aboutSection, imageUrl: url })
          }
          setIsGalleryOpen(false)
        }}
      />
    </div>
  )
}