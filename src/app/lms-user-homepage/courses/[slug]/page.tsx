import { urlFor } from "@/sanity/lib/image";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, BookOpen, Clock, Users, Award } from "lucide-react";
import EnrollButton from "@/components/EnrollButton";
import getCourseBySlug from "@/sanity/lib/courses/getCourseBySlug";
import { isEnrolledInCourse } from "@/sanity/lib/student/isEnrolledInCourse";
import { auth } from "@clerk/nextjs/server";

interface CoursePageProps {
    params: Promise<{
        slug: string;
    }>;
}

export default async function CoursePage({ params }: CoursePageProps) {
    const { slug } = await params;
    const course = await getCourseBySlug(slug);
    const { userId } = await auth();

    const isEnrolled =
        userId && course?._id
            ? await isEnrolledInCourse(userId, course._id)
            : false;

    if (!course) {
        return (
            <div className="min-h-screen bg-zinc-950 flex items-center justify-center px-4">
                <div className="text-center">
                    <h1 className="text-4xl font-bold text-white mb-4">Course not found</h1>
                    <Link
                        href="/"
                        className="text-blue-400 hover:text-blue-300 transition-colors"
                    >
                        Back to Courses
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#030712]">
            {/* Hero Section with Enhanced Overlay */}
            <div className="relative h-[70vh] min-h-[500px] w-full overflow-hidden">
                {course.image && (
                    <Image
                        src={urlFor(course.image).url() || ""}
                        alt={course.title || "Course Title"}
                        fill
                        className="object-cover"
                        priority
                    />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-[#030712] via-[#030712]/80 to-transparent" />

                <div className="absolute inset-0 bg-gradient-to-b from-[#030712] via-[#030712]/10 to-transparent" />

                <div className="absolute inset-0 container mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-end pb-8 sm:pb-12">
                    <Link
                        href="/lms-user-homepage"
                        prefetch={false}
                        className="text-zinc-300 mb-6 sm:mb-8 flex items-center hover:text-blue-400 transition-colors w-fit group"
                    >
                        <ArrowLeft className="mr-2 h-4 w-4 sm:h-5 sm:w-5 group-hover:-translate-x-1 transition-transform" />
                        <span className="text-sm sm:text-base">Back to Courses</span>
                    </Link>

                    <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 lg:gap-8">
                        <div className="flex-1">
                            <div className="flex flex-wrap items-center gap-2 mb-4">
                                <span className="px-3 py-1.5 bg-blue-500/20 text-blue-400 rounded-full text-xs sm:text-sm font-medium backdrop-blur-sm border border-blue-500/30">
                                    {course.category?.name || "Uncategorized"}
                                </span>
                            </div>
                            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight">
                                {course.title}
                            </h1>
                            <p className="text-base sm:text-lg text-zinc-300 max-w-3xl leading-relaxed">
                                {course.description}
                            </p>
                        </div>

                        <div className="bg-zinc-900/90 backdrop-blur-xl rounded-2xl p-6 sm:p-8 border border-zinc-800 lg:min-w-[320px] shadow-2xl">
                            <div className="text-4xl sm:text-5xl font-bold text-white mb-2">
                                {course.price === 0 ? "Free" : `$${course.price}`}
                            </div>
                            <p className="text-zinc-400 text-sm mb-6">One-time payment</p>
                            <EnrollButton courseId={course._id} isEnrolled={isEnrolled} />
                        </div>
                    </div>
                </div>
            </div>

            {/* Content Section */}
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Course Stats */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-zinc-900 rounded-xl p-4 border border-zinc-800">
                                <div className="flex items-center gap-3">
                                    <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-blue-500/20 text-blue-400">
                                        <BookOpen className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <div className="text-2xl font-bold text-white">
                                            {course.modules?.length || 0}
                                        </div>
                                        <div className="text-xs text-zinc-400">Modules</div>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-zinc-900 rounded-xl p-4 border border-zinc-800">
                                <div className="flex items-center gap-3">
                                    <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-purple-500/20 text-purple-400">
                                        <Clock className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <div className="text-2xl font-bold text-white">
                                            {course.modules?.reduce((acc, m) => acc + (m.lessons?.length || 0), 0) || 0}
                                        </div>
                                        <div className="text-xs text-zinc-400">Lessons</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Course Content */}
                        <div className="bg-zinc-900 rounded-2xl p-6 sm:p-8 border border-zinc-800">
                            <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-white">Course Content</h2>
                            <div className="space-y-4">
                                {course.modules?.map((module, index) => (
                                    <div
                                        key={module._id}
                                        className="border border-zinc-800 rounded-xl overflow-hidden bg-zinc-950/50 hover:border-zinc-700 transition-all duration-300"
                                    >
                                        <div className="p-4 sm:p-5 bg-zinc-900/50">
                                            <div className="flex items-start gap-3">
                                                <div className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold text-sm sm:text-base border border-blue-500/30">
                                                    {index + 1}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <h3 className="font-semibold text-white text-base sm:text-lg">
                                                        {module.title}
                                                    </h3>
                                                    <p className="text-xs sm:text-sm text-zinc-400 mt-1">
                                                        {module.lessons?.length || 0} lessons
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="divide-y divide-zinc-800">
                                            {module.lessons?.map((lesson, lessonIndex) => (
                                                <div
                                                    key={lesson._id}
                                                    className="p-4 sm:p-5 hover:bg-zinc-900/70 transition-colors group"
                                                >
                                                    <div className="flex items-center gap-3 sm:gap-4">
                                                        <div className="flex-shrink-0 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-zinc-800 text-zinc-400 flex items-center justify-center text-xs sm:text-sm font-medium group-hover:bg-blue-500/20 group-hover:text-blue-400 transition-colors">
                                                            {lessonIndex + 1}
                                                        </div>
                                                        <div className="flex items-center gap-2 sm:gap-3 text-zinc-300 flex-1 min-w-0">
                                                            <BookOpen className="h-4 w-4 text-zinc-500 flex-shrink-0 group-hover:text-blue-400 transition-colors" />
                                                            <span className="font-medium text-sm sm:text-base truncate">
                                                                {lesson.title}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="lg:sticky lg:top-4 lg:self-start">
                        <div className="bg-zinc-900 rounded-2xl p-6 sm:p-8 border border-zinc-800 shadow-xl">
                            <h2 className="text-xl sm:text-2xl font-bold mb-6 text-white">Instructor</h2>
                            {course.instructor && (
                                <div>
                                    <div className="flex items-center gap-4 mb-6">
                                        {course.instructor.photo && (
                                            <div className="relative h-16 w-16 sm:h-20 sm:w-20 flex-shrink-0">
                                                <Image
                                                    src={urlFor(course.instructor.photo).url() || ""}
                                                    alt={course.instructor.name || "Course Instructor"}
                                                    fill
                                                    className="rounded-full object-cover ring-4 ring-zinc-800"
                                                />
                                            </div>
                                        )}
                                        <div className="flex-1 min-w-0">
                                            <div className="font-semibold text-white text-lg truncate">
                                                {course.instructor.name}
                                            </div>
                                            <div className="text-sm text-blue-400 font-medium">
                                                Course Instructor
                                            </div>
                                        </div>
                                    </div>
                                    {course.instructor.bio && (
                                        <p className="text-zinc-400 text-sm leading-relaxed">
                                            {course.instructor.bio}
                                        </p>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}