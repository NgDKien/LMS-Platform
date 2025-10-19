'use client';
import { useState } from 'react';
import {
    CallControls,
    CallParticipantsList,
    CallStatsButton,
    CallingState,
    PaginatedGridLayout,
    SpeakerLayout,
    useCallStateHooks,
} from '@stream-io/video-react-sdk';
import { useRouter, useSearchParams } from 'next/navigation';
import { Users, LayoutList, X } from 'lucide-react';

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import Loader from './Loader';
import EndCallButton from './EndCallButton';
import { cn } from '@/lib/utils';

type CallLayoutType = 'grid' | 'speaker-left' | 'speaker-right';

const MeetingRoom = () => {
    const searchParams = useSearchParams();
    const isPersonalRoom = !!searchParams.get('personal');
    const router = useRouter();
    const [layout, setLayout] = useState<CallLayoutType>('speaker-left');
    const [showParticipants, setShowParticipants] = useState(false);
    const { useCallCallingState } = useCallStateHooks();

    const callingState = useCallCallingState();

    if (callingState !== CallingState.JOINED) return <Loader />;

    const CallLayout = () => {
        switch (layout) {
            case 'grid':
                return <PaginatedGridLayout />;
            case 'speaker-right':
                return <SpeakerLayout participantsBarPosition="left" />;
            default:
                return <SpeakerLayout participantsBarPosition="right" />;
        }
    };

    return (
        <section className="h-screen w-full flex flex-col overflow-hidden bg-slate-950 text-white">
            {/* Clean Gradient Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-slate-900/50 via-slate-950 to-black -z-10"></div>

            {/* Main Content - Video Area */}
            <div className="flex-1 flex gap-4 p-4 overflow-hidden">
                {/* Video Container */}
                <div className="flex-1 relative flex items-center justify-center">
                    <div className="w-full h-full max-w-[1200px] rounded-xl overflow-hidden bg-black/40 backdrop-blur-sm">
                        <CallLayout />
                    </div>
                </div>

                {/* Participants Sidebar - Desktop */}
                <div
                    className={cn('w-80 xl:w-96 flex-shrink-0 hidden lg:block', {
                        'lg:hidden': !showParticipants,
                    })}
                >
                    <div className="h-full rounded-xl overflow-hidden bg-slate-900/80 backdrop-blur-md border border-slate-800">
                        <div className="flex items-center justify-between p-3 border-b border-slate-800 bg-slate-900/50">
                            <span className="text-xs font-medium text-slate-300 uppercase tracking-wider">Participants</span>
                            <button
                                onClick={() => setShowParticipants(false)}
                                className="p-1 rounded hover:bg-slate-800 transition-colors"
                            >
                                <X size={16} className="text-slate-400" />
                            </button>
                        </div>
                        <div className="h-[calc(100%-48px)]">
                            <CallParticipantsList onClose={() => setShowParticipants(false)} />
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile Participants Overlay */}
            {showParticipants && (
                <div className="lg:hidden fixed inset-0 z-50 bg-black/60 backdrop-blur-sm">
                    <div className="absolute inset-x-4 top-4 bottom-24 rounded-xl overflow-hidden bg-slate-900/95 backdrop-blur-md border border-slate-800">
                        <div className="flex items-center justify-between p-3 border-b border-slate-800">
                            <span className="text-xs font-medium text-slate-300 uppercase tracking-wider">Participants</span>
                            <button
                                onClick={() => setShowParticipants(false)}
                                className="p-1 rounded hover:bg-slate-800 transition-colors"
                            >
                                <X size={16} className="text-slate-400" />
                            </button>
                        </div>
                        <div className="h-[calc(100%-48px)]">
                            <CallParticipantsList onClose={() => setShowParticipants(false)} />
                        </div>
                    </div>
                </div>
            )}

            {/* Control Bar - Not Fixed, Part of Flex Layout */}
            <div className="flex-shrink-0 bg-slate-900/90 backdrop-blur-md border-slate-800">
                <div className="flex items-center justify-center gap-3 px-4 py-3">
                    {/* Call Controls */}
                    <CallControls onLeave={() => router.push(`/zoom`)} />

                    <div className="h-6 w-px bg-slate-800 hidden sm:block"></div>

                    {/* Additional Controls */}
                    <div className="flex items-center gap-2">
                        {/* Layout */}
                        <DropdownMenu>
                            <DropdownMenuTrigger className="p-2 rounded-lg bg-slate-800/80 hover:bg-slate-700 transition-colors">
                                <LayoutList size={18} className="text-slate-300" />
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="bg-slate-900 border-slate-800 text-white">
                                {['Grid', 'Speaker-Left', 'Speaker-Right'].map((item, index) => (
                                    <div key={index}>
                                        <DropdownMenuItem
                                            onClick={() => setLayout(item.toLowerCase() as CallLayoutType)}
                                            className="hover:bg-slate-800 cursor-pointer text-sm"
                                        >
                                            {item}
                                        </DropdownMenuItem>
                                        {index < 2 && <DropdownMenuSeparator className="bg-slate-800" />}
                                    </div>
                                ))}
                            </DropdownMenuContent>
                        </DropdownMenu>

                        {/* Stats */}
                        <div className="hidden sm:block">
                            <CallStatsButton />
                        </div>

                        {/* Participants */}
                        <button
                            onClick={() => setShowParticipants((prev) => !prev)}
                            className={cn(
                                "p-2 rounded-lg transition-colors",
                                showParticipants
                                    ? "bg-blue-600 hover:bg-blue-700"
                                    : "bg-slate-800/80 hover:bg-slate-700"
                            )}
                        >
                            <Users size={18} className="text-white" />
                        </button>

                        {/* End Call */}
                        {!isPersonalRoom && <EndCallButton />}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default MeetingRoom;