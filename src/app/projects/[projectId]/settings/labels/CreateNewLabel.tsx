'use client';
import { successBtnStyles } from '@/app/commonStyles';
import { CreateOrEditLabelForm } from '@/components/CreateOrEditLabelForm';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { ProjectAction } from '@/consts';
// import { useProjectAccess } from '@/hooks/useProjectAccess';
// import { useProjectQueries } from '@/hooks/useProjectQueries';
import { cn } from '@/lib/utils';
import { createClient } from '@/utils/supabase/client';
import React, { useState } from 'react';

interface Props {
    projectId: string;
    onLabelCreated?: (label: ICustomFieldData) => void;
}

export const CreateNewLabel = ({ projectId, onLabelCreated }: Props) => {
    //   const { reloadLabels, reloadProjectTasks } = useProjectQueries(projectId);
    //   const { can } = useProjectAccess({ projectId });
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

            toast.success("Label created successfully");
            setShow(false);
            //   await reloadLabels();
            //   await reloadProjectTasks();
        } catch (error) {
            console.error('Error creating label:', error);
            toast.error(
                error instanceof Error
                    ? error.message
                    : "Failed to create label"
            );
        } finally {
            setIsCreating(false);
        }
    };

    return (
        <div>
            <div className="flex justify-end py-4">
                {/* {can?.(ProjectAction.UPDATE_OPTIONS) ? ( */}
                <Button
                    className={cn(successBtnStyles)}
                    onClick={() => setShow(true)}
                >
                    New label
                </Button>
                {/* ) : null} */}
            </div>

            {show && (
                <CreateOrEditLabelForm
                    cancel={() => setShow(false)}
                    save={saveLabel}
                    isSubmitting={isCreating}
                />
            )}
        </div>
    );
};