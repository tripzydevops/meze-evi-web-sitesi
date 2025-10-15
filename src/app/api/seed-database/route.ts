import { NextResponse } from 'next/server';
import { db } from '@/db';
import { 
  homepageHero, 
  homepageFeatures, 
  homepageFeaturedSection, 
  homepageAboutSection,
  categories,
  menuItems,
  contactInfo,
  homepageFeaturedDishes
} from '@/db/schema';

export async function GET() {
  try {
    // Clear existing data (optional - remove these lines if you want to keep existing data)
    await db.delete(homepageFeaturedDishes);
    await db.delete(menuItems);
    await db.delete(categories);
    await db.delete(contactInfo);
    await db.delete(homepageAboutSection);
    await db.delete(homepageFeaturedSection);
    await db.delete(homepageFeatures);
    await db.delete(homepageHero);

    // 1. Homepage Hero
    await db.insert(homepageHero).values({
      title: 'Bi Special Meze',
      subtitle: 'Geleneksel Türk mutfağının vazgeçilmez lezzetlerini, modern dokunuşlarla bir araya getiriyoruz',
      primaryButtonText: 'Menüyü İncele',
      primaryButtonLink: '/menu',
      secondaryButtonText: 'İletişim',
      secondaryButtonLink: '/iletisim',
      backgroundImageUrl: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=1920&q=80',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    // 2. Homepage Features
    await db.insert(homepageFeatures).values([
      {
        icon: 'Leaf',
        title: 'Taze Malzemeler',
        description: 'Her gün pazar yerinden toplanan en taze ve doğal malzemelerle hazırlıyoruz',
        displayOrder: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        icon: 'ChefHat',
        title: 'Usta Şefler',
        description: 'Yılların deneyimine sahip şeflerimiz, her tabağı özenle hazırlıyor',
        displayOrder: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        icon: 'Book',
        title: 'Geleneksel Tarifler',
        description: 'Nesilden nesile aktarılan özgün tariflerle Anadolu lezzetleri',
        displayOrder: 3,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        icon: 'Heart',
        title: 'Sıcak Atmosfer',
        description: 'Aileniz ve sevdiklerinizle keyifli vakit geçirebileceğiniz samimi ortam',
        displayOrder: 4,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    ]);

    // 3. Featured Section
    await db.insert(homepageFeaturedSection).values({
      sectionTitle: 'Öne Çıkan Lezzetlerimiz',
      sectionDescription: 'En çok tercih edilen ve misafirlerimizin favorisi haline gelmiş özel mezelerimizden bir seçki',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    // 4. About Section
    await db.insert(homepageAboutSection).values({
      title: 'Hikayemiz',
      description: "Bi Special Meze, 2015 yılında İstanbul'un kalbinde, Türk mutfağının eşsiz meze kültürünü modern bir yaklaşımla sunma vizyonuyla kuruldu. Ailemizden gelen geleneksel tarifler ve yılların deneyimiyle, her tabakta Anadolu'nun zengin lezzet mirasını yansıtıyoruz. Taze malzemeler, özenli hazırlık ve içten gelen misafirperverlik anlayışımızla, her ziyaretinizde kendinizi evinizde hissedeceksiniz. Mezelerimiz, özenle seçilmiş malzemelerle günlük taze olarak hazırlanır ve geleneksel tekniklerin modern mutfakla buluştuğu özel tariflerimizle sunulur.",
      imageUrl: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80',
      buttonText: 'Daha Fazla Bilgi',
      buttonLink: '/hakkimizda',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    // 5. Categories
    await db.insert(categories).values([
      { name: 'Soğuk Mezeler', displayOrder: 1, hidden: false, createdAt: new Date(), updatedAt: new Date() },
      { name: 'Sıcak Mezeler', displayOrder: 2, hidden: false, createdAt: new Date(), updatedAt: new Date() },
      { name: 'Ana Yemekler', displayOrder: 3, hidden: false, createdAt: new Date(), updatedAt: new Date() },
      { name: 'İçecekler', displayOrder: 4, hidden: false, createdAt: new Date(), updatedAt: new Date() }
    ]);

    // 6. Menu Items
    await db.insert(menuItems).values([
      // Soğuk Mezeler (categoryId: 1)
      { categoryId: 1, name: 'Humus', description: 'Nohut, tahin, zeytinyağı ve limon suyu ile hazırlanan klasik Orta Doğu mezesi', price: '₺65', imageUrl: null, popular: true, createdAt: new Date(), updatedAt: new Date() },
      { categoryId: 1, name: 'Acılı Ezme', description: 'Domates, biber, soğan, nar ekşisi ve baharatlarla hazırlanan geleneksel ezme', price: '₺70', imageUrl: null, popular: false, createdAt: new Date(), updatedAt: new Date() },
      { categoryId: 1, name: 'Haydari', description: 'Süzme yoğurt, maydonoz, dereotu, sarımsak ve ceviz ile', price: '₺75', imageUrl: null, popular: true, createdAt: new Date(), updatedAt: new Date() },
      { categoryId: 1, name: 'Patlıcan Salatası', description: 'Közlenmiş patlıcan, yoğurt, sarımsak ve zeytinyağı', price: '₺80', imageUrl: null, popular: false, createdAt: new Date(), updatedAt: new Date() },
      { categoryId: 1, name: 'Atom', description: 'Ceviz, sarımsak, biber ve baharatlarla hazırlanan acılı meze', price: '₺75', imageUrl: null, popular: false, createdAt: new Date(), updatedAt: new Date() },
      { categoryId: 1, name: 'Babaganuş', description: 'Közlenmiş patlıcan, tahin ve zeytinyağı ile', price: '₺70', imageUrl: null, popular: false, createdAt: new Date(), updatedAt: new Date() },
      { categoryId: 1, name: 'Cacık', description: 'Yoğurt, salatalık, sarımsak, nane ve zeytinyağı', price: '₺60', imageUrl: null, popular: false, createdAt: new Date(), updatedAt: new Date() },
      
      // Sıcak Mezeler (categoryId: 2)
      { categoryId: 2, name: 'Sigara Böreği', description: 'İçi beyaz peynir ve maydanozlu çıtır yufka böreği (6 adet)', price: '₺85', imageUrl: null, popular: true, createdAt: new Date(), updatedAt: new Date() },
      { categoryId: 2, name: 'Çiğ Köfte', description: 'Bulgur, domates, biber salçası ve baharatlarla yoğrulmuş (8 adet)', price: '₺90', imageUrl: null, popular: true, createdAt: new Date(), updatedAt: new Date() },
      { categoryId: 2, name: 'Kalamar Tava', description: 'Çıtır kalamar halkası, tartar sos ile', price: '₺120', imageUrl: null, popular: false, createdAt: new Date(), updatedAt: new Date() },
      { categoryId: 2, name: 'Hellim Kızartması', description: 'Kıbrıs hellim peyniri, naneli yoğurt ile', price: '₺95', imageUrl: null, popular: false, createdAt: new Date(), updatedAt: new Date() },
      { categoryId: 2, name: 'Falafel', description: 'Nohut köftesi, tahin sos ile (6 adet)', price: '₺80', imageUrl: null, popular: false, createdAt: new Date(), updatedAt: new Date() },
      { categoryId: 2, name: 'Humus Kavurma', description: 'Sıcak humus üzerine kavurma et', price: '₺110', imageUrl: null, popular: false, createdAt: new Date(), updatedAt: new Date() },
      
      // Ana Yemekler (categoryId: 3)
      { categoryId: 3, name: 'İskender Kebap', description: 'Döner eti, yoğurt, tereyağı ve domates sosu ile', price: '₺145', imageUrl: null, popular: false, createdAt: new Date(), updatedAt: new Date() },
      { categoryId: 3, name: 'Adana Kebap', description: 'Şiş kıyma, közlenmiş sebzeler ve pilav ile', price: '₺140', imageUrl: null, popular: false, createdAt: new Date(), updatedAt: new Date() },
      { categoryId: 3, name: 'Kuzu Şiş', description: 'Marine edilmiş kuzu şiş, pilav ve közlenmiş sebzeler', price: '₺150', imageUrl: null, popular: false, createdAt: new Date(), updatedAt: new Date() },
      { categoryId: 3, name: 'Karışık Izgara', description: 'Kuzu pirzola, tavuk şiş, adana, pilav ve meze ile', price: '₺180', imageUrl: null, popular: false, createdAt: new Date(), updatedAt: new Date() },
      
      // İçecekler (categoryId: 4)
      { categoryId: 4, name: 'Ayran', description: 'Geleneksel yoğurt içeceği', price: '₺20', imageUrl: null, popular: false, createdAt: new Date(), updatedAt: new Date() },
      { categoryId: 4, name: 'Şalgam Suyu', description: 'Acılı veya acısız', price: '₺25', imageUrl: null, popular: false, createdAt: new Date(), updatedAt: new Date() },
      { categoryId: 4, name: 'Türk Çayı', description: 'Geleneksel demleme çay', price: '₺15', imageUrl: null, popular: false, createdAt: new Date(), updatedAt: new Date() },
    ]);

    // 7. Contact Info
    await db.insert(contactInfo).values([
      { type: 'address', title: 'Adres', content: 'Nispetiye Caddesi No: 45', subContent: 'Etiler, Beşiktaş / İstanbul', icon: 'MapPin', displayOrder: 1, hidden: false, createdAt: new Date(), updatedAt: new Date() },
      { type: 'phone', title: 'Telefon', content: '+90 212 555 12 34', subContent: 'Rezervasyon için arayın', icon: 'Phone', displayOrder: 2, hidden: false, createdAt: new Date(), updatedAt: new Date() },
      { type: 'email', title: 'E-posta', content: 'info@bispecialmeze.com', subContent: 'Her zaman yanıtlıyoruz', icon: 'Mail', displayOrder: 3, hidden: false, createdAt: new Date(), updatedAt: new Date() },
      { type: 'hours', title: 'Çalışma Saatleri', content: 'Pazartesi - Pazar', subContent: '12:00 - 23:00', icon: 'Clock', displayOrder: 4, hidden: false, createdAt: new Date(), updatedAt: new Date() },
    ]);

    // 8. Featured Dishes (must be last, after menu items are created)
    await db.insert(homepageFeaturedDishes).values([
      { menuItemId: 1, displayOrder: 1, createdAt: new Date(), updatedAt: new Date() }, // Humus
      { menuItemId: 3, displayOrder: 2, createdAt: new Date(), updatedAt: new Date() }, // Haydari
      { menuItemId: 8, displayOrder: 3, createdAt: new Date(), updatedAt: new Date() }, // Sigara Böreği
    ]);

    return NextResponse.json({ 
      success: true, 
      message: '✅ Database seeded successfully! All content has been added.',
      seeded: {
        hero: 1,
        features: 4,
        featuredSection: 1,
        aboutSection: 1,
        categories: 4,
        menuItems: 20,
        contactInfo: 4,
        featuredDishes: 3
      }
    });
  } catch (error) {
    console.error('Seeding error:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to seed database',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}