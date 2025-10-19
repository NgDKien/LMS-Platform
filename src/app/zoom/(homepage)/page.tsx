import StreamVideoProvider from "@/components/providers/StreamClientProvider";
import MeetingTypeList from "@/components/ZoomApp/MeetingTypeList";

const Home = () => {
    const now = new Date();

    const time = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    const date = (new Intl.DateTimeFormat('en-US', { dateStyle: 'full' })).format(now);

    return (
        <section className="flex size-full flex-col gap-6 text-white p-4 md:p-6 lg:p-8">
            {/* Hero Card với Balanced Gradient */}
            <div className="relative h-[280px] md:h-[320px] lg:h-[360px] w-full rounded-3xl overflow-hidden group">
                {/* Balanced Gradient - Sáng hơn */}
                <div className="absolute inset-0 bg-gradient-to-br from-slate-700 via-slate-800 to-slate-900"></div>
                <div className="absolute inset-0 bg-gradient-to-tr from-blue-700/40 via-purple-600/20 to-purple-700/30"></div>

                {/* Dot Pattern - Rõ hơn */}
                <div className="absolute inset-0 opacity-[0.15]"
                    style={{
                        backgroundImage: `radial-gradient(circle at 2px 2px, white 1.5px, transparent 0)`,
                        backgroundSize: '32px 32px'
                    }}>
                </div>

                {/* Content */}
                <div className="relative h-full flex flex-col justify-between p-6 md:p-8 lg:p-12">
                    {/* Upcoming Meeting Badge */}
                    <div className="flex justify-start">
                        <div className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl backdrop-blur-xl bg-slate-700/40 border border-slate-600/40 shadow-xl hover:bg-slate-700/60 transition-all duration-300 hover:scale-105">
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></div>
                            <span className="text-xs md:text-sm font-medium text-slate-200">
                                Plan any meeting you want
                            </span>
                        </div>
                    </div>

                    {/* Time Display */}
                    <div className="flex flex-col gap-2">
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white drop-shadow-lg">
                            {time}
                        </h1>
                        <p className="text-base md:text-lg lg:text-xl font-medium text-slate-300">
                            {date}
                        </p>
                    </div>
                </div>

                {/* Decorative Glow Elements */}
                <div className="absolute top-10 right-10 w-32 h-32 bg-blue-400/20 rounded-full blur-3xl"></div>
                <div className="absolute bottom-10 left-10 w-40 h-40 bg-purple-400/15 rounded-full blur-3xl"></div>
            </div>

            <MeetingTypeList />
        </section>
    );
};

export default Home;