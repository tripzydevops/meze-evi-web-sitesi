import { db } from '@/db';
import { categories } from '@/db/schema';

async function main() {
    const sampleCategories = [
        {
            name: 'Soğuk Mezeler',
            displayOrder: 1,
            hidden: false,
            createdAt: new Date(),
            updatedAt: new Date(),
        },
        {
            name: 'Sıcak Mezeler',
            displayOrder: 2,
            hidden: false,
            createdAt: new Date(),
            updatedAt: new Date(),
        },
        {
            name: 'Ana Yemekler',
            displayOrder: 3,
            hidden: false,
            createdAt: new Date(),
            updatedAt: new Date(),
        },
        {
            name: 'İçecekler',
            displayOrder: 4,
            hidden: false,
            createdAt: new Date(),
            updatedAt: new Date(),
        }
    ];

    await db.insert(categories).values(sampleCategories);
    
    console.log('✅ Categories seeder completed successfully');
}

main().catch((error) => {
    console.error('❌ Seeder failed:', error);
});