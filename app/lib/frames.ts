/* ============================================================
   FRAME LAYOUT DEFINITIONS
   Konfigurasi layout frame yang tersedia: polaroid, strip, grid.
   ============================================================ */

import type {
  FrameLayout,
  FrameLayoutType,
  FrameRenderOptions,
  CanvasDimensions,
  PhotoSlot,
} from '@/app/types/photobooth';

/**
 * Daftar semua layout frame yang tersedia.
 */
export const FRAME_LAYOUTS: FrameLayout[] = [
  {
    id: 'polaroid',
    label: 'Polaroid',
    photoCount: 1,
    description: 'Satu foto dengan frame polaroid klasik',
  },
  {
    id: 'strip-3',
    label: 'Strip 3',
    photoCount: 3,
    description: '3 foto vertikal ala Korean photobooth',
  },
  {
    id: 'strip-4',
    label: 'Strip 4',
    photoCount: 4,
    description: '4 foto vertikal dalam satu strip',
  },
  {
    id: 'grid-2x2',
    label: 'Grid 2x2',
    photoCount: 4,
    description: '4 foto dalam layout grid',
  },
];

/**
 * Mendapatkan frame layout berdasarkan ID.
 */
export function getFrameLayout(id: FrameLayoutType): FrameLayout {
  return FRAME_LAYOUTS.find((f) => f.id === id) ?? FRAME_LAYOUTS[0];
}

/**
 * Default render options untuk frame.
 */
export const DEFAULT_RENDER_OPTIONS: FrameRenderOptions = {
  backgroundColor: '#FFFFFF',
  padding: 24,
  bottomPadding: 64,
  borderRadius: 0,
  brandingText: 'YukPhoto',
  showDate: true,
  textColor: '#B8A9C9',
  fontFamily: 'Poppins, sans-serif',
};

/* ----------------------------------------------------------
   Kalkulasi Dimensi Canvas
   ---------------------------------------------------------- */

/** Ukuran foto dasar (aspect ratio 4:3) */
const BASE_PHOTO_WIDTH = 400;
const BASE_PHOTO_HEIGHT = 300;

/**
 * Menghitung dimensi canvas dan posisi slot foto berdasarkan layout.
 *
 * @param layoutId - ID layout yang dipilih
 * @param options  - Opsi rendering (padding, dll)
 * @returns Dimensi canvas beserta posisi setiap slot foto
 */
export function calculateCanvasDimensions(
  layoutId: FrameLayoutType,
  options: FrameRenderOptions = DEFAULT_RENDER_OPTIONS
): CanvasDimensions {
  const { padding, bottomPadding } = options;
  const gap = 12; // Jarak antar foto

  switch (layoutId) {
    case 'polaroid': {
      const photoW = BASE_PHOTO_WIDTH;
      const photoH = BASE_PHOTO_HEIGHT;
      return {
        width: photoW + padding * 2,
        height: photoH + padding + bottomPadding,
        photoSlots: [{ x: padding, y: padding, width: photoW, height: photoH }],
      };
    }

    case 'strip-3': {
      const photoW = 280;
      const photoH = 210;
      const slots: PhotoSlot[] = [];
      const totalHeight =
        padding + photoH * 3 + gap * 2 + bottomPadding;

      for (let i = 0; i < 3; i++) {
        slots.push({
          x: padding,
          y: padding + i * (photoH + gap),
          width: photoW,
          height: photoH,
        });
      }

      return {
        width: photoW + padding * 2,
        height: totalHeight,
        photoSlots: slots,
      };
    }

    case 'strip-4': {
      const photoW = 280;
      const photoH = 200;
      const slots: PhotoSlot[] = [];
      const totalHeight =
        padding + photoH * 4 + gap * 3 + bottomPadding;

      for (let i = 0; i < 4; i++) {
        slots.push({
          x: padding,
          y: padding + i * (photoH + gap),
          width: photoW,
          height: photoH,
        });
      }

      return {
        width: photoW + padding * 2,
        height: totalHeight,
        photoSlots: slots,
      };
    }

    case 'grid-2x2': {
      const photoW = 240;
      const photoH = 180;
      const slots: PhotoSlot[] = [];
      const totalWidth = padding * 2 + photoW * 2 + gap;
      const totalHeight = padding + photoH * 2 + gap + bottomPadding;

      for (let row = 0; row < 2; row++) {
        for (let col = 0; col < 2; col++) {
          slots.push({
            x: padding + col * (photoW + gap),
            y: padding + row * (photoH + gap),
            width: photoW,
            height: photoH,
          });
        }
      }

      return {
        width: totalWidth,
        height: totalHeight,
        photoSlots: slots,
      };
    }

    default:
      return calculateCanvasDimensions('polaroid', options);
  }
}
