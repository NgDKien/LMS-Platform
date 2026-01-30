'use client'

import { SearchInput } from "./SearchInput";

export default function Hero() {
    return (
        <div className="relative min-h-screen w-full bg-[#030712] overflow-hidden mt-[-50px]">
            {/* Animated background grid */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#0a0f1e_1px,transparent_1px),linear-gradient(to_bottom,#0a0f1e_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#030712_70%,transparent_110%)]" />

            {/* Linear gradient from top */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#030712] via-purple-900/20 to-[#030712]" />

            {/* Gradient orbs */}
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl animate-pulse delay-700" />

            {/* Noise texture overlay */}
            <div className="absolute inset-0 bg-[#030712]/40 backdrop-blur-[1px]" />

            {/* Content */}
            <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 h-screen flex items-center">
                <div className="max-w-5xl w-full">
                    <SearchInput />

                    {/* Main heading */}
                    <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
                        <span className="block text-white mb-2">Mở rộng kho</span>
                        <span className="block bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent animate-gradient">
                            kiến thức
                        </span>
                        <span className="block text-white">cùng khóa học của chúng tôi</span>
                    </h1>

                    {/* Description */}
                    <p className="text-lg sm:text-xl text-gray-400 max-w-2xl mb-10 leading-relaxed">
                        Khám phá thế giới tri thức với các khóa học được thiết kế chuyên nghiệp.
                        Học hỏi từ các chuyên gia hàng đầu và nâng cao kỹ năng của bạn.
                    </p>

                    {/* CTA Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4">
                        <button className="group relative px-8 py-4 bg-white text-[#030712] font-semibold rounded-lg overflow-hidden transition-all hover:scale-105 hover:shadow-2xl hover:shadow-white/20">
                            <span className="relative z-10">Khám phá khóa học</span>
                            <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-blue-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </button>

                        <button className="px-8 py-4 bg-white/5 text-white font-semibold rounded-lg border border-white/10 backdrop-blur-sm transition-all hover:bg-white/10 hover:border-white/20 hover:scale-105">
                            Tìm hiểu thêm
                        </button>
                    </div>

                    {/* Stats */}
                    <div className="mt-16 grid grid-cols-2 sm:grid-cols-3 gap-8 max-w-2xl">
                        <div className="text-left">
                            <div className="text-3xl sm:text-4xl font-bold text-white mb-1">500+</div>
                            <div className="text-sm text-gray-500">Khóa học</div>
                        </div>
                        <div className="text-left">
                            <div className="text-3xl sm:text-4xl font-bold text-white mb-1">50K+</div>
                            <div className="text-sm text-gray-500">Học viên</div>
                        </div>
                        <div className="text-left col-span-2 sm:col-span-1">
                            <div className="text-3xl sm:text-4xl font-bold text-white mb-1">4.9★</div>
                            <div className="text-sm text-gray-500">Đánh giá</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom fade */}
            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#030712] to-transparent" />

            <style jsx>{`
        @keyframes gradient {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 3s ease infinite;
        }
      `}</style>
        </div>
    );
}