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
                <DialogTitle className='text-[#202020]'>Close Project</DialogTitle>
                <DialogDescription>
                    Are you sure you want to close this project? You can reopen it later
                    from the closed projects tab.
                </DialogDescription>
            </DialogHeader>
            <DialogFooter>
                <Button variant="outline" onClick={() => onOpenChange(false)} className='text-[#676767]'>
                    Cancel
                </Button>
                <Button variant="destructive" onClick={onConfirm}>
                    Close Project
                </Button>
            </DialogFooter>
        </DialogContent>
    </Dialog>
);