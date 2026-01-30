'use client';

import { CreateCustomFieldOptionModal } from '@/components/CreateCustomFieldOptionModal';
import { CreateOrEditLabelForm } from '@/components/CreateOrEditLabelForm';
import { CustomFieldOptions } from '@/components/CustomFieldOptions';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import {
    defaultLabels,
    defaultPriorities,
    defaultSizes,
    defaultStatuses,
} from '@/consts/default-options';
import { useModalDialog } from '@/hooks/useModalDialog';
import { cn } from '@/lib/utils';
import { Plus, Layers } from 'lucide-react';
import { useState } from 'react';
import { secondaryBtnStyles, successBtnStyles } from '../commonStyles';
import { LabelList } from '@/components/LabelList';
import { useRouter } from 'next/navigation';
import { projects } from '@/utils/projects';
import { toast } from 'sonner';
import { createClient } from '@/utils/supabase/client';
import { useAuth } from '@clerk/nextjs';
import { motion } from 'framer-motion';

interface Props {
    projectDetails: {
        name: string;
        description: string;
        readme: string;
    };
}

export const CreateProjectModal = ({ projectDetails }: Props) => {
    const { isModalOpen, openModal, closeModal } = useModalDialog();
    const router = useRouter();
    const [statuses, setStatuses] = useState(defaultStatuses);
    const [sizes, setSizes] = useState(defaultSizes);
    const [priorities, setPriorities] = useState(defaultPriorities);
    const [labels, setLabels] = useState(defaultLabels);
    const [showNewLabelCard, setShowNewLabelCard] = useState(false);
    const [skipDefaultOptions, setSkipDefaultOption] = useState(false);
    const [isCreating, setIsCreating] = useState(false);
    const { userId } = useAuth();

    const handleAddNewLabelItem = (data: ICustomFieldData) => {
        setLabels([...labels, data]);
        setShowNewLabelCard(false);
    };

    const handleRemoveLabelItem = (id: string) => {
        setLabels(labels.filter((item) => item.id !== id));
    };

    const handleCreateProject = async () => {
        try {
            setIsCreating(true);
            const supabase = createClient();

            if (!userId) throw new Error('Not authenticated');

            const projectData = {
                ...projectDetails,
                ...(skipDefaultOptions
                    ? {}
                    : {
                        statuses,
                        sizes,
                        priorities,
                        labels,
                    }),
            };

            const project = await projects.management.create(
                projectData as ProjectWithOptions,
                userId
            );

            toast.success('Project created — redirecting');
            closeModal();
            router.push(`/projects/${project.id}`);
        } catch (error) {
            console.error('Error creating project:', error);
            toast.error(
                error instanceof Error
                    ? error.message
                    : 'Failed to create project. Please try again.'
            );
        } finally {
            setIsCreating(false);
        }
    };

    return (
        <Dialog open={isModalOpen} onOpenChange={(open) => !open && closeModal()}>
            <DialogTrigger
                onClick={openModal}
                className={cn(
                    successBtnStyles,
                    'flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-violet-500 hover:from-indigo-600 hover:to-violet-600 shadow-[0_8px_30px_rgba(99,102,241,0.12)]'
                )}
                disabled={!projectDetails.name}
            >
                <Layers className="w-4 h-4" />
                Tiếp tục
            </DialogTrigger>

            <DialogContent
                className={cn(
                    'w-[95vw] md:w-[85vw] lg:w-[70vw] max-w-none',
                    'max-h-[90vh] overflow-y-auto p-0 rounded-2xl border border-white/10',
                    'bg-gradient-to-b from-[#0d0f16] to-[#11131c] shadow-2xl scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent hover:scrollbar-thumb-white/20'
                )}
            >
                <div className="flex flex-col px-6 py-8 space-y-6">
                    {/* Header */}
                    <DialogHeader className="p-0">
                        <DialogTitle className="text-xl font-semibold text-gray-100">
                            Tùy chỉnh các thông số mặc định
                        </DialogTitle>
                        <DialogDescription className="mt-1 text-sm text-gray-400">
                            Điều chỉnh các giá trị mặc định ban đầu của dự án — bạn có thể thay đổi chúng sau.
                        </DialogDescription>
                    </DialogHeader>

                    <Separator className="border-white/10" />

                    {/* Main grid */}
                    <motion.div
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.22 }}
                        className="grid grid-cols-1 md:grid-cols-2 gap-5"
                    >
                        <CustomFieldOptions
                            title="Phạm vi"
                            field="size"
                            options={sizes}
                            setOptions={setSizes}
                            hiddenDescription
                            embeddedCreateOptionEle={
                                <CreateCustomFieldOptionModal
                                    title="Create new size option"
                                    triggerLabel="New Size"
                                    action="create-new-project"
                                />
                            }
                        />

                        <CustomFieldOptions
                            title="Độ ưu tiên"
                            field="priority"
                            options={priorities}
                            setOptions={setPriorities}
                            hiddenDescription
                            embeddedCreateOptionEle={
                                <CreateCustomFieldOptionModal
                                    title="Create new priority option"
                                    triggerLabel="New Priority"
                                    action="create-new-project"
                                />
                            }
                        />

                        <CustomFieldOptions
                            title="Trạng thái"
                            field="status"
                            options={statuses}
                            setOptions={setStatuses}
                            hiddenDescription
                            embeddedCreateOptionEle={
                                <CreateCustomFieldOptionModal
                                    title="Create new status option"
                                    triggerLabel="New Status"
                                    action="create-new-project"
                                />
                            }
                        />

                        {/* LABELS */}
                        <div>
                            <div className="flex justify-between items-center mb-3">
                                <h4 className="text-sm font-medium text-gray-100">Nhãn</h4>
                                <Button
                                    onClick={() => setShowNewLabelCard(true)}
                                    className={cn(
                                        secondaryBtnStyles,
                                        'h-8 px-3 rounded-md bg-white/5 border border-white/10 text-white'
                                    )}
                                >
                                    <Plus className="w-4 h-4" />
                                    Tạo mới
                                </Button>
                            </div>

                            {showNewLabelCard && (
                                <div className="flex justify-center">
                                    <CreateOrEditLabelForm
                                        save={(data) => handleAddNewLabelItem(data)}
                                        cancel={() => setShowNewLabelCard(false)}
                                    />
                                </div>
                            )}

                            <div className="mt-3 rounded-xl border border-white/10 overflow-hidden bg-white/5">
                                <LabelList
                                    labels={labels}
                                    hiddenDescription
                                    onLabelDeleted={handleRemoveLabelItem}
                                />
                            </div>
                        </div>
                    </motion.div>

                    {/* Skip Defaults */}
                    <div className="flex items-center gap-3 pt-4 border-t border-white/10">
                        <Checkbox
                            checked={skipDefaultOptions}
                            onClick={() => setSkipDefaultOption(!skipDefaultOptions)}
                        />
                        <Label className="text-sm text-gray-300">
                            Bỏ qua các thông số mặc đinh (Tôi sẽ tự thêm sau)
                        </Label>
                    </div>

                    {/* Footer */}
                    <DialogFooter className="pt-4 border-t border-white/10">
                        <div className="flex justify-end w-full">
                            <Button
                                onClick={handleCreateProject}
                                className={cn(
                                    successBtnStyles,
                                    'px-5 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-violet-500 hover:from-indigo-600 hover:to-violet-600'
                                )}
                                disabled={isCreating}
                            >
                                {isCreating ? 'Creating...' : 'Tạo dự án'}
                            </Button>
                        </div>
                    </DialogFooter>
                </div>
            </DialogContent>
        </Dialog>
    );
};
