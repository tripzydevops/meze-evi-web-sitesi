import { db } from '@/db';
import { homepageAboutSection } from '@/db/schema';

async function main() {
    const sampleData = [
        {
            title: 'Hikayemiz',
            description: "Bi Special Meze, 2015 yılında İstanbul'un kalbinde, Türk mutfağının eşsiz meze kültürünü modern bir yaklaşımla sunma vizyonuyla kuruldu. Ailemizden gelen geleneksel tarifler ve yılların deneyimiyle, her tabakta Anadolu'nun zengin lezzet mirasını yansıtıyoruz. Taze malzemeler, özenli hazırlık ve içten gelen misafirperverlik anlayışımızla, her ziyaretinizde kendinizi evinizde hissedeceksiniz. Mezelerimiz, özenle seçilmiş malzemelerle günlük taze olarak hazırlanır ve geleneksel tekniklerin modern mutfakla buluştuğu özel tariflerimizle sunulur.",
            imageUrl: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80',
            buttonText: 'Daha Fazla Bilgi',
            buttonLink: '/about',
            createdAt: new Date(),
            updatedAt: new Date(),
        }
    ];

    await db.insert(homepageAboutSection).values(sampleData);
    
    console.log('✅ Homepage about section seeder completed successfully');
}

main().catch((error) => {
    console.error('❌ Seeder failed:', error);
});