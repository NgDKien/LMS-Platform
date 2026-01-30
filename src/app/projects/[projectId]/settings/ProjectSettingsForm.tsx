'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { projects } from '@/utils/projects';
import { secondaryBtnStyles } from '@/app/commonStyles';
import { CloseProjectDialog } from '@/app/projects/_components/CloseProjectDialog';
import { DeleteProjectDialog } from '@/app/projects/_components/DeleteProjectDialog';
import TextEditor from '@/components/TextEditor';
import { toast } from 'sonner';
import { useProjectAccess } from '@/hooks/useProjectAccess';
import { ProjectAction } from '@/consts';

interface ProjectSettingsFormProps {
    project: IProject;
}

export function ProjectSettingsForm({ project }: ProjectSettingsFormProps) {
    const { can, role, isLoading } = useProjectAccess({
        projectId: project.id,
    });
    const [isSaving, setIsSaving] = useState(false);
    const [showCloseDialog, setShowCloseDialog] = useState(false);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [formData, setFormData] = useState({
        name: project.name,
        description: project.description,
        readme: project.readme,
    });

    const router = useRouter();

    if (isLoading) return <div>Loading...</div>;
    if (!can(ProjectAction.VIEW_SETTINGS)) {
        return (
            <div>You don&apos;t have permission to manage project settings.</div>
        );
    }

    const handleUpdateProject = async () => {
        try {
            setIsSaving(true);
            await projects.management.update(project.id, formData);
            toast.success('Project settings updated successfully');
        } catch (error) {
            toast.error(
                error instanceof Error
                    ? error.message
                    : 'Failed to update project settings'
            );
        } finally {
            setIsSaving(false);
        }
    };

    const handleCloseProject = async () => {
        try {
            await projects.management.close(project.id);
            toast.success('Project closed successfully');
            router.push('/projects');
        } catch (error) {
            toast.error(
                error instanceof Error
                    ? error.message
                    : 'Failed to close project'
            );
        }
    };

    const handleDeleteProject = async () => {
        try {
            await projects.management.delete(project.id);
            router.push('/projects');
        } catch (error) {
            toast.error(
                error instanceof Error
                    ? error.message
                    : 'Failed to delete project'
            );
        }
    };

    return (
        <div className="space-y-10 max-w-4xl mx-auto">
            {/* === Project Information Section === */}
            <section className="rounded-xl border border-zinc-800 bg-zinc-900/50 backdrop-blur-md shadow-sm p-6 space-y-6">
                <div>
                    <h2 className="text-lg font-semibold text-white mb-1">
                        Thông tin dự án
                    </h2>
                    <p className="text-sm text-zinc-400">
                        Cập nhật thông tin chi tiết dự án của bạn ở mục bên dưới.
                    </p>
                </div>

                <Separator className="opacity-30" />

                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label className="text-zinc-300">Tên dự án</Label>
                        <Input
                            value={formData.name}
                            onChange={(e) =>
                                setFormData((prev) => ({ ...prev, name: e.target.value }))
                            }
                            className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500 focus:ring-zinc-600"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label className="text-zinc-300">Mô tả</Label>
                        <Textarea
                            value={formData.description}
                            onChange={(e) =>
                                setFormData((prev) => ({
                                    ...prev,
                                    description: e.target.value,
                                }))
                            }
                            className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500 focus:ring-zinc-600"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label className="text-zinc-300">README</Label>
                        <div className="flex justify-center">
                            <div
                                className="w-full md:w-[85%] lg:w-[75%] border border-zinc-700 rounded-lg bg-zinc-900/50 
                 overflow-auto max-h-[60vh] min-h-[250px] 
                 scrollbar-thin scrollbar-thumb-zinc-700 scrollbar-track-transparent"
                            >
                                <div className="p-3">
                                    <TextEditor
                                        content={formData.readme}
                                        onChange={(text) =>
                                            setFormData((prev) => ({ ...prev, readme: text }))
                                        }
                                        isEditable
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end">
                        <Button
                            onClick={handleUpdateProject}
                            disabled={isSaving}
                            className={cn(
                                secondaryBtnStyles,
                                'bg-zinc-800 hover:bg-zinc-700 text-white px-6 py-2'
                            )}
                        >
                            {isSaving ? 'Saving...' : 'Lưu thay đổi'}
                        </Button>
                    </div>
                </div>
            </section>

            {/* === Danger Zone Section === */}
            <section className="rounded-xl border border-red-800 bg-gradient-to-br from-red-950/50 to-zinc-950/30 backdrop-blur-md shadow-sm p-6 space-y-6">
                <div>
                    <h2 className="text-lg font-semibold text-red-400 mb-1">
                        Danger Zone
                    </h2>
                    <p className="text-sm text-zinc-400">
                        Hành động không thể hoàn tác - vui lòng thận trọng.
                    </p>
                </div>

                <Separator className="opacity-40 border-red-900" />

                <div className="space-y-5">

                    <div className="flex justify-between items-center flex-wrap gap-3">
                        <div>
                            <p className="text-sm font-medium text-white">
                                Đóng dự án
                            </p>
                            <p className="text-sm text-zinc-400 max-w-sm">
                                Đóng một dự án sẽ vô hiệu hóa quy trình công việc của nó và xóa nó khỏi danh sách các dự án đang mở.
                            </p>
                        </div>
                        {can(ProjectAction.CLOSE_PROJECT) && (
                            <Button
                                onClick={() => setShowCloseDialog(true)}
                                className="border border-red-500 text-red-400 hover:bg-red-500/10"
                            >
                                Đóng dự án
                            </Button>
                        )}
                    </div>


                    <Separator className="opacity-30" />


                    <div className="flex justify-between items-center flex-wrap gap-3">
                        <div>
                            <p className="text-sm font-medium text-white">
                                Xóa dự án
                            </p>
                            <p className="text-sm text-zinc-400 max-w-sm">
                                Một khi bạn xóa dự án, bạn sẽ không thể mở lại dự án đó. Xin hãy chắc chắn.
                            </p>
                        </div>
                        {can(ProjectAction.DELETE_PROJECT) && (
                            <Button
                                onClick={() => setShowDeleteDialog(true)}
                                className="border border-red-500 text-red-400 hover:bg-red-500/10"
                            >
                                Xóa dự án
                            </Button>
                        )}
                    </div>

                </div>
            </section>

            {/* === Dialogs === */}
            <CloseProjectDialog
                open={showCloseDialog}
                onOpenChange={setShowCloseDialog}
                onConfirm={handleCloseProject}
            />

            <DeleteProjectDialog
                open={showDeleteDialog}
                onOpenChange={setShowDeleteDialog}
                onConfirm={handleDeleteProject}
                projectName={project.name}
            />
        </div>
    );
}
