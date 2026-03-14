"use client"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export const families = ["font-serif", "font-sans"]
export const sizes = ["text-sm", "text-base", "text-lg", "text-xl", "text-2xl", "text-3xl", "text-4xl", "text-5xl", "text-6xl", "text-7xl"]
export const weights = ["font-light", "font-normal", "font-medium", "font-semibold", "font-bold", "font-extrabold"]
export const aligns = ["text-left", "text-center", "text-right"]
export const colors = ["text-primary", "text-amber-600", "text-gray-500", "text-white"]
export const margins = ["mb-0", "mb-2", "mb-4", "mb-6", "mb-8", "mb-10"]

interface StyleControlsProps {
  prefix: string
  value: string
  onChange: (val: string) => void
}

export const StyleControls = ({ 
  prefix, 
  value, 
  onChange 
}: StyleControlsProps) => {
  const parts = (value || "").split(' ')
  
  const getFamily = () => parts.find(p => families.includes(p)) || 'font-serif'
  const getSize = () => parts.find(p => sizes.includes(p)) || 'text-4xl'
  const getWeight = () => parts.find(p => weights.includes(p)) || 'font-bold'
  const getAlign = () => parts.find(p => aligns.includes(p)) || 'text-left'
  const getMargin = () => parts.find(p => margins.includes(p)) || 'mb-6'
  const getColor = () => parts.find(p => colors.includes(p)) || 'none'

  const updateStyle = (newParts: Partial<{ family: string, size: string, weight: string, align: string, margin: string, color: string }>) => {
    const current = {
      family: getFamily(),
      size: getSize(),
      weight: getWeight(),
      align: getAlign(),
      margin: getMargin(),
      color: getColor()
    }
    const final = { ...current, ...newParts }
    onChange(Object.values(final).filter(v => v && v !== 'none' && v !== '').join(' '))
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-2 p-3 border rounded-md bg-muted/20">
      <div className="space-y-1">
        <span className="text-xs font-medium">{prefix} Yazı Tipi</span>
        <Select value={getFamily()} onValueChange={(val) => updateStyle({ family: val })}>
          <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="font-serif">Serif (Zarif)</SelectItem>
            <SelectItem value="font-sans">Sans (Modern)</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-1">
        <span className="text-xs font-medium">Boyut</span>
        <Select value={getSize()} onValueChange={(val) => updateStyle({ size: val })}>
          <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="text-sm">SM</SelectItem>
            <SelectItem value="text-base">M</SelectItem>
            <SelectItem value="text-lg">LG</SelectItem>
            <SelectItem value="text-xl">XL</SelectItem>
            <SelectItem value="text-2xl">2XL</SelectItem>
            <SelectItem value="text-3xl">3XL</SelectItem>
            <SelectItem value="text-4xl">4XL</SelectItem>
            <SelectItem value="text-5xl">5XL</SelectItem>
            <SelectItem value="text-6xl">6XL</SelectItem>
            <SelectItem value="text-7xl">7XL</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-1">
        <span className="text-xs font-medium">Kalınlık</span>
        <Select value={getWeight()} onValueChange={(val) => updateStyle({ weight: val })}>
          <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="font-light">İnce</SelectItem>
            <SelectItem value="font-normal">Normal</SelectItem>
            <SelectItem value="font-medium">Orta</SelectItem>
            <SelectItem value="font-semibold">Yarı Kalın</SelectItem>
            <SelectItem value="font-bold">Kalın</SelectItem>
            <SelectItem value="font-extrabold">Çok Kalın</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-1">
        <span className="text-xs font-medium">Hizalama</span>
        <Select value={getAlign()} onValueChange={(val) => updateStyle({ align: val })}>
          <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="text-left">Sol</SelectItem>
            <SelectItem value="text-center">Orta</SelectItem>
            <SelectItem value="text-right">Sağ</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-1">
        <span className="text-xs font-medium">Renk</span>
        <Select value={getColor() || "none"} onValueChange={(val) => updateStyle({ color: val })}>
          <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="none">Varsayılan</SelectItem>
            <SelectItem value="text-primary">Bordo (Tema)</SelectItem>
            <SelectItem value="text-amber-600">Kehribar</SelectItem>
            <SelectItem value="text-gray-500">Gri</SelectItem>
            <SelectItem value="text-white">Beyaz</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}
