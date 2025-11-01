'use client';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Ellipsis } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { LabelBadge } from '@/components/LabelBadge';
import { useParams, useSearchParams } from 'next/navigation';
import { defaultFieldColor } from '@/consts/colors';
import { CreateOrEditLabelForm } from '@/components/CreateOrEditLabelForm';
import { createClient } from '@/utils/supabase/client';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';

interface Props {
    labels: ICustomFieldData[];
    hiddenDescription?: boolean;
    onLabelUpdated?: (label: ICustomFieldData) => void;
    onLabelDeleted?: (labelId: string) => void;
}

export const LabelList = ({
    labels,
    hiddenDescription = false,
    onLabelUpdated,
    onLabelDeleted,
}: Props) => {
    const { projectId } = useParams();
    const [labelId, setLabelId] = useState('');
    const [isUpdating, setIsUpdating] = useState(false);
    const searchParams = useSearchParams();
    const supabase = createClient();

    useEffect(() => {
        const labelIdParams = searchParams.get('label_id');
        if (labelIdParams) setLabelId(labelIdParams);
    }, [searchParams]);

    const handleUpdateLabel = async (data: ICustomFieldData) => {
        try {
            setIsUpdating(true);
            const { error } = await supabase
                .from('labels')
                .update({ ...data, updated_at: new Date() })
                .eq('id', data.id);
            if (error) throw error;
            onLabelUpdated?.(data);
            toast.success('Label updated successfully');
            setLabelId('');
        } catch (error) {
            toast.error(error instanceof Error ? error.message : 'Failed to update label');
        } finally {
            setIsUpdating(false);
        }
    };

    const handleDeleteLabel = async (id: string) => {
        try {
            const { error } = await supabase.from('labels').delete().eq('id', id);
            if (error) throw error;
            onLabelDeleted?.(id);
            toast.success('Label deleted successfully');
        } catch (error) {
            toast.error(error instanceof Error ? error.message : 'Failed to delete label');
        }
    };

    return (
        <div className="p-4 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {labels.map((label) => (
                    <motion.div
                        key={label.id}
                        layout
                        className="bg-gray-800/70 dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-700 hover:shadow-lg transition-all group"
                    >
                        <div className="flex items-start justify-between">
                            <div>
                                <LabelBadge
                                    labelText={label.label || ''}
                                    description={label.description || ''}
                                    color={label.color || defaultFieldColor}
                                />
                                {!hiddenDescription && (
                                    <p className="mt-2 text-sm text-gray-400 line-clamp-2">
                                        {label.description}
                                    </p>
                                )}
                            </div>

                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <Ellipsis className="h-4 w-4 text-gray-400" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuItem onClick={() => setLabelId(label.id)}>
                                        Edit
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                        onClick={() => handleDeleteLabel(label.id)}
                                        className="text-red-500"
                                    >
                                        Delete
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </motion.div>
                ))}
            </div>

            <AnimatePresence>
                {labelId && (
                    <motion.div
                        key="edit-form"
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        className="w-full"
                    >
                        <div className="p-4 bg-gray-900/80 border border-gray-700 rounded-2xl shadow-md flex justify-center">
                            <CreateOrEditLabelForm
                                mode="edit"
                                cancel={() => setLabelId('')}
                                save={handleUpdateLabel}
                                data={labels.find((l) => l.id === labelId)}
                                isSubmitting={isUpdating}
                            />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );

};
