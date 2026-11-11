export interface Task{
    id: number;
    project_id: number;
    title: string;
    description: string | null;
    status: 'todo' | 'in_progress' | 'done';
    priority: 'low' |'normal' | 'high';
    due_date: string | null;
}

export interface CreateTaskData {
    title: string;
    description: string | null;
    priority: 'low' | 'normal' | 'high';
    due_date:string | null;
}

export interface UpdateTaskData {
    title: string;
    description: string | null;
    priority: 'low' | 'normal' | 'high';
    status: 'todo' | 'in_progress' | 'done';
    due_date: string | null;
}


