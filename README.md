# Bispecial Meze House - Web Application

A modern, dynamic web application for "Bispecial Meze House," featuring a full-featured landing page and a robust admin panel for content management. Built with Next.js 15, Drizzle ORM, and Better Auth.

## 🚀 Technologies

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router, Turbopack)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **UI Components**: [Shadcn UI](https://ui.shadcn.com/) & [Lucide Icons](https://lucide.dev/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Database**: [LibSQL](https://github.com/tursodatabase/libsql) / PostgreSQL with [Drizzle ORM](https://orm.drizzle.team/)
- **Authentication**: [Better Auth](https://www.better-auth.com/)
- **Cloud Storage**: [Vercel Blob](https://vercel.com/docs/storage/vercel-blob)
- **Payment**: [Stripe](https://stripe.com/) (Integration ready)

## ✨ Features

- **Dynamic Landing Page**:
  - Customizable Hero Section
  - Highlighted "Features" section
  - "Featured Dishes" showcase with direct menu links
  - Elegant "About Us" section with image support
  - Instagram integration via clickable CTA
- **Admin Panel**:
  - Secure login with role-based access
  - Real-time management of Homepage content
  - Menu item and Category management (CRUD)
  - Image upload support via Vercel Blob
  - Visibility toggles for menu items and categories
- **Responsive Design**: Fully optimized for mobile, tablet, and desktop views.
- **Modern UI**: Smooth animations, glassmorphism effects, and premium typography.

## 🛠️ Getting Started

### Prerequisites

- Node.js (Latest LTS)
- NPM or Bun

### Installation

1. Clone the repository and install dependencies:
   ```bash
   npm install
   ```

2. Set up your environment variables:
   Copy `.env.example` to `.env` and fill in the required values (Database URL, Auth Secret, Vercel Blob Token, etc.).

3. Push the database schema:
   ```bash
   npm run db:push
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 📂 Project Structure

- `src/app`: Next.js App Router (Pages & API Routes)
- `src/components`: Reusable UI and layout components
- `src/db`: Database schema and Drizzle configuration
- `src/lib`: Utility functions and shared logic
- `src/hooks`: Custom React hooks
- `public`: Static assets (fonts, images)
