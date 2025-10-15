import { NextRequest, NextResponse } from 'next/server';
import { Pool } from 'pg';

export async function POST(request: NextRequest) {
  // Try multiple environment variables for the connection string
  const connectionString = 
    process.env.DATABASE_URL || 
    process.env.POSTGRES_URL || 
    process.env.POSTGRES_PRISMA_URL ||
    process.env.POSTGRES_URL_NON_POOLING;

  if (!connectionString) {
    return NextResponse.json(
      {
        error: 'No database connection string found',
        checkedVars: ['DATABASE_URL', 'POSTGRES_URL', 'POSTGRES_PRISMA_URL', 'POSTGRES_URL_NON_POOLING'],
        availableVars: Object.keys(process.env).filter(key => 
          key.includes('DATABASE') || key.includes('POSTGRES') || key.includes('SUPABASE')
        )
      },
      { status: 500 }
    );
  }

  const pool = new Pool({ connectionString });

  const results = {
    success: false,
    tablesCreated: [] as string[],
    tablesFailed: [] as string[],
    dataSeeded: {
      categories: 0,
      menuItems: 0,
      homepageHero: 0,
      homepageFeatures: 0,
      homepageFeaturedSection: 0,
      homepageFeaturedDishes: 0,
      homepageAboutSection: 0,
    },
    errors: [] as string[],
  };

  let client;

  try {
    client = await pool.connect();

    // Create tables in exact order
    const tablesToCreate = [
      {
        name: 'categories',
        sql: `
          CREATE TABLE IF NOT EXISTS categories (
            id SERIAL PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            display_order INTEGER NOT NULL DEFAULT 0,
            created_at TIMESTAMP NOT NULL DEFAULT NOW(),
            updated_at TIMESTAMP NOT NULL DEFAULT NOW()
          )
        `,
      },
      {
        name: 'menu_items',
        sql: `
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
        `,
      },
      {
        name: 'homepage_hero',
        sql: `
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
        `,
      },
      {
        name: 'homepage_features',
        sql: `
          CREATE TABLE IF NOT EXISTS homepage_features (
            id SERIAL PRIMARY KEY,
            icon VARCHAR(100) NOT NULL,
            title VARCHAR(255) NOT NULL,
            description TEXT,
            display_order INTEGER NOT NULL DEFAULT 0,
            created_at TIMESTAMP NOT NULL DEFAULT NOW(),
            updated_at TIMESTAMP NOT NULL DEFAULT NOW()
          )
        `,
      },
      {
        name: 'homepage_featured_section',
        sql: `
          CREATE TABLE IF NOT EXISTS homepage_featured_section (
            id SERIAL PRIMARY KEY,
            section_title VARCHAR(255) NOT NULL,
            section_description TEXT,
            created_at TIMESTAMP NOT NULL DEFAULT NOW(),
            updated_at TIMESTAMP NOT NULL DEFAULT NOW()
          )
        `,
      },
      {
        name: 'homepage_featured_dishes',
        sql: `
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
        `,
      },
      {
        name: 'homepage_about_section',
        sql: `
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
        `,
      },
    ];

    // Create tables
    for (const table of tablesToCreate) {
      try {
        await client.query(table.sql);
        results.tablesCreated.push(table.name);
      } catch (error) {
        results.tablesFailed.push(table.name);
        results.errors.push(`Failed to create ${table.name}: ${error}`);
        console.error(`Error creating table ${table.name}:`, error);
      }
    }

    // Check if critical tables were created
    if (results.tablesFailed.length > 0 && results.tablesFailed.includes('categories')) {
      return NextResponse.json(
        {
          error: 'Critical table creation failed',
          details: results,
        },
        { status: 500 }
      );
    }

    // Seed Categories
    try {
      const categoriesData = [
        ['Soğuk Mezeler', 1],
        ['Sıcak Mezeler', 2],
        ['Ana Yemekler', 3],
        ['Tatlılar', 4],
        ['İçecekler', 5],
      ];

      for (const [name, displayOrder] of categoriesData) {
        await client.query(
          'INSERT INTO categories (name, display_order) VALUES ($1, $2)',
          [name, displayOrder]
        );
        results.dataSeeded.categories++;
      }
    } catch (error) {
      results.errors.push(`Failed to seed categories: ${error}`);
      console.error('Error seeding categories:', error);
    }

    // Get category IDs
    let categoryIds: { [key: string]: number } = {};
    try {
      const categoriesResult = await client.query(
        'SELECT id, name FROM categories ORDER BY display_order'
      );
      categoriesResult.rows.forEach((row) => {
        categoryIds[row.name] = row.id;
      });
    } catch (error) {
      results.errors.push(`Failed to retrieve category IDs: ${error}`);
      console.error('Error retrieving category IDs:', error);
    }

    // Seed Menu Items
    try {
      const menuItemsData = [
        // Soğuk Mezeler (6 items)
        [categoryIds['Soğuk Mezeler'], 'Haydari', 'Süzme yoğurt, sarımsak ve dereotu', '₺45', null, true],
        [categoryIds['Soğuk Mezeler'], 'Humus', 'Nohut, tahin ve zeytinyağı', '₺50', null, false],
        [categoryIds['Soğuk Mezeler'], 'Atom', 'Acılı ezme, ceviz ve nar ekşisi', '₺55', null, false],
        [categoryIds['Soğuk Mezeler'], 'Patlıcan Salatası', 'Közlenmiş patlıcan, yoğurt ve sarımsak', '₺50', null, false],
        [categoryIds['Soğuk Mezeler'], 'Cacık', 'Yoğurt, salatalık ve sarımsak', '₺40', null, false],
        [categoryIds['Soğuk Mezeler'], 'Yaprak Sarma', 'Zeytinyağlı pirinç ve baharat', '₺60', null, true],
        // Sıcak Mezeler (6 items)
        [categoryIds['Sıcak Mezeler'], 'Sigara Böreği', 'Beyaz peynir ve maydanozlu börek', '₺65', null, true],
        [categoryIds['Sıcak Mezeler'], 'Kalamar Tava', 'Çıtır kalamar halkası', '₺85', null, false],
        [categoryIds['Sıcak Mezeler'], 'Mucver', 'Kabak mücveri, yoğurtlu sos', '₺55', null, false],
        [categoryIds['Sıcak Mezeler'], 'Arnavut Ciğeri', 'Kızarmış ciğer, soğan ve sumak', '₺95', null, true],
        [categoryIds['Sıcak Mezeler'], 'Mantı', 'Yoğurtlu Türk mantısı', '₺70', null, false],
        [categoryIds['Sıcak Mezeler'], 'Paçanga Böreği', 'Pastırma ve kaşarlı börek', '₺75', null, false],
        // Ana Yemekler (4 items)
        [categoryIds['Ana Yemekler'], 'İskender Kebap', 'Döner, yoğurt ve tereyağı', '₺120', null, false],
        [categoryIds['Ana Yemekler'], 'Adana Kebap', 'Acılı kıyma kebap', '₺110', null, false],
        [categoryIds['Ana Yemekler'], 'Tavuk Şiş', 'Marine edilmiş tavuk şiş', '₺95', null, false],
        [categoryIds['Ana Yemekler'], 'Karışık Izgara', 'Çeşitli ızgara etler', '₺140', null, false],
        // Tatlılar (2 items)
        [categoryIds['Tatlılar'], 'Künefe', 'Tel kadayıf ve peynir tatlısı', '₺80', null, false],
        [categoryIds['Tatlılar'], 'Sütlaç', 'Fırın sütlaç', '₺50', null, false],
        // İçecekler (2 items)
        [categoryIds['İçecekler'], 'Ayran', 'Geleneksel yoğurt içeceği', '₺15', null, false],
        [categoryIds['İçecekler'], 'Şalgam Suyu', 'Acılı turşu suyu', '₺15', null, false],
      ];

      for (const [categoryId, name, description, price, imageUrl, popular] of menuItemsData) {
        await client.query(
          'INSERT INTO menu_items (category_id, name, description, price, image_url, popular) VALUES ($1, $2, $3, $4, $5, $6)',
          [categoryId, name, description, price, imageUrl, popular]
        );
        results.dataSeeded.menuItems++;
      }
    } catch (error) {
      results.errors.push(`Failed to seed menu items: ${error}`);
      console.error('Error seeding menu items:', error);
    }

    // Seed Homepage Hero
    try {
      await client.query(
        `INSERT INTO homepage_hero (title, subtitle, primary_button_text, primary_button_link, secondary_button_text, secondary_button_link, background_image_url) 
         VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [
          'Bispecial Meze\'ye Hoş Geldiniz',
          'Geleneksel Türk lezzetlerinin modern yorumu',
          'Menüyü İncele',
          '/menu',
          'Rezervasyon Yap',
          '/reservation',
          '/images/hero-bg.jpg',
        ]
      );
      results.dataSeeded.homepageHero++;
    } catch (error) {
      results.errors.push(`Failed to seed homepage hero: ${error}`);
      console.error('Error seeding homepage hero:', error);
    }

    // Seed Homepage Features
    try {
      const featuresData = [
        ['ChefHat', 'Şef Yapımı', 'Deneyimli şeflerimiz tarafından özenle hazırlanmış yemekler', 1],
        ['Clock', 'Hızlı Servis', 'Siparişleriniz en kısa sürede hazırlanır ve servis edilir', 2],
        ['MapPin', 'Merkezi Konum', 'Şehrin kalbinde, kolay ulaşılabilir konumumuz', 3],
        ['Star', 'Kaliteli Hizmet', 'Müşteri memnuniyeti odaklı profesyonel hizmet anlayışı', 4],
      ];

      for (const [icon, title, description, displayOrder] of featuresData) {
        await client.query(
          'INSERT INTO homepage_features (icon, title, description, display_order) VALUES ($1, $2, $3, $4)',
          [icon, title, description, displayOrder]
        );
        results.dataSeeded.homepageFeatures++;
      }
    } catch (error) {
      results.errors.push(`Failed to seed homepage features: ${error}`);
      console.error('Error seeding homepage features:', error);
    }

    // Seed Homepage Featured Section
    try {
      await client.query(
        'INSERT INTO homepage_featured_section (section_title, section_description) VALUES ($1, $2)',
        [
          'Öne Çıkan Lezzetlerimiz',
          'Müşterilerimizin en çok tercih ettiği ve bizim önerdiğimiz özel lezzetler',
        ]
      );
      results.dataSeeded.homepageFeaturedSection++;
    } catch (error) {
      results.errors.push(`Failed to seed homepage featured section: ${error}`);
      console.error('Error seeding homepage featured section:', error);
    }

    // Seed Homepage Featured Dishes
    try {
      const featuredDishesData = [
        ['Haydari', 'Süzme yoğurt, sarımsak ve dereotu ile hazırlanmış nefis bir meze', '₺45', '/images/haydari.jpg', 1],
        ['Sigara Böreği', 'Çıtır çıtır kızarmış, beyaz peynir ve maydanozlu börek', '₺65', '/images/sigara-boregi.jpg', 2],
        ['Yaprak Sarma', 'Zeytinyağlı, pirinç ve baharatlarla hazırlanmış geleneksel lezzet', '₺60', '/images/yaprak-sarma.jpg', 3],
      ];

      for (const [name, description, price, imageUrl, displayOrder] of featuredDishesData) {
        await client.query(
          'INSERT INTO homepage_featured_dishes (name, description, price, image_url, display_order) VALUES ($1, $2, $3, $4, $5)',
          [name, description, price, imageUrl, displayOrder]
        );
        results.dataSeeded.homepageFeaturedDishes++;
      }
    } catch (error) {
      results.errors.push(`Failed to seed homepage featured dishes: ${error}`);
      console.error('Error seeding homepage featured dishes:', error);
    }

    // Seed Homepage About Section
    try {
      await client.query(
        'INSERT INTO homepage_about_section (title, description, image_url, button_text, button_link) VALUES ($1, $2, $3, $4, $5)',
        [
          'Bispecial Meze Hakkında',
          'Bispecial Meze olarak, Türk mutfağının zengin lezzet mirasını modern bir yaklaşımla sunuyoruz. 2020 yılında kurulan restoranımız, geleneksel tarifleri günümüz damak zevkine uyarlayarak, her yaştan misafirimize unutulmaz bir yemek deneyimi sunmayı amaçlıyor. Taze malzemeler, özenli hazırlık ve samimi hizmet anlayışımızla, her ziyaretinizde kendinizi evinizde hissetmenizi sağlıyoruz. Deneyimli şef kadromuz, her tabağı bir sanat eseri gibi hazırlayarak, gözlerinizi ve damağınızı memnun ediyor. Aileniz ve sevdiklerinizle birlikte geçireceğiniz keyifli anların adresi Bispecial Meze\'de sizi bekliyoruz.',
          '/images/about-restaurant.jpg',
          'Hakkımızda',
          '/about',
        ]
      );
      results.dataSeeded.homepageAboutSection++;
    } catch (error) {
      results.errors.push(`Failed to seed homepage about section: ${error}`);
      console.error('Error seeding homepage about section:', error);
    }

    results.success = results.tablesFailed.length === 0;

    return NextResponse.json(
      {
        success: results.success,
        message: results.success 
          ? 'Database setup completed successfully' 
          : 'Database setup completed with some errors',
        tablesCreated: results.tablesCreated,
        tablesFailed: results.tablesFailed,
        dataSeeded: results.dataSeeded,
        errors: results.errors.length > 0 ? results.errors : undefined,
      },
      { status: results.success ? 200 : 500 }
    );
  } catch (error) {
    console.error('Database setup error:', error);
    return NextResponse.json(
      {
        error: 'Internal server error during database setup',
        details: error instanceof Error ? error.message : String(error),
        results,
      },
      { status: 500 }
    );
  } finally {
    if (client) {
      client.release();
    }
    await pool.end();
  }
}