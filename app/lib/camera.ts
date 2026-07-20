/* ============================================================
   CAMERA UTILITIES
   Fungsi-fungsi pembantu untuk mengakses dan mengelola
   kamera perangkat via MediaDevices API.
   ============================================================ */

import type { CameraFacing } from '@/app/types/photobooth';

/**
 * Meminta akses dan menginisialisasi kamera
 * @param facing Mode kamera depan atau belakang
 * @returns MediaStream dari kamera
 */
export async function initCamera(facing: CameraFacing = 'user'): Promise<MediaStream> {
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    throw new Error('Browser kamu tidak mendukung akses kamera.');
  }

  const constraints: MediaStreamConstraints = {
    video: {
      facingMode: facing,
      width: { ideal: 1280 },
      height: { ideal: 960 },
    },
    audio: false,
  };

  return await navigator.mediaDevices.getUserMedia(constraints);
}

/**
 * Menghentikan semua track (video/audio) dalam sebuah stream
 * @param stream Stream yang ingin dihentikan
 */
export function stopCamera(stream: MediaStream | null) {
  if (!stream) return;
  stream.getTracks().forEach((track) => track.stop());
}

/**
 * Mengecek apakah perangkat memiliki lebih dari 1 kamera (bisa swap)
 */
export async function hasMultipleCameras(): Promise<boolean> {
  if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) {
    return false;
  }
  const devices = await navigator.mediaDevices.enumerateDevices();
  const videoDevices = devices.filter((device) => device.kind === 'videoinput');
  return videoDevices.length > 1;
}

/**
 * Menangkap satu frame dari video element ke dalam format base64 (Data URL)
 * @param video Video element yang sedang memutar stream
 * @param filterCSS CSS filter string untuk diaplikasikan ke canvas
 * @param isMirrored Apakah kamera sedang mode mirror (kamera depan)
 * @returns Base64 string dari gambar PNG
 */
export function captureFrame(
  video: HTMLVideoElement,
  filterCSS: string = 'none',
  isMirrored: boolean = false
): string {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Failed to get canvas context');

  // Set ukuran canvas sama dengan resolusi asli video
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;

  // Terapkan filter jika ada
  ctx.filter = filterCSS;

  // Handle mirror untuk kamera depan
  if (isMirrored) {
    ctx.translate(canvas.width, 0);
    ctx.scale(-1, 1);
  }

  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
  return canvas.toDataURL('image/png', 1.0);
}

/**
 * Menangkap frame dari DUA video element sekaligus untuk mode Multiplayer (Split Screen)
 * @returns Base64 string dari gambar PNG (kiri: local, kanan: remote)
 */
export function captureMultiplayerFrame(
  localVideo: HTMLVideoElement,
  remoteVideo: HTMLVideoElement,
  filterCSS: string = 'none',
  isMirrored: boolean = false
): string {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Failed to get canvas context');

  // Kita asumsikan resolusi yang diinginkan adalah 4:3 (misal 1280x960)
  // Untuk split screen, kita jejerkan dua video crop.
  // Hasil akhirnya tetap 4:3, sehingga setiap video akan dicrop menjadi aspek rasio 2:3 (setengah dari 4:3).
  // Lebar akhir 1280, tinggi 960.
  // Kiri: 640x960 (dari local). Kanan: 640x960 (dari remote).

  const finalWidth = 1280;
  const finalHeight = 960;
  const gap = 24; // Gap antar foto dalam pixel
  const halfWidth = (finalWidth - gap) / 2;
  
  canvas.width = finalWidth;
  canvas.height = finalHeight;

  // Bersihkan background (transparent gap)
  ctx.clearRect(0, 0, finalWidth, finalHeight);

  ctx.filter = filterCSS;

  // --- DRAW LOCAL VIDEO (LEFT) ---
  ctx.save();
  if (isMirrored) {
    // Mirror the left half
    ctx.translate(halfWidth, 0);
    ctx.scale(-1, 1);
  }
  // Crop tengah video local agar fit ke halfWidth x finalHeight
  const localAspect = localVideo.videoWidth / localVideo.videoHeight;
  const targetAspect = halfWidth / finalHeight;
  
  let sWidthL, sHeightL, sxL, syL;
  if (localAspect > targetAspect) {
    // Video terlalu lebar, crop horizontal
    sHeightL = localVideo.videoHeight;
    sWidthL = sHeightL * targetAspect;
    sxL = (localVideo.videoWidth - sWidthL) / 2;
    syL = 0;
  } else {
    // Video terlalu tinggi, crop vertikal
    sWidthL = localVideo.videoWidth;
    sHeightL = sWidthL / targetAspect;
    sxL = 0;
    syL = (localVideo.videoHeight - sHeightL) / 2;
  }
  
  ctx.drawImage(localVideo, sxL, syL, sWidthL, sHeightL, 0, 0, halfWidth, finalHeight);
  ctx.restore();

  // --- DRAW REMOTE VIDEO (RIGHT) ---
  ctx.save();
  const remoteAspect = remoteVideo.videoWidth / remoteVideo.videoHeight;
  let sWidthR, sHeightR, sxR, syR;
  if (remoteAspect > targetAspect) {
    sHeightR = remoteVideo.videoHeight;
    sWidthR = sHeightR * targetAspect;
    sxR = (remoteVideo.videoWidth - sWidthR) / 2;
    syR = 0;
  } else {
    sWidthR = remoteVideo.videoWidth;
    sHeightR = sWidthR / targetAspect;
    sxR = 0;
    syR = (remoteVideo.videoHeight - sHeightR) / 2;
  }
  
  // Gambar di posisi x = halfWidth + gap
  const remoteX = halfWidth + gap;
  ctx.drawImage(remoteVideo, sxR, syR, sWidthR, sHeightR, remoteX, 0, halfWidth, finalHeight);
  ctx.restore();

  return canvas.toDataURL('image/png', 1.0);
}
