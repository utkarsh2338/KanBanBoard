import { Task } from "../models/Task.js";

export interface ClientToServerEvents {
    "task:create": (task: Task) => void;
    "task:update": (task: Task) => void;
    "task:move": (data: { id: string; status: Task["status"] }) => void;
    "task:delete": (id: string) => void;
}

export interface ServerToClientEvents {
    "sync:tasks": (tasks: Task[]) => void;
    "tasks:update": (tasks: Task[]) => void;
}