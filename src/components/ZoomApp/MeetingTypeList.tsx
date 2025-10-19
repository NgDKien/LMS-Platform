'use client'

import { useRouter } from 'next/navigation';
import React, { useState } from 'react'
import HomeCard from './HomeCard';
import MeetingModal from './MeetingModal';
import { Call, useStreamVideoClient } from '@stream-io/video-react-sdk';
import { useUser } from '@clerk/nextjs';
import { toast } from 'sonner';
import { Input } from '../ui/input';

const initialValues = {
    dateTime: new Date(),
    description: '',
    link: '',
};

const MeetingTypeList = () => {
    const router = useRouter();
    const client = useStreamVideoClient();
    const { user } = useUser();
    const [values, setValues] = useState(initialValues);
    const [callDetail, setCallDetail] = useState<Call>();
    const [meetingState, setMeetingState] = useState<
        'isScheduleMeeting' | 'isJoiningMeeting' | 'isInstantMeeting' | undefined
    >(undefined);

    const createMeeting = async () => {
        if (!client || !user) return;

        try {
            if (!values.dateTime) {
                toast.warning("Please select a date and time");
                return;
            }

            const id = crypto.randomUUID();
            const call = client.call("default", id);
            if (!call) throw new Error("Failed to create meeting");

            const startsAt =
                values.dateTime.toISOString() || new Date(Date.now()).toISOString();
            const description = values.description || "Instant Meeting";

            await call.getOrCreate({
                data: {
                    starts_at: startsAt,
                    custom: {
                        description,
                    },
                },
            });

            setCallDetail(call);

            if (!values.description) {
                router.push(`/zoom/meeting/${call.id}`);
            }

            toast.success("Meeting created successfully!");
        } catch (error) {
            console.error(error);
            toast.error("Failed to create meeting");
        }
    };

    return (
        <section className="w-full">
            {/* Grid Layout với Colorful Gradients */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6">
                <HomeCard
                    img="/add-meeting.svg"
                    title="New Meeting"
                    description="Start an instant meeting"
                    className="bg-gradient-to-br from-emerald-600/70 via-green-700/60 to-teal-800/70 hover:from-emerald-500/80 hover:via-green-600/70 hover:to-teal-700/80"
                    handleClick={() => setMeetingState('isInstantMeeting')}
                />
                <HomeCard
                    img="/join-meeting.svg"
                    title="Join Meeting"
                    description="via invitation link"
                    className="bg-gradient-to-br from-blue-600/70 via-indigo-700/60 to-blue-800/70 hover:from-blue-500/80 hover:via-indigo-600/70 hover:to-blue-700/80"
                    handleClick={() => setMeetingState('isJoiningMeeting')}
                />
                <HomeCard
                    img="/schedule.svg"
                    title="Personal Room"
                    description="Plan your own meeting"
                    className="bg-gradient-to-br from-purple-600/70 via-violet-700/60 to-purple-800/70 hover:from-purple-500/80 hover:via-violet-600/70 hover:to-purple-700/80"
                    handleClick={() => router.push('/zoom/personal-room')}
                />
                <HomeCard
                    img="/recordings.svg"
                    title="View Recordings"
                    description="Meeting Recordings"
                    className="bg-gradient-to-br from-amber-600/70 via-orange-700/60 to-amber-800/70 hover:from-amber-500/80 hover:via-orange-600/70 hover:to-amber-700/80"
                    handleClick={() => router.push('/zoom/recordings')}
                />
            </div>

            {/* Modern Meeting Modal - Join Meeting */}
            <MeetingModal
                isOpen={meetingState === 'isJoiningMeeting'}
                onClose={() => setMeetingState(undefined)}
                title="Type the link here"
                className="text-center"
                buttonText="Join Meeting"
                handleClick={() => router.push(values.link)}
            >
                <Input
                    placeholder="Meeting link"
                    onChange={(e) => setValues({ ...values, link: e.target.value })}
                    className="border-none bg-gradient-to-r from-slate-700/70 to-slate-600/50 backdrop-blur-xl focus-visible:ring-2 focus-visible:ring-blue-400/60 focus-visible:ring-offset-0 text-white placeholder:text-slate-300 rounded-xl px-4 py-5 text-sm transition-all duration-300"
                />
            </MeetingModal>

            {/* Modern Meeting Modal - Instant Meeting */}
            <MeetingModal
                isOpen={meetingState === 'isInstantMeeting'}
                onClose={() => setMeetingState(undefined)}
                title="Start an Instant Meeting"
                className="text-center"
                buttonText="Start Meeting"
                handleClick={createMeeting}
            />
        </section>
    )
}

export default MeetingTypeList