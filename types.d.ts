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