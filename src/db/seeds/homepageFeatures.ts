import { db } from '@/db';
import { homepageFeatures } from '@/db/schema';

async function main() {
    const sampleFeatures = [
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
    ];

    await db.insert(homepageFeatures).values(sampleFeatures);
    
    console.log('✅ Homepage features seeder completed successfully');
}

main().catch((error) => {
    console.error('❌ Seeder failed:', error);
});