import { db } from '@/db';
import { sql } from 'drizzle-orm';
import { menuItems } from '@/db/schema';
import { eq } from 'drizzle-orm';

async function main() {
    // Clear existing featured dishes
    await db.execute(sql`DELETE FROM homepage_featured_dishes`);
    
    console.log('🗑️  Cleared existing featured dishes');

    // Fetch menu items with IDs 1, 3, and 7
    const targetIds = [1, 3, 7];
    const items = await db
        .select()
        .from(menuItems)
        .where(
            sql`${menuItems.id} IN (${sql.join(targetIds.map(id => sql`${id}`), sql`, `)})`
        );

    if (items.length === 0) {
        console.error('❌ No menu items found with IDs 1, 3, or 7. Please seed menu_items first.');
        return;
    }

    // Sort items by the target IDs order for consistent display order
    const sortedItems = targetIds
        .map(id => items.find(item => item.id === id))
        .filter(Boolean);

    // Insert featured dishes with proper data from menu items
    for (let i = 0; i < sortedItems.length; i++) {
        const item = sortedItems[i];
        const displayOrder = i + 1;

        await db.execute(
            sql`INSERT INTO homepage_featured_dishes (
                menu_item_id, 
                display_order, 
                name, 
                description, 
                price, 
                image_url
            ) VALUES (
                ${item.id}, 
                ${displayOrder}, 
                ${item.name}, 
                ${item.description}, 
                ${item.price}, 
                ${item.imageUrl}
            )`
        );

        console.log(`✅ Added featured dish: ${item.name} (display order: ${displayOrder})`);
    }

    console.log('✅ Homepage featured dishes seeder completed successfully');
}

main().catch((error) => {
    console.error('❌ Seeder failed:', error);
});