"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Pencil, Trash2, ChefHat, Star, Clock, MapPin, Utensils, Heart, Award, Coffee, Users, Sparkles } from "lucide-react"

const LucideIconMap: Record<string, React.ComponentType<any>> = {
  ChefHat, Star, Clock, MapPin, Utensils, Heart, Award, Coffee, Users, Sparkles
}

interface Feature {
  id: number
  icon: string
  title: string
  description: string | null
  displayOrder: number
}

interface FeaturesTabProps {
  features: Feature[]
  onAdd: () => void
  onEdit: (feature: Feature) => void
  onDelete: (id: number) => void
}

export const FeaturesTab = ({
  features,
  onAdd,
  onEdit,
  onDelete
}: FeaturesTabProps) => {
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Özellikler</CardTitle>
            <CardDescription>Ana sayfa özelliklerini yönetin</CardDescription>
          </div>
          <Button onClick={onAdd}>
            <Plus className="mr-2 h-4 w-4" />
            Yeni Özellik
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {features.map(feature => {
            const IconComponent = LucideIconMap[feature.icon]
            return (
              <div key={feature.id} className="flex items-center gap-4 p-4 border rounded-lg">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                  {IconComponent && <IconComponent className="w-6 h-6 text-primary" />}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                  <p className="text-xs text-muted-foreground mt-1">Sıra: {feature.displayOrder}</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => onEdit(feature)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => onDelete(feature.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
