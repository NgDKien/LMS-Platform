"use client";

import { createClient } from "@/utils/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@clerk/nextjs";

const supabase = createClient();

// Fetch user details từ Supabase bằng Clerk userId
const fetchUserDetails = async (
    clerkId: string | null | undefined
): Promise<Partial<IUser> | null> => {
    if (!clerkId) return null;

    const { data, error } = await supabase
        .from("users")
        .select("clerk_id, name, avatar, description, links")
        .eq("clerk_id", clerkId)
        .single();

    if (error) {
        console.error("Error fetching user details:", error);
        return null;
    }

    // return data;
    return {
        clerk_id: data.clerk_id,
        name: data.name,
        avatar: data.avatar,
        description: data.description,
        links: data.links
    };
};

export const useCurrentUser = (): {
    user: Partial<IUser> | null | undefined;
    isLoading: boolean;
} => {
    const { userId, isLoaded: isAuthLoaded } = useAuth();

    // Fetch user details bằng React Query
    const { data: user, isLoading: isUserLoading } = useQuery({
        queryKey: ["user", userId],
        queryFn: () => fetchUserDetails(userId),
        enabled: !!userId,
        staleTime: 1000 * 60 * 5, // 5 phút
        gcTime: 1000 * 60 * 30, // 30 phút
    });

    return {
        user,
        isLoading: !isAuthLoaded || isUserLoading,
    };
};
