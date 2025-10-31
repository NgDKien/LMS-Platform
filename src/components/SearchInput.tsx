"use client";

import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function SearchInput() {
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            router.push(`/lms-user-homepage/search/${encodeURIComponent(searchQuery.trim())}`);
        }
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="relative w-full flex-1 max-w-[300px] mb-6"
        >
            <input
                type="text"
                placeholder="Search courses..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-full bg-white/5 border border-white/10 backdrop-blur-sm px-4 py-2 pl-10 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-400/50 focus:border-white/20 focus:bg-white/10 transition-all"
            />
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        </form>
    );
}