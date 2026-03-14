"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { toast } from "sonner"
import { Loader2, Plus, Pencil, Trash2, Shield, LogOut, Home, Eye, EyeOff, Star, FolderOpen, Upload, X } from "lucide-react"
import Image from "next/image"

interface GalleryImage {
  id: number
  url: string
  alt: string | null
}

interface Testimonial {
  id: number
  name: string
  content: string
  rating: number
  imageUrl: string | null
  displayOrder: number
  hidden: boolean
}

export default function TestimonialAdminPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editing, setEditing] = useState<Testimonial | null>(null)
  const [isVerified, setIsVerified] = useState(false)
  const [password, setPassword] = useState("")
  
  const [formData, setFormData] = useState({
    name: "",
    content: "",
    rating: "5",
    displayOrder: "0",
    imageUrl: ""
  })

  const [gallery, setGallery] = useState<GalleryImage[]>([])
  const [isGalleryOpen, setIsGalleryOpen] = useState(false)
  const [uploadingImage, setUploadingImage] = useState(false)
  const [previewUrl, setPreviewUrl] = useState("")

  useEffect(() => {
    if (localStorage.getItem("admin_auth") === "true") {
      setIsVerified(true)
      fetchData()
    }
  }, [])

  const fetchData = async () => {
    setIsLoading(true)
    try {
      const res = await fetch("/api/testimonials?showHidden=true")
      if (res.ok) setTestimonials(await res.json())

      const galleryRes = await fetch("/api/gallery")
      if (galleryRes.ok) {
        const data = await galleryRes.json()
        setGallery(data)
      }
    } catch (error) {
      toast.error("Hata oluştu")
    } finally {
      setIsLoading(false)
    }
  }

  const handlePassword = (e: React.FormEvent) => {
    e.preventDefault()
    if (password === "1234") {
      setIsVerified(true)
      localStorage.setItem("admin_auth", "true")
      fetchData()
    } else {
      toast.error("Hatalı şifre")
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const payload = {
      ...formData,
      rating: parseInt(formData.rating),
      displayOrder: parseInt(formData.displayOrder)
    }
    try {
      const res = await fetch(editing ? `/api/testimonials?id=${editing.id}` : "/api/testimonials", {
        method: editing ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      })
      if (res.ok) {
        toast.success("Başarılı")
        setIsDialogOpen(false)
        fetchData()
      }
    } catch (error) {
      toast.error("Hata")
    }
  }

  const handleToggleHidden = async (t: Testimonial) => {
    try {
      const res = await fetch(`/api/testimonials?id=${t.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ hidden: !t.hidden })
      })
      if (res.ok) {
        toast.success("Güncellendi")
        fetchData()
      }
    } catch (error) {
      toast.error("Hata")
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm("Silmek istediğinize emin misiniz?")) return
  const handleUploadImage = async (file: File) => {
    setUploadingImage(true)
    try {
      const formData = new FormData()
      formData.append("file", file)
      const res = await fetch("/api/upload", { method: "POST", body: formData })
      if (!res.ok) throw new Error("Upload failed")
      const data = await res.json()
      return data.url
    } catch (error) {
      toast.error("Hata")
      return null
    } finally {
      setUploadingImage(false)
    }
  }

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const url = await handleUploadImage(file)
    if (url) {
      setFormData({ ...formData, imageUrl: url })
      setPreviewUrl(url)
    }
  }
  }

  if (!isVerified) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/30">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <Shield className="h-12 w-12 text-primary mx-auto mb-4" />
            <CardTitle>Yorum Yönetimi Girişi</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handlePassword} className="space-y-4">
              <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Şifre" />
              <Button type="submit" className="w-full">Giriş Yap</Button>
            </form>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-serif font-bold">Yorum Yönetimi</h1>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => router.push("/admin")}>
              <FolderOpen className="mr-2 h-4 w-4" />
              Menü
            </Button>
            <Button variant="outline" onClick={() => { localStorage.removeItem("admin_auth"); router.push("/") }}>
              <LogOut className="mr-2 h-4 w-4" />
              Çıkış
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">Müşteri Yorumları</h2>
          <Button onClick={() => { setEditing(null); setFormData({ name: "", content: "", rating: "5", displayOrder: "0" }); setIsDialogOpen(true) }}>
            <Plus className="mr-2 h-4 w-4" /> Yeni Yorum Ekle
          </Button>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-20 text-primary animate-spin"><Loader2 className="h-8 w-8" /></div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.map(t => (
              <Card key={t.id} className={t.hidden ? "opacity-60" : ""}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                      {t.imageUrl && (
                        <div className="relative w-10 h-10 rounded-full overflow-hidden border">
                          <Image src={t.imageUrl} alt={t.name} fill className="object-cover" />
                        </div>
                      )}
                      <div className="font-bold">{t.name}</div>
                    </div>
                    <div className="flex text-primary">
                      {[...Array(t.rating)].map((_, i) => <Star key={i} className="h-3 w-3 fill-current" />)}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm italic mb-4">"{t.content}"</p>
                  <div className="flex justify-end gap-2">
                    <Button size="sm" variant="outline" onClick={() => { setEditing(t); setFormData({ name: t.name, content: t.content, rating: t.rating.toString(), displayOrder: t.displayOrder.toString() }); setIsDialogOpen(true) }}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => handleToggleHidden(t)}>
                      {t.hidden ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                    </Button>
                    <Button size="sm" variant="destructive" onClick={() => handleDelete(t.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent>
            <DialogHeader><DialogTitle>{editing ? "Yorumu Düzenle" : "Yeni Yorum Ekle"}</DialogTitle></DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div><Label>İsim</Label><Input value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} /></div>
              <div><Label>Yorum</Label><Textarea value={formData.content} onChange={e => setFormData({...formData, content: e.target.value})} /></div>
              <div><Label>Puan (1-5)</Label><Input type="number" min="1" max="5" value={formData.rating} onChange={e => setFormData({...formData, rating: e.target.value})} /></div>
              <div><Label>Sıralama</Label><Input type="number" value={formData.displayOrder} onChange={e => setFormData({...formData, displayOrder: e.target.value})} /></div>
              
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label>Resim</Label>
                  <Button type="button" variant="outline" size="sm" onClick={() => setIsGalleryOpen(true)}>Galleriden Seç</Button>
                </div>
                {previewUrl ? (
                  <div className="relative w-full h-32 border rounded-lg overflow-hidden">
                    <Image src={previewUrl} alt="Preview" fill className="object-cover" />
                    <Button type="button" variant="destructive" size="icon" className="absolute top-1 right-1 h-6 w-6" onClick={() => { setPreviewUrl(""); setFormData({...formData, imageUrl: ""}) }}>
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ) : (
                  <div className="border border-dashed rounded-lg p-4 text-center">
                    <Input type="file" accept="image/*" onChange={handleFileSelect} className="text-xs" />
                  </div>
                )}
              </div>

              <Button type="submit" className="w-full" disabled={uploadingImage}>
                {uploadingImage ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Kaydet
              </Button>
            </form>
          </DialogContent>
        </Dialog>

        {/* Gallery Dialog */}
        <Dialog open={isGalleryOpen} onOpenChange={setIsGalleryOpen}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Galleriden Resim Seç</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-4">
              {gallery.map(img => (
                <div 
                  key={img.id} 
                  className="relative aspect-square border rounded-lg overflow-hidden cursor-pointer hover:border-primary"
                  onClick={() => {
                    setFormData({ ...formData, imageUrl: img.url })
                    setPreviewUrl(img.url)
                    setIsGalleryOpen(false)
                  }}
                >
                  <Image src={img.url} alt={img.alt || ""} fill className="object-cover" />
                </div>
              ))}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsGalleryOpen(false)}>Kapat</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  )
}
