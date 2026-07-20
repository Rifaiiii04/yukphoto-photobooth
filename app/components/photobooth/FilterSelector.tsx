/* ============================================================
   FILTER SELECTOR COMPONENT
   Horizontal scrollable filter thumbnails.
   Menampilkan nama filter dan preview warna representatif.
   Jika ada preview image dari kamera, gunakan sebagai thumbnail.
   ============================================================ */

'use client';

import { FILTERS } from '@/app/lib/filters';

interface FilterSelectorProps {
  /** ID filter yang sedang aktif */
  activeFilterId: string;
  /** Callback saat user memilih filter */
  onSelect: (filterId: string) => void;
  /** Data URL preview gambar (dari kamera) — opsional */
  previewImage?: string;
}

/**
 * Warna representatif untuk setiap filter ketika belum ada preview image.
 * Ini memastikan thumbnail tidak pernah kosong/hitam.
 */
const FILTER_COLORS: Record<string, string> = {
  original: '#F2C4D0',
  bw: '#9E9E9E',
  sepia: '#C4A882',
  warm: '#F0B87A',
  cool: '#8ECAE6',
  film: '#D4A373',
  soft: '#E8C8D8',
  vivid: '#E85D75',
};

export default function FilterSelector({
  activeFilterId,
  onSelect,
  previewImage,
}: FilterSelectorProps) {
  return (
    <div className="w-full">
      <p className="text-xs font-medium text-[var(--color-text-muted)] mb-2 uppercase tracking-wider">
        Filter
      </p>
      <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-1">
        {FILTERS.map((filter) => {
          const isActive = activeFilterId === filter.id;
          return (
            <button
              key={filter.id}
              onClick={() => onSelect(filter.id)}
              className="flex flex-col items-center gap-1.5 flex-shrink-0 group"
            >
              {/* Thumbnail */}
              <div
                className={`w-14 h-14 rounded-xl overflow-hidden border-2 transition-all duration-200 ${
                  isActive
                    ? 'border-[var(--color-primary)] shadow-md scale-105'
                    : 'border-[var(--color-border)] group-hover:border-[var(--color-primary)]/50 group-hover:scale-105'
                }`}
              >
                <div
                  className="w-full h-full flex items-center justify-center overflow-hidden"
                  style={{
                    filter: filter.css === 'none' ? undefined : filter.css,
                  }}
                >
                  {previewImage ? (
                    <img
                      src={previewImage}
                      alt={filter.label}
                      className="w-full h-full object-cover camera-mirror"
                      draggable={false}
                    />
                  ) : (
                    /* Colored placeholder jika belum ada preview */
                    <div
                      className="w-full h-full"
                      style={{
                        backgroundColor: FILTER_COLORS[filter.id] ?? '#F2C4D0',
                      }}
                    />
                  )}
                </div>
              </div>

              {/* Label */}
              <span
                className={`text-[10px] font-medium transition-colors ${
                  isActive
                    ? 'text-[var(--color-primary)]'
                    : 'text-[var(--color-text-muted)] group-hover:text-[var(--color-text-secondary)]'
                }`}
              >
                {filter.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
