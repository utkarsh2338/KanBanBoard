'use client';

import { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';

interface Task {
    id: string;
    title: string;
    description: string;
    status: 'todo' | 'in-progress' | 'done';
}

export default function KanbanBoard() {
    const [mounted, setMounted] = useState(false);
    const [tasks, setTasks] = useState<Task[]>([
        { id: '1', title: 'Design System', description: 'Create a design system for the app', status: 'todo' },
        { id: '2', title: 'API Integration', description: 'Connect to backend APIs', status: 'in-progress' },
        { id: '3', title: 'User Authentication', description: 'Implement login and signup', status: 'done' },
    ]);

    const [newTask, setNewTask] = useState({ title: '', description: '' });
    const [showAddTask, setShowAddTask] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const onDragEnd = (result: DropResult) => {
        const { destination, source, draggableId } = result;

        if (!destination) return;
        if (destination.droppableId === source.droppableId && destination.index === source.index) return;

        setTasks((prevTasks) => {
            const updatedTasks = [...prevTasks];
            const taskIndex = updatedTasks.findIndex((t) => t.id === draggableId);
            updatedTasks[taskIndex].status = destination.droppableId as Task['status'];
            return updatedTasks;
        });
    };

    const addTask = () => {
        if (newTask.title.trim()) {
            const task: Task = {
                id: Date.now().toString(),
                title: newTask.title,
                description: newTask.description,
                status: 'todo',
            };
            setTasks([...tasks, task]);
            setNewTask({ title: '', description: '' });
            setShowAddTask(false);
        }
    };

    const deleteTask = (id: string) => {
        setTasks(tasks.filter((task) => task.id !== id));
    };

    const columns: { id: Task['status']; title: string; color: string }[] = [
        { id: 'todo', title: 'To Do', color: 'from-red-500 to-orange-500' },
        { id: 'in-progress', title: 'In Progress', color: 'from-yellow-500 to-amber-500' },
        { id: 'done', title: 'Done', color: 'from-green-500 to-emerald-500' },
    ];

    if (!mounted) {
        return null;
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-8">
                <h1 className="text-5xl font-bold text-white mb-2 drop-shadow-lg">Kanban Board</h1>
                <p className="text-gray-300 text-lg">Organize your tasks efficiently</p>
            </div>

            <button
                onClick={() => setShowAddTask(!showAddTask)}
                className="mb-6 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
            >
                + Add New Task
            </button>

            {showAddTask && (
                <div className="mb-6 p-6 bg-white/10 backdrop-blur-md rounded-xl border border-white/20 shadow-2xl">
                    <input
                        type="text"
                        placeholder="Task title"
                        value={newTask.title}
                        onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                        className="w-full mb-3 px-4 py-3 bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                    <textarea
                        placeholder="Task description"
                        value={newTask.description}
                        onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                        className="w-full mb-3 px-4 py-3 bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                        rows={3}
                    />
                    <div className="flex gap-3">
                        <button
                            onClick={addTask}
                            className="px-6 py-2 bg-green-500 text-white rounded-lg font-semibold hover:bg-green-600 transition-colors"
                        >
                            Add
                        </button>
                        <button
                            onClick={() => {
                                setShowAddTask(false);
                                setNewTask({ title: '', description: '' });
                            }}
                            className="px-6 py-2 bg-red-500 text-white rounded-lg font-semibold hover:bg-red-600 transition-colors"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}

            <DragDropContext onDragEnd={onDragEnd}>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {columns.map((column) => (
                        <div key={column.id} className="flex flex-col">
                            <div className={`mb-4 p-4 bg-gradient-to-r ${column.color} rounded-t-xl shadow-lg`}>
                                <h2 className="text-xl font-bold text-white drop-shadow">
                                    {column.title}
                                    <span className="ml-2 text-sm bg-white/30 px-2 py-1 rounded-full">
                                        {tasks.filter((t) => t.status === column.id).length}
                                    </span>
                                </h2>
                            </div>

                            <Droppable droppableId={column.id}>
                                {(provided, snapshot) => (
                                    <div
                                        ref={provided.innerRef}
                                        {...provided.droppableProps}
                                        className={`flex-1 p-4 rounded-b-xl min-h-[400px] transition-colors ${snapshot.isDraggingOver
                                                ? 'bg-white/20 backdrop-blur-md border-2 border-white/40'
                                                : 'bg-white/10 backdrop-blur-md border border-white/20'
                                            }`}
                                    >
                                        {tasks
                                            .filter((task) => task.status === column.id)
                                            .map((task, index) => (
                                                <Draggable key={task.id} draggableId={task.id} index={index}>
                                                    {(provided, snapshot) => (
                                                        <div
                                                            ref={provided.innerRef}
                                                            {...provided.draggableProps}
                                                            {...provided.dragHandleProps}
                                                            className={`mb-3 p-4 bg-white/90 backdrop-blur rounded-lg shadow-lg transform transition-all duration-200 ${snapshot.isDragging
                                                                    ? 'scale-105 rotate-2 shadow-2xl'
                                                                    : 'hover:shadow-xl hover:scale-102'
                                                                }`}
                                                        >
                                                            <div className="flex justify-between items-start mb-2">
                                                                <h3 className="font-bold text-gray-800 text-lg">{task.title}</h3>
                                                                <button
                                                                    onClick={() => deleteTask(task.id)}
                                                                    className="text-red-500 hover:text-red-700 font-bold text-xl leading-none"
                                                                >
                                                                    ×
                                                                </button>
                                                            </div>
                                                            <p className="text-gray-600 text-sm">{task.description}</p>
                                                        </div>
                                                    )}
                                                </Draggable>
                                            ))}
                                        {provided.placeholder}
                                    </div>
                                )}
                            </Droppable>
                        </div>
                    ))}
                </div>
            </DragDropContext>
        </div>
    );
}
