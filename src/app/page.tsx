import Image from "next/image"
import Link from "next/link"
import { ChefHat, Utensils, Star, Clock, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import Navigation from "@/components/Navigation"
import Footer from "@/components/Footer"
import { db } from "@/db"
import { shouldShowPrice } from "@/lib/utils"
import AnimatedSection from "@/components/AnimatedSection"
import HeroButtons from "@/components/HeroButtons"
import InstagramCTA from "@/components/InstagramCTA"
import JsonLd from "@/components/JsonLd"
import Gallery from "@/components/Gallery"
import Testimonials from "@/components/Testimonials"
import AdBanner from "@/components/AdBanner"
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from "@/components/ui/accordion"

export default async function Home() {
  const [heroDataArr, features, featuredSectionArr, featuredDishes, aboutSectionArr, gallery, testimonials] = await Promise.all([
    db.query.homepageHero.findMany(),
    db.query.homepageFeatures.findMany({ orderBy: (features, { asc }) => [asc(features.displayOrder)] }),
    db.query.homepageFeaturedSection.findMany(),
    db.query.homepageFeaturedDishes.findMany({
      with: { menuItem: true },
      orderBy: (dishes, { asc }) => [asc(dishes.displayOrder)]
    }),
    db.query.homepageAboutSection.findMany(),
    db.query.galleryImages.findMany({
      where: (img, { eq }) => eq(img.hidden, false),
      orderBy: (img, { asc }) => [asc(img.displayOrder)]
    }),
    db.query.testimonials.findMany({
      where: (t, { eq }) => eq(t.hidden, false),
      orderBy: (t, { asc }) => [asc(t.displayOrder)]
    })
  ])

  const heroData = heroDataArr[0] || null
  const featuredSection = featuredSectionArr[0] || null
  const aboutSection = aboutSectionArr[0] || null

  const LucideIconMap: Record<string, any> = {
    ChefHat, Star, Clock, MapPin, Utensils
  }

  return (
    <div className="min-h-screen">
      <JsonLd type="Restaurant" />
      <JsonLd type="ItemList" data={featuredDishes.map(d => d.menuItem)} />
      <JsonLd type="FAQPage" data={[
        { question: "Mezeleriniz günlük mü hazırlanıyor?", answer: "Evet, tüm mezelerimiz her sabah taze malzemelerle günlük olarak hazırlanmaktadır." },
        { question: "Vegan veya vejetaryen seçenekleriniz var mı?", answer: "Evet, menümüzün büyük bir çoğunluğu vejetaryen dostudur. Humus, muhammara ve çeşitli zeytinyağlılarımız gibi birçok vegan seçeneğimiz de mevcuttur." },
        { question: "Siparişlerimi nasıl kontrol edebilirim?", answer: "Siparişlerinizi web sitemiz üzerinden inceleyebilir, Instagram DM veya telefon hattımız üzerinden doğrudan bizimle iletişime geçerek verebilirsiniz." },
        { question: "Özel günler için toplu sipariş alıyor musunuz?", answer: "Evet, davetler, doğum günleri ve özel etkinlikleriniz için toplu meze siparişi alıyoruz." }
      ]} />
      <Navigation />
      
      {/* Hero Section */}
      {heroData && (
        <section className="relative h-[600px] flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 z-0 bg-gradient-to-br from-primary/20 to-primary/5">
            {heroData.backgroundImageUrl && (
              <Image
                src={heroData.backgroundImageUrl}
                alt="Bispecial Meze Restaurant"
                fill
                className="object-cover brightness-50"
                priority
              />
            )}
          </div>
          <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
            <AnimatedSection>
              <h1 className={heroData.titleStyle || "font-serif text-5xl md:text-7xl font-bold mb-6"}>
                {heroData.title}
              </h1>
              {heroData.subtitle && (
                <p className={heroData.subtitleStyle || "text-xl md:text-2xl mb-8 text-gray-200"}>
                  {heroData.subtitle}
                </p>
              )}
              <HeroButtons 
                primaryText={heroData.primaryButtonText} 
                primaryLink={heroData.primaryButtonLink} 
              />
            </AnimatedSection>
          </div>
        </section>
      )}

      {/* Features */}
      {features.length > 0 && (
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {features.map((feature, idx) => {
                const IconComponent = LucideIconMap[feature.icon] || ChefHat
                return (
                  <AnimatedSection key={feature.id} delay={idx * 0.1}>
                    <div className="text-center">
                      <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
                        <IconComponent className="w-8 h-8 text-primary" />
                      </div>
                      <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                      {feature.description && (
                        <p className="text-muted-foreground text-sm">
                          {feature.description}
                        </p>
                      )}
                    </div>
                  </AnimatedSection>
                )
              })}
            </div>
          </div>
        </section>
      )}

      {/* Ad Placement 1 */}
      <div className="container mx-auto px-4">
        <AdBanner slot="home-top" />
      </div>

      {/* Featured Dishes */}
      {featuredDishes.length > 0 && (
        <section className="py-12">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            {featuredSection && (
              <AnimatedSection className="text-center mb-8">
                <h2 className="font-serif text-3xl md:text-4xl font-bold mb-3">
                  {featuredSection.sectionTitle}
                </h2>
                {featuredSection.sectionDescription && (
                  <p className="text-muted-foreground text-base max-w-2xl mx-auto">
                    {featuredSection.sectionDescription}
                  </p>
                )}
              </AnimatedSection>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {featuredDishes.map((dish, idx) => (
                <AnimatedSection key={dish.id} delay={idx * 0.1}>
                  <Link href={`/menu/${dish.menuItem.id}`}>
                    <Card className="overflow-hidden group hover:shadow-xl transition-shadow duration-300 cursor-pointer h-full">
                      {dish.menuItem.imageUrl ? (
                        <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                          <Image
                            src={dish.menuItem.imageUrl}
                            alt={dish.menuItem.name}
                            fill
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 400px"
                            className="object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                        </div>
                      ) : (
                        <div className="relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center">
                          <Utensils className="h-12 w-12 text-primary/30" />
                        </div>
                      )}
                      <div className="p-4">
                        <div className="flex justify-between items-start mb-1">
                          <h3 className="font-serif text-xl font-bold">{dish.menuItem.name}</h3>
                          {shouldShowPrice(dish.menuItem.price) && (
                            <span className="text-primary font-bold text-lg">{dish.menuItem.price}</span>
                          )}
                        </div>
                        {dish.menuItem.description && (
                          <p className="text-muted-foreground text-sm line-clamp-2">{dish.menuItem.description}</p>
                        )}
                      </div>
                    </Card>
                  </Link>
                </AnimatedSection>
              ))}
            </div>

            <AnimatedSection className="text-center mt-8">
              <Button size="lg" className="bg-primary hover:bg-primary/90" asChild>
                <Link href="/menu">Tüm Menüyü Görüntüle</Link>
              </Button>
            </AnimatedSection>
          </div>
        </section>
      )}

      {/* Ad Placement 2 */}
      <div className="container mx-auto px-4">
        <AdBanner slot="home-middle" format="rectangle" />
      </div>

      {/* Gallery Section */}
      <Gallery images={gallery} />

      {/* About Preview */}
      {aboutSection && (
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <AnimatedSection>
                {aboutSection.imageUrl ? (
                  <div className="relative aspect-[4/3] rounded-lg overflow-hidden bg-muted group">
                    <Image
                      src={aboutSection.imageUrl}
                      alt="Restaurant Interior"
                      fill
                      sizes="(max-width: 1024px) 100vw, 50vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                  </div>
                ) : (
                  <div className="relative aspect-[4/3] rounded-lg overflow-hidden bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center">
                    <ChefHat className="h-24 w-24 text-primary/30" />
                  </div>
                )}
              </AnimatedSection>
              <AnimatedSection delay={0.2}>
                <div>
                  <h2 className={aboutSection.titleStyle || "font-serif text-4xl md:text-5xl font-bold mb-6"}>
                    {aboutSection.title}
                  </h2>
                  <div className={aboutSection.descriptionStyle || "text-muted-foreground text-lg mb-8 leading-relaxed whitespace-pre-line"}>
                    {aboutSection.description}
                  </div>
                </div>
              </AnimatedSection>
            </div>
          </div>
        </section>
      )}

      {/* Testimonials Section */}
      <Testimonials testimonials={testimonials} />

      {/* Instagram CTA Section */}
      <InstagramCTA />

      {/* FAQ Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl">
          <AnimatedSection className="text-center mb-12">
            <h2 className="font-serif text-4xl font-bold mb-4">Sıkça Sorulan Sorular</h2>
            <p className="text-muted-foreground">Bispecial Meze hakkında merak ettiğiniz her şey.</p>
          </AnimatedSection>
          
          <AnimatedSection delay={0.2}>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger className="text-left font-semibold">Mezeleriniz günlük mü hazırlanıyor?</AccordionTrigger>
                <AccordionContent>
                  Evet, tüm mezelerimiz her sabah taze malzemelerle günlük olarak hazırlanmaktadır. Hiçbir ürünümüzde koruyucu madde kullanmıyoruz.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2">
                <AccordionTrigger className="text-left font-semibold">Vegan veya vejetaryen seçenekleriniz var mı?</AccordionTrigger>
                <AccordionContent>
                  Evet, menümüzün büyük bir çoğunluğu vejetaryen dostudur. Humus, muhammara ve çeşitli zeytinyağlılarımız gibi birçok vegan seçeneğimiz de mevcuttur.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-3">
                <AccordionTrigger className="text-left font-semibold">Siparişlerimi nasıl kontrol edebilirim?</AccordionTrigger>
                <AccordionContent>
                  Siparişlerinizi web sitemiz üzerinden inceleyebilir, Instagram DM veya telefon hattımız üzerinden doğrudan bizimle iletişime geçerek verebilirsiniz.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-4">
                <AccordionTrigger className="text-left font-semibold">Özel günler için toplu sipariş alıyor musunuz?</AccordionTrigger>
                <AccordionContent>
                  Evet, davetler, doğum günleri ve özel etkinlikleriniz için toplu meze siparişi alıyoruz. Detaylar için lütfen en az 2 gün önceden bizimle iletişime geçin.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </AnimatedSection>
        </div>
      </section>

      <Footer />
    </div>
  )
}