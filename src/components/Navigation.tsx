"use client"

import Link from "next/link"
import Image from "next/image"
import { useState, useEffect } from "react"
import { Menu, X, Instagram } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useSession, authClient } from "@/lib/auth-client"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

export default function Navigation() {
  const { data: session, isPending, refetch } = useSession()
  const router = useRouter()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const handleSignOut = async () => {
    try {
      const { error } = await authClient.signOut()
      if (error?.code) {
        toast.error("Çıkış yapılırken hata oluştu")
        return
      }
      
      // Clear all auth data
      localStorage.removeItem("bearer_token")
      
      // Wait for session to refetch
      await refetch()
      
      // Force full page reload to clear all cached data
      window.location.href = "/"
    } catch (error) {
      console.error("Sign out error:", error)
      toast.error("Çıkış yapılırken hata oluştu")
    }
  }

  // Check if user is admin
  const isAdmin = session?.user?.role === "admin"

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <Image
              src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/document-uploads/bi-special-logo-1760438834702.jpg"
              alt="Bi Special Logo"
              width={50}
              height={50}
              className="object-contain rounded-full"
            />
            <Image
              src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/document-uploads/download-1760438706128.png"
              alt="Bi Special"
              width={140}
              height={0}
              style={{ height: 'auto' }}
              className="object-contain"
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link 
              href="/" 
              className="text-foreground hover:text-primary transition-colors font-medium"
            >
              Ana Sayfa
            </Link>
            <Link 
              href="/menu" 
              className="text-foreground hover:text-primary transition-colors font-medium"
            >
              Menü
            </Link>
            <Link 
              href="/hakkimizda" 
              className="text-foreground hover:text-primary transition-colors font-medium"
            >
              Hakkımızda
            </Link>
            <Link 
              href="/iletisim" 
              className="text-foreground hover:text-primary transition-colors font-medium"
            >
              İletişim
            </Link>
            <a
              href="https://www.instagram.com/bispecialmeze/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-foreground hover:text-primary transition-colors"
            >
              <Instagram className="w-5 h-5" />
            </a>
            
            {!isPending && (
              session?.user ? (
                <div className="flex items-center gap-2">
                  {isAdmin && (
                    <Link href="/admin">
                      <Button variant="outline" size="sm">
                        Yönetim
                      </Button>
                    </Link>
                  )}
                  <Button variant="outline" size="sm" onClick={handleSignOut}>
                    Çıkış
                  </Button>
                </div>
              ) : (
                <Link href="/sign-in">
                  <Button size="sm">
                    Giriş Yap
                  </Button>
                </Link>
              )
            )}
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden text-foreground"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t">
            <div className="flex flex-col space-y-4">
              <Link 
                href="/" 
                className="text-foreground hover:text-primary transition-colors font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                Ana Sayfa
              </Link>
              <Link 
                href="/menu" 
                className="text-foreground hover:text-primary transition-colors font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                Menü
              </Link>
              <Link 
                href="/hakkimizda" 
                className="text-foreground hover:text-primary transition-colors font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                Hakkımızda
              </Link>
              <Link 
                href="/iletisim" 
                className="text-foreground hover:text-primary transition-colors font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                İletişim
              </Link>
              <a
                href="https://www.instagram.com/bispecialmeze/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-foreground hover:text-primary transition-colors flex items-center gap-2"
              >
                <Instagram className="w-5 h-5" />
                Instagram
              </a>
              
              {!isPending && (
                session?.user ? (
                  <>
                    {isAdmin && (
                      <Link href="/admin" onClick={() => setMobileMenuOpen(false)}>
                        <Button variant="outline" size="sm" className="w-full">
                          Yönetim Paneli
                        </Button>
                      </Link>
                    )}
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full"
                      onClick={() => {
                        handleSignOut()
                        setMobileMenuOpen(false)
                      }}
                    >
                      Çıkış Yap
                    </Button>
                  </>
                ) : (
                  <Link href="/sign-in" onClick={() => setMobileMenuOpen(false)}>
                    <Button size="sm" className="w-full">
                      Giriş Yap
                    </Button>
                  </Link>
                )
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}