/* ============================================================
   LANDING PAGE
   Halaman utama YukPhoto.
   Sections: Navbar → Hero → How It Works → Features → CTA → Footer
   Server component (tidak perlu 'use client').
   ============================================================ */

import Link from 'next/link';
import { Camera } from 'lucide-react';
import Hero from '@/app/components/landing/Hero';
import HowItWorks from '@/app/components/landing/HowItWorks';
import Features from '@/app/components/landing/Features';
import Footer from '@/app/components/landing/Footer';

export default function Home() {
  return (
    <div className="flex flex-col flex-1 min-h-screen">
      {/* Navigation bar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[var(--color-bg)]/80 backdrop-blur-md border-b border-[var(--color-border)]">
        <div className="max-w-6xl mx-auto flex items-center justify-between px-6 py-3.5">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[var(--color-primary)] flex items-center justify-center">
              <Camera size={16} className="text-white" />
            </div>
            <span className="text-xl font-bold text-[var(--color-text)]">
              Yuk<span className="text-[var(--color-primary)]">Photo</span>
            </span>
          </Link>
          <div className="flex items-center gap-4">
            <a
              href="#fitur"
              className="hidden sm:inline text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text)] transition-colors"
            >
              Fitur
            </a>
            <Link
              href="/photobooth"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[var(--color-primary)] text-white text-sm font-medium hover:bg-[var(--color-primary-hover)] transition-colors"
            >
              <Camera size={16} />
              Mulai Foto
            </Link>
          </div>
        </div>
      </nav>

      {/* Main content */}
      <main className="flex-1">
        <Hero />
        <HowItWorks />
        <Features />

        {/* Final CTA Section */}
        <section className="w-full px-6 py-16 md:py-20">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-[var(--color-text)] mb-4">
              Siap Buat Kenangan Baru?
            </h2>
            <p className="text-[var(--color-text-secondary)] mb-8 max-w-md mx-auto">
              Foto aesthetic gratis tanpa ribet. Langsung buka, foto, download. Tidak perlu daftar!
            </p>
            <Link href="/photobooth">
              <button className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-[var(--color-primary)] text-white text-lg font-semibold hover:bg-[var(--color-primary-hover)] transition-all duration-200 hover:scale-105 cursor-pointer shadow-lg">
                <Camera size={22} />
                Mulai Foto Sekarang
              </button>
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
