interface IUserLink {
    id: string;
    label: string;
    url: string;
}

interface IUser {
    clerk_id: string;
    email: string;
    name: string;
    description: string;
    avatar: string;
    created_at: Date;
    updated_at: Date;
    links: IUserLink[];
    provider: 'google' | 'github' | 'email';
}

interface IProject {
    id: string;
    name: string;
    description: string;
    readme: string;
    created_by: string;
    created_at: Date;
    updated_at: Date;
    closed: boolean;
}

interface ICustomFieldData {
    id: string;
    label?: string;
    color?: string;
    description?: string;
    // number: string;
}

interface ITask {
    id: string;
    project_id: string;
    status_id: string;
    title: string;
    description: string;
    labels: string[];
    priority: string | null;
    size: string | null;
    startDate: Date | null;
    endDate: Date | null;
    created_at: Date;
    updated_at: Date;
    created_by: string;
    statusPosition: number;
    assignees?: string[];
}


interface IField {
    id: string;
    label: string;
    description: string;
    color: string;
    created_at?: Date;
    updated_at?: Date;
    project_id?: string;
}

interface IStatus extends IField {
    order: number;
    limit: number;
}

// interface ILabel extends IField { }
type ILabel = IField;
interface IPriority extends IField {
    order: number;
}
interface ISize extends IField {
    order: number;
}

type ProjectWithOptions = {
    name: string;
    description: string;
    readme: string;
    statuses?: Omit<IStatus, 'created_at' | 'updated_at'>[];
    labels?: Omit<ILabel, 'created_at' | 'updated_at'>[];
    priorities?: Omit<IPriority, 'created_at' | 'updated_at'>[];
    sizes?: Omit<ISize, 'created_at' | 'updated_at'>[];
};

interface ITaskWithOptions extends Partial<ITask> {
    creator?: {
        id: string;
        name: string;
        avatar: string;
        description: string;
        links: IUserLink[];
    };
    labels?: {
        id: string;
        label: string;
        color: string;
    }[];
    size?: {
        id: string;
        label: string;
        color: string;
    };
    priority?: {
        id: string;
        label: string;
        color: string;
        order: number;
    };
    assignees?: {
        id: string;
        name: string;
        description: string;
        avatar: string;
        links: IUserLink[];
    }[];
}