/* ============================================================
   FILTER DEFINITIONS
   Definisi semua filter foto yang tersedia di photobooth.
   Setiap filter memiliki CSS string untuk live preview dan
   canvas rendering.
   ============================================================ */

import type { FilterConfig } from '@/app/types/photobooth';

/**
 * Daftar semua filter yang tersedia.
 * - `css`: Digunakan untuk live preview pada elemen <video> / <img>
 * - `canvasFilter`: Digunakan saat rendering ke canvas untuk download
 */
export const FILTERS: FilterConfig[] = [
  {
    id: 'original',
    label: 'Original',
    css: 'none',
    canvasFilter: 'none',
  },
  {
    id: 'bw',
    label: 'B&W',
    css: 'grayscale(100%)',
    canvasFilter: 'grayscale(100%)',
  },
  {
    id: 'sepia',
    label: 'Sepia',
    css: 'sepia(70%) saturate(1.2)',
    canvasFilter: 'sepia(70%) saturate(1.2)',
  },
  {
    id: 'warm',
    label: 'Warm',
    css: 'saturate(1.3) brightness(1.05) contrast(1.05)',
    canvasFilter: 'saturate(1.3) brightness(1.05) contrast(1.05)',
  },
  {
    id: 'cool',
    label: 'Cool',
    css: 'saturate(0.85) brightness(1.08) hue-rotate(15deg)',
    canvasFilter: 'saturate(0.85) brightness(1.08) hue-rotate(15deg)',
  },
  {
    id: 'film',
    label: 'Film',
    css: 'contrast(1.15) saturate(1.1) brightness(0.95)',
    canvasFilter: 'contrast(1.15) saturate(1.1) brightness(0.95)',
  },
  {
    id: 'soft',
    label: 'Soft',
    css: 'brightness(1.1) contrast(0.9) saturate(0.9)',
    canvasFilter: 'brightness(1.1) contrast(0.9) saturate(0.9)',
  },
  {
    id: 'vivid',
    label: 'Vivid',
    css: 'saturate(1.5) contrast(1.1)',
    canvasFilter: 'saturate(1.5) contrast(1.1)',
  },
];

/**
 * Mendapatkan filter config berdasarkan ID.
 * Mengembalikan filter 'original' jika ID tidak ditemukan.
 */
export function getFilterById(id: string): FilterConfig {
  return FILTERS.find((f) => f.id === id) ?? FILTERS[0];
}

/**
 * Mendapatkan CSS filter string untuk live preview.
 */
export function getFilterCSS(filterId: string): string {
  const filter = getFilterById(filterId);
  return filter.css;
}
