import { Suspense } from "react"
import Navigation from "@/components/Navigation"
import Footer from "@/components/Footer"
import { Loader2 } from "lucide-react"
import AnimatedSection from "@/components/AnimatedSection"
import JsonLd from "@/components/JsonLd"
import AdBanner from "@/components/AdBanner"
import MenuDisplay from "@/components/MenuDisplay"
import { db } from "@/db"

async function MenuContent({ searchParams }: { searchParams: { [key: string]: string | string[] | undefined } }) {
  const searchFromUrl = (typeof searchParams.search === 'string' ? searchParams.search : "") || ""
  
  // Fetch data directly on the server for instant load
  const menuCategoriesData = await db.query.categories.findMany({
    where: (cat, { eq }) => eq(cat.hidden, false),
    orderBy: (cat, { asc }) => [asc(cat.displayOrder)],
    with: {
      menuItems: {
        where: (item, { eq }) => eq(item.hidden, false),
        orderBy: (item, { desc }) => [desc(item.id)],
      },
    },
  });

  const menuCategories = menuCategoriesData.map(cat => ({
    ...cat,
    items: (cat as any).menuItems
  }));

  return (
    <div className="min-h-screen">
      <JsonLd type="Restaurant" />
      <JsonLd type="ItemList" data={menuCategories.flatMap(cat => cat.items)} />
      <Navigation />
      
      {/* Hero */}
      <section className="relative h-[300px] flex items-center justify-center overflow-hidden bg-primary/10">
        <div className="relative z-10 text-center px-4">
          <AnimatedSection>
            <h1 className="font-serif text-5xl md:text-6xl font-bold mb-4 text-primary">
              Menümüz
            </h1>
            <p className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto">
              Özenle hazırlanmış geleneksel Türk mezeleri ve Bispecial özel lezzetleri
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* Ad Placement: Menu Top */}
      <AdBanner slot="menu-top" className="container mx-auto px-4" />

      {/* Interactive Menu Display */}
      <MenuDisplay initialCategories={menuCategories as any} initialSearch={searchFromUrl} />

      <Footer />
    </div>
  )
}

export default function MenuPage({ searchParams }: { searchParams: { [key: string]: string | string[] | undefined } }) {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex justify-center items-center bg-background">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    }>
      <MenuContent searchParams={searchParams} />
    </Suspense>
  )
}