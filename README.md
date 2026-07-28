# 🌿 Plantio — AI-Powered Botanical & Plant Care Platform

[![Live Demo](https://img.shields.io/badge/Live_Demo-plantio--plants.vercel.app-10b981?style=for-the-badge&logo=vercel)](https://plantio-plants.vercel.app)
[![Node.js](https://img.shields.io/badge/Backend-Node.js-339933?style=for-the-badge&logo=node.js)](https://nodejs.org)
[![React](https://img.shields.io/badge/Frontend-React_Vite-61DAFB?style=for-the-badge&logo=react)](https://reactjs.org)
[![Supabase](https://img.shields.io/badge/Database-Supabase_PostgreSQL-3ECF8E?style=for-the-badge&logo=supabase)](https://supabase.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](LICENSE)

**Plantio** is a full-stack, AI-powered plant care and botanical companion web application. It empowers plant enthusiasts, home gardeners, and botanists to keep their green collection thriving with instant AI disease diagnosis, visual growth timeline tracking, intelligent watering schedules, and a database of over 300,000+ plant species.

---

## 🚀 Key Features

### 1. 🤖 AI Doctor & Instant Disease Scanner
- **Vision & Text Analysis**: Upload or snap a photo of any leaf to identify 740+ plant diseases, pests (aphids, root rot, spider mites), and nutrient deficiencies in real time.
- **Organic Remedies**: Receive instant, step-by-step organic remedies and tailored care recommendations.
- **Interactive AI Chat Modal**: Floating AI assistant available on every page to answer all botanical questions.

### 2. 📸 Plant Growth Journal & Progress Photos
- **Photo Timeline Carousel**: Track how much your plant has grown over time! Save dated progress photos (`Day 1`, `First Sprout`, `Month 1`, `Month 3`, `Month 6`, `Year 1`).
- **Client-Side Image Compression**: Automatic HTML5 Canvas compression (max 450px, JPEG 0.7) ensures instant, lightweight photo uploads under 30KB.
- **Persistent Cloud Logs**: Photo timeline entries sync seamlessly with your personal cloud garden.

### 3. 💧 Intelligent Water Tracker & Reminders
- **Custom Care Frequencies**: Set custom watering intervals (`Every day`, `Every 3 days`, `Every 7 days`, `Every 14 days`, `Every 30 days`).
- **Watering Status Badges**: Visual indicators (`Watered (X days left)`, `Due Today`, `Water Plant Now`).
- **1-Click Quick Water & Batch Water All**: Mark individual plants or your entire garden as watered with a single click.

### 4. 🌿 300,000+ Botanical Species & Disease Library
- **Live Search & Category Filtering**: Instant search across 300,000+ plant species with category filters (`All`, `Indoor Plants`, `Outdoor Plants`, `Watering Guides`, `Disease Fixes`).
- **Wikipedia API Integration**: Fetch verified botanical articles, scientific names, lighting requirements, and propagation guides live.
- **Curated Articles & Blog**: High-quality botanical articles organized by category.

---

## 🛠️ Technology Stack

| Layer | Technologies Used |
| :--- | :--- |
| **Frontend** | React 18, Vite, React Router DOM v6, Vanilla CSS3 (Custom Glassmorphism Design System) |
| **Backend** | Node.js native `http` server REST API, Crypto HMAC Auth |
| **Database** | Supabase PostgreSQL (`users`, `user_plants` with fallback packed metadata) |
| **AI Integration** | Gemini Pro Vision API / AI Doctor Gateway |
| **Deployment** | Vercel (Frontend SPA) + Render (Node.js REST API Backend) |

---

## ⚡ Quick Start & Local Setup

### 1. Prerequisites
- **Node.js**: v18.x or higher
- **npm**: v9.x or higher

### 2. Clone Repository
```bash
git clone https://github.com/Sumanthreddy4620/Plantio.git
cd Plantio
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Environment Configuration
Create a `.env` file in the root directory:
```env
PORT=5000
SUPABASE_URL=https://your-supabase-url.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key
GEMINI_API_KEY=your-gemini-api-key
```

### 5. Run Backend Server
```bash
npm run server
```

### 6. Run Frontend Application
```bash
npm run dev
```
Open your browser at `http://localhost:5173`.

---

## 🗄️ Database Schema

Run this SQL snippet in your **Supabase Dashboard → SQL Editor**:

```sql
-- Users table
CREATE TABLE IF NOT EXISTS public.users (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  first_name text NOT NULL,
  last_name text NOT NULL,
  email text UNIQUE NOT NULL,
  password text NOT NULL,
  created_at timestamp with time zone DEFAULT now()
);

-- User Plants table
CREATE TABLE IF NOT EXISTS public.user_plants (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_id bigint REFERENCES public.users(id) ON DELETE CASCADE,
  title text NOT NULL,
  text text,
  img_url text,
  watering_frequency text DEFAULT '7',
  last_watered text,
  growth_journal text,
  created_at timestamp with time zone DEFAULT now()
);
```

---

## 📄 License
Distributed under the **MIT License**. See `LICENSE` for more information.

---
Made with 🌿 for plant lovers by **Sumanth Reddy**.
 