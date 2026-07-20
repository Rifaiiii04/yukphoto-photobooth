import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";

/* ----------------------------------------------------------
   Font Setup
   Poppins: Clean, modern, friendly — cocok untuk aesthetic
   feminine Korean photobooth.
   ---------------------------------------------------------- */
const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

/* ----------------------------------------------------------
   Metadata (SEO)
   ---------------------------------------------------------- */
export const metadata: Metadata = {
  title: "YukPhoto - Photobooth Online Aesthetic",
  description:
    "Photobooth online gratis dengan frame polaroid dan strip ala Korean photobooth. Tanpa penyimpanan data — foto kamu aman dan privat. Langsung foto, pilih filter & frame, lalu download!",
  keywords: [
    "photobooth",
    "photobooth online",
    "korean photobooth",
    "polaroid frame",
    "photo strip",
    "yukphoto",
  ],
};

/* ----------------------------------------------------------
   Root Layout
   ---------------------------------------------------------- */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={poppins.variable}>
      <body className="min-h-screen flex flex-col antialiased">
        {children}
      </body>
    </html>
  );
}
