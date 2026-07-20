/* ============================================================
   PHOTOBOOTH PAGE
   Halaman photobooth utama. Server component wrapper.
   Layout yang lebih lebar untuk mendukung side-by-side view.
   ============================================================ */

import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, Camera } from 'lucide-react';
import PhotoboothApp from '@/app/components/photobooth/PhotoboothApp';

export const metadata: Metadata = {
  title: 'Mulai Foto - YukPhoto',
  description:
    'Ambil foto dengan filter aesthetic dan frame polaroid ala Korean photobooth. Gratis, tanpa penyimpanan data.',
};

export default function PhotoboothPage() {
  return (
    <div className="flex flex-col flex-1 min-h-screen bg-[var(--color-bg)]">
      {/* Top bar */}
      <header className="w-full bg-[var(--color-surface)] border-b border-[var(--color-border)] px-4 py-3 sticky top-0 z-40">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text)] transition-colors"
          >
            <ArrowLeft size={18} />
            <span className="hidden sm:inline">Kembali</span>
          </Link>
          <Link href="/" className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-[var(--color-primary)] flex items-center justify-center">
              <Camera size={14} className="text-white" />
            </div>
            <span className="text-lg font-bold text-[var(--color-text)]">
              Yuk<span className="text-[var(--color-primary)]">Photo</span>
            </span>
          </Link>
          <div className="w-20" />
        </div>
      </header>

      {/* Photobooth app — wider container for desktop */}
      <main className="flex-1 flex flex-col max-w-5xl mx-auto w-full">
        <PhotoboothApp />
      </main>
    </div>
  );
}
