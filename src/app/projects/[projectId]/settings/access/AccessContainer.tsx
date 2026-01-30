'use client';

import { useState } from 'react';
import { InviteUsers } from './InviteUsers';
import { ManageAccess } from './ManageAccess';

interface MemberWithUser extends IProjectMember {
    user: Pick<IUser, 'clerk_id' | 'name' | 'email' | 'avatar'>;
}

interface Props {
    projectId: string;
    projectName: string;
    initialMembers: MemberWithUser[];
    currentUserId: string;
    currentUserRole: Role;
    createdBy: string;
}

export const AccessContainer = ({
    projectId,
    projectName,
    initialMembers,
    currentUserId,
    currentUserRole,
    createdBy,
}: Props) => {
    const [members, setMembers] = useState<MemberWithUser[]>(initialMembers);
    const [currentRole, setCurrentRole] = useState(currentUserRole);

    const handleMemberAdded = (newMember: MemberWithUser) => {
        setMembers((prev: MemberWithUser[]) => [...prev, newMember]);
    };

    const handleCurrentUserRoleChange = (newRole: Role) => {
        setCurrentRole(newRole);
    };

    return (
        <>
            <div className="p-4 rounded-sm bg-[#202020] text-sm">
                Chỉ những người có quyền truy cập mới có thể xem nội dung này.
            </div>
            <InviteUsers
                projectName={projectName}
                projectId={projectId}
                onMemberAdded={handleMemberAdded}
                currentUserRole={currentRole}
                createdBy={createdBy}
                members={members}
            />
            <ManageAccess
                projectId={projectId}
                members={members}
                onMembersChange={setMembers}
                currentUserId={currentUserId}
                createdBy={createdBy}
                onCurrentUserRoleChange={handleCurrentUserRoleChange}
            />
        </>
    );
};