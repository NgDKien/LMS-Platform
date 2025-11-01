'use client';
import { successBtnStyles } from '@/app/commonStyles';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ProjectAction } from '@/consts';
import { cn } from '@/lib/utils';
import { createClient } from '@/utils/supabase/client';
import { tasks as taskUtils } from '@/utils/tasks';
import { UniqueIdentifier } from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { Plus, X, GripVertical } from 'lucide-react';
import { useEffect, useState } from 'react';
import { ColumnLabelColor } from './ColumnLabelColor';
import { ColumnMenuOptions } from './ColumnMenuOptions';
import { TaskItem } from './TaskItem';
import { useDroppable } from '@dnd-kit/core';
import { getLowestColumnPosition } from '@/utils/sort';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { toast } from 'sonner';

interface Props {
  projectId: string;
  column: IStatus;
  tasks: ITaskWithOptions[];
  projectName: string;
  isOver: boolean;
  onTaskCreated?: (task: ITaskWithOptions) => void;
  onColumnUpdate?: (column: IStatus) => void;
  onColumnDelete?: (columnId: string) => void;
  onColumnHide?: (columnId: string) => void;
}

const supabase = createClient();

export const ColumnContainer = ({
  projectId,
  column,
  tasks: columnTasks,
  projectName,
  isOver,
  onTaskCreated,
  onColumnUpdate,
  onColumnDelete,
  onColumnHide,
}: Props) => {
  const [showInput, setShowInput] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const { user } = useCurrentUser();

  const handleAddItem = async () => {
    if (!inputValue.trim() || isCreating || !user) return;

    try {
      setIsCreating(true);
      const newPosition = getLowestColumnPosition(columnTasks);

      const task = await taskUtils.create({
        project_id: projectId,
        status_id: column.id,
        title: inputValue.trim(),
        description: '',
        created_by: user.clerk_id,
        statusPosition: newPosition,
      });

      toast.success("Task created successfully");
      onTaskCreated?.({ ...task, assignees: [] });
      setInputValue('');
      setShowInput(false);
    } catch (error) {
      console.error('Error creating task:', error);
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to create task"
      );
    } finally {
      setIsCreating(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAddItem();
    } else if (e.key === 'Escape') {
      setShowInput(false);
      setInputValue('');
    }
  };

  // Get column color index for styling
  const getColumnColorIndex = () => {
    return columnTasks.length % 5;
  };

  const getColumnGradient = (index: number) => {
    const colors = [
      'from-blue-500/10 to-blue-600/5',
      'from-purple-500/10 to-purple-600/5',
      'from-emerald-500/10 to-emerald-600/5',
      'from-orange-500/10 to-orange-600/5',
      'from-pink-500/10 to-pink-600/5',
    ];
    return colors[index];
  };

  const getCountColor = (hasLimit: boolean, isOverLimit: boolean) => {
    if (hasLimit && isOverLimit) {
      return 'bg-red-500/20 text-red-300 border-red-500/30';
    }
    const colors = [
      'bg-blue-500/20 text-blue-300 border-blue-500/30',
      'bg-purple-500/20 text-purple-300 border-purple-500/30',
      'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
      'bg-orange-500/20 text-orange-300 border-orange-500/30',
      'bg-pink-500/20 text-pink-300 border-pink-500/30',
    ];
    return colors[getColumnColorIndex()];
  };

  const hasLimit = column.limit > 0;
  const isOverLimit = hasLimit && columnTasks.length >= column.limit;

  return (
    <div
      className="flex-shrink-0 w-[350px] h-full flex flex-col transition-all duration-300"
    >
      {/* Column Card */}
      <div className="flex flex-col h-full bg-zinc-900/50 backdrop-blur-sm border border-zinc-800/50 
        rounded-2xl shadow-xl overflow-hidden hover:border-zinc-700/50 transition-all duration-300">

        {/* Column Header */}
        <div className={cn(
          "flex-shrink-0 px-4 py-4 bg-gradient-to-br border-b border-zinc-800/50",
          getColumnGradient(getColumnColorIndex())
        )}>
          <div className="flex items-center justify-between gap-3 mb-2">
            {/* Title & Color */}
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <ColumnLabelColor color={column.color} />

              <h3 className="text-sm font-semibold text-zinc-100 truncate">
                {column.label}
              </h3>

              {/* Task Count Badge */}
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className={cn(
                      "flex-shrink-0 px-2.5 py-1 rounded-lg text-xs font-medium border cursor-default",
                      getCountColor(hasLimit, isOverLimit)
                    )}>
                      {columnTasks.length}
                      {hasLimit && ` / ${column.limit}`}
                    </div>
                  </TooltipTrigger>
                  {isOverLimit && (
                    <TooltipContent className="bg-zinc-900/95 border-zinc-800/50">
                      <p className="text-xs">
                        Column limit {columnTasks.length > column.limit ? 'exceeded' : 'reached'}
                      </p>
                    </TooltipContent>
                  )}
                </Tooltip>
              </TooltipProvider>
            </div>

            {/* Column Menu */}
            <ColumnMenuOptions
              column={column}
              onColumnUpdate={onColumnUpdate}
              onColumnDelete={onColumnDelete}
              onColumnHide={onColumnHide}
            />
          </div>

          {/* Description */}
          {column.description && (
            <p className="text-xs text-zinc-500 mt-1 line-clamp-2">
              {column.description}
            </p>
          )}
        </div>

        {/* Tasks Container with Scroll */}
        <SortableContext
          id={column.id}
          items={columnTasks.map((item) => ({
            ...item,
            id: item.id as UniqueIdentifier,
          }))}
          strategy={verticalListSortingStrategy}
        >
          <div
            className={cn(
              'flex-1 overflow-y-auto custom-scrollbar p-3 space-y-3 min-h-0',
              isOver && 'bg-zinc-800/30 border-2 border-dashed border-zinc-600/50 rounded-lg'
            )}
          >
            {columnTasks.length === 0 && !isOver ? (
              <div className="flex flex-col items-center justify-center h-32 text-center px-4">
                <div className="w-12 h-12 rounded-full bg-zinc-800/30 flex items-center justify-center mb-3">
                  <Plus className="w-6 h-6 text-zinc-600" />
                </div>
                <p className="text-xs text-zinc-500">No tasks yet</p>
                <p className="text-xs text-zinc-600 mt-1">Drop tasks here or click + to add</p>
              </div>
            ) : (
              columnTasks.map((item, index) => (
                <TaskItem
                  key={item.id}
                  item={item}
                  projectName={projectName}
                  index={index}
                />
              ))
            )}
          </div>
        </SortableContext>

        {/* Add Task Section */}
        <div className="flex-shrink-0 p-3 border-t border-zinc-800/50">
          {showInput ? (
            <div className="flex gap-2">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Enter task title..."
                className="h-9 bg-zinc-800/50 border-zinc-700/50 text-zinc-100 
                  placeholder:text-zinc-500 focus:border-zinc-600/50 text-sm"
                autoFocus
                disabled={isCreating}
              />
              <Button
                onClick={handleAddItem}
                className={cn(
                  "h-9 px-4 bg-emerald-600/90 hover:bg-emerald-600 text-white text-sm font-medium",
                  "transition-all duration-200 rounded-lg"
                )}
                disabled={!inputValue.trim() || isCreating}
              >
                {isCreating ? 'Adding...' : 'Add'}
              </Button>
              <Button
                onClick={() => {
                  setShowInput(false);
                  setInputValue('');
                }}
                variant="ghost"
                className="h-9 w-9 p-0 hover:bg-zinc-800/50 text-zinc-400 hover:text-zinc-200"
                disabled={isCreating}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <Button
              onClick={() => setShowInput(true)}
              variant="ghost"
              size="sm"
              className="w-full h-9 justify-start gap-2 text-zinc-400 hover:text-zinc-200 
                hover:bg-zinc-800/50 rounded-lg transition-all group"
            >
              <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform duration-300" />
              <span className="text-sm font-medium">Add item</span>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};