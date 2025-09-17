import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { SettingsLayout } from "../SettingLayout";
import { AccessContainer } from "./AccessContainer";
import { auth } from "@clerk/nextjs/server";

interface Props {
    params: Promise<{ projectId: string }>;
}

export default async function AccessPage({ params }: Props) {
    const { projectId } = await params;
    const supabase = await createClient();

    const { userId } = await auth();
    if (!userId) redirect("/login");

    const [{ data: project, error: projectError }, { data: members, error: membersError }] =
        await Promise.all([
            supabase.from("projects").select("*").eq("id", projectId).single(),
            supabase
                .from("project_members")
                .select(`*, user:users (clerk_id, name, email, avatar)`)
                .eq("project_id", projectId),
        ]);

    if (projectError || !project) redirect("/projects");

    // Get current user's role
    const isCreator = project.created_by === userId;
    const currentMember = members?.find((m) => m.user_id === userId);
    const currentUserRole = isCreator ? "admin" : currentMember?.role || "read";

    return (
        <SettingsLayout title="Who has access">
            <AccessContainer
                projectId={projectId}
                projectName={project.name}
                initialMembers={members || []}
                currentUserId={userId}
                currentUserRole={currentUserRole}
                createdBy={project.created_by}
            />
        </SettingsLayout>
    );
}
