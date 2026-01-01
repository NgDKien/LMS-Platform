export const sortTasks = (tasks: ITaskWithOptions[]): ITaskWithOptions[] => {
    // Split tasks into priority and non-priority groups
    const priorityTasks = tasks.filter(
        (task) => task.priority?.order !== undefined
    );
    const nonPriorityTasks = tasks.filter(
        (task) => task.priority?.order === undefined
    );

    // Sort priorityTasks in task.priority.order group
    const sortedPriorityTasks = priorityTasks.sort((a, b) => {
        // Task has higher priority -> move to the front
        if (a.priority!.order !== b.priority!.order) {
            return b.priority!.order - a.priority!.order;
        }
        // Tasks has equal priority -> compare position
        return (b.statusPosition ?? 0) - (a.statusPosition ?? 0);
    });

    // Sort non-priority tasks by Position
    const sortedNonPriorityTasks = nonPriorityTasks.sort(
        //Task has higher position -> move to the front
        (a, b) => (b.statusPosition ?? 0) - (a.statusPosition ?? 0)
    );

    // Merge priority tasks followed by non-priority tasks
    return [...sortedPriorityTasks, ...sortedNonPriorityTasks];
};

export const getColumnSortedTasks = (
    tasks: ITaskWithOptions[],
    statusId: string
) => {
    // Get all task of one column and sort
    const filteredTasks = tasks.filter((task) => task.status_id === statusId);
    return sortTasks(filteredTasks);
};

export const getLowestColumnPosition = (tasks: ITaskWithOptions[]) => {
    if (tasks.length === 0) return 10000;

    const sortedTasks = sortTasks(tasks);

    //Get task's statusPosition at the end of column (after sort), if undefined -> = 0
    const lowestPosition = sortedTasks[sortedTasks.length - 1]?.statusPosition ?? 0;

    // let newPosition;
    // if (lowestPosition < 1) {
    // newPosition = lowestPosition - 0.1;
    // } else if (lowestPosition < 10) {
    // newPosition = lowestPosition - 1;
    // } else if (lowestPosition < 100) {
    // newPosition = lowestPosition - 10;
    // } else {
    // newPosition = lowestPosition - 100;
    // }
    // Create a new statusPostion < lowestPosition
    return lowestPosition < 1
        ? lowestPosition - 0.1
        : lowestPosition < 10
            ? lowestPosition - 1
            : lowestPosition < 100
                ? lowestPosition - 10
                : lowestPosition - 100;
};