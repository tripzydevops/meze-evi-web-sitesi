"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Loader2, Upload, X } from "lucide-react"
import Image from "next/image"
import { StyleControls } from "./StyleControls"

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
  imagePosition: string | null
}

interface HeroTabProps {
  heroData: HeroSection | null
  heroImage: { file: File | null, preview: string }
  uploadingImage: boolean
  onHeroUpdate: (e: React.FormEvent<HTMLFormElement>) => void
  onStyleChange: (field: 'titleStyle' | 'subtitleStyle', val: string) => void
  onGalleryOpen: () => void
  onImageSelect: (e: React.ChangeEvent<HTMLInputElement>) => void
  onImageClear: () => void
  onUrlChange: (url: string) => void
  onPositionChange: (pos: string) => void
}

export const HeroTab = ({
  heroData,
  heroImage,
  uploadingImage,
  onHeroUpdate,
  onStyleChange,
  onGalleryOpen,
  onImageSelect,
  onImageClear,
  onUrlChange,
  onPositionChange
}: HeroTabProps) => {
  if (!heroData) return null

  return (
    <Card>
      <CardHeader>
        <CardTitle>Hero Bölümü</CardTitle>
        <CardDescription>Ana sayfa hero bölümünü düzenleyin</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={onHeroUpdate} className="space-y-4">
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
              onChange={(val) => onStyleChange('titleStyle', val)} 
            />
            <StyleControls 
              prefix="Alt Başlık" 
              value={heroData.subtitleStyle || "text-xl md:text-2xl mb-8 text-gray-200"} 
              onChange={(val) => onStyleChange('subtitleStyle', val)} 
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label>Arka Plan Resmi</Label>
              <Button 
                type="button" 
                variant="outline" 
                size="sm"
                onClick={onGalleryOpen}
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
                  onClick={onImageClear}
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
                  onChange={onImageSelect}
                />
              </div>
            )}
            <Input
              id="backgroundImageUrl"
              name="backgroundImageUrl"
              defaultValue={heroData.backgroundImageUrl || ""}
              placeholder="Veya resim URL'si girin"
              onChange={(e) => onUrlChange(e.target.value)}
            />
            <div className="space-y-2 mt-4">
              <Label>Resim Hizalaması</Label>
              <Select 
                value={heroData.imagePosition || "center"} 
                onValueChange={onPositionChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Hizalama seçin" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="top">Üst (Top)</SelectItem>
                  <SelectItem value="top left">Üst Sol (Top Left)</SelectItem>
                  <SelectItem value="top right">Üst Sağ (Top Right)</SelectItem>
                  <SelectItem value="center">Orta (Center)</SelectItem>
                  <SelectItem value="left">Sol (Left)</SelectItem>
                  <SelectItem value="right">Sağ (Right)</SelectItem>
                  <SelectItem value="bottom">Alt (Bottom)</SelectItem>
                  <SelectItem value="bottom left">Alt Sol (Bottom Left)</SelectItem>
                  <SelectItem value="bottom right">Alt Sağ (Bottom Right)</SelectItem>
                </SelectContent>
              </Select>
              <input type="hidden" name="imagePosition" value={heroData.imagePosition || "center"} />
            </div>
          </div>

          <Button type="submit" disabled={uploadingImage}>
            {uploadingImage ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Kaydet
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
