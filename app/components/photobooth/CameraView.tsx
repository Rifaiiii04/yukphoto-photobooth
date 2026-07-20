/* ============================================================
   CAMERA VIEW COMPONENT
   Live camera viewfinder dengan kontrol capture.
   Menampilkan stream kamera, filter preview, dan tombol capture.
   ============================================================ */

'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { Camera, SwitchCamera, XCircle } from 'lucide-react';
import { initCamera, stopCamera, captureFrame, hasMultipleCameras } from '@/app/lib/camera';
import { getFilterCSS } from '@/app/lib/filters';
import type { CameraFacing } from '@/app/types/photobooth';
import IconButton from '@/app/components/ui/IconButton';

interface CameraViewProps {
  /** ID filter yang aktif */
  filterId: string;
  /** Callback saat foto berhasil dicapture */
  onCapture: (dataUrl: string) => void;
  /** Callback saat user mau mulai countdown */
  onStartCountdown: () => void;
  /** Apakah sedang dalam mode countdown (sembunyikan tombol capture) */
  isCountingDown: boolean;
  /** Callback untuk menampilkan flash */
  onFlash?: () => void;
}

export default function CameraView({
  filterId,
  onCapture,
  onStartCountdown,
  isCountingDown,
  onFlash,
}: CameraViewProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const [facing, setFacing] = useState<CameraFacing>('user');
  const [showSwitchBtn, setShowSwitchBtn] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isCameraReady, setIsCameraReady] = useState(false);

  /* ----------------------------------------------------------
     Inisialisasi Kamera
     ---------------------------------------------------------- */

  const startCamera = useCallback(async (facingMode: CameraFacing) => {
    try {
      setError(null);
      setIsCameraReady(false);

      // Stop stream lama jika ada
      stopCamera(streamRef.current);

      const stream = await initCamera(facingMode);
      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
        setIsCameraReady(true);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gagal mengakses kamera');
    }
  }, []);

  useEffect(() => {
    startCamera(facing);

    // Cek apakah ada lebih dari 1 kamera
    hasMultipleCameras().then(setShowSwitchBtn);

    return () => {
      stopCamera(streamRef.current);
    };
  }, [facing, startCamera]);

  /* ----------------------------------------------------------
     Capture Foto
     ---------------------------------------------------------- */

  const handleCapture = useCallback(() => {
    if (!videoRef.current || !isCameraReady) return;

    const filterCSS = getFilterCSS(filterId);
    const dataUrl = captureFrame(videoRef.current, filterCSS, facing === 'user');

    onFlash?.();
    onCapture(dataUrl);
  }, [filterId, facing, isCameraReady, onCapture, onFlash]);

  /* ----------------------------------------------------------
     Switch Kamera
     ---------------------------------------------------------- */

  const handleSwitchCamera = useCallback(() => {
    setFacing((prev) => (prev === 'user' ? 'environment' : 'user'));
  }, []);

  /* ----------------------------------------------------------
     Render Error State
     ---------------------------------------------------------- */

  if (error) {
    return (
      <div className="w-full aspect-[4/3] rounded-[var(--radius-lg)] bg-[var(--color-bg-alt)] flex flex-col items-center justify-center gap-4 p-6 text-center">
        <XCircle size={48} className="text-[var(--color-danger)]" />
        <p className="text-[var(--color-text)] font-medium">{error}</p>
        <button
          onClick={() => startCamera(facing)}
          className="text-sm text-[var(--color-primary)] hover:underline cursor-pointer"
        >
          Coba lagi
        </button>
      </div>
    );
  }

  /* ----------------------------------------------------------
     Render
     ---------------------------------------------------------- */

  const filterCSS = getFilterCSS(filterId);

  return (
    <div className="relative w-full">
      {/* Video viewfinder */}
      <div className="relative w-full aspect-[4/3] rounded-[var(--radius-lg)] overflow-hidden bg-black">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className={`w-full h-full object-cover ${
            facing === 'user' ? 'camera-mirror' : ''
          }`}
          style={{
            filter: filterCSS === 'none' ? undefined : filterCSS,
          }}
        />

        {/* Loading indicator */}
        {!isCameraReady && (
          <div className="absolute inset-0 flex items-center justify-center bg-[var(--color-bg-alt)]">
            <div className="flex flex-col items-center gap-3">
              <Camera size={32} className="text-[var(--color-text-muted)] animate-pulse" />
              <p className="text-sm text-[var(--color-text-muted)]">
                Memulai kamera...
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Camera controls */}
      {isCameraReady && !isCountingDown && (
        <div className="flex items-center justify-center gap-6 mt-4">
          {/* Switch camera button */}
          {showSwitchBtn && (
            <IconButton
              icon={<SwitchCamera size={20} />}
              label="Ganti kamera"
              variant="secondary"
              onClick={handleSwitchCamera}
            />
          )}

          {/* Capture / Countdown trigger button */}
          <button
            onClick={onStartCountdown}
            className="capture-btn"
            aria-label="Ambil foto"
          >
            <Camera size={28} className="text-white" />
          </button>

          {/* Spacer for symmetry */}
          {showSwitchBtn && <div className="w-11" />}
        </div>
      )}
    </div>
  );
}

/**
 * Hook untuk expose handleCapture ke parent via ref.
 * Digunakan oleh PhotoboothApp saat countdown selesai.
 */
export { CameraView };
