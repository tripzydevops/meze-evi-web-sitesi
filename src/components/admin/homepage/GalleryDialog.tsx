"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import Image from "next/image"

interface GalleryImage {
  id: number
  url: string
  alt: string | null
}

interface GalleryDialogProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  gallery: GalleryImage[]
  target: "hero" | "about" | null
  onSelect: (url: string) => void
}

export const GalleryPicker = ({
  isOpen,
  onOpenChange,
  gallery,
  onSelect
}: GalleryDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Galleriden Resim Seç</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-4">
          {gallery.map(img => (
            <div 
              key={img.id} 
              className="relative aspect-square border rounded-lg overflow-hidden cursor-pointer hover:border-primary"
              onClick={() => {
                onSelect(img.url)
              }}
            >
              <Image src={img.url} alt={img.alt || ""} fill className="object-cover" />
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  )
}
