import React, { FC, memo } from 'react';
import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
} from '@/components/ui/hover-card';
import { UserAvatar } from './Avatar';
import Link from 'next/link';
import { Separator } from './ui/separator';
import { Link as LinkIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Props {
    id: string;
    name: string;
    avatarUrl: string;
    description?: string;
    links?: IUserLink[];
    showPreviewName?: boolean;
    avatarStyles?: string;
}

const UserCardContent = memo(
    ({ name, avatarUrl, description, links, id }: Props) => (
        <div className="bg-zinc-900/80 backdrop-blur-md border border-zinc-800 rounded-xl p-4 shadow-xl transition-all duration-300 hover:border-sky-500/40 hover:shadow-sky-500/20">
            <div className="flex items-center gap-3 mb-3">
                <UserAvatar
                    src={avatarUrl}
                    fallback={name.charAt(0)}
                    className="w-10 h-10 border border-zinc-700 shadow-md"
                />
                <p className="text-white font-semibold text-lg tracking-wide">{name}</p>
            </div>
        </div>
    )
);
UserCardContent.displayName = 'UserCardContent';

// 🧠 Main UserCard
export const UserCard: FC<Props> = memo(
    ({
        id,
        name,
        avatarUrl,
        description,
        links,
        showPreviewName = true,
        avatarStyles,
    }) => {
        return (
            <HoverCard>
                <HoverCardTrigger asChild>
                    <div className="flex items-center gap-2 cursor-pointer hover:opacity-90 transition-all">
                        <UserAvatar
                            src={avatarUrl}
                            fallback={name.charAt(0)}
                            className={cn(
                                'w-8 h-8 border border-zinc-700 bg-zinc-800 text-white',
                                avatarStyles
                            )}
                        />
                        {showPreviewName && (
                            <span className="text-sm font-medium text-gray-300 hover:text-white transition-colors">
                                {name}
                            </span>
                        )}
                    </div>
                </HoverCardTrigger>

                <HoverCardContent
                    side="top"
                    className="w-80 bg-zinc-950/90 border border-zinc-800 rounded-xl shadow-2xl p-0 backdrop-blur-md"
                >
                    <UserCardContent
                        id={id}
                        name={name}
                        avatarUrl={avatarUrl}
                        description={description}
                        links={links}
                    />
                </HoverCardContent>
            </HoverCard>
        );
    }
);
UserCard.displayName = 'UserCard';
