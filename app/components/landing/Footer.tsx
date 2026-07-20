/* ============================================================
   FOOTER COMPONENT
   Footer minimalis dengan branding dan info privasi.
   ============================================================ */

import { Heart, Shield } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full px-6 py-8 mt-auto border-t border-[var(--color-border)]">
      <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Brand */}
        <div className="flex items-center gap-2">
          <span className="text-lg font-bold text-[var(--color-primary)]">
            YukPhoto
          </span>
          <span className="text-sm text-[var(--color-text-muted)]">
            &copy; {currentYear}
          </span>
        </div>

        {/* Privacy badge */}
        <div className="flex items-center gap-2 text-xs text-[var(--color-text-muted)]">
          <Shield size={14} className="text-[var(--color-success)]" />
          <span>Foto kamu tidak pernah disimpan di server</span>
        </div>

        {/* Made with love */}
        <div className="flex items-center gap-1 text-xs text-[var(--color-text-muted)]">
          <span>Dibuat dengan</span>
          <Heart size={12} className="text-[var(--color-primary)]" fill="var(--color-primary)" />
          <span>di Indonesia</span>
        </div>
      </div>
    </footer>
  );
}
