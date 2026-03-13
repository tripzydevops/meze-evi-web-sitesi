import Navigation from "@/components/Navigation"
import Footer from "@/components/Footer"
import CateringForm from "@/components/CateringForm"
import { Utensils, Award, Clock, Heart } from "lucide-react"
import Image from "next/image"

export const metadata = {
  title: 'Catering Hizmetleri | Meze Evi',
  description: 'Özel günleriniz, davetleriniz ve kurumsal etkinlikleriniz için geleneksel Türk mezeleriyle catering hizmeti sunuyoruz.',
}

export default function CateringPage() {
  const features = [
    {
      icon: Utensils,
      title: "Geleneksel Lezzetler",
      description: "Yılların deneyimiyle hazırlanan, Anadolunun otantik tariflerinden ödün vermeyen meze seçkisi."
    },
    {
      icon: Award,
      title: "Premium Kalite",
      description: "Her zaman en taze ve en kaliteli malzemelerle hazırlanan, özenle sunulan ikramlar."
    },
    {
      icon: Clock,
      title: "Zamanında Teslimat",
      description: "Etkinlik planınıza sadık kalarak, mezelerinizi tazeliğini koruyarak tam vaktinde ulaştırıyoruz."
    },
    {
      icon: Heart,
      title: "Kişiye Özel Menü",
      description: "Etkinliğinizin konseptine ve misafirlerinizin tercihlerine özel menü oluşturma imkanı."
    }
  ]

  return (
    <div className="min-h-screen">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative h-[450px] flex items-center justify-center overflow-hidden">
        <Image 
          src="https://images.unsplash.com/photo-1555244162-803834f70033?w=1920&q=80" 
          alt="Catering Background"
          fill
          className="object-cover brightness-[0.4]"
          priority
        />
        <div className="relative z-10 text-center px-4 max-w-4xl">
          <h1 className="font-serif text-5xl md:text-7xl font-bold mb-6 text-white drop-shadow-md">
            Özel Günlerinize <span className="text-primary italic text-6xl md:text-8xl">Lezzet</span> Katıyoruz
          </h1>
          <p className="text-zinc-200 text-lg md:text-2xl font-light mb-8 max-w-2xl mx-auto">
            Düğün, nişan, kurumsal etkinlik ve tüm davetleriniz için profesyonel meze catering hizmetleri.
          </p>
        </div>
      </section>

      {/* Benefits Grid */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-serif text-4xl md:text-5xl font-bold mb-4 text-primary">Neden Meze Evi Catering?</h2>
            <div className="w-24 h-1 bg-primary/30 mx-auto rounded-full"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="p-8 rounded-2xl border border-primary/5 bg-primary/5 hover:bg-primary/10 transition-colors text-center group">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-full mb-6 shadow-sm group-hover:scale-110 transition-transform">
                  <feature.icon className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Form Section */}
      <section className="py-20 bg-primary/5">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="font-serif text-4xl md:text-6xl font-bold mb-6 leading-tight">
                Hayalinizdeki Daveti <br /> 
                <span className="text-primary">Birlikte Planlayalım</span>
              </h2>
              <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
                Her etkinliğin kendine has bir ruhu ve hikayesi vardır. Biz, bu hikayeyi en lezzetli mezelerimizle taçlandırmak için yanınızdayız. 
                Siz sadece misafirlerinizle ilgilenin, lezzet kısmını uzman ekibimize bırakın.
              </p>
              <div className="space-y-4 mb-8">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm">
                    <span className="text-primary font-bold text-xl">1</span>
                  </div>
                  <p className="font-medium">Formu doldurarak tercihlerinizi bize iletin.</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm">
                    <span className="text-primary font-bold text-xl">2</span>
                  </div>
                  <p className="font-medium">Ekibimiz size özel bir menü ve fiyat teklifi hazırlasın.</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm">
                    <span className="text-primary font-bold text-xl">3</span>
                  </div>
                  <p className="font-medium">Etkinlik gününde mezeleriniz taze taze sofranıza gelsin.</p>
                </div>
              </div>
            </div>
            <div>
              <CateringForm />
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
