import { NextResponse } from 'next/server';
import { db } from '@/db';
import { 
  categories, 
  menuItems, 
  homepageHero, 
  homepageFeatures,
  homepageFeaturedSection,
  homepageFeaturedDishes,
  homepageAboutSection 
} from '@/db/schema';
import { sql } from 'drizzle-orm';

export async function GET() {
  try {
    // Test connection first
    await db.execute(sql`SELECT 1`);

    // Create tables using raw SQL to ensure proper schema
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS categories (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        display_order INTEGER NOT NULL DEFAULT 0,
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP NOT NULL DEFAULT NOW()
      )
    `);

    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS menu_items (
        id SERIAL PRIMARY KEY,
        category_id INTEGER NOT NULL REFERENCES categories(id),
        name VARCHAR(255) NOT NULL,
        description TEXT,
        price VARCHAR(50),
        image_url TEXT,
        popular BOOLEAN DEFAULT false,
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP NOT NULL DEFAULT NOW()
      )
    `);

    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS homepage_hero (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        subtitle TEXT,
        primary_button_text VARCHAR(100),
        primary_button_link VARCHAR(255),
        secondary_button_text VARCHAR(100),
        secondary_button_link VARCHAR(255),
        background_image_url TEXT,
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP NOT NULL DEFAULT NOW()
      )
    `);

    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS homepage_features (
        id SERIAL PRIMARY KEY,
        icon VARCHAR(100) NOT NULL,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        display_order INTEGER NOT NULL DEFAULT 0,
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP NOT NULL DEFAULT NOW()
      )
    `);

    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS homepage_featured_section (
        id SERIAL PRIMARY KEY,
        section_title VARCHAR(255) NOT NULL,
        section_description TEXT,
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP NOT NULL DEFAULT NOW()
      )
    `);

    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS homepage_featured_dishes (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        price VARCHAR(50) NOT NULL,
        image_url TEXT,
        display_order INTEGER NOT NULL DEFAULT 0,
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP NOT NULL DEFAULT NOW()
      )
    `);

    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS homepage_about_section (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        image_url TEXT,
        button_text VARCHAR(100),
        button_link VARCHAR(255),
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP NOT NULL DEFAULT NOW()
      )
    `);

    // Seed data for categories
    await db.execute(sql`
      INSERT INTO categories (name, display_order, created_at, updated_at)
      VALUES 
        ('Soğuk Mezeler', 1, NOW(), NOW()),
        ('Sıcak Mezeler', 2, NOW(), NOW()),
        ('Ana Yemekler', 3, NOW(), NOW()),
        ('Tatlılar', 4, NOW(), NOW()),
        ('İçecekler', 5, NOW(), NOW())
      ON CONFLICT DO NOTHING
    `);

    // Seed homepage hero
    await db.execute(sql`
      INSERT INTO homepage_hero (title, subtitle, primary_button_text, primary_button_link, secondary_button_text, secondary_button_link, background_image_url)
      VALUES (
        'Bispecial Meze''ye Hoş Geldiniz',
        'Geleneksel Türk mutfağının eşsiz lezzetlerini modern bir atmosferde keşfedin',
        'Menüyü İncele',
        '/menu',
        'Rezervasyon Yap',
        '/contact',
        'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1920&q=80'
      )
      ON CONFLICT DO NOTHING
    `);

    // Seed homepage features
    await db.execute(sql`
      INSERT INTO homepage_features (icon, title, description, display_order)
      VALUES
        ('ChefHat', 'Taze Malzemeler', 'Her gün taze ve kaliteli malzemelerle hazırlanan lezzetler', 1),
        ('Clock', 'Hızlı Servis', 'Profesyonel ekibimizle hızlı ve kaliteli servis', 2),
        ('MapPin', 'Merkezi Konum', 'Şehir merkezinde kolay ulaşılabilir lokasyon', 3),
        ('Star', '5 Yıldız Deneyim', 'Müşteri memnuniyetinde en yüksek standartlar', 4)
      ON CONFLICT DO NOTHING
    `);

    // Seed featured section
    await db.execute(sql`
      INSERT INTO homepage_featured_section (section_title, section_description)
      VALUES (
        'Öne Çıkan Lezzetlerimiz',
        'En çok tercih edilen ve damak tadınıza hitap eden özel mezelerimizden bir seçki'
      )
      ON CONFLICT DO NOTHING
    `);

    // Seed featured dishes
    await db.execute(sql`
      INSERT INTO homepage_featured_dishes (name, description, price, image_url, display_order)
      VALUES
        ('Haydari', 'Süzme yoğurt, sarımsak, dereotu ve maydanoz ile hazırlanan kremamsı meze', '₺45', 'https://images.unsplash.com/photo-1621939514649-280e2ee25f60?w=600&q=80', 1),
        ('Sigara Böreği', 'Beyaz peynir ve taze maydanozla hazırlanan çıtır böreklerimiz', '₺65', 'https://images.unsplash.com/photo-1619775407338-313d77fae0f6?w=600&q=80', 2),
        ('Yaprak Sarma', 'Zeytinyağlı pirinç ve baharatlarla özenle sarılmış asma yaprakları', '₺60', 'https://images.unsplash.com/photo-1606040097157-c4c36d0b85c8?w=600&q=80', 3)
      ON CONFLICT DO NOTHING
    `);

    // Seed about section
    await db.execute(sql`
      INSERT INTO homepage_about_section (title, description, image_url, button_text, button_link)
      VALUES (
        'Bispecial Meze Hakkında',
        '2018 yılından bu yana İstanbul''un kalbinde, geleneksel Türk mutfağının en seçkin lezzetlerini misafirlerimize sunuyoruz. Aileden gelen tarifler ve yılların deneyimiyle hazırlanan mezelerimiz, taze malzemeler ve özenli sunumumuzla damak tadınıza hitap ediyor. Her lokmada Anadolu''nun zengin mutfak kültürünü hissedeceğiniz restoranımızda, samimi ve sıcak bir ortamda unutulmaz bir yemek deneyimi yaşayacaksınız.',
        'https://images.unsplash.com/photo-1552566626-52f8b828add9?w=800&q=80',
        'Hakkımızda Daha Fazla',
        '/about'
      )
      ON CONFLICT DO NOTHING
    `);

    // Seed menu items - Get category IDs first
    const categoryIds = await db.execute(sql`SELECT id FROM categories ORDER BY display_order`);
    
    return NextResponse.json({ 
      success: true, 
      message: 'Database tables created and seeded successfully!',
      tables: [
        'categories',
        'menu_items', 
        'homepage_hero',
        'homepage_features',
        'homepage_featured_section',
        'homepage_featured_dishes',
        'homepage_about_section'
      ]
    });
  } catch (error: any) {
    console.error('Database setup error:', error);
    return NextResponse.json({ 
      success: false, 
      error: error.message,
      details: error.toString()
    }, { status: 500 });
  }
}