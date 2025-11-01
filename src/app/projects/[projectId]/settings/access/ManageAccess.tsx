'use client';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { UserAvatar } from '@/components/Avatar';
import { Badge } from '@/components/ui/badge';
import { RoleSelect } from './RoleSelect';
import { toast } from 'sonner';
import { createClient } from '@/utils/supabase/client';
import { useState, useMemo } from 'react';
import { useProjectAccess } from '@/hooks/useProjectAccess';
import { useProjectOwner } from '@/hooks/useProjectOwner';
import { ProjectAction } from '@/consts';
import { Trash2, Users } from 'lucide-react';

interface MemberWithUser extends IProjectMember {
  user: Pick<IUser, 'clerk_id' | 'name' | 'email' | 'avatar'>;
}

interface Props {
  members: MemberWithUser[];
  onMembersChange?: (
    members: MemberWithUser[] | ((prev: MemberWithUser[]) => MemberWithUser[])
  ) => void;
  currentUserId: string;
  projectId: string;
  createdBy: string;
  onCurrentUserRoleChange?: (newRole: Role) => void;
}

export const ManageAccess = ({
  members,
  onMembersChange,
  currentUserId,
  projectId,
  createdBy,
  onCurrentUserRoleChange,
}: Props) => {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [isUpdatingMembers, setIsUpdatingMembers] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const supabase = createClient();
  const { can } = useProjectAccess({ projectId });
  const { owner, isLoading: isLoadingOwner } = useProjectOwner(projectId);

  const allMembers = useMemo(() => {
    if (!members || !owner) return members ?? [];
    const isOwnerInMembers = members.some((m) => m.user_id === owner.clerk_id);
    if (isOwnerInMembers) return members;
    return [
      {
        id: `owner-${owner.clerk_id}`,
        user_id: owner.clerk_id,
        project_id: projectId,
        role: 'owner' as Role,
        invitationStatus: 'accepted',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        user: {
          id: owner.clerk_id,
          name: owner.name,
          email: owner.email,
          avatar: owner.avatar,
        },
      },
      ...members,
    ];
  }, [members, owner, projectId]);

  const filteredMembers = useMemo(() => {
    if (!searchTerm.trim()) return allMembers;
    return allMembers.filter((m) =>
      m.user.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [allMembers, searchTerm]);

  if (isLoadingOwner) return <div>Loading...</div>;

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const selectable = allMembers.filter(
        (m) => m.user_id !== currentUserId && m.user_id !== createdBy
      );
      setSelectedIds(new Set(selectable.map((m) => m.id)));
    } else setSelectedIds(new Set());
  };

  const handleSelectMember = (id: string, checked: boolean) => {
    const updated = new Set(selectedIds);
    checked ? updated.add(id) : updated.delete(id);
    setSelectedIds(updated);
  };

  const handleRoleChange = async (memberId: string, newRole: Role) => {
    try {
      setIsUpdatingMembers(true);
      const { error } = await supabase
        .from('project_members')
        .update({ role: newRole, updated_at: new Date() })
        .eq('id', memberId);
      if (error) throw error;
      onMembersChange?.((prev: MemberWithUser[]) =>
        prev.map((m) =>
          m.id === memberId ? { ...m, role: newRole } : m
        )
      );
      toast.success('Member role updated');
      const member = members.find((m) => m.id === memberId);
      if (member?.user_id === currentUserId)
        onCurrentUserRoleChange?.(newRole);
    } catch (err) {
      toast.error('Failed to update role');
    } finally {
      setIsUpdatingMembers(false);
    }
  };

  const handleRemoveMembers = async () => {
    if (selectedIds.size === 0) return;
    try {
      setIsUpdatingMembers(true);
      const idsToRemove = Array.from(selectedIds).filter((id) => {
        const member = members.find((m) => m.id === id);
        return (
          member?.user_id !== currentUserId &&
          member?.user_id !== createdBy
        );
      });
      if (idsToRemove.length === 0) return;

      const { error } = await supabase
        .from('project_members')
        .delete()
        .in('id', idsToRemove);
      if (error) throw error;

      onMembersChange?.((prev: MemberWithUser[]) =>
        prev.filter((m) => !idsToRemove.includes(m.id))
      );
      setSelectedIds(new Set());
      toast.success('Members removed');
    } catch (err) {
      toast.error('Failed to remove members');
    } finally {
      setIsUpdatingMembers(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-10">
      <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 backdrop-blur-md shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800 sticky top-0 bg-zinc-900/70 backdrop-blur-md z-10">
          <div className="flex items-center gap-3">
            <Users className="w-5 h-5 text-zinc-400" />
            <h2 className="text-lg font-semibold text-white">
              Manage Access
            </h2>
          </div>
          {selectedIds.size > 0 && (
            <Button
              size="sm"
              variant="ghost"
              disabled={isUpdatingMembers}
              onClick={handleRemoveMembers}
              className="text-red-400 hover:text-red-300 hover:bg-red-500/10 flex items-center gap-1"
            >
              <Trash2 className="w-4 h-4" /> Remove
            </Button>
          )}
        </div>

        {/* Filter + select all */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-6 py-3 border-b border-zinc-800">
          <div className="flex items-center gap-3">
            <Checkbox
              checked={
                allMembers.length > 0 &&
                allMembers
                  .filter(
                    (m) =>
                      m.user_id !== currentUserId &&
                      m.user_id !== createdBy
                  )
                  .every((m) => selectedIds.has(m.id))
              }
              onCheckedChange={handleSelectAll}
            />
            <span className="text-sm text-zinc-400">
              {selectedIds.size} selected
            </span>
          </div>
          <Input
            placeholder="Search members..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="h-8 bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500 max-w-xs"
          />
        </div>

        {/* Member list */}
        <div className="divide-y divide-zinc-800">
          {filteredMembers.map((member) => (
            <div
              key={member.id}
              className="flex items-center justify-between px-6 py-4 hover:bg-zinc-800/40 transition-colors"
            >
              <div className="flex items-center gap-3 min-w-0">
                {member.user_id !== currentUserId &&
                  member.user_id !== owner?.clerk_id && (
                    <Checkbox
                      checked={selectedIds.has(member.id)}
                      onCheckedChange={(checked: boolean) =>
                        handleSelectMember(member.id, checked)
                      }
                    />
                  )}

                <UserAvatar
                  src={member.user.avatar ?? ''}
                  fallback={member.user.name}
                  className="h-8 w-8"
                />

                <div className="min-w-0">
                  <p className="text-sm font-medium text-white truncate">
                    {member.user.name}{' '}
                    {member.user_id === currentUserId && (
                      <span className="text-xs text-zinc-500">(You)</span>
                    )}
                  </p>
                  <p className="text-xs text-zinc-400 truncate">
                    {member.user.email}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {member.user_id === owner?.clerk_id ? (
                  <Badge
                    variant="secondary"
                    className="bg-zinc-800 text-zinc-300 text-xs px-2 py-0.5"
                  >
                    Owner
                  </Badge>
                ) : can(ProjectAction.UPDATE_MEMBER_ROLE) ? (
                  <RoleSelect
                    value={member.role}
                    onValueChange={(r) => handleRoleChange(member.id, r)}
                    disabled={isUpdatingMembers}
                  />
                ) : (
                  <Badge
                    variant="outline"
                    className="text-xs border-zinc-700 text-zinc-400"
                  >
                    {member.role}
                  </Badge>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
