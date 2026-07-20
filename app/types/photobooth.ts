/* ============================================================
   PHOTOBOOTH TYPES
   TypeScript type definitions untuk seluruh aplikasi photobooth.
   ============================================================ */

/* ----------------------------------------------------------
   Step / Flow
   ---------------------------------------------------------- */

/** Tahapan dalam flow photobooth */
export type PhotoboothStep =
  | 'idle'         // Belum mulai, menunggu user klik "Mulai"
  | 'join_session' // Memasukkan kode sesi
  | 'camera'       // Live camera viewfinder
  | 'countdown'    // Countdown 3-2-1 sebelum capture
  | 'review'       // Preview foto yang baru diambil
  | 'result';      // Hasil akhir dengan frame, siap download

/* ----------------------------------------------------------
   Filter
   ---------------------------------------------------------- */

/** Konfigurasi satu filter foto */
export interface FilterConfig {
  /** ID unik filter */
  id: string;
  /** Nama tampilan filter */
  label: string;
  /** CSS filter string yang akan diterapkan */
  css: string;
  /** CSS filter string untuk canvas rendering (bisa berbeda dari preview) */
  canvasFilter: string;
}

/* ----------------------------------------------------------
   Frame / Layout
   ---------------------------------------------------------- */

/** Jenis layout frame */
export type FrameLayoutType = 'polaroid' | 'strip-3' | 'strip-4' | 'grid-2x2';

/** Konfigurasi satu frame layout */
export interface FrameLayout {
  /** ID unik layout */
  id: FrameLayoutType;
  /** Nama tampilan */
  label: string;
  /** Jumlah foto yang dibutuhkan */
  photoCount: number;
  /** Deskripsi singkat */
  description: string;
}

/* ----------------------------------------------------------
   Photo Data
   ---------------------------------------------------------- */

/** Data satu foto yang sudah dicapture */
export interface PhotoData {
  /** Data URL (base64) dari foto */
  dataUrl: string;
  /** Timestamp saat foto diambil */
  timestamp: number;
  /** ID filter yang diterapkan saat capture */
  filterId: string;
}

/* ----------------------------------------------------------
   Canvas Rendering
   ---------------------------------------------------------- */

/** Opsi untuk rendering frame ke canvas */
export interface FrameRenderOptions {
  /** Warna background frame */
  backgroundColor: string;
  /** Padding frame (dalam pixel) */
  padding: number;
  /** Padding bawah (untuk label area di polaroid) */
  bottomPadding: number;
  /** Border radius foto (dalam pixel) */
  borderRadius: number;
  /** Teks branding di bagian bawah */
  brandingText: string;
  /** Tampilkan tanggal di frame */
  showDate: boolean;
  /** Warna teks branding/tanggal */
  textColor: string;
  /** Font family untuk teks */
  fontFamily: string;
}

/** Dimensi canvas yang sudah dihitung */
export interface CanvasDimensions {
  width: number;
  height: number;
  /** Area-area di mana foto akan ditempatkan */
  photoSlots: PhotoSlot[];
}

/** Posisi dan ukuran satu slot foto di canvas */
export interface PhotoSlot {
  x: number;
  y: number;
  width: number;
  height: number;
}

/* ----------------------------------------------------------
   Camera
   ---------------------------------------------------------- */

/** Facing mode kamera */
export type CameraFacing = 'user' | 'environment';

/** State kamera */
export interface CameraState {
  /** Apakah kamera sudah aktif */
  isActive: boolean;
  /** Stream kamera saat ini */
  stream: MediaStream | null;
  /** Facing mode saat ini */
  facing: CameraFacing;
  /** Error message jika ada masalah */
  error: string | null;
}
