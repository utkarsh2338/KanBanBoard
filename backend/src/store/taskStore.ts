import { Task, TaskStatus } from "../models/Task.js";

class TaskStore {
    private tasks: Map<string, Task> = new Map();

    // Get all tasks
    getAllTasks(): Task[] {
        return Array.from(this.tasks.values());
    }

    // Get task by ID
    getTaskById(id: string): Task | undefined {
        return this.tasks.get(id);
    }

    // Create a new task
    createTask(task: Task): Task {
        if (this.tasks.has(task.id)) {
            throw new Error(`Task with ID ${task.id} already exists`);
        }
        this.tasks.set(task.id, task);
        return task;
    }

    // Update an existing task
    updateTask(id: string, updates: Partial<Task>): Task {
        const task = this.tasks.get(id);
        if (!task) {
            throw new Error(`Task with ID ${id} not found`);
        }
        const updatedTask = { ...task, ...updates, id }; // Prevent ID change
        this.tasks.set(id, updatedTask);
        return updatedTask;
    }

    // Move task to different status
    moveTask(id: string, status: TaskStatus): Task {
        const task = this.tasks.get(id);
        if (!task) {
            throw new Error(`Task with ID ${id} not found`);
        }
        const updatedTask = { ...task, status };
        this.tasks.set(id, updatedTask);
        return updatedTask;
    }

    // Delete a task
    deleteTask(id: string): boolean {
        return this.tasks.delete(id);
    }

    // Get tasks by status
    getTasksByStatus(status: TaskStatus): Task[] {
        return Array.from(this.tasks.values()).filter(task => task.status === status);
    }

    // Clear all tasks (useful for testing)
    clearAll(): void {
        this.tasks.clear();
    }
}

// Export a singleton instance
export const taskStore = new TaskStore();