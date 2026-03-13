"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { toast } from "sonner"
import { Loader2, Plus, Pencil, Trash2, Shield, LogOut, Home, Upload, X, Eye, EyeOff, ImageIcon, FolderOpen } from "lucide-react"
import Image from "next/image"

interface GalleryImage {
  id: number
  url: string
  alt: string | null
  displayOrder: number
  hidden: boolean
}

export default function GalleryAdminPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [images, setImages] = useState<GalleryImage[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingImage, setEditingImage] = useState<GalleryImage | null>(null)
  const [isVerified, setIsVerified] = useState(false)
  const [password, setPassword] = useState("")
  
  const [formData, setFormData] = useState({
    url: "",
    alt: "",
    displayOrder: "0",
    hidden: false
  })
  const [uploading, setUploading] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState("")

  useEffect(() => {
    if (localStorage.getItem("admin_auth") === "true") {
      setIsVerified(true)
      fetchImages()
    }
  }, [])

  const fetchImages = async () => {
    setIsLoading(true)
    try {
      const res = await fetch("/api/gallery?showHidden=true")
      if (res.ok) {
        const data = await res.json()
        setImages(data)
      }
    } catch (error) {
      toast.error("Görseller yüklenemedi")
    } finally {
      setIsLoading(false)
    }
  }

  const handlePassword = (e: React.FormEvent) => {
    e.preventDefault()
    if (password === "1234") {
      setIsVerified(true)
      localStorage.setItem("admin_auth", "true")
      fetchImages()
    } else {
      toast.error("Hatalı şifre")
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setSelectedFile(file)
    const reader = new FileReader()
    reader.onloadend = () => setPreviewUrl(reader.result as string)
    reader.readAsDataURL(file)
  }

  const handleUpload = async () => {
    if (!selectedFile) return formData.url
    setUploading(true)
    try {
      const fData = new FormData()
      fData.append("file", selectedFile)
      const res = await fetch("/api/upload", { method: "POST", body: fData })
      if (res.ok) {
        const data = await res.json()
        return data.url
      }
      throw new Error("Upload failed")
    } catch (error) {
      toast.error("Resim yüklenemedi")
      return null
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const url = await handleUpload()
    if (!url) return

    const payload = {
      ...formData,
      url,
      displayOrder: parseInt(formData.displayOrder)
    }

    try {
      const res = await fetch(editingImage ? `/api/gallery?id=${editingImage.id}` : "/api/gallery", {
        method: editingImage ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      })

      if (res.ok) {
        toast.success(editingImage ? "Güncellendi" : "Eklendi")
        setIsDialogOpen(false)
        setEditingImage(null)
        setFormData({ url: "", alt: "", displayOrder: "0", hidden: false })
        setPreviewUrl("")
        setSelectedFile(null)
        fetchImages()
      }
    } catch (error) {
      toast.error("Bir hata oluştu")
    }
  }

  const handleToggleHidden = async (img: GalleryImage) => {
    try {
      const res = await fetch(`/api/gallery?id=${img.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ hidden: !img.hidden })
      })
      if (res.ok) {
        toast.success(img.hidden ? "Görsel gösterildi" : "Görsel gizlendi")
        fetchImages()
      }
    } catch (error) {
      toast.error("Hata oluştu")
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm("Bu görseli silmek istediğinize emin misiniz?")) return
    try {
      const res = await fetch(`/api/gallery?id=${id}`, { method: "DELETE" })
      if (res.ok) {
        toast.success("Silindi")
        fetchImages()
      }
    } catch (error) {
      toast.error("Silinemedi")
    }
  }

  if (!isVerified) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/30">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <Shield className="h-12 w-12 text-primary mx-auto mb-4" />
            <CardTitle>Galeri Yönetimi Girişi</CardTitle>
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
          <h1 className="text-2xl font-serif font-bold flex items-center gap-2">
            Galeri Yönetimi
          </h1>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => router.push("/admin")}>
              <FolderOpen className="mr-2 h-4 w-4" />
              Menü Yönetimi
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
          <h2 className="text-xl font-bold">Galeri Görselleri</h2>
          <Button onClick={() => { setEditingImage(null); setFormData({ url: "", alt: "", displayOrder: "0", hidden: false }); setPreviewUrl(""); setSelectedFile(null); setIsDialogOpen(true) }}>
            <Plus className="mr-2 h-4 w-4" /> Yeni Görsel Ekle
          </Button>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin" /></div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {images.map(img => (
              <Card key={img.id} className={`overflow-hidden group ${img.hidden ? "opacity-60" : ""}`}>
                <div className="relative aspect-square">
                  <Image src={img.url} alt={img.alt || ""} fill className="object-cover" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <Button size="icon" variant="secondary" onClick={() => { setEditingImage(img); setFormData({ url: img.url, alt: img.alt || "", displayOrder: img.displayOrder.toString(), hidden: img.hidden }); setPreviewUrl(img.url); setIsDialogOpen(true) }}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button size="icon" variant={img.hidden ? "default" : "secondary"} onClick={() => handleToggleHidden(img)}>
                      {img.hidden ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                    </Button>
                    <Button size="icon" variant="destructive" onClick={() => handleDelete(img.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="p-2 text-xs text-center border-t truncate">{img.alt || "Resim"}</div>
              </Card>
            ))}
          </div>
        )}

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent>
            <DialogHeader><DialogTitle>{editingImage ? "Görseli Düzenle" : "Yeni Görsel Ekle"}</DialogTitle></DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex flex-col items-center gap-4">
                <div className="relative w-40 h-40 border-2 border-dashed rounded-lg overflow-hidden flex items-center justify-center">
                  {previewUrl ? <Image src={previewUrl} alt="Preview" fill className="object-cover" /> : <ImageIcon className="h-12 w-12 text-muted-foreground" />}
                </div>
                <Input type="file" onChange={handleFileSelect} className="max-w-[200px]" />
              </div>
              <div><Label>Açıklama (alt)</Label><Input value={formData.alt} onChange={e => setFormData({...formData, alt: e.target.value})} /></div>
              <div><Label>Sıralama</Label><Input type="number" value={formData.displayOrder} onChange={e => setFormData({...formData, displayOrder: e.target.value})} /></div>
              <Button type="submit" className="w-full" disabled={uploading}>{uploading ? <Loader2 className="mr-2 animate-spin" /> : "Kaydet"}</Button>
            </form>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  )
}
