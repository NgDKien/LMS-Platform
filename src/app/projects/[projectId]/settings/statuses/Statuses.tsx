'use client';
import { primaryBtnStyles } from '@/app/commonStyles';
import { CreateCustomFieldOptionModal } from '@/components/CreateCustomFieldOptionModal';
import { CustomFieldOptions } from '@/components/CustomFieldOptions';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { createClient } from '@/utils/supabase/client';
import { compareAndUpdateItems, hasChanges } from '@/utils/array-utils';
import { useState } from 'react';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { Save } from 'lucide-react';

interface Props {
    projectId: string;
    items: ICustomFieldData[];
}

export const Statuses = ({ projectId, items: initialItems }: Props) => {
    const [items, setItems] = useState(initialItems);
    const [statuses, setStatuses] = useState(initialItems);
    const [isSaving, setIsSaving] = useState(false);
    const supabase = createClient();

    const hasUnsavedChanges = hasChanges(items, statuses);

    const handleSaveData = async () => {
        try {
            setIsSaving(true);

            const { itemsToAdd, itemsToUpdate, itemsToDelete } =
                compareAndUpdateItems(items, statuses);

            await Promise.all([
                itemsToDelete.length > 0 &&
                supabase.from('statuses').delete().in('id', itemsToDelete),
                itemsToUpdate.length > 0 &&
                supabase.from('statuses').upsert(
                    itemsToUpdate.map((item) => ({
                        ...item,
                        project_id: projectId,
                        updated_at: new Date(),
                    }))
                ),
                itemsToAdd.length > 0 &&
                supabase.from('statuses').insert(
                    itemsToAdd.map((item) => ({
                        ...item,
                        project_id: projectId,
                        updated_at: new Date(),
                    }))
                ),
            ]);

            setItems(statuses);
            toast.success('Statuses updated successfully');
        } catch (error) {
            console.error('Error saving statuses:', error);
            toast.error(
                error instanceof Error ? error.message : 'Failed to save statuses'
            );
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="w-full">
            <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-2xl border border-gray-800 bg-gray-900/60 dark:bg-gray-900 shadow-sm p-6 space-y-6"
            >
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                    <h2 className="text-base font-medium text-gray-200">
                        Manage Status Options
                    </h2>

                    <CreateCustomFieldOptionModal
                        title="Create new status"
                        triggerLabel="New Status"
                        handleSubmit={(data) =>
                            setStatuses((items) => [
                                ...items,
                                { id: crypto.randomUUID(), order: items.length, ...data },
                            ])
                        }
                    />
                </div>

                {/* Status list */}
                <div className="bg-gray-800/50 rounded-xl border border-gray-700 p-4">
                    <CustomFieldOptions
                        field="status"
                        options={statuses}
                        setOptions={setStatuses}
                    />
                </div>

                {/* Footer actions */}
                <div className="flex flex-col sm:flex-row justify-end items-center sm:items-center gap-3">
                    {hasUnsavedChanges && (
                        <motion.span
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-sm text-emerald-400 font-medium tracking-wide"
                        >
                            Unsaved changes
                        </motion.span>
                    )}

                    <Button
                        onClick={handleSaveData}
                        disabled={isSaving || !hasUnsavedChanges}
                        className={cn(
                            primaryBtnStyles,
                            'flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50'
                        )}
                    >
                        <Save className="h-4 w-4" />
                        {isSaving ? 'Saving...' : 'Save Changes'}
                    </Button>
                </div>
            </motion.div>
        </div>
    );
};
