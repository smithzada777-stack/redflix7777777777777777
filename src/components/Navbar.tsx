'use client';

// 🔒 ARQUIVO BLOQUEADO - SENHA PARA EDIÇÃO: 123 🔒
// ESTE ARQUIVO NÃO DEVE SER ALTERADO SEM AUTORIZAÇÃO EXPLÍCITA E A SENHA.

import Image from 'next/image';
import Link from 'next/link';

export default function Navbar() {
    return (
        <nav className="absolute top-0 left-0 w-full z-50 bg-transparent p-4 md:p-6">
            <div className="container mx-auto px-4 md:px-12 flex justify-center md:justify-start">
                <Link href="/">
                    <div className="relative w-52 h-12 md:w-64 md:h-16 hover:opacity-80 transition-opacity border-none outline-none ring-0">
                        <Image
                            src="https://i.imgur.com/MD1ffQ7.png"
                            alt="DvnFlix Logo"
                            fill
                            className="object-contain object-center md:object-left scale-[1.09] md:scale-[1.14] origin-center md:origin-left"
                            priority
                            sizes="256px"
                        />
                    </div>
                </Link>
            </div>
        </nav>
    );
}
