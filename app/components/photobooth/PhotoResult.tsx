/* ============================================================
   PHOTO RESULT COMPONENT
   Menampilkan preview hasil foto dengan frame terpilih.
   Menggunakan Canvas API untuk rendering final.
   ============================================================ */

'use client';

import { useEffect, useRef, useState } from 'react';
import { renderPhotoFrame, downloadCanvas } from '@/app/lib/canvas';
import { DEFAULT_RENDER_OPTIONS } from '@/app/lib/frames';
import type { FrameLayoutType } from '@/app/types/photobooth';

interface PhotoResultProps {
  /** Array data URL foto */
  photos: string[];
  /** Layout frame yang dipilih */
  layoutId: FrameLayoutType;
  /** ID filter yang diterapkan */
  filterId: string;
}

export default function PhotoResult({
  photos,
  layoutId,
  filterId,
}: PhotoResultProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isRendering, setIsRendering] = useState(true);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  /* ----------------------------------------------------------
     Render foto ke canvas setiap kali props berubah
     ---------------------------------------------------------- */

  useEffect(() => {
    let cancelled = false;

    async function render() {
      setIsRendering(true);

      try {
        const canvas = await renderPhotoFrame(
          photos,
          layoutId,
          filterId,
          DEFAULT_RENDER_OPTIONS
        );

        if (!cancelled) {
          canvasRef.current = canvas;
          setPreviewUrl(canvas.toDataURL('image/png'));
          setIsRendering(false);
        }
      } catch (err) {
        console.error('Gagal merender foto:', err);
        if (!cancelled) {
          setIsRendering(false);
        }
      }
    }

    render();

    return () => {
      cancelled = true;
    };
  }, [photos, layoutId, filterId]);

  /* ----------------------------------------------------------
     Download handler
     ---------------------------------------------------------- */

  const handleDownload = async () => {
    if (!canvasRef.current) return;
    await downloadCanvas(canvasRef.current);
  };

  return {
    isRendering,
    previewUrl,
    handleDownload,
  };
}

/**
 * Komponen visual untuk menampilkan preview hasil foto.
 * Dipisahkan dari logic rendering agar bisa dicompose
 * dengan kontrol lain di PhotoboothApp.
 */
export function PhotoPreview({
  previewUrl,
  isRendering,
}: {
  previewUrl: string | null;
  isRendering: boolean;
}) {
  if (isRendering) {
    return (
      <div className="w-full flex items-center justify-center py-12">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-3 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-[var(--color-text-muted)]">
            Menyiapkan foto...
          </p>
        </div>
      </div>
    );
  }

  if (!previewUrl) return null;

  return (
    <div className="w-full flex justify-center animate-fade-in-scale">
      <div className="relative inline-block">
        <img
          src={previewUrl}
          alt="Hasil foto"
          className="max-w-full h-auto shadow-lg rounded-sm"
          style={{ maxHeight: '70vh' }}
        />
      </div>
    </div>
  );
}
