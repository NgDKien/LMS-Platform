'use client';
import { primaryBtnStyles } from '@/app/commonStyles';
import { CreateCustomFieldOptionModal } from '@/components/CreateCustomFieldOptionModal';
import { CustomFieldOptions } from '@/components/CustomFieldOptions';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { createClient } from '@/utils/supabase/client';
import { compareAndUpdateItems, hasChanges } from '@/utils/array-utils';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Save } from 'lucide-react';

interface Props {
    projectId: string;
    items: ICustomFieldData[];
}

export const Sizes = ({ projectId, items: initialItems }: Props) => {
    const [items, setItems] = useState(initialItems);
    const [sizes, setSizes] = useState(initialItems);
    const [isSaving, setIsSaving] = useState(false);
    const supabase = createClient();

    const hasUnsavedChanges = hasChanges(items, sizes);

    const handleSaveData = async () => {
        try {
            setIsSaving(true);

            const { itemsToAdd, itemsToUpdate, itemsToDelete } =
                compareAndUpdateItems(items, sizes);

            await Promise.all([
                itemsToDelete.length > 0 &&
                supabase.from('sizes').delete().in('id', itemsToDelete),
                itemsToUpdate.length > 0 &&
                supabase.from('sizes').upsert(
                    itemsToUpdate.map((item) => ({
                        ...item,
                        project_id: projectId,
                        updated_at: new Date(),
                    }))
                ),
                itemsToAdd.length > 0 &&
                supabase.from('sizes').insert(
                    itemsToAdd.map((item) => ({
                        ...item,
                        project_id: projectId,
                        updated_at: new Date(),
                    }))
                ),
            ]);

            setItems(sizes);
            toast.success('Sizes updated successfully');
        } catch (error) {
            console.error('Error saving sizes:', error);
            toast.error(
                error instanceof Error ? error.message : 'Failed to save sizes'
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
                    <h2 className="text-base font-medium text-gray-200">Manage Sizes</h2>

                    <CreateCustomFieldOptionModal
                        title="Create new size"
                        triggerLabel="New Size"
                        handleSubmit={(data) =>
                            setSizes((items) => [
                                ...items,
                                { id: crypto.randomUUID(), order: items.length, ...data },
                            ])
                        }
                    />
                </div>

                {/* Description */}
                <p className="text-sm text-gray-400 leading-relaxed">
                    Define available size options for tasks or products in your project.
                </p>

                {/* Sizes list */}
                <div className="bg-gray-800/50 rounded-xl border border-gray-700 p-4">
                    <CustomFieldOptions field="size" options={sizes} setOptions={setSizes} />
                </div>

                {/* Footer actions */}
                <div className="flex flex-col sm:flex-row justify-end items-center gap-3">
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
