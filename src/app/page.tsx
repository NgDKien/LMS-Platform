'use client'
import React, { useState, useEffect } from 'react';
import { BookOpen, Code, Brain, Briefcase, Video, Menu, X, ArrowRight, Sparkles, Zap, Star, ChevronDown } from 'lucide-react';
import { useAuth, SignInButton } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';

export default function LandingPage() {
    const { isSignedIn } = useAuth();
    const router = useRouter();

    useEffect(() => {
        // Auto redirect if already signed in
        if (isSignedIn) {
            router.push('/lms-user-homepage');
        }
    }, [isSignedIn, router]);

    const handleGetStarted = () => {
        if (isSignedIn) {
            router.push('/lms-user-homepage');
        }
    };

    const features = [
        {
            icon: BookOpen,
            title: "LMS Platform",
            description: "Nền tảng học trực tuyến với AI adaptive learning",
            color: "from-cyan-400 via-blue-500 to-purple-600",
            gradient: "bg-gradient-to-br from-cyan-500/20 to-blue-600/20",
            bgGradient: "from-cyan-500/10 via-blue-500/10 to-purple-600/10"
        },
        {
            icon: Code,
            title: "Code Editor",
            description: "IDE real-time với 50+ ngôn ngữ lập trình",
            color: "from-purple-400 via-pink-500 to-red-500",
            gradient: "bg-gradient-to-br from-purple-500/20 to-pink-600/20",
            bgGradient: "from-purple-500/10 via-pink-500/10 to-red-500/10"
        },
        {
            icon: Brain,
            title: "AI Quiz Generator",
            description: "Tạo quiz thông minh với GPT-4 integration",
            color: "from-green-400 via-emerald-500 to-teal-600",
            gradient: "bg-gradient-to-br from-green-500/20 to-emerald-600/20",
            bgGradient: "from-green-500/10 via-emerald-500/10 to-teal-600/10"
        },
        {
            icon: Briefcase,
            title: "Project Management",
            description: "Agile boards với automation workflows",
            color: "from-orange-400 via-red-500 to-pink-600",
            gradient: "bg-gradient-to-br from-orange-500/20 to-red-600/20",
            bgGradient: "from-orange-500/10 via-red-500/10 to-pink-600/10"
        },
    ];

    const GetStartedButton = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => {
        if (isSignedIn) {
            return (
                <button
                    onClick={handleGetStarted}
                    className={className}
                >
                    {children}
                </button>
            );
        }

        return (
            <SignInButton
                mode="modal"
                forceRedirectUrl="/lms-user-homepage"
            >
                <button className={className}>
                    {children}
                </button>
            </SignInButton>
        );
    };

    return (
        <div className="min-h-screen bg-black text-white overflow-hidden">
            {/* Animated Background */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute inset-0" style={{
                    backgroundImage: 'linear-gradient(rgba(59, 130, 246, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(59, 130, 246, 0.1) 1px, transparent 1px)',
                    backgroundSize: '50px 50px'
                }} />
            </div>

            {/* Navigation */}
            <nav className="fixed top-0 w-full z-50 bg-black/80 backdrop-blur-xl border-b border-white/10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-20">
                        <div className="flex items-center space-x-3 group cursor-pointer">
                            <div className="relative">
                                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl blur-lg opacity-70 group-hover:opacity-100 transition" />
                                <div className="relative w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center transform group-hover:scale-110 transition">
                                    <Sparkles className="w-7 h-7" />
                                </div>
                            </div>
                            <div>
                                <span className="text-2xl font-black bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                                    EduVerse
                                </span>
                                <div className="text-xs text-gray-400">Next Generation</div>
                            </div>
                        </div>

                        <div className="hidden md:flex items-center space-x-8">
                            <div className="relative group">
                                <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg blur opacity-70 group-hover:opacity-100 transition" />
                                <GetStartedButton className="relative bg-black px-6 py-2.5 rounded-lg font-bold hover:bg-transparent transition">
                                    Get Started
                                </GetStartedButton>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 mt-10 pt-20">
                <div className="max-w-7xl mx-auto text-center relative z-10">
                    {/* Floating badges */}
                    <div className="flex flex-wrap justify-center gap-3 mb-8 animate-fade-in">
                        {['🚀 500K+ Users', '⚡ 99.9% Uptime', '🏆 #1 Platform'].map((badge, i) => (
                            <div
                                key={i}
                                className="px-4 py-2 bg-white/5 backdrop-blur-xl border border-white/10 rounded-full text-sm font-semibold hover:bg-white/10 transition transform hover:scale-110 cursor-pointer"
                                style={{ animationDelay: `${i * 0.1}s` }}
                            >
                                {badge}
                            </div>
                        ))}
                    </div>

                    <h1 className="text-5xl sm:text-6xl lg:text-8xl font-black mb-6 leading-tight">
                        <div className="overflow-hidden">
                            <span className="inline-block animate-slide-up" style={{ animationDelay: '0.1s' }}>
                                The Future of
                            </span>
                        </div>
                        <div className="overflow-hidden">
                            <span className="inline-block bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent animate-slide-up" style={{ animationDelay: '0.3s' }}>
                                Education
                            </span>
                        </div>
                        <div className="overflow-hidden">
                            <span className="inline-block animate-slide-up" style={{ animationDelay: '0.5s' }}>
                                is Here
                            </span>
                        </div>
                    </h1>

                    <p className="text-xl sm:text-2xl text-gray-400 mb-12 max-w-3xl mx-auto leading-relaxed">
                        4 powerful platforms unified in one revolutionary ecosystem.
                        <span className="text-white font-semibold"> Learn, Code, Test, Manage, Connect</span> - all in one place.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
                        <div className="relative group">
                            <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-2xl blur opacity-70 group-hover:opacity-100 transition animate-pulse" />
                            <GetStartedButton className="relative bg-white text-black px-10 py-4 rounded-2xl font-bold text-lg hover:bg-gray-100 transition flex items-center space-x-2 transform group-hover:scale-105">
                                <Zap className="w-6 h-6" />
                                <span>Start Free Trial</span>
                                <ArrowRight className="w-5 h-5" />
                            </GetStartedButton>
                        </div>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
                        {[
                            { value: '500K+', label: 'Active Users' },
                            { value: '50M+', label: 'Code Executions' },
                            { value: '1M+', label: 'AI Quizzes' },
                            { value: '99.9%', label: 'Uptime' }
                        ].map((stat, i) => (
                            <div
                                key={i}
                                className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition transform hover:scale-110 cursor-pointer"
                            >
                                <div className="text-3xl font-black bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                                    {stat.value}
                                </div>
                                <div className="text-gray-400 text-sm mt-1">{stat.label}</div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-16 animate-bounce">
                        <ChevronDown className="w-8 h-8 mx-auto text-gray-500" />
                    </div>
                </div>

                {/* Floating elements */}
                <div className="absolute top-1/4 left-10 w-20 h-20 bg-blue-500/20 rounded-full blur-2xl animate-float" />
                <div className="absolute top-1/3 right-20 w-32 h-32 bg-purple-500/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }} />
                <div className="absolute bottom-1/4 left-1/4 w-24 h-24 bg-pink-500/20 rounded-full blur-2xl animate-float" style={{ animationDelay: '2s' }} />
            </section>

            {/* Features Section */}
            <section id="features" className="relative py-32 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-20">
                        <div className="inline-block mb-4 px-6 py-2 bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30 rounded-full text-blue-400 font-semibold">
                            4 Powerful Platforms
                        </div>
                        <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black mb-6">
                            Everything You Need,
                            <br />
                            <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                                Nothing You Don't
                            </span>
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                        {features.map((feature, index) => {
                            const Icon = feature.icon;

                            return (
                                <div
                                    key={index}
                                    className={`relative group cursor-pointer transition-all duration-500 ${index === 2 ? 'md:col-span-2 lg:col-span-1' : ''
                                        }`}
                                >
                                    <div className={`absolute -inset-1 bg-gradient-to-r ${feature.color} rounded-3xl blur opacity-30 group-hover:opacity-70 transition duration-500`} />

                                    <div className={`relative h-full bg-gradient-to-br ${feature.bgGradient} backdrop-blur-xl border border-white/20 rounded-3xl p-8 transform transition-all duration-500 group-hover:scale-105 group-hover:border-white/40 group-hover:bg-white/5`}>
                                        <div className={`w-16 h-16 ${feature.gradient} rounded-2xl flex items-center justify-center mb-6 transform transition-all duration-500 group-hover:scale-110 group-hover:rotate-6 shadow-lg`}>
                                            <Icon className="w-8 h-8 text-white" />
                                        </div>

                                        <h3 className="text-2xl font-bold mb-3 text-white">{feature.title}</h3>
                                        <p className="text-gray-300 leading-relaxed">{feature.description}</p>

                                        <div className="mt-6 flex items-center text-blue-400 font-semibold group-hover:text-blue-300 transition">
                                            <span>Explore</span>
                                            <ArrowRight className="w-4 h-4 ml-2 transform group-hover:translate-x-2 transition" />
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            <style jsx>{`
        @keyframes slide-up {
          from {
            transform: translateY(100%);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }
        
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-slide-up {
          animation: slide-up 0.8s ease-out forwards;
          opacity: 0;
        }
        
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        
        .animate-fade-in {
          animation: fade-in 0.8s ease-out forwards;
        }
      `}</style>
        </div>
    );
}