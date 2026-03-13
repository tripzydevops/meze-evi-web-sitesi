"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { authClient } from "@/lib/auth-client"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"
import { FcGoogle } from "react-icons/fc"

export default function SignUpPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  })

  const handleGoogleSignUp = async () => {
    setIsLoading(true)
    try {
      const { error } = await authClient.signIn.social({
        provider: "google",
        callbackURL: "/"
      })
      if (error?.code) {
        toast.error("Google ile kayıt başarısız oldu")
      }
    } catch (error) {
      toast.error("Bir hata oluştu")
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (formData.password !== formData.confirmPassword) {
      toast.error("Şifreler eşleşmiyor")
      return
    }

    if (formData.password.length < 8) {
      toast.error("Şifre en az 8 karakter olmalıdır")
      return
    }

    setIsLoading(true)

    try {
      const { data, error } = await authClient.signUp.email({
        email: formData.email,
        password: formData.password,
        name: formData.name
      })

      if (error?.code) {
        const errorMap: Record<string, string> = {
          USER_ALREADY_EXISTS: "Bu e-posta adresi zaten kayıtlı"
        }
        toast.error(errorMap[error.code] || `Kayıt başarısız oldu: ${error.message || error.code}`)
        return
      }

      toast.success("Hesap oluşturuldu!")
      
      // Check if user should be promoted to admin
      const adminEmails = [
        "gulsahalver@hotmail.com",
        "bispecialmeze@gmail.com"
      ];
      
      if (adminEmails.includes(formData.email.toLowerCase().trim())) {
        try {
          // Get the bearer token that was just created
          const token = localStorage.getItem("bearer_token")
          
          if (token) {
            // Call the promote-admin API
            const response = await fetch("/api/users/promote-admin", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
              },
              body: JSON.stringify({ email: formData.email })
            })

            if (response.ok) {
              toast.success("Admin yetkisi verildi!")
              // Redirect to admin after promotion
              router.push("/admin")
              return
            }
          }
        } catch (error) {
          console.error("Admin promotion error:", error)
        }
      }

      // Redirect to homepage (user is already logged in after sign-up)
      router.push("/")
    } catch (error) {
      toast.error("Bir hata oluştu")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 px-4 py-12">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center items-center gap-3 mb-4">
            <Image
              src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/document-uploads/bi-special-logo-1760438834702.jpg"
              alt="Bi Special Chef Logo"
              width={50}
              height={50}
              className="object-contain rounded-full"
            />
            <Image
              src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/document-uploads/download-1760438706128.png"
              alt="Bi Special Text"
              width={140}
              height={40}
              className="object-contain"
            />
          </div>
          <CardTitle className="text-2xl font-bold text-center">Hesap Oluştur</CardTitle>
          <CardDescription className="text-center">
            Hesap oluşturmak için bilgilerinizi girin
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Ad Soyad</Label>
              <Input
                id="name"
                type="text"
                placeholder="Ad Soyad"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">E-posta</Label>
              <Input
                id="email"
                type="email"
                placeholder="ornek@email.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Şifre</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
                disabled={isLoading}
                autoComplete="off"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Şifre Tekrar</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                required
                disabled={isLoading}
                autoComplete="off"
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Hesap Oluştur
            </Button>
          </form>

          <div className="relative my-4 hidden">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">veya</span>
            </div>
          </div>

          <Button
            type="button"
            variant="outline"
            className="w-full hidden"
            onClick={handleGoogleSignUp}
            disabled={isLoading}
          >
            <FcGoogle className="mr-2 h-5 w-5" />
            Google ile Kayıt Ol
          </Button>

          <p className="text-center text-sm text-muted-foreground mt-4">
            Zaten hesabınız var mı?{" "}
            <Link href="/sign-in" className="text-primary hover:underline font-medium">
              Giriş Yap
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  )
}