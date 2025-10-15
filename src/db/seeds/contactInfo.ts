import { db } from '@/db';
import { contactInfo } from '@/db/schema';

async function main() {
    const sampleContactInfo = [
        {
            type: 'address',
            title: 'Adres',
            content: 'Nispetiye Caddesi No: 45',
            subContent: 'Etiler, Beşiktaş / İstanbul',
            icon: 'MapPin',
            displayOrder: 1,
            hidden: false,
            createdAt: new Date(),
            updatedAt: new Date(),
        },
        {
            type: 'phone',
            title: 'Telefon',
            content: '+90 212 555 12 34',
            subContent: 'Rezervasyon için arayın',
            icon: 'Phone',
            displayOrder: 2,
            hidden: false,
            createdAt: new Date(),
            updatedAt: new Date(),
        },
        {
            type: 'email',
            title: 'E-posta',
            content: 'info@bispecialmeze.com',
            subContent: 'Her zaman yanıtlıyoruz',
            icon: 'Mail',
            displayOrder: 3,
            hidden: false,
            createdAt: new Date(),
            updatedAt: new Date(),
        },
        {
            type: 'hours',
            title: 'Çalışma Saatleri',
            content: 'Pazartesi - Pazar',
            subContent: '12:00 - 23:00',
            icon: 'Clock',
            displayOrder: 4,
            hidden: false,
            createdAt: new Date(),
            updatedAt: new Date(),
        }
    ];

    await db.insert(contactInfo).values(sampleContactInfo);
    
    console.log('✅ Contact info seeder completed successfully');
}

main().catch((error) => {
    console.error('❌ Seeder failed:', error);
});