/* ============================================================
   FRAME SELECTOR COMPONENT
   Pilihan layout frame: Polaroid, Strip 3, Strip 4, Grid 2x2.
   Menampilkan preview visual yang lebih kaya dan informatif.
   ============================================================ */

'use client';

import { Image, Grid2x2, StretchVertical, LayoutGrid } from 'lucide-react';
import { FRAME_LAYOUTS } from '@/app/lib/frames';
import type { FrameLayoutType } from '@/app/types/photobooth';

interface FrameSelectorProps {
  /** Layout yang sedang aktif */
  activeLayoutId: FrameLayoutType;
  /** Callback saat user memilih layout */
  onSelect: (layoutId: FrameLayoutType) => void;
}

/**
 * Icon dan info untuk setiap layout frame.
 */
const FRAME_META: Record<FrameLayoutType, {
  icon: typeof Image;
  photoLabel: string;
  colorAccent: string;
}> = {
  'polaroid': {
    icon: Image,
    photoLabel: '1 Foto',
    colorAccent: 'var(--color-accent)',
  },
  'strip-3': {
    icon: StretchVertical,
    photoLabel: '3 Foto',
    colorAccent: 'var(--color-secondary)',
  },
  'strip-4': {
    icon: StretchVertical,
    photoLabel: '4 Foto',
    colorAccent: 'var(--color-primary)',
  },
  'grid-2x2': {
    icon: Grid2x2,
    photoLabel: '4 Foto',
    colorAccent: 'var(--color-accent-alt)',
  },
};

/**
 * Mini preview visual untuk setiap layout frame.
 * Lebih detail dan informatif daripada versi sebelumnya.
 */
function FramePreview({ layoutId, isActive }: { layoutId: FrameLayoutType; isActive: boolean }) {
  const accentColor = isActive ? 'var(--color-primary)' : 'var(--color-accent)';
  const boxClass = 'rounded-[2px]';

  switch (layoutId) {
    case 'polaroid':
      return (
        <div className="w-12 h-14 bg-white p-1 pb-3.5 shadow-sm mx-auto rounded-[2px] rotate-[-2deg] transition-transform duration-200 group-hover:rotate-0">
          <div className={`w-full h-full ${boxClass}`} style={{ backgroundColor: accentColor }} />
        </div>
      );
    case 'strip-3':
      return (
        <div className="w-8 h-14 bg-white p-[3px] pb-2.5 shadow-sm mx-auto rounded-[2px] flex flex-col gap-[2px]">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className={`w-full flex-1 ${boxClass}`}
              style={{
                backgroundColor: accentColor,
                opacity: isActive ? 1 - i * 0.15 : 1,
              }}
            />
          ))}
        </div>
      );
    case 'strip-4':
      return (
        <div className="w-8 h-14 bg-white p-[3px] pb-2 shadow-sm mx-auto rounded-[2px] flex flex-col gap-[2px]">
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className={`w-full flex-1 ${boxClass}`}
              style={{
                backgroundColor: accentColor,
                opacity: isActive ? 1 - i * 0.1 : 1,
              }}
            />
          ))}
        </div>
      );
    case 'grid-2x2':
      return (
        <div className="w-14 h-12 bg-white p-[3px] pb-2 shadow-sm mx-auto rounded-[2px] grid grid-cols-2 gap-[2px]">
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className={`${boxClass}`}
              style={{
                backgroundColor: accentColor,
                opacity: isActive ? 1 - i * 0.1 : 1,
              }}
            />
          ))}
        </div>
      );
    default:
      return null;
  }
}

export default function FrameSelector({
  activeLayoutId,
  onSelect,
}: FrameSelectorProps) {
  return (
    <div className="w-full">
      <p className="text-xs font-medium text-[var(--color-text-muted)] mb-3 uppercase tracking-wider">
        Pilih Layout
      </p>
      <div className="grid grid-cols-4 w-full gap-2">
        {FRAME_LAYOUTS.map((layout) => {
          const isActive = activeLayoutId === layout.id;
          const meta = FRAME_META[layout.id];
          const IconComp = meta.icon;

          return (
            <button
              key={layout.id}
              onClick={() => onSelect(layout.id)}
              className={`group relative flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all duration-200 cursor-pointer ${isActive
                ? 'border-[var(--color-primary)] bg-[var(--color-surface-hover)] shadow-md'
                : 'border-[var(--color-border)] bg-[var(--color-surface)] hover:border-[var(--color-primary)]/50 hover:shadow-sm'
                }`}
            >
              {/* Active indicator dot */}
              {isActive && (
                <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-[var(--color-primary)] border-2 border-[var(--color-surface)]" />
              )}

              {/* Preview */}
              <FramePreview layoutId={layout.id} isActive={isActive} />

              {/* Label */}
              <div className="text-center">
                <p className={`text-xs font-semibold transition-colors ${isActive ? 'text-[var(--color-primary)]' : 'text-[var(--color-text)]'
                  }`}>
                  {layout.label}
                </p>
                <div className="flex items-center justify-center gap-1 mt-0.5">
                  <IconComp size={10} className="text-[var(--color-text-muted)]" />
                  <span className="text-[9px] text-[var(--color-text-muted)]">
                    {meta.photoLabel}
                  </span>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
