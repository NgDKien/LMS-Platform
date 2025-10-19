'use client';

import Image from 'next/image';
import { cn } from '@/lib/utils';

interface HomeCardProps {
    className?: string;
    img: string;
    title: string;
    description: string;
    handleClick?: () => void;
}

const HomeCard = ({ className, img, title, description, handleClick }: HomeCardProps) => {
    return (
        <section
            className={cn(
                'group relative px-5 py-6 flex flex-col justify-between w-full min-h-[240px] rounded-2xl cursor-pointer overflow-hidden transition-all duration-500 hover:scale-[1.02] hover:shadow-xl',
                'bg-slate-800/60',
                'border border-slate-700/40 hover:border-slate-600/60',
                'backdrop-blur-sm',
                className
            )}
            onClick={handleClick}
        >
            {/* Subtle Gradient on Hover */}
            <div className="absolute inset-0 bg-gradient-to-br from-slate-700/0 to-slate-900/0 group-hover:from-slate-700/20 group-hover:to-slate-900/30 transition-all duration-500"></div>

            {/* Shimmer Effect */}
            <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/5 to-transparent"></div>

            {/* Icon Container */}
            <div className="relative flex items-center justify-center w-12 h-12 rounded-xl bg-slate-700/40 backdrop-blur-md border border-slate-600/30 group-hover:scale-105 group-hover:rotate-3 transition-all duration-500 shadow-lg">
                <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <Image
                    src={img}
                    alt="meeting"
                    width={24}
                    height={24}
                    className="relative z-10 filter brightness-110"
                />
            </div>

            {/* Content */}
            <div className="relative flex flex-col gap-2 z-10">
                <h1 className="text-lg md:text-xl font-semibold text-white group-hover:text-slate-50 transition-colors duration-300">
                    {title}
                </h1>
                <p className="text-sm md:text-base font-normal text-slate-400 group-hover:text-slate-300 transition-colors duration-300 leading-relaxed">
                    {description}
                </p>
            </div>

            {/* Subtle Bottom Glow */}
            <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-slate-500/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        </section>
    );
};

export default HomeCard;