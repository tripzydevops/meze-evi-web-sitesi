import { db } from '@/db';
import { homepageFeaturedSection } from '@/db/schema';

async function main() {
    const sampleData = [
        {
            sectionTitle: 'Öne Çıkan Lezzetlerimiz',
            sectionDescription: 'En çok tercih edilen ve misafirlerimizin favorisi haline gelmiş özel mezelerimizden bir seçki',
            createdAt: new Date(),
            updatedAt: new Date(),
        }
    ];
    
    await db.insert(homepageFeaturedSection).values(sampleData);
    
    console.log('✅ Seeder completed successfully');
}

main().catch((error) => {
    console.error('❌ Seeder failed:', error);
});