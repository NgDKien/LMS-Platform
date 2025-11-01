'use client';
import { successBtnStyles } from '@/app/commonStyles';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { useDebounce } from '@/hooks/useDebounce';
import { cn } from '@/lib/utils';
import { createClient } from '@/utils/supabase/client';
import { Loader2, User, UsersRound } from 'lucide-react';
import { useState } from 'react';
import { RoleSelect } from './RoleSelect';
import { useCurrentUser } from '@/hooks/useCurrentUser';

interface Props {
  projectName: string;
  projectId: string;
  onMemberAdded?: (member: MemberWithUser) => void;
  currentUserRole: Role;
  createdBy: string;
  members: MemberWithUser[];
}

const supabase = createClient();

export const InviteUsers = ({
  projectName,
  projectId,
  onMemberAdded,
  currentUserRole,
  createdBy,
  members,
}: Props) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<IUser | null>(null);
  const [role, setRole] = useState<Role>('read');
  const [isSearching, setIsSearching] = useState(false);
  const [isInviting, setIsInviting] = useState(false);
  const [searchResults, setSearchResults] = useState<IUser[]>([]);
  const { user } = useCurrentUser();

  const debouncedSearch = useDebounce(async (term: string) => {
    if (term.length < 2) {
      setSearchResults([]);
      return;
    }
    setIsSearching(true);
    try {
      const excludeUserIds = [
        ...members.map((m) => m.user_id),
        createdBy,
      ];
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .ilike('name', `%${term}%`)
        .not('clerk_id', 'in', `(${excludeUserIds.join(',')})`)
        .limit(5);

      if (error) throw error;
      setSearchResults(data as IUser[] || []);
    } catch (error) {
      console.error('Error searching users:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to search users');
    } finally {
      setIsSearching(false);
    }
  }, 800);

  const handleInvite = async () => {
    if (!selectedUser) return;
    try {
      setIsInviting(true);
      const memberDetails = {
        id: crypto.randomUUID(),
        project_id: projectId,
        user_id: selectedUser.clerk_id,
        role,
        invitationStatus: 'invited',
        invited_at: new Date(),
      };

      const { error: memberError } = await supabase
        .from('project_members')
        .insert(memberDetails);
      if (memberError) throw memberError;

      const newMember = {
        ...memberDetails,
        user: selectedUser,
      } as MemberWithUser;

      onMemberAdded?.(newMember);
      toast.success('Invitation sent successfully');
      setSelectedUser(null);
      setSearchTerm('');
      setSearchResults([]);
    } catch (error) {
      console.error(error);
      toast.error(error instanceof Error ? error.message : 'Failed to invite');
    } finally {
      setIsInviting(false);
    }
  };

  if (currentUserRole !== 'admin') return null;

  return (
    <div className="max-w-4xl mx-auto mt-10 w-full">
      <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 backdrop-blur-md shadow-sm p-6">
        <div className="flex items-center gap-2 mb-5">
          <UsersRound className="w-5 h-5 text-zinc-400" />
          <h1 className="text-lg font-semibold text-white">Invite Users</h1>
        </div>

        <div className="flex flex-col md:flex-row md:items-center gap-3">
          {/* Search Box */}
          <div className="relative flex-1">
            <User className="absolute left-3 top-2.5 h-4 w-4 text-zinc-500" />
            {isSearching && (
              <Loader2 className="absolute right-3 top-2.5 h-4 w-4 text-zinc-500 animate-spin" />
            )}
            <Input
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                debouncedSearch(e.target.value);
              }}
              placeholder="Search user by name..."
              className="w-full pl-9 pr-8 h-9 text-sm bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500 focus:ring-zinc-600"
            />

            {searchResults.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-zinc-900 border border-zinc-700 rounded-lg shadow-lg z-20 overflow-hidden">
                {searchResults.map((user) => (
                  <button
                    key={user.clerk_id}
                    onClick={() => {
                      setSelectedUser(user);
                      setSearchTerm(user.name);
                      setSearchResults([]);
                    }}
                    className="w-full text-left px-3 py-2 text-sm text-zinc-300 hover:bg-zinc-800 transition"
                  >
                    {user.name}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Role select */}
          <RoleSelect value={role} onValueChange={setRole} />

          {/* Invite button */}
          <Button
            onClick={handleInvite}
            disabled={!selectedUser || isInviting}
            className={cn(
              successBtnStyles,
              'px-4 h-9 bg-emerald-600 hover:bg-emerald-500 text-white font-medium transition-colors'
            )}
          >
            {isInviting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Inviting...
              </>
            ) : (
              'Invite'
            )}
          </Button>
        </div>

        {/* Selected user info */}
        {selectedUser && (
          <div className="mt-4 text-sm text-zinc-400 border-t border-zinc-800 pt-3">
            <span className="text-zinc-300">Selected user:</span>{' '}
            <span className="text-white font-medium">{selectedUser.name}</span>
          </div>
        )}
      </div>
    </div>
  );
};
