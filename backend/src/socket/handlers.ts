import { Server, Socket } from "socket.io";
import { ClientToServerEvents, ServerToClientEvents } from "./events";
import { taskStore } from "../store/taskStore";
import { Task } from "../models/Task";

export function setupSocketHandlers(
    io: Server<ClientToServerEvents, ServerToClientEvents>,
    socket: Socket<ClientToServerEvents, ServerToClientEvents>
) {
    console.log(`Client connected: ${socket.id}`);

    // Send all tasks to newly connected client
    socket.emit("sync:tasks", taskStore.getAllTasks());

    // Handle task creation
    socket.on("task:create", (task: Task) => {
        try {
            const createdTask = taskStore.createTask(task);
            console.log(`Task created: ${createdTask.id}`);

            // Broadcast updated task list to all clients
            io.emit("tasks:update", taskStore.getAllTasks());
        } catch (error) {
            console.error("Error creating task:", error);
        }
    });

    // Handle task update
    socket.on("task:update", (task: Task) => {
        try {
            const { id, ...updates } = task;
            const updatedTask = taskStore.updateTask(id, updates);
            console.log(`Task updated: ${updatedTask.id}`);

            // Broadcast updated task list to all clients
            io.emit("tasks:update", taskStore.getAllTasks());
        } catch (error) {
            console.error("Error updating task:", error);
        }
    });

    // Handle task move (status change)
    socket.on("task:move", (data) => {
        try {
            const movedTask = taskStore.moveTask(data.id, data.status);
            console.log(`Task moved: ${movedTask.id} to ${data.status}`);

            // Broadcast updated task list to all clients
            io.emit("tasks:update", taskStore.getAllTasks());
        } catch (error) {
            console.error("Error moving task:", error);
        }
    });

    // Handle task deletion
    socket.on("task:delete", (id: string) => {
        try {
            const deleted = taskStore.deleteTask(id);
            if (deleted) {
                console.log(`Task deleted: ${id}`);

                // Broadcast updated task list to all clients
                io.emit("tasks:update", taskStore.getAllTasks());
            }
        } catch (error) {
            console.error("Error deleting task:", error);
        }
    });

    // Handle client disconnection
    socket.on("disconnect", () => {
        console.log(`Client disconnected: ${socket.id}`);
    });
}