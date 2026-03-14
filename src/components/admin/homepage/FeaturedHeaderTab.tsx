"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

interface FeaturedSection {
  id: number
  sectionTitle: string
  sectionDescription: string | null
}

interface FeaturedHeaderTabProps {
  featuredSection: FeaturedSection | null
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void
}

export const FeaturedHeaderTab = ({
  featuredSection,
  onSubmit
}: FeaturedHeaderTabProps) => {
  if (!featuredSection) return null

  return (
    <Card>
      <CardHeader>
        <CardTitle>Öne Çıkan Bölüm Başlığı</CardTitle>
        <CardDescription>Öne çıkan yemekler bölümünün başlığını düzenleyin</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="sectionTitle">Bölüm Başlığı *</Label>
            <Input
              id="sectionTitle"
              name="sectionTitle"
              defaultValue={featuredSection.sectionTitle}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="sectionDescription">Bölüm Açıklaması</Label>
            <Textarea
              id="sectionDescription"
              name="sectionDescription"
              defaultValue={featuredSection.sectionDescription || ""}
              rows={3}
            />
          </div>

          <Button type="submit">Kaydet</Button>
        </form>
      </CardContent>
    </Card>
  )
}
