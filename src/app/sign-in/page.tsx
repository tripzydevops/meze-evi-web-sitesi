"use client"

import { useState, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { authClient } from "@/lib/auth-client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"

function SignInForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isLoading, setIsLoading] = useState(false)
  const [isGoogleLoading, setIsGoogleLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const { data, error } = await authClient.signIn.email({
        email: formData.email,
        password: formData.password,
        rememberMe: formData.rememberMe,
        callbackURL: "/admin"
      })

      if (error?.code) {
        toast.error("Geçersiz e-posta veya şifre. Lütfen tekrar deneyin.")
        return
      }

      toast.success("Giriş başarılı!")
      const redirect = searchParams.get("redirect") || "/"
      router.push(redirect)
    } catch (error) {
      toast.error("Bir hata oluştu. Lütfen tekrar deneyin.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true)
    try {
      const { data, error } = await authClient.signIn.social({
        provider: "google",
        callbackURL: searchParams.get("redirect") || "/"
      })

      if (error?.code) {
        toast.error("Google ile giriş yapılırken hata oluştu")
        setIsGoogleLoading(false)
        return
      }
    } catch (error) {
      toast.error("Bir hata oluştu. Lütfen tekrar deneyin.")
      setIsGoogleLoading(false)
    }
  }

  return (
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
        <CardTitle className="text-2xl font-serif">Kullanıcı Girişi</CardTitle>
        <CardDescription>
          Hesabınıza giriş yapın
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <Button
            type="button"
            variant="outline"
            className="w-full hidden"
            onClick={handleGoogleSignIn}
            disabled={isGoogleLoading || isLoading}
          >
            {isGoogleLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
            )}
            Google ile Giriş Yap
          </Button>
          
          <div className="relative hidden">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                veya e-posta ile
              </span>
            </div>
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
              disabled={isLoading || isGoogleLoading}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Şifre</Label>
            <Input
              id="password"
              type="password"
              autoComplete="off"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
              disabled={isLoading || isGoogleLoading}
            />
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="remember"
              checked={formData.rememberMe}
              onCheckedChange={(checked) => 
                setFormData({ ...formData, rememberMe: checked as boolean })
              }
              disabled={isLoading || isGoogleLoading}
            />
            <Label 
              htmlFor="remember" 
              className="text-sm font-normal cursor-pointer"
            >
              Beni hatırla
            </Label>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <Button 
            type="submit" 
            className="w-full" 
            disabled={isLoading || isGoogleLoading}
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Giriş Yap
          </Button>
          <p className="text-sm text-center text-muted-foreground">
            Hesabınız yok mu?{" "}
            <Link 
              href="/sign-up" 
              className="text-primary hover:underline font-medium"
            >
              Kayıt olun
            </Link>
          </p>
        </CardFooter>
      </form>
    </Card>
  )
}

export default function SignInPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 px-4">
      <Suspense fallback={
        <Card className="w-full max-w-md">
          <CardContent className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </CardContent>
        </Card>
      }>
        <SignInForm />
      </Suspense>
    </div>
  )
}