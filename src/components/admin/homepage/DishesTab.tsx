"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Pencil, Trash2 } from "lucide-react"
import Image from "next/image"

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

interface DishesTabProps {
  featuredDishes: FeaturedDish[]
  onAdd: () => void
  onEdit: (dish: FeaturedDish) => void
  onDelete: (id: number) => void
}

export const DishesTab = ({
  featuredDishes,
  onAdd,
  onEdit,
  onDelete
}: DishesTabProps) => {
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Öne Çıkan Yemekler</CardTitle>
            <CardDescription>Ana sayfada gösterilecek yemekleri yönetin</CardDescription>
          </div>
          <Button onClick={onAdd}>
            <Plus className="mr-2 h-4 w-4" />
            Yeni Yemek
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {featuredDishes.map(dish => (
            <div key={dish.id} className="border rounded-lg overflow-hidden">
              {dish.menuItem.imageUrl && (
                <div className="relative h-40">
                  <Image
                    src={dish.menuItem.imageUrl}
                    alt={dish.menuItem.name}
                    fill
                    className="object-cover"
                  />
                </div>
              )}
              <div className="p-4 space-y-2">
                <div className="flex justify-between items-start">
                  <h3 className="font-semibold">{dish.menuItem.name}</h3>
                  <span className="text-primary font-bold">{dish.menuItem.price}</span>
                </div>
                <p className="text-sm text-muted-foreground">{dish.menuItem.description}</p>
                <p className="text-xs text-muted-foreground">Sıra: {dish.displayOrder}</p>
                <div className="flex gap-2 pt-2">
                  <Button variant="outline" size="sm" onClick={() => onEdit(dish)} className="flex-1">
                    <Pencil className="h-4 w-4 mr-1" />
                    Düzenle
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => onDelete(dish.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
