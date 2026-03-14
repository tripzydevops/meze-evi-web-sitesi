import { pgTable, serial, text, varchar, timestamp, integer, boolean } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

export const categories = pgTable('categories', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  displayOrder: integer('display_order').notNull().default(0),
  hidden: boolean('hidden').default(false),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const categoriesRelations = relations(categories, ({ many }) => ({
  menuItems: many(menuItems),
}));

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

export const menuItemsRelations = relations(menuItems, ({ one, many }) => ({
  category: one(categories, {
    fields: [menuItems.categoryId],
    references: [categories.id],
  }),
  featuredDishes: many(homepageFeaturedDishes),
}));

export const homepageHero = pgTable('homepage_hero', {
  id: serial('id').primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  titleStyle: text('title_style'),
  subtitle: text('subtitle'),
  subtitleStyle: text('subtitle_style'),
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

export const homepageFeaturedDishesRelations = relations(homepageFeaturedDishes, ({ one }) => ({
  menuItem: one(menuItems, {
    fields: [homepageFeaturedDishes.menuItemId],
    references: [menuItems.id],
  }),
}));

export const homepageAboutSection = pgTable('homepage_about_section', {
  id: serial('id').primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  titleStyle: text('title_style'),
  description: text('description').notNull(),
  descriptionStyle: text('description_style'),
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

export const galleryImages = pgTable('gallery_images', {
  id: serial('id').primaryKey(),
  url: text('url').notNull(),
  alt: varchar('alt', { length: 255 }),
  displayOrder: integer('display_order').notNull().default(0),
  hidden: boolean('hidden').default(false),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const testimonials = pgTable('testimonials', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  content: text('content').notNull(),
  rating: integer('rating').notNull().default(5),
  imageUrl: text('image_url'),
  displayOrder: integer('display_order').notNull().default(0),
  hidden: boolean('hidden').default(false),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const cateringInquiries = pgTable('catering_inquiries', {
  id: serial('id').primaryKey(),
  fullName: varchar('full_name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull(),
  phone: varchar('phone', { length: 50 }).notNull(),
  eventDate: timestamp('event_date'),
  guestCount: integer('guest_count'),
  message: text('message'),
  status: varchar('status', { length: 50 }).default('pending'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});