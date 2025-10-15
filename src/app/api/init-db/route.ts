import { NextResponse } from 'next/server';
import { db } from '@/db';
import { sql } from 'drizzle-orm';

export async function GET() {
  try {
    // Create tables one by one
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
        category_id INTEGER NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
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

    // Seed categories
    await db.execute(sql`
      INSERT INTO categories (name, display_order)
      SELECT 'Soğuk Mezeler', 1 WHERE NOT EXISTS (SELECT 1 FROM categories WHERE name = 'Soğuk Mezeler')
    `);
    await db.execute(sql`
      INSERT INTO categories (name, display_order)
      SELECT 'Sıcak Mezeler', 2 WHERE NOT EXISTS (SELECT 1 FROM categories WHERE name = 'Sıcak Mezeler')
    `);
    await db.execute(sql`
      INSERT INTO categories (name, display_order)
      SELECT 'Ana Yemekler', 3 WHERE NOT EXISTS (SELECT 1 FROM categories WHERE name = 'Ana Yemekler')
    `);
    await db.execute(sql`
      INSERT INTO categories (name, display_order)
      SELECT 'Tatlılar', 4 WHERE NOT EXISTS (SELECT 1 FROM categories WHERE name = 'Tatlılar')
    `);
    await db.execute(sql`
      INSERT INTO categories (name, display_order)
      SELECT 'İçecekler', 5 WHERE NOT EXISTS (SELECT 1 FROM categories WHERE name = 'İçecekler')
    `);

    // Seed homepage hero
    await db.execute(sql`
      INSERT INTO homepage_hero (title, subtitle, primary_button_text, primary_button_link, secondary_button_text, secondary_button_link, background_image_url)
      SELECT 
        'Bispecial Mezeye Hoş Geldiniz',
        'Geleneksel Türk mutfağının eşsiz lezzetlerini modern bir atmosferde keşfedin',
        'Menüyü İncele',
        '/menu',
        'Rezervasyon Yap',
        '/iletisim',
        'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1920&q=80'
      WHERE NOT EXISTS (SELECT 1 FROM homepage_hero LIMIT 1)
    `);

    // Seed homepage features
    await db.execute(sql`
      INSERT INTO homepage_features (icon, title, description, display_order)
      SELECT 'ChefHat', 'Taze Malzemeler', 'Her gün taze ve kaliteli malzemelerle hazırlanan lezzetler', 1
      WHERE NOT EXISTS (SELECT 1 FROM homepage_features WHERE display_order = 1)
    `);
    await db.execute(sql`
      INSERT INTO homepage_features (icon, title, description, display_order)
      SELECT 'Clock', 'Hızlı Servis', 'Profesyonel ekibimizle hızlı ve kaliteli servis', 2
      WHERE NOT EXISTS (SELECT 1 FROM homepage_features WHERE display_order = 2)
    `);
    await db.execute(sql`
      INSERT INTO homepage_features (icon, title, description, display_order)
      SELECT 'MapPin', 'Merkezi Konum', 'Şehir merkezinde kolay ulaşılabilir lokasyon', 3
      WHERE NOT EXISTS (SELECT 1 FROM homepage_features WHERE display_order = 3)
    `);
    await db.execute(sql`
      INSERT INTO homepage_features (icon, title, description, display_order)
      SELECT 'Star', '5 Yıldız Deneyim', 'Müşteri memnuniyetinde en yüksek standartlar', 4
      WHERE NOT EXISTS (SELECT 1 FROM homepage_features WHERE display_order = 4)
    `);

    // Seed featured section
    await db.execute(sql`
      INSERT INTO homepage_featured_section (section_title, section_description)
      SELECT 
        'Öne Çıkan Lezzetlerimiz',
        'En çok tercih edilen ve damak tadınıza hitap eden özel mezelerimizden bir seçki'
      WHERE NOT EXISTS (SELECT 1 FROM homepage_featured_section LIMIT 1)
    `);

    // Seed featured dishes
    await db.execute(sql`
      INSERT INTO homepage_featured_dishes (name, description, price, image_url, display_order)
      SELECT 'Haydari', 'Süzme yoğurt, sarımsak, dereotu ve maydanoz ile hazırlanan kremamsı meze', '₺45', 'https://images.unsplash.com/photo-1621939514649-280e2ee25f60?w=600&q=80', 1
      WHERE NOT EXISTS (SELECT 1 FROM homepage_featured_dishes WHERE display_order = 1)
    `);
    await db.execute(sql`
      INSERT INTO homepage_featured_dishes (name, description, price, image_url, display_order)
      SELECT 'Sigara Böreği', 'Beyaz peynir ve taze maydanozla hazırlanan çıtır böreklerimiz', '₺65', 'https://images.unsplash.com/photo-1619775407338-313d77fae0f6?w=600&q=80', 2
      WHERE NOT EXISTS (SELECT 1 FROM homepage_featured_dishes WHERE display_order = 2)
    `);
    await db.execute(sql`
      INSERT INTO homepage_featured_dishes (name, description, price, image_url, display_order)
      SELECT 'Yaprak Sarma', 'Zeytinyağlı pirinç ve baharatlarla özenle sarılmış asma yaprakları', '₺60', 'https://images.unsplash.com/photo-1606040097157-c4c36d0b85c8?w=600&q=80', 3
      WHERE NOT EXISTS (SELECT 1 FROM homepage_featured_dishes WHERE display_order = 3)
    `);

    // Seed about section
    await db.execute(sql`
      INSERT INTO homepage_about_section (title, description, image_url, button_text, button_link)
      SELECT 
        'Bispecial Meze Hakkında',
        '2018 yılından bu yana İstanbulun kalbinde, geleneksel Türk mutfağının en seçkin lezzetlerini misafirlerimize sunuyoruz. Aileden gelen tarifler ve yılların deneyimiyle hazırlanan mezelerimiz, taze malzemeler ve özenli sunumumuzla damak tadınıza hitap ediyor.

Her lokmada Anadolunun zengin mutfak kültürünü hissedeceğiniz restoranımızda, samimi ve sıcak bir ortamda unutulmaz bir yemek deneyimi yaşayacaksınız.',
        'https://images.unsplash.com/photo-1552566626-52f8b828add9?w=800&q=80',
        'Hakkımızda Daha Fazla',
        '/hakkimizda'
      WHERE NOT EXISTS (SELECT 1 FROM homepage_about_section LIMIT 1)
    `);

    return NextResponse.json({ 
      success: true, 
      message: 'Database initialized successfully! All tables created and seeded.',
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
    return NextResponse.json({ 
      success: false, 
      error: error.message
    }, { status: 500 });
  }
}