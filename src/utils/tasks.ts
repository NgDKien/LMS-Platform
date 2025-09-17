import { DateUpdates } from "@/hooks/useTaskQueries";
import { createClient } from "./supabase/client";

const supabase = createClient();

export const tasks = {
    // Board-related operations
    board: {
        getProjectTasks: async (projectId: string) => {
            const { data, error } = await supabase
                .from("tasks")
                .select(
                    `
          id,
          title,
          status_id,
          statusPosition,
          creator:users!tasks_created_by_fkey ( clerk_id, name, avatar ),
          size ( id, label, color ),
          priority ( id, label, color, "order" ),
          task_labels (
            labels ( id, label, color )
          ),
          task_assignees (
            users ( clerk_id, name, avatar, description, links )
          )
        `
                )
                .eq("project_id", projectId);

            if (error) throw error;

            return data.map((task: any) => ({
                ...task,
                labels: task.task_labels?.map((tl: any) => tl.labels) || [],
                assignees: task.task_assignees?.map((a: any) => a.users) || [],
                task_labels: null,
                task_assignees: null,
            })) as ITaskWithOptions[];
        },

        updatePosition: async (taskId: string, statusPosition: number) => {
            const { data, error } = await supabase
                .from("tasks")
                .update({
                    statusPosition,
                    updated_at: new Date(),
                })
                .eq("id", taskId)
                .select("*")
                .single();

            if (error) throw error;
            return data as ITask;
        },

        moveTask: async (
            taskId: string,
            statusId: string,
            statusPosition: number
        ) => {
            const { data, error } = await supabase
                .from("tasks")
                .update({
                    status_id: statusId,
                    statusPosition,
                    updated_at: new Date(),
                })
                .eq("id", taskId)
                .select("*")
                .single();

            if (error) throw error;
            return data as ITask;
        },
    },

    // Task details operations
    details: {
        get: async (taskId: string) => {
            const { data, error } = await supabase
                .from("tasks")
                .select(
                    `
          *,
          creator:users!tasks_created_by_fkey ( clerk_id, name, avatar, description, links ),
          size ( id, label, color ),
          priority ( id, label, color, "order" ),
          task_labels (
            labels ( id, label, color )
          ),
          task_assignees (
            users ( clerk_id, name, description, avatar, links )
          )
        `
                )
                .eq("id", taskId)
                .single();

            if (error) throw error;

            return {
                ...data,
                labels: data.task_labels?.map((tl: any) => tl.labels) || [],
                assignees: data.task_assignees?.map((a: any) => a.users) || [],
                task_labels: null,
                task_assignees: null,
            } as ITaskWithOptions;
        },

        update: async (taskId: string, updates: Partial<ITask>) => {
            // Handle task_labels junction table
            if ("labels" in updates) {
                const labelIds = updates.labels || [];
                delete updates.labels;

                await supabase.from("task_labels").delete().eq("task_id", taskId);

                if (labelIds.length > 0) {
                    await supabase.from("task_labels").insert(
                        labelIds.map((labelId) => ({
                            task_id: taskId,
                            label_id: labelId,
                            created_at: new Date(),
                            updated_at: new Date(),
                        }))
                    );
                }
            }

            // Handle task_assignees junction table
            if ("assignees" in updates) {
                const assigneeIds = updates.assignees || [];
                delete updates.assignees;

                await supabase.from("task_assignees").delete().eq("task_id", taskId);

                if (assigneeIds.length > 0) {
                    await supabase.from("task_assignees").insert(
                        assigneeIds.map((userId) => ({
                            task_id: taskId,
                            user_id: userId, // 👈 ở schema mới user_id = clerk_id
                            created_at: new Date(),
                            updated_at: new Date(),
                        }))
                    );
                }
            }

            if (Object.keys(updates).length > 0) {
                const { data, error } = await supabase
                    .from("tasks")
                    .update({ ...updates, updated_at: new Date() })
                    .eq("id", taskId)
                    .select("*")
                    .single();

                if (error) throw error;
                return data as ITask;
            }

            return null;
        },

        delete: async (taskId: string) => {
            const { error } = await supabase.from("tasks").delete().eq("id", taskId);
            if (error) throw error;
        },

        updateDates: async (taskId: string, dates: DateUpdates) => {
            const { data, error } = await supabase
                .from("tasks")
                .update({
                    startDate: dates.startDate,
                    endDate: dates.endDate,
                    updated_at: new Date().toISOString(),
                })
                .eq("id", taskId)
                .select("*")
                .single();

            if (error) throw error;
            return data as ITask;
        },
    },

    // Task creation
    create: async (task: Partial<ITask>) => {
        const { data: createdTask, error } = await supabase
            .from("tasks")
            .insert(task)
            .select(
                `
        *,
        creator:users!tasks_created_by_fkey (
          clerk_id,
          name,
          avatar
        )
      `
            )
            .single();

        if (error) throw error;
        return createdTask as ITaskWithOptions;
    },
};
