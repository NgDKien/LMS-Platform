'use client';
import { Button } from '@/components/ui/button';
import { Check, Copy } from 'lucide-react';
import { useState } from 'react';
import { EditableTitle } from './EditableTitle';
import { TaskActionsMenu } from './TaskActionsMenu';
import { useCopyToClipboard } from '@/hooks/useCopyToClipboard';
import { usePathname } from 'next/navigation';
import { tasks } from '@/utils/tasks';

interface Props {
    title: string;
    taskId: string;
    hideCopyLink?: boolean;
    onTitleUpdate?: (newTitle: string) => void;
}

export const HeaderSection = ({
    title,
    taskId,
    hideCopyLink = false,
    onTitleUpdate,
}: Props) => {
    const pathname = usePathname();
    const [isEditing, setIsEditing] = useState(false);
    const { isCopied, handleCopy } = useCopyToClipboard();

    const permalink =
        typeof window !== 'undefined'
            ? `${location?.origin}${pathname}/${taskId}`
            : '';

    const handleSaveTitle = async (newTitle: string) => {
        await tasks.details.update(taskId, { title: newTitle });
        onTitleUpdate?.(newTitle);
    };

    return (
        <>
            <EditableTitle
                title={title}
                isEditing={isEditing}
                setIsEditing={setIsEditing}
                onSave={handleSaveTitle}
            />
        </>
    );
};