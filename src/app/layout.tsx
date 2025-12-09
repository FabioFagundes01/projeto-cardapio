// src/app/layout.tsx
import type { Metadata } from "next";
import "./globals.css"; // <--- ESSA LINHA É A MÁGICA QUE FAZ O DESIGN FUNCIONAR!

export const metadata: Metadata = {
  title: "Cardápio Delivery",
  description: "O melhor lanche da cidade",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className="antialiased bg-gray-50">
        {children}
      </body>
    </html>
  );
}