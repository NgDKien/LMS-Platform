import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface ReopenProjectDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onConfirm: () => void;
}

export const ReopenProjectDialog = ({
    open,
    onOpenChange,
    onConfirm,
}: ReopenProjectDialogProps) => (
    <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent>
            <DialogHeader>
                <DialogTitle className='text-[#202020]'>Mở lại dự án</DialogTitle>
                <DialogDescription>
                    Bạn có chắc chắn mở lại dự án này? Nó sẽ được chuyển vào cửa sổ "Các dự án đang hoạt động".
                </DialogDescription>
            </DialogHeader>
            <DialogFooter>
                <Button variant="outline" onClick={() => onOpenChange(false)} className='text-[#676767]'>
                    Hủy
                </Button>
                <Button onClick={onConfirm}>Mở lại dự án</Button>
            </DialogFooter>
        </DialogContent>
    </Dialog>
);