'use client';
import TextEditor from '@/components/TextEditor';
import { Button } from '@/components/ui/button';
import React, { useMemo, useState } from 'react';
import { TaskDescription } from './TaskDescription';
import { getTimelineItems } from '@/lib/get-timeline-items';
import ActivityRenderer from './ActivityRenderer';
import { Comment } from './Comment';
import { successBtnStyles } from '@/app/commonStyles';
import { cn } from '@/lib/utils';
import { Separator } from '@radix-ui/react-dropdown-menu';
import { Assignees } from './Assignees';
import { OtherActions } from './OtherActions';
import { Participants } from './Participants';
import { Project } from './Project';
import { TaskLabels } from './TaskLabels';
import { useTaskDetails } from '../Board/TaskDetailsContext';
import { useActivityQueries } from '@/hooks/useActivityQueries';
import { useCommentQueries } from '@/hooks/useCommentQueries';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { UserCard } from '@/components/UserCard';
import { useProjectQueries } from '@/hooks/useProjectQueries';
import { useParams } from 'next/navigation';
import { toast } from 'sonner';
import { MessageSquare, Activity, ChevronDown, Send } from 'lucide-react';

// Separate component for the comment form to prevent re-renders of the entire timeline
const CommentForm = () => {
    const [comment, setComment] = React.useState('');
    const [resetKey, setResetKey] = React.useState(0);
    const { selectedTask } = useTaskDetails();
    const { createComment } = useCommentQueries(selectedTask?.id || '');
    const { user } = useCurrentUser();

    const handleCreateComment = async () => {
        if (!comment.trim() || !selectedTask?.id || !user?.clerk_id) return;

        try {
            await createComment({
                task_id: selectedTask.id,
                clerk_id: user.clerk_id,
                content: comment,
            });

            // Reset the comment input
            setComment('');
            setResetKey((prev) => prev + 1);
        } catch (error) {
            toast.error(
                error instanceof Error
                    ? error.message
                    : "Failed to add comment"
            );
        }
    };

    return (
        <div className="mt-6">
            <div className="flex items-center space-x-3 mb-4">
                <div className="flex-1">
                    <div className="bg-slate-700/30 rounded-xl border border-slate-600 focus-within:border-blue-500 transition-colors overflow-hidden">
                        <TextEditor
                            content={comment}
                            onChange={setComment}
                            isEditable
                            resetKey={resetKey}
                        />
                        <div className="px-4 py-3 border-t border-slate-600 flex items-center justify-end">
                            <Button
                                className={cn(
                                    "px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-600 disabled:cursor-not-allowed rounded-lg flex items-center space-x-2 transition-colors text-white"
                                )}
                                onClick={handleCreateComment}
                                disabled={!comment.trim()}
                            >
                                <Send className="w-4 h-4" />
                                <span className="text-sm font-medium">Thêm bình luận</span>
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export const TaskDetails = () => {
    const { selectedTask } = useTaskDetails();
    const { taskActivities } = useActivityQueries(selectedTask?.id as string);
    const params = useParams();
    const projectId = params.projectId as string;
    const { statuses, members, labels } = useProjectQueries(projectId);
    const { user } = useCurrentUser();
    const { taskComments } = useCommentQueries(selectedTask?.id as string);
    const [showComments, setShowComments] = useState(true);
    const [showActivities, setShowActivities] = useState(true);

    const allMembers = useMemo(() => {
        if (!members || !user) return members;
        const isCurrentUserMember = members.some((m) => m.clerk_id === user.clerk_id);
        return isCurrentUserMember ? members : [...members, user];
    }, [members, user]);

    // Memoize timeline items
    const timelineItems = useMemo(
        () => getTimelineItems(taskComments || []),
        [taskComments]
    );

    // Separate comments and activities
    const comments = timelineItems.filter(item => item.type === 'comment');

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content - 2/3 width */}
            <div className="lg:col-span-2 space-y-6">
                {/* Description Card */}
                <div className="bg-slate-800/40 backdrop-blur-sm rounded-xl border border-slate-700/50 p-6 hover:border-slate-600/50 transition-all">
                    <div className="flex items-center mb-4">
                        <div className="w-1 h-6 bg-blue-500 rounded-full mr-3"></div>
                        <h2 className="text-lg font-semibold text-white">Mô tả dự án</h2>
                    </div>
                    <TaskDescription />
                </div>

                {/* Comments Section */}
                <div className="bg-slate-800/40 backdrop-blur-sm rounded-xl border border-slate-700/50 overflow-hidden hover:border-slate-600/50 transition-all">
                    <button
                        onClick={() => setShowComments(!showComments)}
                        className="w-full px-6 py-4 flex items-center justify-between hover:bg-slate-700/30 transition-colors"
                    >
                        <h2 className="text-lg font-semibold text-white flex items-center">
                            <MessageSquare className="w-5 h-5 mr-3 text-blue-400" />
                            Thảo luận ({comments.length})
                        </h2>
                        <ChevronDown className={`w-5 h-5 transition-transform text-slate-400 ${showComments ? 'rotate-180' : ''}`} />
                    </button>

                    {showComments && (
                        <div className="px-6 pb-6">
                            <div className="space-y-4">
                                {comments.map((item) => (
                                    <div key={item.id} className="flex space-x-3">
                                        <div className="flex-1 bg-slate-700/30 rounded-lg p-4 hover:bg-slate-700/50 transition-colors">
                                            <Comment comment={item.value as CommentResponse} />
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <CommentForm />
                        </div>
                    )}
                </div>
            </div>

            {/* Sidebar - 1/3 width */}
            <div className="space-y-4">
                <div className="bg-slate-800/40 backdrop-blur-sm rounded-xl border border-slate-700/50 p-5 hover:border-slate-600/50 transition-all">
                    <Assignees />
                </div>

                <Separator className="my-2" />

                <div className="bg-slate-800/40 backdrop-blur-sm rounded-xl border border-slate-700/50 p-5 hover:border-slate-600/50 transition-all">
                    <TaskLabels />
                </div>

                <Separator className="my-2" />

                <div className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 backdrop-blur-sm rounded-xl border border-blue-500/30 p-5 hover:border-blue-400/50 transition-all">
                    <Project />
                </div>

                <Separator className="my-2" />

                <div className="bg-slate-800/40 backdrop-blur-sm rounded-xl border border-slate-700/50 p-5 hover:border-slate-600/50 transition-all">
                    <Participants />
                </div>

                <Separator className="my-2" />

                <div className="bg-slate-800/40 backdrop-blur-sm rounded-xl border border-slate-700/50 p-5 hover:border-slate-600/50 transition-all">
                    <OtherActions />
                </div>
            </div>
        </div>
    );
};