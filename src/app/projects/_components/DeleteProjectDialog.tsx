import { useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface DeleteProjectDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onConfirm: () => void;
    projectName: string;
}

export const DeleteProjectDialog = ({
    open,
    onOpenChange,
    onConfirm,
    projectName,
}: DeleteProjectDialogProps) => {
    const [confirmName, setConfirmName] = useState('');

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle className='text-[#202020]'>Delete Project Permanently</DialogTitle>
                    <DialogDescription>
                        This action cannot be undone. This will permanently delete the
                        project and all associated data.
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                    <p className="text-sm text-gray-500">
                        Please type <span className="font-semibold">{projectName}</span> to
                        confirm.
                    </p>
                    <div className="space-y-2">
                        <Label htmlFor="projectName" className='text-[#676767]'>Project Name</Label>
                        <Input
                            id="projectName"
                            value={confirmName}
                            onChange={(e) => setConfirmName(e.target.value)}
                            placeholder="Enter project name"
                            className='text-[#202020]'
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)} className='text-[#676767]'>
                        Cancel
                    </Button>
                    <Button
                        variant="destructive"
                        onClick={onConfirm}
                        disabled={confirmName !== projectName}
                    >
                        Delete Project
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};