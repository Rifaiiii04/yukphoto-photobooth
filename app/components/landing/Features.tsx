/* ============================================================
   FEATURES SECTION
   Menampilkan fitur-fitur utama YukPhoto dalam card layout.
   ============================================================ */

import {
  Shield,
  Download,
  Palette,
  LayoutGrid,
  Zap,
  Smartphone,
} from 'lucide-react';

/** Data fitur */
const features = [
  {
    icon: Shield,
    title: 'Privasi Terjaga',
    description:
      'Foto kamu tidak pernah disimpan di server. Semua proses dilakukan langsung di browser kamu.',
    color: 'var(--color-success)',
  },
  {
    icon: Download,
    title: 'Download Langsung',
    description:
      'Hasil foto bisa langsung di-download sebagai gambar PNG berkualitas tinggi.',
    color: 'var(--color-primary)',
  },
  {
    icon: Palette,
    title: 'Filter Aesthetic',
    description:
      'Pilih dari berbagai filter: B&W, Sepia, Warm, Cool, Film, dan lainnya. Preview real-time!',
    color: 'var(--color-secondary)',
  },
  {
    icon: LayoutGrid,
    title: 'Frame Beragam',
    description:
      'Polaroid klasik, strip 3-4 foto vertikal ala Korean photobooth, atau grid 2x2.',
    color: 'var(--color-primary)',
  },
  {
    icon: Zap,
    title: 'Instan & Gratis',
    description:
      'Tanpa registrasi, tanpa biaya. Langsung buka dan mulai foto kapan saja.',
    color: 'var(--color-danger)',
  },
  {
    icon: Smartphone,
    title: 'Mobile Friendly',
    description:
      'Bisa digunakan di HP maupun laptop. Mendukung kamera depan dan belakang.',
    color: 'var(--color-secondary)',
  },
];

export default function Features() {
  return (
    <section
      id="fitur"
      className="w-full px-6 py-16 md:py-24"
    >
      <div className="max-w-5xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-[var(--color-text)] mb-3">
            Kenapa YukPhoto?
          </h2>
          <p className="text-[var(--color-text-secondary)] max-w-md mx-auto">
            Photobooth online yang aman, cantik, dan mudah digunakan
          </p>
        </div>

        {/* Feature cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="group bg-[var(--color-surface)] rounded-[var(--radius-lg)] p-6 shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-md)] transition-all duration-300 hover:-translate-y-1"
            >
              {/* Icon */}
              <div
                className="w-12 h-12 rounded-[var(--radius-md)] flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110"
                style={{ backgroundColor: `color-mix(in srgb, ${feature.color} 15%, transparent)` }}
              >
                <feature.icon
                  size={22}
                  style={{ color: feature.color }}
                />
              </div>

              {/* Text */}
              <h3 className="font-semibold text-[var(--color-text)] mb-2">
                {feature.title}
              </h3>
              <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
