# Rezzkiel Illusion Platform

> **Unlock the illusion. Dive into immersive, original webcomics and character lore.**

![ASP.NET Core](https://img.shields.io/badge/Backend-ASP.NET_Core_10-512BD4?style=for-the-badge&logo=dotnet)
![Next.js](https://img.shields.io/badge/Frontend-Next.js_15-000000?style=for-the-badge&logo=next.js)
![Tailwind v4](https://img.shields.io/badge/Styling-Tailwind_v4_Comfort-38B2AC?style=for-the-badge&logo=tailwind-css)

Rezzkiel Illusion is a high-fidelity platform designed for hosting premium webcomics and character lore. Built with a "Comfort Midnight Indigo" aesthetic, it prioritizes cinematic immersion and deep social engagement.

---

## ✨ Core Features & Overhaul highlights

* 🌌 **Nexus Galaxy Map**: A revolutionary orbital navigation system for exploring story categories through interactive, rotating planetary resonance.
* 🚀 **Hyperspace News Hub**: Cinematic transition-driven broadcast system featuring immersive, Twitter-style detail views and natural-ratio media rendering.
* 🎭 **Social Pulse (Comments)**: Advanced community engagement featuring Lore Stickers, Neon Identity Glows for creators/admins, and fluid entry animations.
* 🛠️ **Identity Tuner**: Personalized profile customization system including cinematic ambient backdrops, banner synchronization, and hidden management controls.
* 📖 **Story & Chapter Management**: Robust admin dashboard for publishing comic series sequentially with dynamic cover art and page arrays.
* 💳 **Commerce Integration**: Seamless chapter unlocking and purchase validation (Phase 5).
* 📱 **Webtoon Vertical Reader**: Smooth, responsive continuous-scroll reader tailored perfectly across desktop and mobile devices.

---

## 🏗️ System Architecture 
The application utilizes an advanced Monorepo layout:

- **`/backend`**: Architected leveraging Repository & Service principles using C# ASP.NET Core 10.
- **`/frontend`**: App Router environment using Next.js 15, Tailwind CSS v4, and Framer Motion.

---

## 🚀 Getting Started

Ensure you have installed **Node.js (LTS)**, **.NET 10.0 SDK**, and a running instance of **PostgreSQL**.

### 1. Database Setup
Update the connection string in `Rezzkiel_Illusion/backend/RezzkielIllusion.API/appsettings.json` (or create it from the example).

### 2. Launch Backend
```bash
cd backend/RezzkielIllusion.API
dotnet ef database update
dotnet run
```

### 3. Launch Frontend
```bash
cd frontend
npm install
npm run dev
```

---

## 📜 License
Provided strictly under the [MIT License](LICENSE).
