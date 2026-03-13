import { pgTable, serial, text, varchar, timestamp, integer, boolean } from 'drizzle-orm/pg-core';

export const categories = pgTable('categories', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  displayOrder: integer('display_order').notNull().default(0),
  hidden: boolean('hidden').default(false),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const menuItems = pgTable('menu_items', {
  id: serial('id').primaryKey(),
  categoryId: integer('category_id').notNull().references(() => categories.id, { onDelete: 'cascade' }),
  name: varchar('name', { length: 255 }).notNull(),
  description: text('description'),
  price: varchar('price', { length: 50 }),
  imageUrl: text('image_url'),
  popular: boolean('popular').default(false),
  hidden: boolean('hidden').default(false),
  servingSize: varchar('serving_size', { length: 100 }),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const homepageHero = pgTable('homepage_hero', {
  id: serial('id').primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  subtitle: text('subtitle'),
  primaryButtonText: varchar('primary_button_text', { length: 100 }),
  primaryButtonLink: varchar('primary_button_link', { length: 255 }),
  secondaryButtonText: varchar('secondary_button_text', { length: 100 }),
  secondaryButtonLink: varchar('secondary_button_link', { length: 255 }),
  backgroundImageUrl: text('background_image_url'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const homepageFeatures = pgTable('homepage_features', {
  id: serial('id').primaryKey(),
  icon: varchar('icon', { length: 100 }).notNull(),
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description'),
  displayOrder: integer('display_order').notNull().default(0),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const homepageFeaturedSection = pgTable('homepage_featured_section', {
  id: serial('id').primaryKey(),
  sectionTitle: varchar('section_title', { length: 255 }).notNull(),
  sectionDescription: text('section_description'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const homepageFeaturedDishes = pgTable('homepage_featured_dishes', {
  id: serial('id').primaryKey(),
  menuItemId: integer('menu_item_id').notNull().references(() => menuItems.id, { onDelete: 'cascade' }),
  displayOrder: integer('display_order').notNull().default(0),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const homepageAboutSection = pgTable('homepage_about_section', {
  id: serial('id').primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description').notNull(),
  imageUrl: text('image_url'),
  buttonText: varchar('button_text', { length: 100 }),
  buttonLink: varchar('button_link', { length: 255 }),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const contactInfo = pgTable('contact_info', {
  id: serial('id').primaryKey(),
  type: text('type').notNull(),
  title: text('title').notNull(),
  content: text('content').notNull(),
  subContent: text('sub_content'),
  icon: text('icon').notNull(),
  displayOrder: integer('display_order').notNull().default(0),
  hidden: boolean('hidden').default(false),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});


// Categories, Menu Items, and other content tables remain unchanged.