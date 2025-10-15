import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { sql } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  const tablesCreated: string[] = [];
  const tablesFailed: { table: string; error: string }[] = [];
  let dataSeeded = false;

  try {
    // 1. Create categories table
    try {
      await db.execute(sql`
        CREATE TABLE IF NOT EXISTS categories (
          id SERIAL PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          display_order INTEGER NOT NULL DEFAULT 0,
          created_at TIMESTAMP NOT NULL DEFAULT NOW(),
          updated_at TIMESTAMP NOT NULL DEFAULT NOW()
        )
      `);
      tablesCreated.push('categories');
    } catch (error) {
      tablesFailed.push({ table: 'categories', error: String(error) });
    }

    // 2. Create menu_items table
    try {
      await db.execute(sql`
        CREATE TABLE IF NOT EXISTS menu_items (
          id SERIAL PRIMARY KEY,
          category_id INTEGER NOT NULL REFERENCES categories(id),
          name VARCHAR(255) NOT NULL,
          description TEXT,
          price VARCHAR(50),
          image_url TEXT,
          popular BOOLEAN DEFAULT FALSE,
          created_at TIMESTAMP NOT NULL DEFAULT NOW(),
          updated_at TIMESTAMP NOT NULL DEFAULT NOW()
        )
      `);
      tablesCreated.push('menu_items');
    } catch (error) {
      tablesFailed.push({ table: 'menu_items', error: String(error) });
    }

    // 3. Create homepage_hero table
    try {
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
      tablesCreated.push('homepage_hero');
    } catch (error) {
      tablesFailed.push({ table: 'homepage_hero', error: String(error) });
    }

    // 4. Create homepage_features table
    try {
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
      tablesCreated.push('homepage_features');
    } catch (error) {
      tablesFailed.push({ table: 'homepage_features', error: String(error) });
    }

    // 5. Create homepage_featured_section table
    try {
      await db.execute(sql`
        CREATE TABLE IF NOT EXISTS homepage_featured_section (
          id SERIAL PRIMARY KEY,
          section_title VARCHAR(255) NOT NULL,
          section_description TEXT,
          created_at TIMESTAMP NOT NULL DEFAULT NOW(),
          updated_at TIMESTAMP NOT NULL DEFAULT NOW()
        )
      `);
      tablesCreated.push('homepage_featured_section');
    } catch (error) {
      tablesFailed.push({ table: 'homepage_featured_section', error: String(error) });
    }

    // 6. Create homepage_featured_dishes table
    try {
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
      tablesCreated.push('homepage_featured_dishes');
    } catch (error) {
      tablesFailed.push({ table: 'homepage_featured_dishes', error: String(error) });
    }

    // 7. Create homepage_about_section table
    try {
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
      tablesCreated.push('homepage_about_section');
    } catch (error) {
      tablesFailed.push({ table: 'homepage_about_section', error: String(error) });
    }

    // SEEDING DATA
    try {
      // Clear existing data
      await db.execute(sql`TRUNCATE TABLE menu_items, categories, homepage_hero, homepage_features, homepage_featured_section, homepage_featured_dishes, homepage_about_section RESTART IDENTITY CASCADE`);

      // Insert categories
      await db.execute(sql`
        INSERT INTO categories (name, display_order, created_at, updated_at)
        VALUES 
          ('Soğuk Mezeler', 1, NOW(), NOW()),
          ('Sıcak Mezeler', 2, NOW(), NOW()),
          ('Ana Yemekler', 3, NOW(), NOW()),
          ('Tatlılar', 4, NOW(), NOW()),
          ('İçecekler', 5, NOW(), NOW())
      `);

      // Get category IDs
      const categoryResult = await db.execute(sql`SELECT id, name FROM categories ORDER BY display_order`);
      const categories = categoryResult.rows;
      
      const sogukMezelerCat = categories.find((c: any) => c.name === 'Soğuk Mezeler');
      const sicakMezelerCat = categories.find((c: any) => c.name === 'Sıcak Mezeler');
      const anaYemeklerCat = categories.find((c: any) => c.name === 'Ana Yemekler');
      const tatlilarCat = categories.find((c: any) => c.name === 'Tatlılar');
      const iceceklerCat = categories.find((c: any) => c.name === 'İçecekler');

      // Insert menu items - Soğuk Mezeler
      await db.execute(sql`
        INSERT INTO menu_items (category_id, name, description, price, image_url, popular, created_at, updated_at)
        VALUES 
          (${sogukMezelerCat?.id}, 'Haydari', 'Süzme yoğurt, sarımsak ve dereotu', '₺45', NULL, TRUE, NOW(), NOW()),
          (${sogukMezelerCat?.id}, 'Humus', 'Nohut, tahin ve zeytinyağı', '₺50', NULL, FALSE, NOW(), NOW()),
          (${sogukMezelerCat?.id}, 'Atom', 'Acılı ezme, ceviz ve nar ekşisi', '₺55', NULL, FALSE, NOW(), NOW()),
          (${sogukMezelerCat?.id}, 'Patlıcan Salatası', 'Közlenmiş patlıcan, yoğurt ve sarımsak', '₺50', NULL, FALSE, NOW(), NOW()),
          (${sogukMezelerCat?.id}, 'Cacık', 'Yoğurt, salatalık ve sarımsak', '₺40', NULL, FALSE, NOW(), NOW()),
          (${sogukMezelerCat?.id}, 'Yaprak Sarma', 'Zeytinyağlı pirinç ve baharat', '₺60', NULL, TRUE, NOW(), NOW())
      `);

      // Insert menu items - Sıcak Mezeler
      await db.execute(sql`
        INSERT INTO menu_items (category_id, name, description, price, image_url, popular, created_at, updated_at)
        VALUES 
          (${sicakMezelerCat?.id}, 'Sigara Böreği', 'Beyaz peynir ve maydanozlu börek', '₺65', NULL, TRUE, NOW(), NOW()),
          (${sicakMezelerCat?.id}, 'Kalamar Tava', 'Çıtır kalamar halkası', '₺85', NULL, FALSE, NOW(), NOW()),
          (${sicakMezelerCat?.id}, 'Mucver', 'Kabak mücveri, yoğurtlu sos', '₺55', NULL, FALSE, NOW(), NOW()),
          (${sicakMezelerCat?.id}, 'Arnavut Ciğeri', 'Kızarmış ciğer, soğan ve sumak', '₺95', NULL, TRUE, NOW(), NOW()),
          (${sicakMezelerCat?.id}, 'Mantı', 'Yoğurtlu Türk mantısı', '₺70', NULL, FALSE, NOW(), NOW()),
          (${sicakMezelerCat?.id}, 'Paçanga Böreği', 'Pastırma ve kaşarlı börek', '₺75', NULL, FALSE, NOW(), NOW())
      `);

      // Insert menu items - Ana Yemekler
      await db.execute(sql`
        INSERT INTO menu_items (category_id, name, description, price, image_url, popular, created_at, updated_at)
        VALUES 
          (${anaYemeklerCat?.id}, 'İskender Kebap', 'Döner, yoğurt ve tereyağı', '₺120', NULL, FALSE, NOW(), NOW()),
          (${anaYemeklerCat?.id}, 'Adana Kebap', 'Acılı kıyma kebap', '₺110', NULL, FALSE, NOW(), NOW()),
          (${anaYemeklerCat?.id}, 'Tavuk Şiş', 'Marine edilmiş tavuk şiş', '₺95', NULL, FALSE, NOW(), NOW()),
          (${anaYemeklerCat?.id}, 'Karışık Izgara', 'Çeşitli ızgara etler', '₺140', NULL, FALSE, NOW(), NOW())
      `);

      // Insert menu items - Tatlılar
      await db.execute(sql`
        INSERT INTO menu_items (category_id, name, description, price, image_url, popular, created_at, updated_at)
        VALUES 
          (${tatlilarCat?.id}, 'Künefe', 'Tel kadayıf ve peynir tatlısı', '₺80', NULL, FALSE, NOW(), NOW()),
          (${tatlilarCat?.id}, 'Sütlaç', 'Fırın sütlaç', '₺50', NULL, FALSE, NOW(), NOW())
      `);

      // Insert menu items - İçecekler
      await db.execute(sql`
        INSERT INTO menu_items (category_id, name, description, price, image_url, popular, created_at, updated_at)
        VALUES 
          (${iceceklerCat?.id}, 'Ayran', 'Geleneksel yoğurt içeceği', '₺15', NULL, FALSE, NOW(), NOW()),
          (${iceceklerCat?.id}, 'Şalgam Suyu', 'Acılı turşu suyu', '₺15', NULL, FALSE, NOW(), NOW())
      `);

      // Insert homepage_hero
      await db.execute(sql`
        INSERT INTO homepage_hero (title, subtitle, primary_button_text, primary_button_link, secondary_button_text, secondary_button_link, background_image_url, created_at, updated_at)
        VALUES 
          ('Bispecial Meze''ye Hoş Geldiniz', 'Geleneksel Türk mutfağının eşsiz lezzetlerini modern bir atmosferde keşfedin', 'Menüyü İncele', '/menu', 'Rezervasyon Yap', '/contact', 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1920&q=80', NOW(), NOW())
      `);

      // Insert homepage_features
      await db.execute(sql`
        INSERT INTO homepage_features (icon, title, description, display_order, created_at, updated_at)
        VALUES 
          ('ChefHat', 'Taze Malzemeler', 'Her gün taze ve kaliteli malzemelerle hazırlanan lezzetler', 1, NOW(), NOW()),
          ('Clock', 'Hızlı Servis', 'Profesyonel ekibimizle hızlı ve kaliteli servis', 2, NOW(), NOW()),
          ('MapPin', 'Merkezi Konum', 'Şehir merkezinde kolay ulaşılabilir lokasyon', 3, NOW(), NOW()),
          ('Star', '5 Yıldız Deneyim', 'Müşteri memnuniyetinde en yüksek standartlar', 4, NOW(), NOW())
      `);

      // Insert homepage_featured_section
      await db.execute(sql`
        INSERT INTO homepage_featured_section (section_title, section_description, created_at, updated_at)
        VALUES 
          ('Öne Çıkan Lezzetlerimiz', 'En çok tercih edilen ve damak tadınıza hitap eden özel mezelerimizden bir seçki', NOW(), NOW())
      `);

      // Insert homepage_featured_dishes
      await db.execute(sql`
        INSERT INTO homepage_featured_dishes (name, description, price, image_url, display_order, created_at, updated_at)
        VALUES 
          ('Haydari', 'Süzme yoğurt, sarımsak, dereotu ve maydanoz ile hazırlanan kremamsı meze', '₺45', 'https://images.unsplash.com/photo-1621939514649-280e2ee25f60?w=600&q=80', 1, NOW(), NOW()),
          ('Sigara Böreği', 'Beyaz peynir ve taze maydanozla hazırlanan çıtır böreklerimiz', '₺65', 'https://images.unsplash.com/photo-1619775407338-313d77fae0f6?w=600&q=80', 2, NOW(), NOW()),
          ('Yaprak Sarma', 'Zeytinyağlı pirinç ve baharatlarla özenle sarılmış asma yaprakları', '₺60', 'https://images.unsplash.com/photo-1606040097157-c4c36d0b85c8?w=600&q=80', 3, NOW(), NOW())
      `);

      // Insert homepage_about_section
      await db.execute(sql`
        INSERT INTO homepage_about_section (title, description, image_url, button_text, button_link, created_at, updated_at)
        VALUES 
          ('Bispecial Meze Hakkında', '2018 yılından bu yana İstanbul''un kalbinde, geleneksel Türk mutfağının en seçkin lezzetlerini misafirlerimize sunuyoruz. Aileden gelen tarifler ve yılların deneyimiyle hazırlanan mezelerimiz, taze malzemeler ve özenli sunumumuzla damak tadınıza hitap ediyor. Her lokmada Anadolu''nun zengin mutfak kültürünü hissedeceğiniz restoranımızda, samimi ve sıcak bir ortamda unutulmaz bir yemek deneyimi yaşayacaksınız.', 'https://images.unsplash.com/photo-1552566626-52f8b828add9?w=800&q=80', 'Hakkımızda Daha Fazla', '/about', NOW(), NOW())
      `);

      dataSeeded = true;
    } catch (error) {
      console.error('Seeding error:', error);
      return NextResponse.json({
        success: false,
        message: 'Tables created but seeding failed',
        tablesCreated,
        tablesFailed,
        dataSeeded: false,
        seedError: String(error)
      }, { status: 500 });
    }

    // Return success response
    return NextResponse.json({
      success: tablesFailed.length === 0,
      message: tablesFailed.length === 0 
        ? 'All tables created and data seeded successfully' 
        : `${tablesCreated.length} tables created, ${tablesFailed.length} failed. Data seeding: ${dataSeeded ? 'success' : 'failed'}`,
      tablesCreated,
      tablesFailed,
      dataSeeded,
      details: {
        totalTables: 7,
        successfulTables: tablesCreated.length,
        failedTables: tablesFailed.length,
        categoriesSeeded: 5,
        menuItemsSeeded: 20,
        homepageDataSeeded: true
      }
    }, { status: 200 });

  } catch (error) {
    console.error('Database setup error:', error);
    return NextResponse.json({
      success: false,
      message: 'Database setup failed',
      error: String(error),
      tablesCreated,
      tablesFailed,
      dataSeeded: false
    }, { status: 500 });
  }
}