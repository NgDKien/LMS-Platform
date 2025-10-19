'use client';

import { useEffect, useState } from 'react';
import {
    DeviceSettings,
    VideoPreview,
    useCall,
    useCallStateHooks,
} from '@stream-io/video-react-sdk';
import Alert from './Alert';
import { Button } from '../ui/button';

const MeetingSetup = ({
    setIsSetupComplete,
}: {
    setIsSetupComplete: (value: boolean) => void;
}) => {
    const { useCallEndedAt, useCallStartsAt } = useCallStateHooks();
    const callStartsAt = useCallStartsAt();
    const callEndedAt = useCallEndedAt();
    const callTimeNotArrived =
        callStartsAt && new Date(callStartsAt) > new Date();
    const callHasEnded = !!callEndedAt;
    const call = useCall();

    if (!call) {
        throw new Error(
            'useStreamCall must be used within a StreamCall component.',
        );
    }

    const [isMicCamToggled, setIsMicCamToggled] = useState(false);

    useEffect(() => {
        if (isMicCamToggled) {
            call.camera.disable();
            call.microphone.disable();
        } else {
            call.camera.enable();
            call.microphone.enable();
        }
    }, [isMicCamToggled, call.camera, call.microphone]);

    if (callTimeNotArrived)
        return (
            <Alert
                title={`Your Meeting has not started yet. It is scheduled for ${callStartsAt.toLocaleString()}`}
            />
        );

    if (callHasEnded)
        return (
            <Alert
                title="The call has been ended by the host"
                iconUrl="/icons/call-ended.svg"
            />
        );

    return (
        <div className="flex h-screen w-full flex-col items-center justify-center gap-6 text-white px-4 py-6">
            {/* Header */}
            <div className="text-center space-y-2 mb-2">
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-white via-blue-100 to-purple-200 bg-clip-text text-transparent">
                    Get Ready to Join
                </h1>
                <p className="text-sm text-slate-400">
                    Check your camera and microphone before joining the meeting
                </p>
            </div>

            {/* Video Preview - Full Size */}
            <div className="w-full max-w-5xl flex-1 flex items-center justify-center">
                <div className="relative w-full h-full max-h-[600px] rounded-2xl overflow-hidden border-2 border-blue-500/50 shadow-2xl shadow-blue-500/20">
                    <div className="absolute inset-0 flex items-center justify-center">
                        <VideoPreview />
                    </div>

                    {/* Status Badge */}
                    <div className="absolute top-4 left-4 flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-900/90 backdrop-blur-md border border-slate-700/50">
                        <div className={`w-2 h-2 rounded-full ${isMicCamToggled ? 'bg-red-400' : 'bg-green-400'} animate-pulse`}></div>
                        <span className="text-sm font-medium text-white">
                            {isMicCamToggled ? 'Camera & Mic Off' : 'Camera & Mic On'}
                        </span>
                    </div>
                </div>
            </div>

            {/* Controls - Fixed at Bottom */}
            <div className="w-full max-w-5xl space-y-4">
                {/* Toggle and Settings */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-4 py-4 rounded-xl bg-slate-900/50 backdrop-blur-md border border-slate-700/50">
                    <label className="flex items-center gap-3 cursor-pointer group">
                        <div className="relative">
                            <input
                                type="checkbox"
                                checked={isMicCamToggled}
                                onChange={(e) => setIsMicCamToggled(e.target.checked)}
                                className="peer sr-only"
                            />
                            <div className="w-11 h-6 bg-slate-700 rounded-full peer-checked:bg-gradient-to-r peer-checked:from-blue-600 peer-checked:to-blue-500 transition-all duration-300"></div>
                            <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-all duration-300 peer-checked:translate-x-5 shadow-lg"></div>
                        </div>
                        <span className="text-sm sm:text-base font-medium text-white">
                            Join with mic and camera off
                        </span>
                    </label>

                    <DeviceSettings />
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3">
                    <Button
                        className="flex-1 h-12 sm:h-14 text-base font-semibold bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400 border-0 shadow-lg shadow-green-500/30 transition-all duration-300 rounded-xl"
                        onClick={() => {
                            call.join();
                            setIsSetupComplete(true);
                        }}
                    >
                        <span className="flex items-center justify-center gap-2">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                            </svg>
                            Join Meeting
                        </span>
                    </Button>

                    <Button
                        className="sm:w-auto h-12 sm:h-14 px-8 text-base font-medium bg-slate-800/80 hover:bg-slate-700 border border-slate-700/50 transition-all duration-300 rounded-xl"
                        onClick={() => {
                            window.history.back();
                        }}
                    >
                        <span className="flex items-center justify-center gap-2">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                            Go Back
                        </span>
                    </Button>
                </div>

                {/* Info Tips */}
                <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-xs sm:text-sm text-slate-500">
                    <div className="flex items-center gap-2">
                        <svg className="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span>HD Video Quality</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <svg className="w-4 h-4 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span>Crystal Clear Audio</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <svg className="w-4 h-4 text-purple-400" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span>Secure Connection</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MeetingSetup;