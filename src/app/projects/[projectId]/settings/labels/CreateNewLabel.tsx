'use client';
import { successBtnStyles } from '@/app/commonStyles';
import { CreateOrEditLabelForm } from '@/components/CreateOrEditLabelForm';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { createClient } from '@/utils/supabase/client';
import React, { useState } from 'react';
import { PlusCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useProjectAccess } from '@/hooks/useProjectAccess';
import { ProjectAction } from '@/consts';

interface Props {
    projectId: string;
    onLabelCreated?: (label: ICustomFieldData) => void;
}

export const CreateNewLabel = ({ projectId, onLabelCreated }: Props) => {
    const { can } = useProjectAccess({ projectId });
    const [show, setShow] = useState(false);
    const [isCreating, setIsCreating] = useState(false);
    const supabase = createClient();

    const saveLabel = async (data: ICustomFieldData) => {
        try {
            setIsCreating(true);
            const newLabel = {
                ...data,
                id: crypto.randomUUID(),
                project_id: projectId,
                updated_at: new Date(),
            };

            const { error } = await supabase.from('labels').insert(newLabel);
            if (error) throw error;

            onLabelCreated?.(newLabel);
            toast.success('Label created successfully');
            setShow(false);
        } catch (error) {
            toast.error(
                error instanceof Error ? error.message : 'Failed to create label'
            );
        } finally {
            setIsCreating(false);
        }
    };

    return (
        <div className="w-full">
            <div className="flex justify-end mb-6">
                {can?.(ProjectAction.UPDATE_OPTIONS) ? (
                    <Button
                        className={cn(
                            successBtnStyles,
                            'flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600 transition-all'
                        )}
                        onClick={() => setShow(true)}
                    >
                        <PlusCircle className="h-4 w-4" />
                        New Label
                    </Button>
                ) : null}
            </div>

            <AnimatePresence>
                {show && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="p-4 bg-muted/30 rounded-xl shadow-md dark:bg-gray-800 border border-gray-700"
                    >
                        <div className="flex justify-center">

                            <CreateOrEditLabelForm
                                cancel={() => setShow(false)}
                                save={saveLabel}
                                isSubmitting={isCreating}
                            />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
