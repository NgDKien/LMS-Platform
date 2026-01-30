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
                    <DialogTitle className='text-[#202020]'>Xóa hoàn toàn dự án</DialogTitle>
                    <DialogDescription>
                        Hành động này không thể hoàn tác. Điều này sẽ xóa vĩnh viễn dự án và tất cả dữ liệu liên quan.
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                    <p className="text-sm text-gray-500">
                        Vui lòng nhập <span className="font-semibold">{projectName}</span> để xác nhận.
                    </p>
                    <div className="space-y-2">
                        <Label htmlFor="projectName" className='text-[#676767]'>Tên dự án</Label>
                        <Input
                            id="projectName"
                            value={confirmName}
                            onChange={(e) => setConfirmName(e.target.value)}
                            placeholder="Nhập tên dự án"
                            className='text-[#202020]'
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)} className='text-[#676767]'>
                        Hủy
                    </Button>
                    <Button
                        variant="destructive"
                        onClick={onConfirm}
                        disabled={confirmName !== projectName}
                    >
                        Xóa dự án
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};