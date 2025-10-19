'use client';

import { Call, CallRecording } from '@stream-io/video-react-sdk';

import Loader from './Loader';
import { useGetCalls } from '@/hooks/useGetCalls';
import MeetingCard from './MeetingCard';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

const CallList = ({ type }: { type: 'ended' | 'upcoming' | 'recordings' }) => {
    const router = useRouter();
    const { endedCalls, upcomingCalls, callRecordings, isLoading } =
        useGetCalls();
    const [recordings, setRecordings] = useState<CallRecording[]>([]);

    const getCalls = () => {
        switch (type) {
            case 'ended':
                return endedCalls;
            case 'recordings':
                return recordings;
            case 'upcoming':
                return upcomingCalls;
            default:
                return [];
        }
    };

    const getNoCallsMessage = () => {
        switch (type) {
            case 'ended':
                return 'No Previous Calls';
            case 'upcoming':
                return 'No Upcoming Calls';
            case 'recordings':
                return 'No Recordings';
            default:
                return '';
        }
    };

    useEffect(() => {
        const fetchRecordings = async () => {
            const callData = await Promise.all(
                callRecordings?.map((meeting) => meeting.queryRecordings()) ?? [],
            );

            const recordings = callData
                .filter((call) => call.recordings.length > 0)
                .flatMap((call) => call.recordings);

            setRecordings(recordings);
        };

        if (type === 'recordings') {
            fetchRecordings();
        }
    }, [type, callRecordings]);

    if (isLoading) return <Loader />;

    const calls = getCalls();
    const noCallsMessage = getNoCallsMessage();

    return (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-3">
            {calls && calls.length > 0 ? (
                calls.map((meeting: Call | CallRecording) => (
                    <MeetingCard
                        key={
                            type === 'recordings'
                                ? (meeting as CallRecording).url || (meeting as CallRecording).start_time
                                : (meeting as Call).id
                        }
                        icon={
                            type === 'ended'
                                ? '/previous.svg'
                                : type === 'upcoming'
                                    ? '/upcoming.svg'
                                    : '/recordings.svg'
                        }
                        title={
                            (meeting as Call).state?.custom?.description ||
                            (meeting as CallRecording).filename?.substring(0, 20) ||
                            'No Description'
                        }
                        date={
                            (meeting as Call).state?.startsAt?.toLocaleString() ||
                            (meeting as CallRecording).start_time?.toLocaleString()
                        }
                        isPreviousMeeting={type === 'ended'}
                        link={
                            type === 'recordings'
                                ? (meeting as CallRecording).url
                                : `${process.env.NEXT_PUBLIC_BASE_URL}/meeting/${(meeting as Call).id}`
                        }
                        buttonIcon1={type === 'recordings' ? '/play.svg' : undefined}
                        buttonText={type === 'recordings' ? 'Play' : 'Start'}
                        handleClick={
                            type === 'recordings'
                                ? () => router.push(`${(meeting as CallRecording).url}`)
                                : () => router.push(`/meeting/${(meeting as Call).id}`)
                        }
                    />
                ))
            ) : (
                <div className="col-span-full flex flex-col items-center justify-center py-20 px-4">
                    <div className="relative mb-6">
                        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50 flex items-center justify-center">
                            <svg className="w-12 h-12 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                            </svg>
                        </div>
                        <div className="absolute inset-0 rounded-full bg-blue-500/10 blur-2xl"></div>
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-2">{noCallsMessage}</h2>
                    <p className="text-slate-400 text-center max-w-md">
                        {type === 'recordings'
                            ? 'Your recorded meetings will appear here once you start recording.'
                            : type === 'upcoming'
                                ? 'Schedule a new meeting to see it listed here.'
                                : 'Your meeting history will be displayed here.'}
                    </p>
                </div>
            )}
        </div>
    );
};

export default CallList;