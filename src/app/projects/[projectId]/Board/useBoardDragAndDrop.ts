import { useActivityQueries } from '@/hooks/useActivityQueries';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { canMoveTask, moveTaskDown, moveTaskUp } from '@/utils/move-task';
import { tasks as tasksUtils } from '@/utils/tasks';
import {
    DragEndEvent,
    DragOverEvent,
    DragStartEvent,
    MouseSensor,
    PointerSensor,
    TouchSensor,
    useSensor,
    useSensors,
} from '@dnd-kit/core';
import { useState } from 'react';
import { toast } from 'sonner';

type SetTasksFunction = React.Dispatch<
    React.SetStateAction<ITaskWithOptions[]>
>;

interface DragTaskContext {
    tasks: ITaskWithOptions[];
    setTasks: SetTasksFunction;
    activeId: string | number;
    overId: string | number;
    overColumnId: string | null;
    active: any;
    over: any;
    overPosition: number;
    activePosition: number;
}

export const useBoardDragAndDrop = () => {
    const [overColumnId, setOverColumnId] = useState<string | null>(null);
    const [activeColumnId, setActiveColumnId] = useState<string | null>(null);
    const [activeTask, setActiveTask] = useState<ITaskWithOptions | null>(null);
    const [isUpdating, setIsUpdating] = useState(false);
    const { user } = useCurrentUser();
    const { createActivity } = useActivityQueries(activeTask?.id as string);

    const pointerSensor = useSensor(PointerSensor, {
        activationConstraint: {
            distance: 10,
        },
    });

    const mouseSensor = useSensor(MouseSensor, {
        activationConstraint: {
            distance: 10,
        },
    });

    const touchSensor = useSensor(TouchSensor, {
        activationConstraint: {
            delay: 250,
            tolerance: 5,
        },
    });

    const sensors = useSensors(pointerSensor, mouseSensor, touchSensor);

    // Set the active task when dragging starts
    // Lưu task đang kéo, hiển thị preview
    const handleDragStart = (event: DragStartEvent) => {
        if (event.active.data.current?.type === 'task') {
            setActiveTask(event.active.data.current?.task);
            return;
        }
    };
    //get position for priority item drag
    const getPriorityTaskPositionOnNonEmptyColumn = (
        tasks: ITaskWithOptions[],
        active: any
    ) => {
        const columnTasks = tasks.filter((task) => task.status_id === overColumnId);

        if (columnTasks.some((item) => item.priority)) {
            const tasksWithHigherPriority = columnTasks.filter(
                (task) =>
                    (task.priority?.order ?? 0) >
                    (active.data.current?.task.priority?.order ?? 0)
            );

            const tasksWithLowerPriority = columnTasks.filter(
                (task) =>
                    task.priority?.order === active.data.current?.task.priority?.order - 1
            );

            const tasksWithSamePriority = columnTasks.filter(
                (task) =>
                    task.priority?.order === active.data.current?.task.priority?.order
            );

            if (tasksWithSamePriority.length > 0) {
                const lastTaskWithSamePriority =
                    tasksWithSamePriority[tasksWithSamePriority.length - 1];

                const index = columnTasks.findIndex(
                    (task) => task.id === lastTaskWithSamePriority?.id
                );

                return moveTaskDown(
                    index,
                    lastTaskWithSamePriority?.id ?? '',
                    overColumnId ?? '',
                    tasks
                );
            } else if (tasksWithHigherPriority.length > 0) {
                const lastTaskWithHigherPriority =
                    tasksWithHigherPriority[tasksWithHigherPriority.length - 1];
                const index = columnTasks.findIndex(
                    (task) => task.id === lastTaskWithHigherPriority?.id
                );
                return moveTaskDown(
                    index,
                    lastTaskWithHigherPriority?.id ?? '',
                    overColumnId ?? '',
                    tasks
                );
            } else if (tasksWithLowerPriority.length > 0) {
                const targetTaskWithLowerPriority = tasksWithLowerPriority[0];
                const index = columnTasks.findIndex(
                    (task) => task.id === targetTaskWithLowerPriority?.id
                );
                return moveTaskUp(
                    index,
                    targetTaskWithLowerPriority?.id ?? '',
                    overColumnId ?? '',
                    tasks
                );
            } else {
                return (columnTasks[0]?.statusPosition ?? 0) + 100;
            }
        } else {
            return (columnTasks[0]?.statusPosition ?? 0) + 100;
        }
        // ---------------------------
    };

    const getStatusMoveActivity = (
        userId: string,
        fromStatusId: string,
        toStatusId: string
    ): TaskActivity => {
        return [
            { type: 'user', id: userId },
            'moved this from',
            { type: 'status', id: fromStatusId },
            'to',
            { type: 'status', id: toStatusId },
            'on',
            { type: 'date', value: new Date().toISOString() },
        ];
    };

    // A: Thả lên task khác
    // A1: Handle task movement within the same column
    const handleSameColumnDrag = async (context: DragTaskContext) => {
        const {
            tasks,
            setTasks,
            activeId,
            overId,
            overColumnId,
            active,
            over,
            overPosition,
            activePosition,
        } = context;

        // Check priority constraints
        const overTask: ITaskWithOptions = over.data.current?.task;
        const activeTask: ITaskWithOptions = active.data.current?.task;
        if (!canMoveTask(overTask, activeTask)) {
            setOverColumnId(null);
            return;
        }

        // Calculate new position based on movement direction
        const newStatusPosition =
            activePosition > overPosition
                ? moveTaskUp(overPosition, overId as string, overColumnId ?? '', tasks)
                : moveTaskDown(
                    overPosition,
                    overId as string,
                    overColumnId ?? '',
                    tasks
                );

        // Update task position
        const activeIndex = tasks.findIndex((item) => item.id === activeId);
        tasks[activeIndex].statusPosition = newStatusPosition;
        setTasks([...tasks]);
        setOverColumnId(null);

        try {
            await tasksUtils.board.updatePosition(
                activeId as string,
                newStatusPosition as number
            );
            // create activity
            await createActivity({
                task_id: activeId as string,
                user_id: user?.clerk_id as string,
                content: getStatusMoveActivity(
                    user?.clerk_id as string,
                    activeColumnId as string,
                    overColumnId as string
                ),
            });
        } catch (error) {
            toast.error(
                error instanceof Error
                    ? error.message
                    : "Failed to move task. Please try again."
            );
        }
    };

    // A2: Handle task movement between different columns with priority considerations
    const handleDifferentColumnDrag = async (context: DragTaskContext) => {
        const { tasks, setTasks, activeId, overColumnId, active, over } = context;
        let newStatusPosition;

        const columnTasks = tasks.filter((task) => task.status_id === overColumnId);
        const activePriority = active.data.current?.task.priority;
        const overPriority = over.data.current?.task.priority;

        // Case 1: Moving non-priority task to priority section
        if (!activePriority && overPriority) {
            newStatusPosition = handleNonPriorityToPriorityMove(
                columnTasks,
                overColumnId,
                tasks
            );
        }
        // Case 2: Moving priority task to non-priority section
        else if (activePriority && !overPriority) {
            newStatusPosition = getPriorityTaskPositionOnNonEmptyColumn(
                tasks,
                active
            );
        }
        // Case 3: Moving between different priority levels
        else if (activePriority?.order > overPriority?.order) {
            newStatusPosition = handlePriorityLevelMove(
                columnTasks,
                active,
                overColumnId,
                tasks
            );
        }
        // Case 4: Default position based on cursor location
        else {
            newStatusPosition = handleDefaultPositionMove(context);
        }

        // Update task position and status
        const activeIndex = tasks.findIndex((item) => item.id === activeId);
        tasks[activeIndex].statusPosition = newStatusPosition;
        tasks[activeIndex].status_id = overColumnId as string;
        setTasks([...tasks]);
        setOverColumnId(null);

        try {
            await tasksUtils.board.moveTask(
                activeId as string,
                overColumnId as string,
                newStatusPosition as number
            );

            // create activity
            await createActivity({
                task_id: activeId as string,
                user_id: user?.clerk_id as string,
                content: getStatusMoveActivity(
                    user?.clerk_id as string,
                    activeColumnId as string,
                    overColumnId as string
                ),
            });
        } catch (error) {
            toast.error(
                error instanceof Error
                    ? error.message
                    : "Failed to move task. Please try again."
            );
        }
    };

    // B: Thả vào vùng trống của cột
    // B1: Handle task movement to an empty column
    const handleEmptyColumnDrag = async (context: DragTaskContext) => {
        const { tasks, setTasks, active, activeId, overId, overColumnId } = context;

        const activeIndex = tasks.findIndex((item) => item.id === activeId);
        tasks[activeIndex].statusPosition = 10000;
        tasks[activeIndex].status_id = overColumnId as string;
        setTasks([...tasks]);
        setOverColumnId(null);

        try {
            await tasksUtils.board.moveTask(
                activeId as string,
                overColumnId ?? '',
                10000
            );
            // create activity
            await createActivity({
                task_id: activeId as string,
                user_id: user?.clerk_id as string,
                content: getStatusMoveActivity(
                    user?.clerk_id as string,
                    activeColumnId as string,
                    overColumnId as string
                ),
            });
        } catch (error) {
            toast.error(
                error instanceof Error
                    ? error.message
                    : "Failed to move task. Please try again."
            );
        }
    };

    // Helper functions for different movement scenarios
    const handleNonPriorityToPriorityMove = (
        columnTasks: ITaskWithOptions[],
        overColumnId: string | null,
        tasks: ITaskWithOptions[]
    ) => {
        const firstNonPriorityTask = columnTasks.find((task) => !task.priority);
        const firstNonPriorityTaskIndex = columnTasks.findIndex(
            (task) => task.id === firstNonPriorityTask?.id
        );

        if (firstNonPriorityTask) {
            return moveTaskUp(
                firstNonPriorityTaskIndex,
                firstNonPriorityTask?.id ?? '',
                overColumnId ?? '',
                tasks
            );
        } else {
            const lastTaskIndex = columnTasks.length - 1;
            return moveTaskDown(
                lastTaskIndex,
                columnTasks[lastTaskIndex].id ?? '',
                overColumnId ?? '',
                tasks
            );
        }
    };

    const handlePriorityLevelMove = (
        columnTasks: ITaskWithOptions[],
        active: any,
        overColumnId: string | null,
        tasks: ITaskWithOptions[]
    ) => {
        const tasksWithLowerPriority = columnTasks.filter(
            (task) =>
                task.priority?.order === active.data.current?.task.priority?.order - 1
        );
        const firstTaskWithLowerPriority = tasksWithLowerPriority[0];
        const firstTaskWithLowerPriorityIndex = columnTasks.findIndex(
            (task) => task.id === firstTaskWithLowerPriority?.id
        );

        return moveTaskUp(
            firstTaskWithLowerPriorityIndex,
            firstTaskWithLowerPriority?.id ?? '',
            overColumnId ?? '',
            tasks
        );
    };

    const handleDefaultPositionMove = (context: DragTaskContext) => {
        const { active, over, overPosition, overColumnId, overId, tasks } = context;
        const activeRect = active.rect.current.translated;
        const overRect = over.rect;
        const activeMidY = (activeRect?.top ?? 0) + (activeRect?.height ?? 0) / 2;
        const overMidY = (overRect?.top ?? 0) + (overRect?.height ?? 0) / 2;

        return activeMidY < overMidY
            ? moveTaskUp(overPosition, overId as string, overColumnId ?? '', tasks)
            : moveTaskDown(overPosition, overId as string, overColumnId ?? '', tasks);
    };

    const handleNonPriorityColumnDrag = async (context: DragTaskContext) => {
        const { tasks, setTasks, active, activeId, overColumnId } = context;
        const columnTasks = tasks.filter((task) => task.status_id === overColumnId);

        const lastTaskIndex = columnTasks.length - 1;
        const lastTaskId = columnTasks[lastTaskIndex].id;
        const newStatusPosition = moveTaskDown(
            lastTaskIndex,
            lastTaskId ?? '',
            overColumnId ?? '',
            tasks
        );

        const activeIndex = tasks.findIndex((item) => item.id === activeId);
        tasks[activeIndex].statusPosition = newStatusPosition;
        tasks[activeIndex].status_id = overColumnId as string;
        setTasks([...tasks]);
        setOverColumnId(null);

        try {
            await tasksUtils.board.moveTask(
                activeId as string,
                overColumnId as string,
                newStatusPosition ?? 0
            );

            // create activity
            await createActivity({
                task_id: activeId as string,
                user_id: user?.clerk_id as string,
                content: getStatusMoveActivity(
                    user?.clerk_id as string,
                    activeColumnId as string,
                    overColumnId as string
                ),
            });
        } catch (error) {
            toast.error(
                error instanceof Error
                    ? error.message
                    : "Failed to move task. Please try again."
            );
        }
    };

    const handlePriorityColumnDrag = async (context: DragTaskContext) => {
        const { tasks, setTasks, activeId, overColumnId, active } = context;

        const newStatusPosition = getPriorityTaskPositionOnNonEmptyColumn(
            tasks,
            active
        );

        const activeIndex = tasks.findIndex((item) => item.id === activeId);
        tasks[activeIndex].statusPosition = newStatusPosition;
        tasks[activeIndex].status_id = overColumnId as string;
        setTasks([...tasks]);
        setOverColumnId(null);

        try {
            await tasksUtils.board.moveTask(
                activeId as string,
                overColumnId as string,
                newStatusPosition ?? 0
            );

            // create activity
            await createActivity({
                task_id: activeId as string,
                user_id: user?.clerk_id as string,
                content: getStatusMoveActivity(
                    user?.clerk_id as string,
                    activeColumnId as string,
                    overColumnId as string
                ),
            });
        } catch (error) {
            toast.error(
                error instanceof Error
                    ? error.message
                    : "Failed to move task. Please try again."
            );
        }
    };

    // Thực hiện logic di chuyển, update DB
    const handleDragEnd = async (
        event: DragEndEvent,
        tasks: ITaskWithOptions[],
        setTasks: SetTasksFunction
    ) => {
        const { active, over } = event;

        // Early return if invalid drag
        if (
            !over ||
            active.data.current?.type !== 'task' ||
            active.id === over.id
        ) {
            setOverColumnId(null);
            return;
        }

        const context: DragTaskContext = {
            tasks,
            setTasks,
            activeId: active.id,
            overId: over.id,
            overColumnId,
            active,
            over,
            overPosition: event.over?.data?.current?.position,
            activePosition: event.active?.data?.current?.position,
        };

        // Handle different drag scenarios

        // Thả lên 1 task khác
        if (over.data.current?.type === 'task') {
            const isSameColumn =
                over.data.current?.task.status_id ===
                active.data.current?.task.status_id;
            // Same column
            if (isSameColumn) {
                // Xử lý thứ tự các task trong cột đó
                await handleSameColumnDrag(context);
                // Different column
            } else {
                // Xử lý thứ tự các task priority và non-priority
                await handleDifferentColumnDrag(context);
            }

            // Thả lên vùng trống
        } else if (over.data.current?.type === 'column') {
            const columnTasks = tasks.filter(
                (task) => task.status_id === overColumnId
            );

            // Empty column
            if (columnTasks.length === 0) {
                //Thả bất kỳ các task nào, không quan tâm priority
                await handleEmptyColumnDrag(context);
                // Non-priority task 
            } else if (!active.data.current?.task.priority) {
                // Các task không có priority -> thả vào cuối cột
                await handleNonPriorityColumnDrag(context);
                // Priority task 
            } else {
                // Các task có priority
                await handlePriorityColumnDrag(context);
            }
        }
    };

    // High light cột đích để biết thả vào đâu + Lưu trạng thái để handleDragEnd xử lý logic
    const handleDragOver = (event: DragOverEvent) => {
        const { active, over } = event;

        //Kiểm tra các điều kiện về type và hover 
        if (!over || active.id === over.id || active.data.current?.type !== 'task')
            return;

        //Phân loại phần tử đang hover
        const isOverTask = over.data.current?.type === 'task';
        const isOverEmptyColumnArea = over.data.current?.type === 'column';

        //Thả lên 1 task khác
        if (isOverTask) {
            // Check có cùng cột không
            const isSameColumn =
                over.data.current?.task.status_id ===
                active.data.current?.task.status_id;

            setOverColumnId(
                isSameColumn
                    // Nếu cùng cột thì giữ nguyên cột đó
                    ? active.data.current?.task.status_id
                    // Nếu không cùng cột thì lưu cột mới vào overColumnId
                    : over.data.current?.task.status_id
            );
            setActiveColumnId(active.data.current?.task.status_id as string);

            // Thả lên 1 vùng trống của cột
        } else if (isOverEmptyColumnArea) {
            setOverColumnId(over.id as string);
            setActiveColumnId(active.data.current?.task.status_id as string);
        }
    };

    return {
        overColumnId,
        activeTask,
        isUpdating,
        sensors,
        handleDragStart,
        handleDragEnd,
        handleDragOver,
    };
};