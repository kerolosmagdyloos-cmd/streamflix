import "./globals.css";
import Navbar from "@/components/Navbar";

export const metadata = {
  title: "StreamFlix – Series y películas",
  description:
    "Explora series y películas reales con sinopsis, reparto y tráilers.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body className="min-h-screen antialiased">
        <Navbar />
        <main>{children}</main>
        <footer className="px-4 py-10 text-center text-xs text-neutral-500 md:px-12">
          Datos e imágenes proporcionados por TMDB. Este producto usa la API de
          TMDB pero no está avalado ni certificado por TMDB.
        </footer>
      </body>
    </html>
  );
}
