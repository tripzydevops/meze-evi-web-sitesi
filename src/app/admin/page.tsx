"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "sonner"
import { Loader2, Plus, Pencil, Trash2, AlertCircle, LogOut, Upload, X, Home, FolderOpen, Eye, EyeOff, Mail, MapPin, Phone, Clock, Shield, ImageIcon, Star } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import Image from "next/image"
// LucideIcons map for dynamic icon rendering
const LucideIconMap: Record<string, React.ComponentType<any>> = {
  MapPin,
  Phone,
  Mail,
  Clock,
  Shield,
  Home,
  FolderOpen,
  Eye,
  EyeOff,
  Trash2,
  Pencil,
  Plus,
  Loader2,
  AlertCircle,
  LogOut,
  Upload,
  X,
  ImageIcon,
  Star
}

interface Category {
  id: number
  name: string
  displayOrder: number
  hidden: boolean
}

interface MenuItem {
  id: number
  categoryId: number
  name: string
  description: string | null
  price: string
  imageUrl: string | null
  popular: boolean
  hidden: boolean
  servingSize?: string | null
  category?: {
    id: number
    name: string
  }
}

interface ContactInfo {
  id: number
  type: string
  title: string
  content: string
  subContent: string | null
  icon: string
  displayOrder: number
  hidden: boolean
}

interface ContactFormData {
  type: string
  title: string
  content: string
  subContent: string
  icon: string
  displayOrder: string
}



interface DeleteConfirmation {
  isOpen: boolean
  title: string
  description: string
  onConfirm: () => void
}

interface FormData {
  name: string
  description: string
  price: string
  servingSize: string
  imageUrl: string
  categoryId: string
  popular: boolean
  hidden: boolean
  newCategoryName?: string
}

export default function AdminPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [categories, setCategories] = useState<Category[]>([])
  const [menuItems, setMenuItems] = useState<MenuItem[]>([])
  const [contactInfos, setContactInfos] = useState<ContactInfo[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false)
  const [isContactDialogOpen, setIsContactDialogOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [editingContact, setEditingContact] = useState<ContactInfo | null>(null)
  const [deleteConfirmation, setDeleteConfirmation] = useState<DeleteConfirmation>({
    isOpen: false,
    title: "",
    description: "",
    onConfirm: () => {}
  })
  const [formData, setFormData] = useState<FormData>({
    name: "",
    description: "",
    price: "",
    servingSize: "",
    imageUrl: "",
    categoryId: "",
    popular: false,
    hidden: false,
    newCategoryName: ""
  })
  const [categoryFormData, setCategoryFormData] = useState({
    name: "",
    displayOrder: ""
  })
  const [contactFormData, setContactFormData] = useState<ContactFormData>({
    type: "address",
    title: "",
    content: "",
    subContent: "",
    icon: "MapPin",
    displayOrder: "0"
  })
  const [uploadingImage, setUploadingImage] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string>("")
  const [isCreatingNewCategory, setIsCreatingNewCategory] = useState(false)

  const [isPasswordVerified, setIsPasswordVerified] = useState(false)
  const [passwordInput, setPasswordInput] = useState("")

  // Check if user is admin
  const isAdmin = true 

  useEffect(() => {
    const savedAuth = localStorage.getItem("admin_auth")
    if (savedAuth === "true") {
      setIsPasswordVerified(true)
    }
  }, [])

  useEffect(() => {
    console.log("Admin Panel v1.0.3 - Password Protection Active")
  }, [])

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (passwordInput === "1234") {
      setIsPasswordVerified(true)
      // Set local storage for UI state
      localStorage.setItem("admin_auth", "true")
      // Set cookie for middleware protection
      document.cookie = `admin_auth=1234; path=/; max-age=${60 * 60 * 24 * 7}; samesite=strict`
      
      toast.success("Giriş başarılı")
      fetchData()
    } else {
      toast.error("Hatalı şifre")
    }
  }

  const handleSignOut = async () => {
    localStorage.removeItem("admin_auth")
    document.cookie = "admin_auth=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT"
    window.location.href = "/"
  }

  const fetchData = async () => {
    // Only fetch if verified
    if (!isPasswordVerified && localStorage.getItem("admin_auth") !== "true") return
    
    setIsLoading(true)
    try {
      const [categoriesRes, itemsRes, contactRes] = await Promise.all([
        fetch("/api/categories?showHidden=true"),
        fetch("/api/menu-items?showHidden=true"),
        fetch("/api/contact-info?showHidden=true")
      ])

      if (categoriesRes.ok) {
        const categoriesData = await categoriesRes.json()
        setCategories(categoriesData)
      }

      if (itemsRes.ok) {
        const itemsData = await itemsRes.json()
        setMenuItems(itemsData)
      }

      if (contactRes.ok) {
        const contactData = await contactRes.json()
        setContactInfos(contactData)
      }
    } catch (error) {
      toast.error("Veriler yüklenirken hata oluştu")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (isPasswordVerified || localStorage.getItem("admin_auth") === "true") {
      fetchData()
    }
  }, [isPasswordVerified])




  const handleToggleHidden = async (category: Category) => {
    try {
      const response = await fetch(`/api/categories?id=${category.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ hidden: !category.hidden })
      })

      if (response.ok) {
        toast.success(category.hidden ? "Kategori gösterildi" : "Kategori gizlendi")
        setCategories(prev => prev.map(c => 
          c.id === category.id ? { ...c, hidden: !c.hidden } : c
        ))
        fetchData()
      } else {
        const error = await response.json()
        toast.error(error.error || "İşlem başarısız")
      }
    } catch (error) {
      toast.error("Bir hata oluştu")
    }
  }

  const handleToggleMenuItemHidden = async (item: MenuItem) => {
    try {
      const response = await fetch(`/api/menu-items?id=${item.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ hidden: !item.hidden })
      })

      if (response.ok) {
        toast.success(item.hidden ? "Öğe gösterildi" : "Öğe gizlendi")
        setMenuItems(prev => prev.map(m => 
          m.id === item.id ? { ...m, hidden: !m.hidden } : m
        ))
        fetchData()
      } else {
        const error = await response.json()
        toast.error(error.error || "İşlem başarısız")
      }
    } catch (error) {
      toast.error("Bir hata oluştu")
    }
  }

  const handleToggleContactHidden = async (contact: ContactInfo) => {
    try {
      const response = await fetch(`/api/contact-info?id=${contact.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ hidden: !contact.hidden })
      })

      if (response.ok) {
        toast.success(contact.hidden ? "İletişim bilgisi gösterildi" : "İletişim bilgisi gizlendi")
        fetchData()
      } else {
        const error = await response.json()
        toast.error(error.error || "İşlem başarısız")
      }
    } catch (error) {
      toast.error("Bir hata oluştu")
    }
  }

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      price: "",
      servingSize: "",
      imageUrl: "",
      categoryId: "",
      popular: false,
      hidden: false,
      newCategoryName: ""
    })
    setEditingItem(null)
    setSelectedFile(null)
    setPreviewUrl("")
    setIsCreatingNewCategory(false)
  }

  const resetCategoryForm = () => {
    setCategoryFormData({
      name: "",
      displayOrder: ""
    })
    setEditingCategory(null)
  }

  const resetContactForm = () => {
    setContactFormData({
      type: "address",
      title: "",
      content: "",
      subContent: "",
      icon: "MapPin",
      displayOrder: "0"
    })
    setEditingContact(null)
  }

  const openAddDialog = () => {
    resetForm()
    setIsDialogOpen(true)
  }

  const openEditDialog = (item: MenuItem) => {
    setEditingItem(item)
    setFormData({
      name: item.name,
      description: item.description || "",
      price: item.price || "",
      servingSize: item.servingSize || "",
      imageUrl: item.imageUrl || "",
      categoryId: item.categoryId.toString(),
      popular: item.popular,
      hidden: item.hidden,
      newCategoryName: ""
    })
    setPreviewUrl(item.imageUrl || "")
    setIsCreatingNewCategory(false)
    setIsDialogOpen(true)
  }

  const openAddCategoryDialog = () => {
    resetCategoryForm()
    setIsCategoryDialogOpen(true)
  }

  const openEditCategoryDialog = (category: Category) => {
    setEditingCategory(category)
    setCategoryFormData({
      name: category.name,
      displayOrder: category.displayOrder.toString()
    })
    setIsCategoryDialogOpen(true)
  }

  const openAddContactDialog = () => {
    resetContactForm()
    setIsContactDialogOpen(true)
  }

  const openEditContactDialog = (contact: ContactInfo) => {
    setEditingContact(contact)
    setContactFormData({
      type: contact.type,
      title: contact.title,
      content: contact.content,
      subContent: contact.subContent || "",
      icon: contact.icon,
      displayOrder: contact.displayOrder.toString()
    })
    setIsContactDialogOpen(true)
  }

  const handleCategorySubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!categoryFormData.name.trim()) {
      toast.error("Kategori adı zorunludur")
      return
    }

    try {
      const payload = {
        name: categoryFormData.name.trim(),
        displayOrder: categoryFormData.displayOrder ? parseInt(categoryFormData.displayOrder) : 0
      }

      let response
      if (editingCategory) {
        response = await fetch(`/api/categories?id=${editingCategory.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        })
      } else {
        response = await fetch("/api/categories", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        })
      }

      if (response.ok) {
        toast.success(editingCategory ? "Kategori güncellendi" : "Kategori eklendi")
        setIsCategoryDialogOpen(false)
        resetCategoryForm()
        fetchData()
      } else {
        const error = await response.json()
        toast.error(error.error || "İşlem başarısız")
      }
    } catch (error) {
      toast.error("Bir hata oluştu")
    }
  }

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!contactFormData.title.trim() || !contactFormData.content.trim()) {
      toast.error("Başlık ve içerik zorunludur")
      return
    }

    try {
      const payload = {
        type: contactFormData.type,
        title: contactFormData.title.trim(),
        content: contactFormData.content.trim(),
        subContent: contactFormData.subContent.trim() || null,
        icon: contactFormData.icon,
        displayOrder: contactFormData.displayOrder ? parseInt(contactFormData.displayOrder) : 0
      }

      let response
      if (editingContact) {
        response = await fetch(`/api/contact-info?id=${editingContact.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        })
      } else {
        response = await fetch("/api/contact-info", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        })
      }

      if (response.ok) {
        toast.success(editingContact ? "İletişim bilgisi güncellendi" : "İletişim bilgisi eklendi")
        setIsContactDialogOpen(false)
        resetContactForm()
        fetchData()
      } else {
        const error = await response.json()
        toast.error(error.error || "İşlem başarısız")
      }
    } catch (error) {
      toast.error("Bir hata oluştu")
    }
  }

  const handleDeleteCategory = async (id: number) => {
    setDeleteConfirmation({
      isOpen: true,
      title: "Kategoriyi Sil",
      description: "Bu kategoriyi kalıcı olarak silmek istediğinizden emin misiniz?",
      onConfirm: async () => {
        try {
          const response = await fetch(`/api/categories?id=${id}`, {
            method: "DELETE"
          })

          if (response.ok) {
            toast.success("Kategori silindi")
            fetchData()
          } else {
            const error = await response.json()
            toast.error(error.error || "Silme işlemi başarısız")
          }
        } catch (error) {
          toast.error("Bir hata oluştu")
        } finally {
          setDeleteConfirmation({ isOpen: false, title: "", description: "", onConfirm: () => {} })
        }
      }
    })
  }

  const handleDeleteContact = async (id: number) => {
    setDeleteConfirmation({
      isOpen: true,
      title: "İletişim Bilgisini Sil",
      description: "Bu iletişim bilgisini silmek istediğinizden emin misiniz?",
      onConfirm: async () => {
        try {
          const response = await fetch(`/api/contact-info?id=${id}`, {
            method: "DELETE"
          })

          if (response.ok) {
            toast.success("İletişim bilgisi silindi")
            fetchData()
          } else {
            const error = await response.json()
            toast.error(error.error || "Silme işlemi başarısız")
          }
        } catch (error) {
          toast.error("Bir hata oluştu")
        } finally {
          setDeleteConfirmation({ isOpen: false, title: "", description: "", onConfirm: () => {} })
        }
      }
    })
  }

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Lütfen bir resim dosyası seçin")
      return
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Dosya boyutu 5MB'dan küçük olmalıdır")
      return
    }

    setSelectedFile(file)
    
    // Create preview
    const reader = new FileReader()
    reader.onloadend = () => {
      setPreviewUrl(reader.result as string)
    }
    reader.readAsDataURL(file)
  }

  const handleUploadImage = async () => {
    if (!selectedFile) return null

    setUploadingImage(true)
    try {
      const formData = new FormData()
      formData.append("file", selectedFile)

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

  const handleRemoveImage = () => {
    setSelectedFile(null)
    setPreviewUrl("")
    setFormData({ ...formData, imageUrl: "" })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name) {
      toast.error("Lütfen zorunlu alanları doldurun")
      return
    }

    // Validate category selection or new category name
    if (!isCreatingNewCategory && !formData.categoryId) {
      toast.error("Lütfen bir kategori seçin veya yeni kategori oluşturun")
      return
    }

    if (isCreatingNewCategory && !formData.newCategoryName?.trim()) {
      toast.error("Lütfen yeni kategori adı girin")
      return
    }

    try {
      let imageUrl = formData.imageUrl
      let categoryId = formData.categoryId

      // Upload image if a new file is selected
      if (selectedFile) {
        const uploadedUrl = await handleUploadImage()
        if (uploadedUrl) {
          imageUrl = uploadedUrl
        } else {
          return // Upload failed
        }
      }

      // Create new category if needed
      if (isCreatingNewCategory && formData.newCategoryName?.trim()) {
        const categoryResponse = await fetch("/api/categories", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: formData.newCategoryName.trim(),
            displayOrder: 0
          })
        })

        if (categoryResponse.ok) {
          const newCategory = await categoryResponse.json()
          categoryId = newCategory.id.toString()
          toast.success("Yeni kategori oluşturuldu")
        } else {
          const error = await categoryResponse.json()
          toast.error(error.error || "Kategori oluşturulamadı")
          return
        }
      }

      const payload = {
        name: formData.name,
        description: formData.description || null,
        price: formData.price || null,
        servingSize: formData.servingSize || null,
        imageUrl: imageUrl || null,
        categoryId: parseInt(categoryId),
        popular: formData.popular
      }

      let response
      if (editingItem) {
        response = await fetch(`/api/menu-items?id=${editingItem.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        })
      } else {
        response = await fetch("/api/menu-items", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        })
      }

      if (response.ok) {
        toast.success(editingItem ? "Menü öğesi güncellendi" : "Menü öğesi eklendi")
        setIsDialogOpen(false)
        resetForm()
        fetchData()
      } else {
        const error = await response.json()
        toast.error(error.error || "İşlem başarısız")
      }
    } catch (error) {
      toast.error("Bir hata oluştu")
    }
  }

  const handleDelete = async (id: number) => {
    setDeleteConfirmation({
      isOpen: true,
      title: "Menü Öğesini Sil",
      description: "Bu öğeyi silmek istediğinizden emin misiniz?",
      onConfirm: async () => {
        try {
          const response = await fetch(`/api/menu-items?id=${id}`, {
            method: "DELETE"
          })

          if (response.ok) {
            toast.success("Menü öğesi silindi")
            fetchData()
          } else {
            toast.error("Silme işlemi başarısız")
          }
        } catch (error) {
          toast.error("Bir hata oluştu")
        } finally {
          setDeleteConfirmation({ isOpen: false, title: "", description: "", onConfirm: () => {} })
        }
      }
    })
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

  const groupedItems = categories.map(category => ({
    category,
    items: menuItems.filter(item => Number(item.categoryId) === Number(category.id))
  }))

  const contactTypeOptions = [
    { value: "address", label: "Adres", icon: "MapPin" },
    { value: "phone", label: "Telefon", icon: "Phone" },
    { value: "email", label: "E-posta", icon: "Mail" },
    { value: "hours", label: "Çalışma Saatleri", icon: "Clock" }
  ]

  return (
    <div className="min-h-screen bg-muted/30">
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-serif font-bold flex items-center gap-2">
              Yönetim Paneli 
              <span className="text-[10px] bg-red-500 text-white px-1.5 py-0.5 rounded-full">v1.0.4</span>
            </h1>
            <p className="text-sm text-muted-foreground">Hoş geldiniz, Yönetici</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" asChild>
              <a href="/admin/homepage">
                <Home className="mr-2 h-4 w-4" />
                Ana Sayfa
              </a>
            </Button>
            <Button variant="outline" asChild>
              <a href="/admin/gallery">
                <ImageIcon className="mr-2 h-4 w-4" />
                Galeri
              </a>
            </Button>
            <Button variant="outline" asChild>
              <a href="/admin/testimonials">
                <Star className="mr-2 h-4 w-4" />
                Yorumlar
              </a>
            </Button>
            <Button variant="outline" onClick={handleSignOut}>
              <LogOut className="mr-2 h-4 w-4" />
              Çıkış
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="menu-items" className="w-full">
          <TabsList className="grid w-full max-w-2xl mx-auto grid-cols-3 mb-8">
            <TabsTrigger value="menu-items">Menü Öğeleri</TabsTrigger>
            <TabsTrigger value="categories">Kategoriler</TabsTrigger>
            <TabsTrigger value="contact">İletişim Bilgileri</TabsTrigger>
          </TabsList>

          <TabsContent value="menu-items">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-serif font-bold">Menü Öğeleri</h2>
              <Button onClick={openAddDialog}>
                <Plus className="mr-2 h-4 w-4" />
                Yeni Öğe Ekle
              </Button>
            </div>

            {groupedItems.map(({ category, items }) => (
              <Card key={category.id} className="mb-6">
                <CardHeader>
                  <CardTitle className="text-lg">{category.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  {items.length === 0 ? (
                    <p className="text-muted-foreground text-sm">Bu kategoride öğe yok</p>
                  ) : (
                    <div className="space-y-3">
                      {items.map(item => (
                        <div 
                          key={item.id} 
                          className={`flex items-center gap-4 p-3 border rounded-lg hover:bg-muted/50 transition-colors ${item.hidden ? "opacity-60 border-dashed bg-muted/20" : ""}`}
                        >
                          {item.imageUrl && (
                            <div className="relative h-16 w-16 flex-shrink-0">
                              <Image
                                src={item.imageUrl}
                                alt={item.name}
                                fill
                                className="object-cover rounded"
                              />
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <h3 className="font-semibold truncate">{item.name}</h3>
                              {item.popular && (
                                <span className="text-xs bg-primary text-white px-2 py-0.5 rounded">
                                  Popüler
                                </span>
                              )}
                            </div>
                            {item.description && (
                              <p className="text-sm text-muted-foreground line-clamp-1">
                                {item.description}
                              </p>
                            )}
                            <div className="flex items-center gap-2 mt-1">
                              <p className="text-sm font-bold text-primary">{item.price}</p>
                              {item.servingSize && (
                                <>
                                  <span className="text-xs text-muted-foreground">•</span>
                                  <p className="text-xs text-muted-foreground">{item.servingSize}</p>
                                </>
                              )}
                            </div>
                          </div>
                            <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => openEditDialog(item)}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleToggleMenuItemHidden(item)}
                              title={item.hidden ? "Göster" : "Gizle"}
                              className={item.hidden ? "text-primary hover:text-primary" : "text-muted-foreground hover:text-destructive"}
                            >
                              {item.hidden ? (
                                <Eye className="h-4 w-4" />
                              ) : (
                                <EyeOff className="h-4 w-4" />
                              )}
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDelete(item.id)}
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="categories">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-serif font-bold">Kategoriler</h2>
              <Button onClick={openAddCategoryDialog}>
                <Plus className="mr-2 h-4 w-4" />
                Yeni Kategori Ekle
              </Button>
            </div>

            <div className="grid gap-4">
              {categories.length === 0 ? (
                <Card>
                  <CardContent className="py-12 text-center">
                    <FolderOpen className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-muted-foreground">Henüz kategori eklenmemiş</p>
                  </CardContent>
                </Card>
              ) : (
                categories.map(category => {
                  const itemCount = menuItems.filter(item => Number(item.categoryId) === Number(category.id)).length
                  return (
                    <Card key={category.id} className={category.hidden ? "opacity-60 border-dashed" : ""}>
                      <CardContent className="flex items-center justify-between p-6">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold text-lg">{category.name}</h3>
                            {category.hidden && (
                              <span className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded">
                                Gizli
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">
                            Sıralama: {category.displayOrder} • {itemCount} öğe
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleToggleHidden(category)}
                            title={category.hidden ? "Göster" : "Gizle"}
                          >
                            {category.hidden ? (
                              <Eye className="h-4 w-4" />
                            ) : (
                              <EyeOff className="h-4 w-4" />
                            )}
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openEditCategoryDialog(category)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            className="!text-white hover:opacity-90"
                            style={{ backgroundColor: '#dc2626', color: 'white' }}
                            onClick={() => handleDeleteCategory(category.id)}
                            title="Kalıcı olarak sil"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })
              )}
            </div>
          </TabsContent>

          <TabsContent value="contact">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-serif font-bold">İletişim Bilgileri</h2>
              <Button onClick={openAddContactDialog}>
                <Plus className="mr-2 h-4 w-4" />
                Yeni İletişim Bilgisi Ekle
              </Button>
            </div>

            <div className="grid gap-4">
              {contactInfos.length === 0 ? (
                <Card>
                  <CardContent className="py-12 text-center">
                    <Mail className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-muted-foreground">Henüz iletişim bilgisi eklenmemiş</p>
                  </CardContent>
                </Card>
              ) : (
                contactInfos.map(contact => {
                  const IconComponent = LucideIconMap[contact.icon] || Mail
                  return (
                    <Card key={contact.id} className={contact.hidden ? "opacity-60 border-dashed" : ""}>
                      <CardContent className="flex items-center gap-4 p-6">
                        <div className="inline-flex items-center justify-center w-12 h-12 bg-primary/10 rounded-full flex-shrink-0">
                          <IconComponent className="w-6 h-6 text-primary" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold text-lg">{contact.title}</h3>
                            {contact.hidden && (
                              <span className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded">
                                Gizli
                              </span>
                            )}
                          </div>
                          <p className="text-sm font-medium">{contact.content}</p>
                          {contact.subContent && (
                            <p className="text-sm text-muted-foreground">{contact.subContent}</p>
                          )}
                          <p className="text-xs text-muted-foreground mt-1">
                            Sıralama: {contact.displayOrder} • Tip: {contact.type}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleToggleContactHidden(contact)}
                            title={contact.hidden ? "Göster" : "Gizle"}
                          >
                            {contact.hidden ? (
                              <Eye className="h-4 w-4" />
                            ) : (
                              <EyeOff className="h-4 w-4" />
                            )}
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openEditContactDialog(contact)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteContact(contact.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })
              )}
            </div>
          </TabsContent>


        </Tabs>
      </main>

      {/* Menu Item Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingItem ? "Menü Öğesini Düzenle" : "Yeni Menü Öğesi Ekle"}
            </DialogTitle>
            <DialogDescription>
              Menü öğesi bilgilerini girin. * ile işaretli alanlar zorunludur.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Kategori *</Label>
                <div className="space-y-3">
                  <div className="flex items-center gap-4">
                    <Button
                      type="button"
                      variant={!isCreatingNewCategory ? "default" : "outline"}
                      size="sm"
                      onClick={() => {
                        setIsCreatingNewCategory(false)
                        setFormData({ ...formData, newCategoryName: "" })
                      }}
                    >
                      Mevcut Kategori Seç
                    </Button>
                    <Button
                      type="button"
                      variant={isCreatingNewCategory ? "default" : "outline"}
                      size="sm"
                      onClick={() => {
                        setIsCreatingNewCategory(true)
                        setFormData({ ...formData, categoryId: "" })
                      }}
                    >
                      Yeni Kategori Oluştur
                    </Button>
                  </div>

                  {!isCreatingNewCategory ? (
                    <Select
                      value={formData.categoryId}
                      onValueChange={(value) => setFormData({ ...formData, categoryId: value })}
                      required={!isCreatingNewCategory}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Kategori seçin" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map(cat => (
                          <SelectItem key={cat.id} value={cat.id.toString()}>
                            {cat.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    <Input
                      value={formData.newCategoryName || ""}
                      onChange={(e) => setFormData({ ...formData, newCategoryName: e.target.value })}
                      placeholder="Yeni kategori adı girin"
                      required={isCreatingNewCategory}
                    />
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="name">Adı *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Haydari"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Açıklama</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Süzme yoğurt, maydonoz ve sarımsak..."
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="price">Fiyat</Label>
                <Input
                  id="price"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  placeholder="₺55 (opsiyonel)"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="servingSize">Porsiyon Boyutu</Label>
                <Input
                  id="servingSize"
                  list="serving-size-options"
                  value={formData.servingSize}
                  onChange={(e) => setFormData({ ...formData, servingSize: e.target.value })}
                  placeholder="500g, 1kg, 5 adet vb."
                />
                <datalist id="serving-size-options">
                  <option value="100g" />
                  <option value="200g" />
                  <option value="500g" />
                  <option value="1kg" />
                </datalist>
                <p className="text-xs text-muted-foreground">
                  Açılır menüden seçin veya manuel olarak yazın (örn: 500g, 1kg, 5 adet)
                </p>
              </div>

              <div className="space-y-2">
                <Label>Resim</Label>
                <div className="space-y-3">
                  {previewUrl ? (
                    <div className="relative w-full h-48 border rounded-lg overflow-hidden">
                      <Image
                        src={previewUrl}
                        alt="Preview"
                        fill
                        className="object-cover"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute top-2 right-2"
                        onClick={handleRemoveImage}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <div className="border-2 border-dashed rounded-lg p-8 text-center">
                      <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground mb-2">
                        Resim yüklemek için tıklayın
                      </p>
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={handleFileSelect}
                        className="cursor-pointer"
                      />
                    </div>
                  )}
                  
                  <div className="text-xs text-muted-foreground">
                    Veya resim URL'si girin:
                  </div>
                  <Input
                    id="imageUrl"
                    value={formData.imageUrl}
                    onChange={(e) => {
                      setFormData({ ...formData, imageUrl: e.target.value })
                      if (e.target.value) {
                        setPreviewUrl(e.target.value)
                        setSelectedFile(null)
                      }
                    }}
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
              </div>

              <div className="flex flex-wrap gap-6">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="popular"
                    checked={formData.popular}
                    onCheckedChange={(checked) => 
                      setFormData({ ...formData, popular: checked as boolean })
                    }
                  />
                  <Label htmlFor="popular" className="font-normal cursor-pointer">
                    Popüler olarak işaretle
                  </Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="hidden"
                    checked={formData.hidden}
                    onCheckedChange={(checked) => 
                      setFormData({ ...formData, hidden: checked as boolean })
                    }
                  />
                  <Label htmlFor="hidden" className="font-normal cursor-pointer text-destructive font-medium">
                    Gizle (Müşteriler görmesin)
                  </Label>
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsDialogOpen(false)
                  resetForm()
                }}
              >
                İptal
              </Button>
              <Button type="submit" disabled={uploadingImage}>
                {uploadingImage ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Yükleniyor...
                  </>
                ) : (
                  editingItem ? "Güncelle" : "Ekle"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Category Dialog */}
      <Dialog open={isCategoryDialogOpen} onOpenChange={setIsCategoryDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingCategory ? "Kategoriyi Düzenle" : "Yeni Kategori Ekle"}
            </DialogTitle>
            <DialogDescription>
              Kategori bilgilerini girin.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCategorySubmit}>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="categoryName">Kategori Adı *</Label>
                <Input
                  id="categoryName"
                  value={categoryFormData.name}
                  onChange={(e) => setCategoryFormData({ ...categoryFormData, name: e.target.value })}
                  placeholder="Soğuk Mezeler"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="displayOrder">Sıralama</Label>
                <Input
                  id="displayOrder"
                  type="number"
                  value={categoryFormData.displayOrder}
                  onChange={(e) => setCategoryFormData({ ...categoryFormData, displayOrder: e.target.value })}
                  placeholder="0"
                />
                <p className="text-xs text-muted-foreground">
                  Kategorilerin görüntülenme sırası (küçükten büyüğe)
                </p>
              </div>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsCategoryDialogOpen(false)
                  resetCategoryForm()
                }}
              >
                İptal
              </Button>
              <Button type="submit">
                {editingCategory ? "Güncelle" : "Ekle"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Contact Info Dialog */}
      <Dialog open={isContactDialogOpen} onOpenChange={setIsContactDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingContact ? "İletişim Bilgisini Düzenle" : "Yeni İletişim Bilgisi Ekle"}
            </DialogTitle>
            <DialogDescription>
              İletişim bilgilerini girin.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleContactSubmit}>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="contactType">Tip *</Label>
                <Select
                  value={contactFormData.type}
                  onValueChange={(value) => {
                    const option = contactTypeOptions.find(opt => opt.value === value)
                    setContactFormData({ 
                      ...contactFormData, 
                      type: value,
                      icon: option?.icon || "MapPin"
                    })
                  }}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {contactTypeOptions.map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="contactTitle">Başlık *</Label>
                <Input
                  id="contactTitle"
                  value={contactFormData.title}
                  onChange={(e) => setContactFormData({ ...contactFormData, title: e.target.value })}
                  placeholder="Adres"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="contactContent">İçerik *</Label>
                <Input
                  id="contactContent"
                  value={contactFormData.content}
                  onChange={(e) => setContactFormData({ ...contactFormData, content: e.target.value })}
                  placeholder="İstanbul, Türkiye"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="contactSubContent">Alt İçerik</Label>
                <Input
                  id="contactSubContent"
                  value={contactFormData.subContent}
                  onChange={(e) => setContactFormData({ ...contactFormData, subContent: e.target.value })}
                  placeholder="Şişli / İstanbul"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="contactDisplayOrder">Sıralama</Label>
                <Input
                  id="contactDisplayOrder"
                  type="number"
                  value={contactFormData.displayOrder}
                  onChange={(e) => setContactFormData({ ...contactFormData, displayOrder: e.target.value })}
                  placeholder="0"
                />
              </div>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsContactDialogOpen(false)
                  resetContactForm()
                }}
              >
                İptal
              </Button>
              <Button type="submit">
                {editingContact ? "Güncelle" : "Ekle"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteConfirmation.isOpen} onOpenChange={(open) => {
        if (!open) {
          setDeleteConfirmation({ isOpen: false, title: "", description: "", onConfirm: () => {} })
        }
      }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{deleteConfirmation.title}</DialogTitle>
            <DialogDescription>{deleteConfirmation.description}</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteConfirmation({ isOpen: false, title: "", description: "", onConfirm: () => {} })}
            >
              İptal
            </Button>
            <Button
              variant="destructive"
              onClick={() => deleteConfirmation.onConfirm()}
            >
              Sil
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}