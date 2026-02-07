// task interface
export type TaskStatus = 'todo' | 'in-progress' | 'done';
export type TaskPriority = 'low' | 'medium' | 'high';
export type taskCategory = 'feature' | 'bug' | 'improvement';

export interface Task{
    id:string;
    title:string;
    description?:string;
    status:TaskStatus;
    priority:TaskPriority;
    category:taskCategory;
    attachments: string[];
    createdAt: number;
}