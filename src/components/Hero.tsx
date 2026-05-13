'use client';

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useState, useEffect } from "react";

const Hero = () => {
    const [animate, setAnimate] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setAnimate(true);
        }, 400); // 0.4s delay
        return () => clearTimeout(timer);
    }, []);

    return (
        <section className="relative w-full min-h-[600px] md:h-screen text-white overflow-x-clip md:overflow-hidden flex flex-col justify-center">
            {/* Desktop Background Image - Rendered immediately */}
            <div className="absolute inset-0 items-center justify-end hidden md:flex">
                <div className="absolute left-[20%] top-1/2 -translate-y-1/2 w-[50%] h-[70%] bg-primary/25 blur-[100px] rounded-full"></div>
                <div className="relative w-[70%] h-full">
                    <Image
                        src="/images/hero/hero-bg.png"
                        alt="RedFlix Background"
                        fill
                        className="object-cover object-left"
                        priority
                        sizes="70vw"
                    />
                </div>
            </div>

            {/* Gradients */}
            <div className="absolute inset-x-0 bottom-0 h-32 md:h-full bg-gradient-to-t from-black via-black/80 to-transparent z-10" />
            <div className="absolute inset-0 bottom-0 bg-gradient-to-r from-[#1a0000] via-[#0a0000]/90 to-transparent hidden md:block" />

            {/* Mobile Atmosphere */}
            <div className="absolute top-[-25%] left-1/2 -translate-x-1/2 w-[200%] h-[600px] bg-primary/5 blur-[160px] rounded-full z-0 md:hidden pointer-events-none"></div>

            <div className="relative z-10 container mx-auto p-4 md:p-6 px-4 md:px-12 h-full flex flex-col justify-start md:justify-center text-center md:text-left pt-32 pb-20 md:py-0">
                <div className="max-w-2xl flex flex-col items-center md:items-start">
                    <h1 
                        className="relative z-20 mt-[-40px] md:mt-0 text-[30px] md:text-[38px] lg:text-[50px] font-bold tracking-tighter leading-[1.1] font-[family-name:var(--font-inter)] text-center md:text-left"
                    >
                        Cansado de <span className="text-primary uppercase font-black tracking-tight whitespace-nowrap">pagar caro</span><br />
                        por&nbsp;&nbsp;
                        <span className={`relative inline-block whitespace-nowrap px-2 ${animate ? 'ios-animate-active' : ''}`}>
                            <span className="relative z-10">catálogos limitados?</span>
                            <span className="ios-selection-layer">
                                <span className="ios-selection-dot-tl"></span>
                                <span className="ios-selection-dot-tr"></span>
                                <span className="ios-selection-dot-bl"></span>
                                <span className="ios-selection-dot-br"></span>
                                <span className="ios-selection-cursor">
                                    <svg width="22" height="22" viewBox="0 0 24 24" fill="white" stroke="black" strokeWidth="1.5">
                                        <path d="M5.622,3.122l14.208,9.472c0.812,0.541,0.577,1.789-0.36,2.001l-4.524,1.018l3.125,5.625c0.231,0.416,0.07,0.938-0.347,1.17l-1.406,0.781c-0.416,0.231-0.938,0.07-1.17-0.347l-3.125-5.625l-2.457,2.457C8.97,20.366,7.667,19.932,7.667,18.89V3.889C7.667,2.977,8.711,2.505,9.458,3.023L5.622,3.122z" />
                                    </svg>
                                </span>
                            </span>
                        </span>
                    </h1>

                    <p 
                        className="relative z-20 mt-6 md:mt-10 text-[15.5px] md:text-[20px] text-white font-medium max-w-[345px] md:max-w-[560px] mx-auto md:mx-0 leading-snug"
                    >
                        Pare de pagar e depois pagar novamente,<br className="hidden md:block" /> para depois nem ter o filme que você queria.
                    </p>

                    {/* Mobile Image */}
                    <div className="relative z-10 w-[calc(100%+3rem)] -mx-6 h-[260px] mt-4 mb-4 md:hidden">
                        <div className="absolute -top-[40%] left-1/2 -translate-x-1/2 w-[120%] h-full bg-primary/50 blur-[90px] rounded-full z-10 pointer-events-none"></div>
                        <div className="relative w-full h-full" style={{ maskImage: 'linear-gradient(to bottom, transparent 0%, black 25%)', WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 25%)' }}>
                            <Image
                                src="/images/hero/hero-bg.png"
                                alt="RedFlix Mobile"
                                fill
                                className="object-contain scale-110"
                                priority
                                sizes="100vw"
                            />
                        </div>
                    </div>

                    <div className="mt-4 md:mt-14 w-full flex justify-center md:justify-start">
                        <Link href="#pricing" className="w-[85%] md:w-auto block">
                            <button className="relative w-full md:w-auto bg-primary/90 backdrop-blur-md hover:bg-primary text-white font-bold text-[17px] md:text-lg px-8 py-4 rounded-xl inline-flex items-center justify-center gap-2 transition-all group overflow-hidden border-2 border-white/20 shadow-[0_8px_32px_0_rgba(229,9,20,0.37)]">
                                <div className="absolute inset-0 rounded-xl border-2 border-transparent bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shine" style={{ WebkitMaskImage: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)', WebkitMaskComposite: 'xor', maskComposite: 'exclude', padding: '2px' }}></div>
                                <span className="relative z-10">Assine agora e economize</span>
                                <ArrowRight className="relative z-10 transition-transform group-hover:translate-x-1" size={18} />
                            </button>
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Hero;