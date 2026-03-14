"use client"

import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ChefHat, Star, Clock, MapPin, Utensils, Heart, Award, Coffee, Users, Sparkles } from "lucide-react"

const LucideIconMap: Record<string, React.ComponentType<any>> = {
  ChefHat, Star, Clock, MapPin, Utensils, Heart, Award, Coffee, Users, Sparkles
}

const iconList = ['ChefHat', 'Star', 'Clock', 'MapPin', 'Utensils', 'Heart', 'Award', 'Coffee', 'Users', 'Sparkles']

interface Feature {
  id: number
  icon: string
  title: string
  description: string | null
  displayOrder: number
}

interface FeatureDialogProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  editingFeature: Feature | null
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void
}

export const FeatureDialog = ({
  isOpen,
  onOpenChange,
  editingFeature,
  onSubmit
}: FeatureDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{editingFeature ? "Özelliği Düzenle" : "Yeni Özellik Ekle"}</DialogTitle>
          <DialogDescription>Özellik bilgilerini girin</DialogDescription>
        </DialogHeader>
        <form onSubmit={onSubmit}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="icon">İkon *</Label>
              <Select name="icon" defaultValue={editingFeature?.icon || "ChefHat"} required>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {iconList.map(icon => {
                    const IconComponent = (LucideIconMap as any)[icon]
                    return (
                      <SelectItem key={icon} value={icon}>
                        <div className="flex items-center gap-2">
                          {IconComponent && <IconComponent className="w-4 h-4" />}
                          {icon}
                        </div>
                      </SelectItem>
                    )
                  })}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="featureTitle">Başlık *</Label>
              <Input
                id="featureTitle"
                name="title"
                defaultValue={editingFeature?.title}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="featureDescription">Açıklama</Label>
              <Textarea
                id="featureDescription"
                name="description"
                defaultValue={editingFeature?.description || ""}
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="displayOrder">Sıra</Label>
              <Input
                id="displayOrder"
                name="displayOrder"
                type="number"
                defaultValue={editingFeature?.displayOrder || 0}
                required
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              İptal
            </Button>
            <Button type="submit">
              {editingFeature ? "Güncelle" : "Ekle"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
