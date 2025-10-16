'use client'

import { useRouter } from 'next/navigation';
import React, { useState } from 'react'
import HomeCard from './HomeCard';
import MeetingModal from './MeetingModal';

const MeetingTypeList = () => {
    const router = useRouter();

    const [meetingState, setMeetingState] = useState<
        'isScheduleMeeting' | 'isJoiningMeeting' | 'isInstantMeeting' | undefined
    >(undefined);

    const createMeeting = async () => {

    }

    return (
        <section className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
            <HomeCard
                img="/add-meeting.svg"
                title="New Meeting"
                description="Start an instant meeting"
                handleClick={() => setMeetingState('isInstantMeeting')}
            />
            <HomeCard
                img="/join-meeting.svg"
                title="Join Meeting"
                description="via invitation link"
                className="bg-blue-1"
                handleClick={() => setMeetingState('isJoiningMeeting')}
            />
            <HomeCard
                img="/schedule.svg"
                title="Schedule Meeting"
                description="Plan your meeting"
                className="bg-purple-1"
                handleClick={() => setMeetingState('isScheduleMeeting')}
            />
            <HomeCard
                img="/recordings.svg"
                title="View Recordings"
                description="Meeting Recordings"
                className="bg-yellow-1"
                handleClick={() => router.push('/recordings')}
            />
            <MeetingModal
                isOpen={meetingState === 'isInstantMeeting'}
                onClose={() => setMeetingState(undefined)}
                title="Start an Instant Meeting"
                handleClick={createMeeting}
                className="text-center"
                buttonText="Start Meeting"
            />
        </section>
    )
}

export default MeetingTypeList
