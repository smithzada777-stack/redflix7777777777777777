import type { Metadata } from 'next';
import { Outfit, Inter, Epilogue, Lexend } from 'next/font/google';
import './globals.css';

const outfit = Outfit({ subsets: ['latin'] });
const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const epilogue = Epilogue({ subsets: ['latin'], variable: '--font-epilogue' });
const lexend = Lexend({ subsets: ['latin'], variable: '--font-lexend' });

export const metadata: Metadata = {
  title: 'RedFlix - O Melhor do Streaming',
  description: 'Filmes, Séries e TV Ao Vivo com qualidade e economia.',
  icons: {
    icon: 'https://i.imgur.com/mq59DAj.png',
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className={`${outfit.className} ${inter.variable} ${epilogue.variable} ${lexend.variable} antialiased selection:bg-primary selection:text-white bg-[#121414]`}>
        {children}
      </body>
    </html>
  );
}
