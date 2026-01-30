import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface CloseProjectDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onConfirm: () => void;
}

export const CloseProjectDialog = ({
    open,
    onOpenChange,
    onConfirm,
}: CloseProjectDialogProps) => (
    <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent>
            <DialogHeader>
                <DialogTitle className='text-[#202020]'>Đóng dự án</DialogTitle>
                <DialogDescription>
                    Bạn có chắc chắn muốn đóng dự án này? Bạn có thể mở lại nó sau ở cửa sổ "Các dự án đã đóng".
                </DialogDescription>
            </DialogHeader>
            <DialogFooter>
                <Button variant="outline" onClick={() => onOpenChange(false)} className='text-[#676767]'>
                    Hủy
                </Button>
                <Button variant="destructive" onClick={onConfirm}>
                    Đóng dự án
                </Button>
            </DialogFooter>
        </DialogContent>
    </Dialog>
);