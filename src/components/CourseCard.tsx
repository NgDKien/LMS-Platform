"use client";

import Image from "next/image";
import Link from "next/link";
import { BookOpen } from "lucide-react";
import { urlFor } from "@/sanity/lib/image";
import { Loader } from "@/components/ui/loader";
import { CourseProgress } from "@/components/CourseProgress";
import {
    GetCoursesQueryResult,
} from "../../sanity.types";

interface CourseCardProps {
    course: GetCoursesQueryResult[number];
    progress?: number;
    href: string;
}

export function CourseCard({ course, progress, href }: CourseCardProps) {
    return (
        <Link
            href={href}
            prefetch={false}
            className="group hover:no-underline flex"
        >
            <div className="bg-zinc-900 rounded-xl overflow-hidden shadow-lg transition-all duration-300 ease-in-out hover:shadow-2xl hover:shadow-blue-500/10 hover:translate-y-[-4px] border border-zinc-800 hover:border-zinc-700 flex flex-col flex-1">
                <div className="relative h-52 w-full overflow-hidden">
                    {course.image ? (
                        <Image
                            src={urlFor(course.image).url() || ""}
                            alt={course.title || "Course Image"}
                            fill
                            className="object-cover transition-transform duration-300 group-hover:scale-110"
                        />
                    ) : (
                        <div className="h-full w-full flex items-center justify-center bg-zinc-800">
                            <Loader size="lg" />
                        </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300" />
                    <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                        <span className="text-sm font-medium px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full backdrop-blur-sm border border-blue-500/30">
                            {course.category?.name || "Uncategorized"}
                        </span>
                        {"price" in course && typeof course.price === "number" && (
                            <span className="text-white font-bold px-3 py-1 bg-black/50 rounded-full backdrop-blur-sm">
                                {course.price === 0
                                    ? "Free"
                                    : `$${course.price.toLocaleString("en-US", {
                                        minimumFractionDigits: 2,
                                    })}`}
                            </span>
                        )}
                    </div>
                </div>
                <div className="p-6 flex flex-col flex-1">
                    <h3 className="text-xl font-bold mb-2 text-white group-hover:text-blue-400 transition-colors duration-300">
                        {course.title}
                    </h3>
                    <p className="text-zinc-400 mb-4 line-clamp-2 flex-1">
                        {course.description}
                    </p>
                    <div className="space-y-4 mt-auto">
                        {course.instructor && (
                            <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                    {course.instructor.photo ? (
                                        <div className="relative h-8 w-8 mr-2">
                                            <Image
                                                src={urlFor(course.instructor.photo).url() || ""}
                                                alt={course.instructor.name || "Instructor"}
                                                fill
                                                className="rounded-full object-cover ring-2 ring-zinc-800"
                                            />
                                        </div>
                                    ) : (
                                        <div className="h-8 w-8 mr-2 rounded-full bg-zinc-800 flex items-center justify-center">
                                            <Loader size="sm" />
                                        </div>
                                    )}
                                    <span className="text-sm text-zinc-400">
                                        by {course.instructor.name}
                                    </span>
                                </div>
                                <BookOpen className="h-4 w-4 text-zinc-500 group-hover:text-blue-400 transition-colors duration-300" />
                            </div>
                        )}
                        {typeof progress === "number" && (
                            <CourseProgress
                                progress={progress}
                                variant="default"
                                size="sm"
                                label="Course Progress"
                            />
                        )}
                    </div>
                </div>
            </div>
        </Link>
    );
}