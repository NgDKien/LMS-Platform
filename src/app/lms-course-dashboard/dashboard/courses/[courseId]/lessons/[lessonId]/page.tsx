import { redirect } from "next/navigation";
import { currentUser } from "@clerk/nextjs/server";
import { getLessonById } from "@/sanity/lib/lessons/getLessonById";
import { PortableText } from "@portabletext/react";
import { BookOpen, Clock } from "lucide-react";
import { LoomEmbed } from "@/components/lmsCourseDashboard/LoomEmbed";
import { VideoPlayer } from "@/components/lmsCourseDashboard/VideoPlayer";
import { LessonCompleteButton } from "@/components/LessonCompleteButton";

interface LessonPageProps {
    params: Promise<{
        courseId: string;
        lessonId: string;
    }>;
}

export default async function LessonPage({ params }: LessonPageProps) {
    const user = await currentUser();
    const { courseId, lessonId } = await params;

    const lesson = await getLessonById(lessonId);

    if (!lesson) {
        return redirect(`/dashboard/courses/${courseId}`);
    }

    return (
        <div className="h-full flex flex-col overflow-hidden bg-slate-950">
            <div className="flex-1 overflow-y-auto">
                <div className="max-w-4xl mx-auto pt-8 pb-20 px-4 lg:px-6">
                    {/* Header Section */}
                    <div className="mb-8 space-y-4">
                        <div className="flex items-center gap-2 text-sm text-slate-500">
                            <BookOpen className="h-4 w-4" />
                            <span>Lesson Content</span>
                        </div>

                        <h1 className="text-3xl lg:text-4xl font-bold text-slate-100 leading-tight">
                            {lesson.title}
                        </h1>

                        {lesson.description && (
                            <p className="text-lg text-slate-400 leading-relaxed border-l-2 border-blue-500/30 pl-4">
                                {lesson.description}
                            </p>
                        )}
                    </div>

                    <div className="space-y-8">
                        {/* Video Section */}
                        {lesson.videoUrl && (
                            <div className="rounded-xl overflow-hidden bg-slate-900/50 border border-slate-800/60 p-2">
                                <VideoPlayer url={lesson.videoUrl} />
                            </div>
                        )}

                        {/* Loom Embed Video if loomUrl is provided */}
                        {lesson.loomUrl && (
                            <div className="rounded-xl overflow-hidden bg-slate-900/50 border border-slate-800/60 p-2">
                                <LoomEmbed shareUrl={lesson.loomUrl} />
                            </div>
                        )}

                        {/* Lesson Content */}
                        {lesson.content && (
                            <div className="bg-slate-900/30 border border-slate-800/60 rounded-xl p-6 lg:p-8">
                                <div className="flex items-center gap-2 mb-6 pb-4 border-b border-slate-800/60">
                                    <BookOpen className="h-5 w-5 text-blue-400" />
                                    <h2 className="text-xl font-semibold text-slate-200">
                                        Lesson Notes
                                    </h2>
                                </div>

                                <div className="prose prose-blue dark:prose-invert max-w-none prose-headings:text-slate-200 prose-p:text-slate-300 prose-p:leading-relaxed prose-a:text-blue-400 prose-a:no-underline hover:prose-a:text-blue-300 prose-strong:text-slate-200 prose-code:text-emerald-400 prose-code:bg-slate-800/50 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-pre:bg-slate-900 prose-pre:border prose-pre:border-slate-800 prose-blockquote:border-l-blue-500 prose-blockquote:text-slate-400 prose-ul:text-slate-300 prose-ol:text-slate-300 prose-li:text-slate-300 prose-hr:border-slate-800">
                                    <PortableText value={lesson.content} />
                                </div>

                                {/* Action Button - Moved inside Lesson Content */}
                                <div className="flex justify-end pt-6 mt-6 border-t border-slate-800/60">
                                    <LessonCompleteButton
                                        lessonId={lesson._id}
                                        clerkId={user!.id}
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Bottom Gradient Fade Effect */}
            <div className="pointer-events-none fixed bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-slate-950 to-transparent" />
        </div>
    );
}