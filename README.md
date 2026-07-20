# 📸 YukPhoto - Web Photobooth Aesthetic

![YukPhoto Preview](/public/images/yukphoto-banner.jpg) <!-- Ganti dengan banner asli jika ada -->

**YukPhoto** adalah web aplikasi photobooth gratis bernuansa pastel (Korean-style aesthetic) yang memungkinkan kamu berfoto seru dengan berbagai filter dan layout bingkai (frame) polaroid. Aplikasi ini dibuat **100% Client-Side**, yang berarti semua foto diproses langsung di *browser* kamu dan **tidak pernah disimpan di server mana pun**, sehingga privasi sangat terjamin.

## ✨ Fitur Utama

- **🎨 8+ Filter Aesthetic**: Mulai dari Original, Black & White, Sepia, Warm, Cool, Vintage, Fade, hingga Cinematic.
- **🖼️ 4 Layout Frame**: Pilih frame favoritmu (Polaroid 1 Foto, Strip 3 Foto, Strip 4 Foto, atau Grid 2x2).
- **👥 Live Multiplayer (Sesi Foto Bareng)**: Bikin *room* dengan kode 6 digit dan undang temanmu! Layar akan terbelah (Split-Screen) dan kalian bisa foto bareng secara *real-time* meskipun berbeda device/tempat (menggunakan teknologi WebRTC P2P).
- **🔒 100% Aman & Private**: Tanpa *database*. Menggunakan Canvas API dan WebRTC murni sehingga jejak fotomu otomatis hilang saat tab ditutup.
- **📱 Responsive UI**: Tampilan cantik dan optimal baik di Desktop, Tablet, maupun Smartphone.

## 🛠️ Teknologi yang Digunakan

- **Framework**: [Next.js](https://nextjs.org/) (App Router)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Realtime / P2P**: [PeerJS](https://peerjs.com/) (WebRTC)
- **Image Processing**: Native HTML5 Canvas API

## 🚀 Menjalankan Secara Lokal (Local Development)

Ikuti langkah-langkah di bawah ini untuk menjalankan YukPhoto di komputermu:

1. **Clone repository ini**
   ```bash
   git clone https://github.com/Rifaiiii04/yukphoto-photobooth.git
   cd yukphoto-photobooth
   ```

2. **Install dependencies**
   ```bash
   npm install
   # atau
   yarn install
   # atau
   pnpm install
   ```

3. **Jalankan Development Server**
   ```bash
   npm run dev
   # atau
   yarn dev
   # atau
   pnpm dev
   ```

4. **Buka di Browser**
   Buka [http://localhost:3000](http://localhost:3000) dan mulai berfoto! 📸

## 🌐 Deployment

Karena aplikasi ini sepenuhnya *client-side* (Static/SSG), kamu bisa men-deploy-nya dengan sangat mudah dan **GRATIS** ke [Vercel](https://vercel.com/) atau [Netlify](https://www.netlify.com/).

### Deploy ke Vercel (Rekomendasi)
Pilih salah satu cara:
1. Hubungkan repository GitHub kamu ke Vercel Dashboard, Vercel akan otomatis mengenali ini sebagai project Next.js.
2. Atau jalankan command via Vercel CLI:
   ```bash
   npx vercel
   ```

## 🤝 Kontribusi

Saran, perbaikan *bug*, atau penambahan fitur (seperti desain frame baru) sangat diterima! Silakan lakukan *Fork* repository ini dan buat *Pull Request*.

---
Dibuat dengan ❤️ untuk mengabadikan momen serumu!
