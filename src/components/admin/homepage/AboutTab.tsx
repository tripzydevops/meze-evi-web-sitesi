"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Loader2, Upload, X } from "lucide-react"
import Image from "next/image"
import { StyleControls } from "./StyleControls"

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

interface AboutTabProps {
  aboutSection: AboutSection | null
  aboutImage: { file: File | null, preview: string }
  uploadingImage: boolean
  onAboutUpdate: (e: React.FormEvent<HTMLFormElement>) => void
  onAboutChange: (updated: AboutSection) => void
  onStyleChange: (field: 'titleStyle' | 'descriptionStyle', val: string) => void
  onGalleryOpen: () => void
  onImageSelect: (e: React.ChangeEvent<HTMLInputElement>) => void
  onImageClear: () => void
}

export const AboutTab = ({
  aboutSection,
  aboutImage,
  uploadingImage,
  onAboutUpdate,
  onAboutChange,
  onStyleChange,
  onGalleryOpen,
  onImageSelect,
  onImageClear
}: AboutTabProps) => {
  if (!aboutSection) return null

  return (
    <Card>
      <CardHeader>
        <CardTitle>Hakkımızda Bölümü</CardTitle>
        <CardDescription>Ana sayfa hakkımızda bölümünü düzenleyin</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={onAboutUpdate} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="aboutTitle">Başlık *</Label>
            <Input
              id="aboutTitle"
              name="title"
              value={aboutSection.title}
              onChange={(e) => onAboutChange({ ...aboutSection, title: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="aboutDescription">Açıklama *</Label>
            <Textarea
              id="aboutDescription"
              name="description"
              value={aboutSection.description}
              onChange={(e) => onAboutChange({ ...aboutSection, description: e.target.value })}
              rows={6}
              required
            />
          </div>

          <div className="space-y-4">
            <StyleControls 
              prefix="Başlık" 
              value={aboutSection.titleStyle || "font-serif text-4xl md:text-5xl font-bold mb-6"} 
              onChange={(val) => onStyleChange('titleStyle', val)} 
            />
            <StyleControls 
              prefix="Açıklama" 
              value={aboutSection.descriptionStyle || "text-muted-foreground text-lg mb-8 leading-relaxed whitespace-pre-line"} 
              onChange={(val) => onStyleChange('descriptionStyle', val)} 
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label>Resim</Label>
              <Button 
                type="button" 
                variant="outline" 
                size="sm"
                onClick={onGalleryOpen}
              >
                Galleriden Seç
              </Button>
            </div>
            {aboutImage.preview || aboutSection.imageUrl ? (
              <div className="relative w-full h-48 border rounded-lg overflow-hidden">
                <Image
                  src={aboutImage.preview || aboutSection.imageUrl || ""}
                  alt="About"
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
              id="aboutImageUrl"
              name="imageUrl"
              value={aboutSection.imageUrl || ""}
              onChange={(e) => onAboutChange({ ...aboutSection, imageUrl: e.target.value })}
              placeholder="Veya resim URL'si girin"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="aboutButtonText">Buton Metni</Label>
              <Input
                id="aboutButtonText"
                name="buttonText"
                value={aboutSection.buttonText || ""}
                onChange={(e) => onAboutChange({ ...aboutSection, buttonText: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="aboutButtonLink">Buton Linki</Label>
              <Input
                id="aboutButtonLink"
                name="buttonLink"
                value={aboutSection.buttonLink || ""}
                onChange={(e) => onAboutChange({ ...aboutSection, buttonLink: e.target.value })}
              />
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
