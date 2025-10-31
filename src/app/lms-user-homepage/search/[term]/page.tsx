import { Search } from "lucide-react";
import { CourseCard } from "@/components/CourseCard";
import { searchCourses } from "@/sanity/lib/courses/searchCourses";

interface SearchPageProps {
    params: Promise<{
        term: string;
    }>;
}

export default async function SearchPage({ params }: SearchPageProps) {
    const { term } = await params;
    const decodedTerm = decodeURIComponent(term);
    const courses = await searchCourses(decodedTerm);

    return (
        <div className="min-h-screen bg-[#030712] py-12">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header Section */}
                <div className="flex items-start gap-6 mb-12">
                    <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
                        <Search className="h-8 w-8 text-purple-400" />
                    </div>
                    <div>
                        <h1 className="text-4xl font-medium text-white mb-2">Search Results</h1>
                        <p className="text-gray-400 text-lg">
                            Found <span className="text-white font-semibold">{courses.length}</span> result{courses.length === 1 ? "" : "s"} for
                            <span className="text-purple-400 font-semibold ml-1">&quot;{decodedTerm}&quot;</span>
                        </p>
                    </div>
                </div>

                {/* Results Section */}
                {courses.length === 0 ? (
                    <div className="text-center py-20">
                        <div className="inline-flex p-6 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm mb-6">
                            <Search className="h-12 w-12 text-gray-500" />
                        </div>
                        <h2 className="text-3xl font-bold text-white mb-4">No courses found</h2>
                        <p className="text-gray-400 text-lg max-w-md mx-auto">
                            Try searching with different keywords or browse our course catalog
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {courses.map((course) => (
                            <CourseCard
                                key={course._id}
                                course={course}
                                href={`/courses/${course.slug}`}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}