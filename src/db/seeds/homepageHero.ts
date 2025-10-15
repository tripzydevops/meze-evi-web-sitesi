import { db } from '@/db';
import { homepageHero } from '@/db/schema';

async function main() {
    const sampleHomepageHero = [
        {
            title: 'Bi Special Meze',
            subtitle: 'Geleneksel Türk mutfağının vazgeçilmez lezzetlerini, modern dokunuşlarla bir araya getiriyoruz',
            primaryButtonText: 'Menüyü İncele',
            primaryButtonLink: '/menu',
            secondaryButtonText: 'İletişim',
            secondaryButtonLink: '/contact',
            backgroundImageUrl: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=1920&q=80',
            createdAt: new Date(),
            updatedAt: new Date(),
        }
    ];

    await db.insert(homepageHero).values(sampleHomepageHero);
    
    console.log('✅ Homepage hero seeder completed successfully');
}

main().catch((error) => {
    console.error('❌ Seeder failed:', error);
});