'use client';
import { secondaryBtnStyles } from '@/app/commonStyles';
import { CreateCustomFieldOptionModal } from '@/components/CreateCustomFieldOptionModal';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useProjectQueries } from '@/hooks/useProjectQueries';
import { cn } from '@/lib/utils';
import { columns as columnsUtils } from '@/utils/columns';
import { getColumnSortedTasks, sortTasks } from '@/utils/sort';
import { closestCorners, DndContext, DragOverlay, DragStartEvent } from '@dnd-kit/core';
import { Eye, Plus, EyeOff } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { ColumnContainer } from './ColumnContainer';
import { TaskDetailsProvider } from './TaskDetailsContext';
import { TaskDetailsDrawer } from './TaskDetailsDrawer';
import { TaskItem } from './TaskItem';
import { useBoardDragAndDrop } from './useBoardDragAndDrop';
import { createPortal } from 'react-dom';

interface Props {
  projectId: string;
  projectName: string;
  statuses: IStatus[];
}

export const Board: React.FC<Props> = ({
  projectId,
  projectName,
  statuses,
}) => {
  const [columns, setColumns] = useState(statuses);
  const [hiddenColumns, setHiddenColumns] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(false);
  const { projectTasks, reloadProjectTasks } = useProjectQueries(projectId);
  const [tasks, setTasks] = useState<ITaskWithOptions[]>(projectTasks || []);

  const {
    activeTask,
    sensors,
    overColumnId,
    handleDragStart,
    handleDragEnd,
    handleDragOver,
  } = useBoardDragAndDrop();

  useEffect(() => {
    setTasks(projectTasks || []);
  }, [projectTasks]);

  const sortedTasks = sortTasks(tasks);

  const getColumnTasks = (statusId: string) => {
    return getColumnSortedTasks(sortedTasks, statusId);
  };

  const handleTaskCreated = (newTask: ITaskWithOptions) => {
    setTasks((prev) => [...prev, newTask]);
  };

  const handleColumnUpdate = (updatedColumn: IStatus) => {
    setColumns((prev) =>
      prev.map((status) =>
        status.id === updatedColumn.id ? updatedColumn : status
      )
    );
  };

  const handleColumnDelete = (columnId: string) => {
    setColumns((prev) => prev.filter((status) => status.id !== columnId));
  };

  const handleColumnHide = (columnId: string) => {
    setHiddenColumns((prev) => new Set([...prev, columnId]));
  };

  const handleShowHiddenColumns = () => {
    setHiddenColumns(new Set());
  };

  const visibleColumns = columns.filter(
    (column) => !hiddenColumns.has(column.id)
  );

  const handleCreateColumn = async (data: Omit<ICustomFieldData, 'id'>) => {
    try {
      setIsLoading(true);
      const newColumn = await columnsUtils.createColumn(projectId, data);
      setColumns((prev) => [...prev, newColumn]);
      toast.success("Column created successfully");
    } catch (error) {
      console.error('Error creating column:', error);
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to create column"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleTaskUpdate = async (
    taskId: string,
    updates: Partial<ITaskWithOptions>
  ) => {
    try {
      if ('labels' in updates || 'size' in updates || 'priority' in updates) {
        await reloadProjectTasks();
      } else {
        setTasks((prev) =>
          prev.map((task) =>
            task.id === taskId
              ? { ...task, ...(updates as Partial<ITaskWithOptions>) }
              : task
          )
        );
      }
    } catch (error) {
      console.error('Error updating task:', error);
      toast.error("Failed to update task");
    }
  };

  return (
    <TaskDetailsProvider onTaskUpdate={handleTaskUpdate}>
      <div className="h-full flex flex-col bg-zinc-950/30 rounded-xl border border-zinc-800/50">
        {/* Hidden columns indicator */}
        {hiddenColumns.size > 0 && (
          <div className="flex-shrink-0 px-4 py-3 bg-zinc-900/50 backdrop-blur-sm border-b border-zinc-800/50 rounded-t-xl">
            <Button
              variant="outline"
              size="sm"
              className="h-8 px-3 text-xs gap-2 bg-zinc-800/80 border-zinc-700/50 text-zinc-400
                hover:bg-zinc-700/80 hover:text-zinc-200 hover:border-zinc-600/50 
                transition-all duration-200 rounded-lg group"
              onClick={handleShowHiddenColumns}
            >
              <Eye className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
              <span>Show {hiddenColumns.size} hidden column{hiddenColumns.size > 1 ? 's' : ''}</span>
            </Button>
          </div>
        )}

        {/* Board container with horizontal scroll - THIS IS THE KEY PART */}
        <div className="flex-1 min-h-0 overflow-x-auto overflow-y-hidden board-scrollbar">
          <div className="h-full p-4 inline-flex gap-4">
            <DndContext
              onDragEnd={(event) => handleDragEnd(event, sortedTasks, setTasks)}
              onDragStart={handleDragStart}
              onDragOver={(event) => handleDragOver(event)}
              collisionDetection={closestCorners}
              sensors={sensors}
            >
              {visibleColumns.map((status) => (
                <ColumnContainer
                  projectId={projectId}
                  key={status.id}
                  column={status}
                  tasks={getColumnTasks(status.id)}
                  projectName={projectName}
                  onColumnHide={handleColumnHide}
                  onColumnUpdate={handleColumnUpdate}
                  onColumnDelete={handleColumnDelete}
                  onTaskCreated={handleTaskCreated}
                  isOver={overColumnId === status.id}
                />
              ))}

              {/* Add new column button */}
              <div className="flex-shrink-0 flex items-start pt-2">
                <CreateCustomFieldOptionModal
                  title="New Column"
                  handleSubmit={handleCreateColumn}
                  triggerBtn={
                    <Button
                      className={cn(
                        "w-10 h-10 p-0 bg-zinc-800/50 border border-zinc-700/50",
                        "hover:bg-zinc-700/70 hover:border-zinc-600/50",
                        "text-zinc-400 hover:text-zinc-200",
                        "transition-all duration-200 rounded-xl",
                        "group flex items-center justify-center shadow-lg hover:shadow-xl"
                      )}
                      disabled={isLoading}
                    >
                      <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
                    </Button>
                  }
                />
              </div>

              {typeof document !== 'undefined' &&
                createPortal(
                  <DragOverlay>
                    {activeTask && (
                      <div className="rotate-3 scale-105 opacity-90">
                        <TaskItem
                          item={activeTask}
                          projectName={projectName}
                          index={0}
                        />
                      </div>
                    )}
                  </DragOverlay>,
                  document.body
                )}
            </DndContext>
          </div>
        </div>

        <TaskDetailsDrawer />
      </div>

      <style jsx global>{`
        /* Horizontal scrollbar for board */
        .board-scrollbar::-webkit-scrollbar {
          height: 10px;
        }
        
        .board-scrollbar::-webkit-scrollbar-track {
          background: rgba(24, 24, 27, 0.5);
          border-radius: 5px;
          margin: 0 8px;
        }
        
        .board-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(63, 63, 70, 0.8);
          border-radius: 5px;
          transition: background 0.2s;
        }
        
        .board-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(82, 82, 91, 0.9);
        }

        /* Vertical scrollbar for columns */
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(24, 24, 27, 0.3);
          border-radius: 3px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(63, 63, 70, 0.5);
          border-radius: 3px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(82, 82, 91, 0.7);
        }
      `}</style>
    </TaskDetailsProvider>
  );
};