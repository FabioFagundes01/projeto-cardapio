import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "react-hot-toast";

// Configurações para o WhatsApp carregar a imagem e título
export const metadata: Metadata = {
  title: "Coombo Street | Delivery",
  description: "O melhor smash da cidade! Peça seu hambúrguer ou shawarma online.",
  
  // Isso aqui é o que aparece no WhatsApp:
  openGraph: {
    title: "Coombo Street | Mata sua fome!",
    description: "Cardápio digital oficial. Peça agora e receba em casa 🛵",
    url: "https://seu-link-da-vercel.app", // (Opcional) Coloque seu link real aqui depois
    siteName: "Coombo Street",
    locale: "pt_BR",
    type: "website",
    images: [
      {
        url: "/images/logo.png", // Vai usar sua logo como capa
        width: 800,
        height: 600,
        alt: "Logo Coombo Street",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className="antialiased bg-gray-50">
        <Toaster position="bottom-center" />
        {children}
      </body>
    </html>
  );
}