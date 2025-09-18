import { createClient } from "./supabase/client";

const supabase = createClient();

export const comments = {
    // Get all comments for a task
    getTaskComments: async (taskId: string) => {
        const { data, error } = await supabase
            .from("comments")
            .select(
                `
        id,
        content,
        created_at,
        updated_at,
        task_id,
        user:users!comments_user_id_fkey (
          clerk_id,
          name,
          avatar,
          description,
          links
        )
      `
            )
            .eq("task_id", taskId)
            .order("created_at", { ascending: true }); // oldest first

        if (error) throw error;
        return data as CommentResponse[];
    },

    // Create a new comment
    create: async (comment: { task_id: string; clerk_id: string; content: string }) => {
        const { data, error } = await supabase
            .from("comments")
            .insert({
                task_id: comment.task_id,
                user_id: comment.clerk_id,
                content: comment.content,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
            })
            .select(
                `
        id,
        content,
        created_at,
        updated_at,
        task_id,
        user:users!comments_user_id_fkey (
          clerk_id,
          name,
          avatar,
          description,
          links
        )
      `
            )
            .single();

        if (error) throw error;
        return data as CommentResponse;
    },

    // Delete a comment
    delete: async (commentId: string) => {
        const { error } = await supabase.from("comments").delete().eq("id", commentId);
        if (error) throw error;
    },

    // Update a comment
    update: async (commentId: string, updates: { content: string }) => {
        const { data, error } = await supabase
            .from("comments")
            .update({
                ...updates,
                updated_at: new Date().toISOString(),
            })
            .eq("id", commentId)
            .select(
                `
        id,
        content,
        created_at,
        updated_at,
        task_id,
        user:users!comments_user_id_fkey (
          clerk_id,
          name,
          avatar,
          description,
          links
        )
      `
            )
            .single();

        if (error) throw error;
        return data as CommentResponse;
    },
};
