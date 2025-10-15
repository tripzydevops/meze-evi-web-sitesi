import { db } from '@/db';
import { homepageFeaturedDishes } from '@/db/schema';

async function main() {
    const sampleFeaturedDishes = [
        {
            menuItemId: 1,
            displayOrder: 1,
            createdAt: new Date(),
            updatedAt: new Date(),
        },
        {
            menuItemId: 3,
            displayOrder: 2,
            createdAt: new Date(),
            updatedAt: new Date(),
        },
        {
            menuItemId: 8,
            displayOrder: 3,
            createdAt: new Date(),
            updatedAt: new Date(),
        }
    ];

    await db.insert(homepageFeaturedDishes).values(sampleFeaturedDishes);
    
    console.log('✅ Homepage featured dishes seeder completed successfully');
}

main().catch((error) => {
    console.error('❌ Seeder failed:', error);
});