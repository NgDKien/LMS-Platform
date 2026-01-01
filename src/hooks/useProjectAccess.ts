import { useEffect } from "react";
import { useAccessStore } from "@/stores/useAccessStore";
import { ProjectAction } from "@/consts";
import { useAuth } from "@clerk/nextjs";

interface UseProjectAccessProps {
    projectId: string;
}

export const useProjectAccess = ({ projectId }: UseProjectAccessProps) => {
    const { userId, isLoaded } = useAuth();
    const { permissions, roles, isCreator, fetchProjectAccess, requiresMinRole } =
        useAccessStore();

    useEffect(() => {
        if (isLoaded && userId && !permissions[projectId]) {
            fetchProjectAccess(projectId, userId);
        }
    }, [projectId, userId, isLoaded, permissions, fetchProjectAccess]);

    const can = (action: ProjectAction): boolean => {
        return permissions[projectId]?.[action] ?? false;
    };

    const hasMinRole = (minRole: Role): boolean => {
        return requiresMinRole(projectId, minRole);
    };

    return {
        can,
        hasMinRole,
        role: roles[projectId],
        isCreator: isCreator[projectId],
        isLoading: !permissions[projectId],
    };
};
