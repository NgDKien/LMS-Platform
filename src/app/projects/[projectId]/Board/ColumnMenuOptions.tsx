'use client';
import { secondaryBtnStyles, successBtnStyles } from '@/app/commonStyles';
import { CustomOptionForm } from '@/components/CustomOptionForm';
import { Icons } from '@/components/Icons';
import { Button } from '@/components/ui/button';
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useModalDialog } from '@/hooks/useModalDialog';
import { cn } from '@/lib/utils';
import { Dialog } from '@radix-ui/react-dialog';
import { Ellipsis, EyeOff, Pencil, Trash } from 'lucide-react';
import { useState } from 'react';
import { columns } from '@/utils/columns';
import { toast } from 'sonner';

interface Props {
  column: IStatus;
  onColumnUpdate?: (column: IStatus) => void;
  onColumnDelete?: (columnId: string) => void;
  onColumnHide?: (columnId: string) => void;
}

export const ColumnMenuOptions = ({
  column,
  onColumnUpdate,
  onColumnDelete,
  onColumnHide,
}: Props) => {
  const { isModalOpen, openModal, closeModal } = useModalDialog();
  const [limit, setLimit] = useState(column.limit);
  const [optionType, setOptionType] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleUpdateLimit = async () => {
    if (limit < 1 || limit === column.limit) return;

    try {
      setIsLoading(true);
      const updatedColumn = await columns.updateLimit(column.id, limit);
      onColumnUpdate?.(updatedColumn);
      toast.success("Column limit updated successfully");
      closeModal();
    } catch (error) {
      console.error('Error updating limit:', error);
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to update column limit"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateDetails = async (data: Omit<ICustomFieldData, 'id'>) => {
    try {
      setIsLoading(true);
      const updatedColumn = await columns.updateDetails(column.id, data);
      onColumnUpdate?.(updatedColumn);
      toast.success("Column details updated successfully");
      closeModal();
    } catch (error) {
      console.error('Error updating details:', error);
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to update column details"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteColumn = async () => {
    try {
      setIsLoading(true);
      await columns.deleteColumn(column.id);
      onColumnDelete?.(column.id);
      toast.success("Column deleted successfully");
      closeModal();
    } catch (error) {
      console.error('Error deleting column:', error);
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to delete column"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Dialog
        open={isModalOpen}
        onOpenChange={(isOpen) => !isOpen && closeModal()}
      >
        <DropdownMenu>
          <DropdownMenuTrigger className="focus:outline-none focus:ring-0">
            <Ellipsis />
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-44">
            <DropdownMenuItem
              onClick={() => {
                setOptionType('limit');
                openModal();
              }}
            >
              <Icons.number className="w-3 h-3 mr-2 fill-gray-900 dark:fill-slate-50" />
              <span className="text-xs">Đặt giới hạn</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                setOptionType('details');
                openModal();
              }}
            >
              <Pencil className="w-3 h-3 mr-2" />
              <span className="text-xs">Chỉnh sửa</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => onColumnHide?.(column.id)}
            >
              <EyeOff className="w-3 h-3 mr-2" />
              <span className="text-xs">Ẩn khỏi bảng</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              className="text-red-500"
              onClick={() => {
                setOptionType('delete');
                openModal();
              }}
            >
              <Trash className="w-3 h-3 mr-2" />
              Xóa
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {optionType === 'details' && (
          <DialogContent className="max-w-96 max-h-[100vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className='text-[#424242]'>Cập nhật thông tin</DialogTitle>
            </DialogHeader>

            <CustomOptionForm
              color={column.color}
              description={column.description}
              label={column.label}
              onSubmit={handleUpdateDetails}
              submitBtnLabel="Cập nhật"
              cancelButton={
                <Button
                  className={cn(secondaryBtnStyles)}
                  onClick={closeModal}
                  disabled={isLoading}
                >
                  Cancel
                </Button>
              }
            />
          </DialogContent>
        )}

        {optionType === 'limit' && (
          <DialogContent className="max-w-80 gap-2">
            <DialogHeader>
              <DialogTitle className='text-[#424242]'>
                {column.limit === 0 ? 'Đặt giới hạn của cột' : 'Chỉnh sửa giới hạn của cột'}
              </DialogTitle>
            </DialogHeader>
            <Separator className="my-2" />

            <Label className="text-[#424242] mb-0 pb-0">Giới hạn của cột</Label>
            <Input
              type="number"
              value={limit}
              onChange={(e) => setLimit(Number(e.currentTarget.value))}
              className="h-8 text-[#424242]"
            />
            <Label className="text-xs text-gray-500">
              Giới hạn của cột là số tác vụ tối đa trong một cột.
            </Label>
            <Separator className="my-2" />
            <div className="flex justify-end gap-2">
              <Button
                className={cn(secondaryBtnStyles, 'px-3 h-7')}
                onClick={() => {
                  closeModal();
                  setOptionType('');
                }}
              >
                Hủy
              </Button>
              <Button
                className={cn(successBtnStyles, 'px-3 h-7')}
                onClick={handleUpdateLimit}
                disabled={isLoading || limit < 1 || limit === column.limit}
              >
                {isLoading ? 'Saving...' : 'Lưu'}
              </Button>
            </div>
          </DialogContent>
        )}

        {optionType === 'delete' && (
          <DialogContent className="max-w-96 gap-2">
            <DialogHeader>
              <DialogTitle className='text-[#424242]'>
                Bạn có chắc chắn muốn xóa cột<br />{' '}
                <span className='text-[#a5353e]'>{column.label.toUpperCase()}</span>&nbsp;
              </DialogTitle>
              <DialogDescription>
                Hành động này không thể hoàn tác
              </DialogDescription>
            </DialogHeader>

            <DialogFooter>
              <Button
                className={cn(secondaryBtnStyles, 'bg-gray-50 px-3 h-7')}
                onClick={() => {
                  closeModal();
                  setOptionType('');
                  setLimit(column.limit);
                }}
              >
                Hủy
              </Button>
              <Button
                variant="outline"
                className={cn(
                  'text-red-600 dark:text-red-300 px-3 h-7 hover:bg-red-800 dark:hover:bg-red-600 hover:text-white dark:hover:text-white'
                )}
                onClick={handleDeleteColumn}
                disabled={isLoading}
              >
                {isLoading ? 'Deleting...' : 'Xóa'}
              </Button>
            </DialogFooter>
          </DialogContent>
        )}
      </Dialog>
    </>
  );
};