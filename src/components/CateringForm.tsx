"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { toast } from "sonner"
import { Loader2, Send, Calendar, Users, Mail, Phone, User } from "lucide-react"

export default function CateringForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    eventDate: "",
    guestCount: "",
    message: ""
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch("/api/catering", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        toast.success("Talebiniz başarıyla alındı! En kısa sürede sizinle iletişime geçeceğiz.")
        setFormData({
          fullName: "",
          email: "",
          phone: "",
          eventDate: "",
          guestCount: "",
          message: ""
        })
      } else {
        let errorMessage = "Bir hata oluştu. Lütfen tekrar deneyin.";
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || errorData.detail || errorMessage;
          console.error("Catering Submission Error:", errorData);
        } catch (e) {
          console.error("Failed to parse error response:", e);
        }
        toast.error(errorMessage);
      }
    } catch (error) {
      toast.error("Bağlantı hatası oluştu.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  return (
    <Card className="border-primary/10 shadow-xl overflow-hidden bg-white">
      <div className="bg-primary px-6 py-4">
        <h3 className="text-white font-serif text-xl font-semibold flex items-center gap-2">
          <Send className="w-5 h-5" />
          Etkinlik Teklifi Alın
        </h3>
      </div>
      <CardContent className="p-6 md:p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="fullName" className="flex items-center gap-2">
                <User className="w-4 h-4 text-primary" />
                Ad Soyad *
              </Label>
              <Input
                id="fullName"
                name="fullName"
                required
                placeholder="Örn: Ahmet Yılmaz"
                value={formData.fullName}
                onChange={handleChange}
                className="bg-muted/30 focus-visible:ring-primary"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone" className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-primary" />
                Telefon *
              </Label>
              <Input
                id="phone"
                name="phone"
                required
                type="tel"
                placeholder="05xx xxx xx xx"
                value={formData.phone}
                onChange={handleChange}
                className="bg-muted/30 focus-visible:ring-primary"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-primary" />
                E-posta *
              </Label>
              <Input
                id="email"
                name="email"
                required
                type="email"
                placeholder="ahmet@email.com"
                value={formData.email}
                onChange={handleChange}
                className="bg-muted/30 focus-visible:ring-primary"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="eventDate" className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-primary" />
                Etkinlik Tarihi
              </Label>
              <Input
                id="eventDate"
                name="eventDate"
                type="date"
                value={formData.eventDate}
                onChange={handleChange}
                className="bg-muted/30 focus-visible:ring-primary"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="guestCount" className="flex items-center gap-2">
                <Users className="w-4 h-4 text-primary" />
                Kişi Sayısı
              </Label>
              <Input
                id="guestCount"
                name="guestCount"
                type="number"
                placeholder="Örn: 50"
                value={formData.guestCount}
                onChange={handleChange}
                className="bg-muted/30 focus-visible:ring-primary"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="message">Özel Notlarınız ve Tercihleriniz</Label>
            <Textarea
              id="message"
              name="message"
              placeholder="Hangi mezeleri tercih edersiniz? Ekstra bir isteğiniz var mı?"
              rows={4}
              value={formData.message}
              onChange={handleChange}
              className="bg-muted/30 focus-visible:ring-primary resize-none"
            />
          </div>

          <Button 
            type="submit" 
            disabled={isSubmitting}
            className="w-full bg-primary hover:bg-primary/90 text-lg py-6 h-auto"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Gönderiliyor...
              </>
            ) : (
              "Teklif İsteğini Gönder"
            )}
          </Button>
          <p className="text-xs text-center text-muted-foreground mt-2">
            * işaretli alanların doldurulması zorunludur.
          </p>
        </form>
      </CardContent>
    </Card>
  )
}
