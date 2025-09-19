import { UserCard } from './UserCard';

export default function StackedAvatars({ users }: { users: Partial<IUser>[] }) {
  return (
    <div className="flex items-center -space-x-2 hover:-space-x-0">
      {users
        .filter((u): u is Partial<IUser> & { clerk_id: string } => !!u?.clerk_id)
        .map((user) => (
          <UserCard
            key={user.clerk_id}
            id={user.clerk_id || ''}
            name={user.name || ''}
            avatarUrl={user.avatar || ''}
            description={user.description || ''}
            links={user.links || []}
            showPreviewName={false}
            avatarStyles="w-4 h-4 border-2 bg-[#6e6c6c] border-gray-300 dark:border-gray-800"
          />
        ))}
    </div>
  );
}