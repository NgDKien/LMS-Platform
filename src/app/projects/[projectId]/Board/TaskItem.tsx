'use client';
import { CustomFieldTagRenderer } from '@/components/CustomFieldTagRenderer';
import { LabelBadge } from '@/components/LabelBadge';
import StackedAvatars from '@/components/StackedAvaters';
import { prefetchTask } from '@/hooks/useTaskQueries';
import { UniqueIdentifier } from '@dnd-kit/core';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useQueryClient } from '@tanstack/react-query';
import { useTaskDetails } from './TaskDetailsContext';
import { GripVertical } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Props {
  item: ITaskWithOptions;
  projectName: string;
  index: number;
}

export const TaskItem = ({ item, projectName, index }: Props) => {
  const queryClient = useQueryClient();
  const { openDrawer } = useTaskDetails();
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: item.id as UniqueIdentifier,
    data: {
      type: 'task',
      task: item,
      position: index,
    },
  });

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
  };

  const handleClick = async () => {
    await prefetchTask(queryClient, item.id!);
    openDrawer(item, projectName);
  };

  if (isDragging) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className="min-h-[100px] bg-zinc-800/30 rounded-xl border-2 border-dashed border-zinc-600/50 opacity-50"
      />
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      className="group cursor-pointer transition-all duration-200"
    >
      <div className="bg-zinc-800/50 backdrop-blur-sm border border-zinc-700/50 rounded-xl 
        overflow-hidden hover:bg-zinc-800/70 hover:border-zinc-600/50 
        hover:shadow-xl hover:shadow-zinc-950/50 transition-all duration-200">

        {/* Card Content */}
        <div className="p-4">
          {/* Header: Project Name & Drag Handle */}
          <div className="flex items-start justify-between gap-2 mb-3">
            <span className="text-[11px] text-zinc-500 font-medium tracking-wide uppercase">
              {projectName}
            </span>

            <div
              {...listeners}
              className="flex-shrink-0 cursor-grab active:cursor-grabbing opacity-0 
                group-hover:opacity-100 transition-opacity p-1 hover:bg-zinc-700/50 rounded"
            >
              <GripVertical className="w-4 h-4 text-zinc-500 hover:text-zinc-400" />
            </div>
          </div>

          {/* Task Title - Clickable */}
          <div
            onClick={handleClick}
            className="mb-3 cursor-pointer group/title"
          >
            <h4 className="text-sm font-medium text-zinc-100 leading-snug 
              group-hover/title:text-blue-400 transition-colors">
              {item.title}
            </h4>
          </div>

          {/* Tags/Labels Section */}
          {(item.priority || item.size || (item.labels && item.labels.length > 0)) && (
            <div className="flex flex-wrap gap-1.5">
              {/* Priority */}
              {item.priority && (
                <CustomFieldTagRenderer
                  color={item.priority.color}
                  label={item.priority.label}
                />
              )}

              {/* Size */}
              {item.size && (
                <CustomFieldTagRenderer
                  color={item.size.color}
                  label={item.size.label}
                />
              )}

              {/* Labels */}
              {item.labels?.map((label) => (
                <LabelBadge
                  key={label.id}
                  color={label.color}
                  labelText={label.label}
                />
              ))}
            </div>
          )}
        </div>

        {/* Hover indicator line */}
        <div className="h-0.5 bg-gradient-to-r from-blue-500/0 via-blue-500/50 to-blue-500/0 
          opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>
    </div>
  );
};