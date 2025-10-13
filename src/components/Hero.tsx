"use client";

export default function Hero() {
    return (
        <div className="relative h-[60vh] w-full overflow-hidden bg-gradient-to-br from-indigo-950 via-gray-900 to-black">
            {/* Animated Background Elements */}
            <div className="absolute inset-0">
                {/* Large Glowing Orbs */}
                <div className="absolute -top-40 -right-40 w-[500px] h-[500px] bg-gradient-to-br from-primary/30 to-purple-600/30 rounded-full blur-3xl opacity-40 animate-pulse" />
                <div className="absolute top-1/2 -left-40 w-[400px] h-[400px] bg-gradient-to-br from-cyan-500/20 to-blue-600/20 rounded-full blur-3xl opacity-30 animate-pulse" style={{ animationDelay: '2s', animationDuration: '4s' }} />
                <div className="absolute -bottom-20 right-1/3 w-[350px] h-[350px] bg-gradient-to-br from-pink-500/20 to-purple-600/20 rounded-full blur-3xl opacity-25 animate-pulse" style={{ animationDelay: '1s', animationDuration: '3s' }} />

                {/* Floating Particles */}
                <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-primary/60 rounded-full animate-ping" style={{ animationDuration: '3s' }} />
                <div className="absolute top-1/3 right-1/3 w-1.5 h-1.5 bg-cyan-400/60 rounded-full animate-ping" style={{ animationDuration: '2s', animationDelay: '0.5s' }} />
                <div className="absolute bottom-1/3 left-1/2 w-1 h-1 bg-purple-400/60 rounded-full animate-ping" style={{ animationDuration: '4s', animationDelay: '1s' }} />
                <div className="absolute top-2/3 right-1/4 w-2 h-2 bg-pink-400/60 rounded-full animate-ping" style={{ animationDuration: '3.5s', animationDelay: '1.5s' }} />
            </div>

            {/* Gradient Mesh Overlay */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(139,92,246,0.15),transparent_50%),radial-gradient(ellipse_at_bottom_left,rgba(59,130,246,0.1),transparent_50%)]" />

            {/* Scanline Effect */}
            <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_50%,rgba(255,255,255,0.02)_50%)] bg-[length:100%_4px] pointer-events-none" />

            {/* Content */}
            <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center z-10 pt-8 sm:pt-12">
                <div className="max-w-4xl">
                    {/* Animated Badge */}
                    <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-primary/10 via-purple-500/10 to-primary/10 border border-primary/30 backdrop-blur-md mb-8 shadow-lg shadow-primary/20 animate-in fade-in slide-in-from-top-4 duration-700">
                        <div className="relative">
                            <span className="absolute inline-flex h-3 w-3 animate-ping rounded-full bg-primary opacity-75" />
                            <span className="relative inline-flex h-3 w-3 rounded-full bg-primary shadow-lg shadow-primary/50" />
                        </div>
                        <span className="text-sm font-semibold bg-gradient-to-r from-primary via-purple-400 to-primary bg-clip-text text-transparent">
                            🎓 Join 10,000+ Students Worldwide
                        </span>
                    </div>

                    {/* Main Title with Animation */}
                    <h1 className="text-5xl md:text-6xl lg:text-7xl font-black mb-6 leading-[1.1] animate-in fade-in slide-in-from-bottom-6 duration-1000">
                        <span className="block text-white drop-shadow-2xl mb-2">
                            Expand Your
                        </span>
                        <span className="block bg-gradient-to-r from-primary via-purple-400 to-pink-400 bg-clip-text text-transparent animate-gradient-x">
                            Knowledge
                        </span>
                    </h1>

                    {/* Description */}
                    <p className="text-xl md:text-2xl text-gray-300 leading-relaxed max-w-2xl mb-10 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
                        Discover a world of learning with our expertly crafted courses.
                        Learn from <span className="text-primary font-semibold text-purple-400">industry professionals</span> and take your skills to the <span className="text-purple-400 font-semibold">next level</span>.
                    </p>

                    {/* CTA Buttons with Enhanced Styling */}
                    <div className="flex flex-wrap items-center gap-4 animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-300">
                        <button className="group relative px-8 py-4 bg-gradient-to-r from-primary to-purple-600 text-white font-bold rounded-xl overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-primary/50">
                            <span className="relative z-10 flex items-center gap-2">
                                Browse Courses
                                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                </svg>
                            </span>
                            <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        </button>

                        <button className="group px-8 py-4 bg-white/5 hover:bg-white/10 text-white font-bold rounded-xl border-2 border-white/20 hover:border-primary/50 backdrop-blur-sm transition-all duration-300 hover:scale-105 flex items-center gap-2">
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M8 5v14l11-7z" />
                            </svg>
                            Watch Demo
                        </button>
                    </div>

                    {/* Stats Bar */}
                    <div className="flex flex-wrap gap-8 mt-12 pt-8 border-t border-white/10 animate-in fade-in duration-1000 delay-500">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center">
                                <span className="text-2xl">📚</span>
                            </div>
                            <div>
                                <div className="text-2xl font-bold text-white">500+</div>
                                <div className="text-sm text-gray-400">Courses</div>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-full bg-purple-500/20 border border-purple-500/30 flex items-center justify-center">
                                <span className="text-2xl">👨‍🏫</span>
                            </div>
                            <div>
                                <div className="text-2xl font-bold text-white">50+</div>
                                <div className="text-sm text-gray-400">Expert Instructors</div>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-full bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center">
                                <span className="text-2xl">⭐</span>
                            </div>
                            <div>
                                <div className="text-2xl font-bold text-white">4.9/5</div>
                                <div className="text-sm text-gray-400">Average Rating</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <style jsx>{`
                @keyframes gradient-x {
                    0%, 100% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                }
                .animate-gradient-x {
                    background-size: 200% 200%;
                    animation: gradient-x 3s ease infinite;
                }
            `}</style>
        </div>
    );
}