/* ============================================================
   CANVAS UTILITIES
   Fungsi-fungsi untuk merender foto ke canvas dengan frame
   polaroid/strip dan mengekspor hasilnya.
   ============================================================ */

import type {
  FrameLayoutType,
  FrameRenderOptions,
  PhotoSlot,
} from '@/app/types/photobooth';
import { calculateCanvasDimensions, DEFAULT_RENDER_OPTIONS } from '@/app/lib/frames';
import { getFilterById } from '@/app/lib/filters';

/**
 * Memuat gambar dari data URL dan mengembalikan HTMLImageElement.
 */
function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('Gagal memuat gambar'));
    img.src = src;
  });
}

/**
 * Menggambar satu foto ke dalam slot tertentu di canvas.
 * Foto akan di-crop agar mengisi slot dengan aspect ratio yang benar (cover).
 */
function drawPhotoInSlot(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  slot: PhotoSlot,
  filter: string = 'none'
): void {
  ctx.save();

  // Terapkan filter
  if (filter !== 'none') {
    ctx.filter = filter;
  }

  // Hitung crop area agar foto mengisi slot (object-fit: cover)
  const imgRatio = img.width / img.height;
  const slotRatio = slot.width / slot.height;

  let srcX = 0;
  let srcY = 0;
  let srcW = img.width;
  let srcH = img.height;

  if (imgRatio > slotRatio) {
    // Gambar lebih lebar, crop sisi kiri-kanan
    srcW = img.height * slotRatio;
    srcX = (img.width - srcW) / 2;
  } else {
    // Gambar lebih tinggi, crop atas-bawah
    srcH = img.width / slotRatio;
    srcY = (img.height - srcH) / 2;
  }

  ctx.drawImage(img, srcX, srcY, srcW, srcH, slot.x, slot.y, slot.width, slot.height);
  ctx.restore();
}

/**
 * Menggambar teks branding dan tanggal di bagian bawah frame.
 */
function drawBranding(
  ctx: CanvasRenderingContext2D,
  canvasWidth: number,
  canvasHeight: number,
  options: FrameRenderOptions
): void {
  const { brandingText, showDate, textColor, fontFamily, bottomPadding, padding } = options;
  const centerX = canvasWidth / 2;
  const bottomAreaY = canvasHeight - bottomPadding + padding;

  ctx.textAlign = 'center';
  ctx.textBaseline = 'top';

  // Branding text
  ctx.fillStyle = textColor;
  ctx.font = `600 16px ${fontFamily}`;
  ctx.fillText(brandingText, centerX, bottomAreaY + 4);

  // Tanggal
  if (showDate) {
    const now = new Date();
    const dateStr = now.toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
    ctx.font = `400 11px ${fontFamily}`;
    ctx.fillStyle = textColor;
    ctx.fillText(dateStr, centerX, bottomAreaY + 26);
  }
}

/**
 * Merender foto-foto ke dalam canvas dengan frame layout tertentu.
 *
 * @param photoDataUrls - Array data URL foto yang akan dirender
 * @param layoutId      - Jenis layout frame
 * @param filterId      - ID filter yang diterapkan
 * @param options       - Opsi rendering tambahan
 * @returns Canvas element yang sudah dirender
 */
export async function renderPhotoFrame(
  photoDataUrls: string[],
  layoutId: FrameLayoutType,
  filterId: string = 'original',
  options: FrameRenderOptions = DEFAULT_RENDER_OPTIONS
): Promise<HTMLCanvasElement> {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    throw new Error('Gagal membuat canvas context');
  }

  // Hitung dimensi canvas
  const dimensions = calculateCanvasDimensions(layoutId, options);
  canvas.width = dimensions.width;
  canvas.height = dimensions.height;

  // Gambar background putih
  ctx.fillStyle = options.backgroundColor;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Dapatkan filter config
  const filterConfig = getFilterById(filterId);

  // Muat dan gambar setiap foto ke slot-nya
  const photoPromises = photoDataUrls.map((url) => loadImage(url));
  const images = await Promise.all(photoPromises);

  for (let i = 0; i < dimensions.photoSlots.length; i++) {
    const slot = dimensions.photoSlots[i];
    const img = images[i % images.length]; // Ulangi foto jika kurang

    drawPhotoInSlot(ctx, img, slot, filterConfig.canvasFilter);
  }

  // Gambar branding
  drawBranding(ctx, canvas.width, canvas.height, options);

  return canvas;
}

/**
 * Mengekspor canvas sebagai Blob untuk didownload.
 */
export function exportCanvasAsBlob(
  canvas: HTMLCanvasElement,
  format: string = 'image/png',
  quality: number = 0.95
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) {
          resolve(blob);
        } else {
          reject(new Error('Gagal mengekspor gambar'));
        }
      },
      format,
      quality
    );
  });
}

/**
 * Men-download canvas sebagai file gambar.
 *
 * @param canvas   - Canvas yang akan didownload
 * @param filename - Nama file (tanpa ekstensi)
 */
export async function downloadCanvas(
  canvas: HTMLCanvasElement,
  filename?: string
): Promise<void> {
  const blob = await exportCanvasAsBlob(canvas);
  const url = URL.createObjectURL(blob);

  // Generate filename dengan timestamp
  const timestamp = new Date()
    .toISOString()
    .replace(/[:.]/g, '-')
    .slice(0, 19);
  const finalFilename = filename ?? `yukphoto_${timestamp}`;

  // Buat link download dan klik otomatis
  const link = document.createElement('a');
  link.href = url;
  link.download = `${finalFilename}.png`;
  document.body.appendChild(link);
  link.click();

  // Cleanup
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
