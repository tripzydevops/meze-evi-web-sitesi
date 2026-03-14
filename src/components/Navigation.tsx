"use client"

import Link from "next/link"
import Image from "next/image"
import { useState, useEffect } from "react"
import { Menu, X, ChevronRight, MapPin, Phone, Instagram, Facebook, Home, Info, Utensils, Shield, LogOut, Search } from "lucide-react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const router = useRouter()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [navSearch, setNavSearch] = useState("")

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (navSearch.trim()) {
      router.push(`/menu?search=${encodeURIComponent(navSearch.trim())}`)
    }
  }

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 shrink-0 h-full py-2">
            <Image
              src="/brand/logo.jpg"
              alt="Bi Special Logo"
              width={60}
              height={60}
              className="w-[60px] h-[60px] object-contain rounded-full border-2 border-primary/20"
            />
            <div className="relative h-12 w-[160px]">
              <Image
                src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/document-uploads/download-1760438706128.png"
                alt="Bi Special"
                fill
                className="object-contain object-left"
              />
            </div>
          </Link>

          {/* Desktop Search & Contact (Utilization of space) */}
          <div className="hidden lg:flex items-center flex-1 max-w-xl mx-10 gap-8">
            {/* Search Bar */}
            <form onSubmit={handleSearch} className="relative w-full max-w-sm group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors cursor-pointer" onClick={handleSearch} />
              <Input
                placeholder="Lezzet ara..."
                value={navSearch}
                onChange={(e) => setNavSearch(e.target.value)}
                className="pl-9 bg-muted/40 border-none focus-visible:ring-1 focus-visible:ring-primary/20 h-9 text-sm"
              />
            </form>

            {/* Contact Info */}
            <div className="hidden xl:flex items-center gap-2 text-sm font-medium whitespace-nowrap">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                <Phone className="w-4 h-4 text-primary" />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] text-muted-foreground leading-none">Sipariş Hattı</span>
                <a href="tel:+905334344406" className="hover:text-primary transition-colors font-bold text-primary/80 tracking-tight">
                  +90 (533) 434 44 06
                </a>
              </div>
            </div>
          </div>

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
              href="/catering" 
              className="text-foreground hover:text-primary transition-colors font-medium"
            >
              Catering
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
            
            <Link href="/admin">
              <Button variant="outline" size="sm">
                Yönetim Paneli
              </Button>
            </Link>
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
                href="/catering" 
                className="text-foreground hover:text-primary transition-colors font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                Catering
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
              
              <Link href="/admin" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="outline" size="sm" className="w-full">
                  Yönetim Paneli
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}