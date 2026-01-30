import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getEnrolledCourses } from "@/sanity/lib/student/getEnrolledCourses";
import Link from "next/link";
import { GraduationCap } from "lucide-react";
import { getCourseProgress } from "@/sanity/lib/lessons/getCourseProgress";
import { CourseCard } from "@/components/CourseCard";

export default async function MyCoursesPage() {
    const user = await currentUser();

    if (!user?.id) {
        return redirect("/");
    }

    const enrolledCourses = await getEnrolledCourses(user.id);

    // Get progress for each enrolled course
    const coursesWithProgress = await Promise.all(
        enrolledCourses.map(async ({ course }) => {
            if (!course) return null;
            const progress = await getCourseProgress(user.id, course._id);
            return {
                course,
                progress: progress.courseProgress,
            };
        })
    );

    return (
        <div className="h-full">
            <div className="container mx-auto px-4 pt-4">
                <div className="flex items-start gap-6 mb-12">
                    <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
                        <GraduationCap className="h-8 w-8 text-purple-400" />
                    </div>
                    <div>
                        <h1 className="text-4xl font-bold text-white">Khóa học của tôi</h1>
                        <p className="text-gray-400 text-lg mt-2">
                            Tiếp tục quá trình học tập
                        </p>
                    </div>
                </div>

                {enrolledCourses.length === 0 ? (
                    <div className="text-center py-12">
                        <h2 className="text-2xl font-semibold mb-4">Chưa ghi danh vào khóa học nào</h2>
                        <p className="text-muted-foreground mb-8">
                            Bạn chưa ghi danh bất kì khóa học nào. Hãy khám phá thêm các khóa học của chúng tôi để bắt đầu!
                        </p>
                        <Link
                            href="/"
                            prefetch={false}
                            className="inline-flex items-center justify-center rounded-lg px-6 py-3 font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                        >
                            Khám phá các khóa học
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {coursesWithProgress.map((item) => {
                            if (!item || !item.course) return null;

                            return (
                                <CourseCard
                                    key={item.course._id}
                                    course={item.course}
                                    progress={item.progress}
                                    href={`/lms-course-dashboard/dashboard/courses/${item.course._id}`}
                                />
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}