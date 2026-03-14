"use client"

import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Image from "next/image"

interface MenuItem {
  id: number
  categoryId: number
  name: string
  description: string | null
  price: string
  imageUrl: string | null
  popular: boolean
  category?: {
    id: number
    name: string
  }
}

interface FeaturedDish {
  id: number
  menuItemId: number
  displayOrder: number
  menuItem: {
    id: number
    name: string
    description: string | null
    price: string
    imageUrl: string | null
    categoryId: number
    popular: boolean
  }
}

interface DishDialogProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  editingDish: FeaturedDish | null
  menuItems: MenuItem[]
  dishPreview: string
  onMenuItemChange: (value: string) => void
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void
  onCancel: () => void
}

export const DishDialog = ({
  isOpen,
  onOpenChange,
  editingDish,
  menuItems,
  dishPreview,
  onMenuItemChange,
  onSubmit,
  onCancel
}: DishDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{editingDish ? "Yemeği Düzenle" : "Yeni Yemek Ekle"}</DialogTitle>
          <DialogDescription>
            Mevcut menü öğelerinden bir yemek seçin ve sırasını belirleyin
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={onSubmit}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="menuItemId">Menü Öğesi Seç *</Label>
              <Select
                name="menuItemId"
                defaultValue={editingDish?.menuItemId.toString()}
                required
                onValueChange={onMenuItemChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Bir menü öğesi seçin" />
                </SelectTrigger>
                <SelectContent>
                  {menuItems.map(item => (
                    <SelectItem key={item.id} value={item.id.toString()}>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{item.name}</span>
                        {item.price && <span className="text-muted-foreground text-sm">- {item.price}</span>}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {dishPreview && (
              <div className="space-y-2">
                <Label>Önizleme</Label>
                <div className="relative w-full h-48 border rounded-lg overflow-hidden">
                  <Image
                    src={dishPreview}
                    alt="Preview"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="dishDisplayOrder">Sıra *</Label>
              <Input
                id="dishDisplayOrder"
                name="displayOrder"
                type="number"
                defaultValue={editingDish?.displayOrder || 0}
                required
              />
              <p className="text-xs text-muted-foreground">
                Ana sayfada gösterilme sırası (küçükten büyüğe)
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
            >
              İptal
            </Button>
            <Button type="submit">
              {editingDish ? "Güncelle" : "Ekle"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
