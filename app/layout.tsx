import type { Metadata } from "next";
import "./globals.css";
import { Plus_Jakarta_Sans, Barlow } from "next/font/google";

// Fuentes de Google
const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta-sans",
  weight: ["200", "400", "600", "800"],
  display: "swap",
});

const barlow = Barlow({
  subsets: ["latin"],
  variable: "--font-barlow",
  weight: ["100", "400", "700", "900"],
  display: "swap",
});


export const metadata: Metadata = {
  title: "Hotel Pairumani",
  description:
    "El Hotel Pairumani te ofrece paquetes personalizados con habitaciones confortables, desayuno, almuerzo y cena adaptados a tus gustos. Disfruta de nuestra piscina, sauna seco, vapor, comedor, aire acondicionado y WiFi gratuito.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className="antialiased">{children}</body>
    </html>
  );
}
