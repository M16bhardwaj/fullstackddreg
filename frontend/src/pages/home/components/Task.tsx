import { EllipsisVertical, Trash2, Check, PenLine } from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ITask } from '@/services/tasks';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';

import { deleteTask, completeTask } from '@/services/tasks';
import { AxiosError } from 'axios';
import { useState } from 'react';
import CreateTaskForm from '@/components/Create';

const Task: React.FC<ITask> = (task) => {
    const queryClient = useQueryClient();

    const [editTask, setEditTask] = useState<boolean>(false);

    const { mutate } = useMutation({
        mutationFn: deleteTask,
        mutationKey: ['deleteTask'],
        onSuccess: (data) => {
            toast.success(data.message);
            queryClient.invalidateQueries({
                queryKey: ['tasks'],
            });
        },
        onError: (error: AxiosError) => {
            toast.error(
                (error.response?.data as { message: string }).message ||
                    'Error deleting task',
                { position: 'bottom-right' },
            );
        },
    });

    const { mutate: complete } = useMutation({
        mutationFn: completeTask,
        mutationKey: ['completeTask'],
        onSuccess: (data) => {
            toast.success(data.message);
            queryClient.invalidateQueries({
                queryKey: ['tasks'],
            });
        },
        onError: (error: AxiosError) => {
            toast.error(
                (error.response?.data as { message: string }).message ||
                    'Error completing task',
                { position: 'bottom-right' },
            );
        },
    });

    return (
        <div className="rounded-md border shadow-sm max-w-[400px] min-w-[300px] h-fit">
            <div className="flex flex-col gap-2 p-4">
                <div className="flex justify-between items-start">
                    <div
                        className={`w-fit px-3 text-sm rounded-3xl ${task.priority === 'High' ? 'bg-red-100 text-red-600' : task.priority === 'Medium' ? 'bg-yellow-100 text-yellow-600' : 'bg-green-100 text-green-600'}`}
                    >
                        {task.priority}
                    </div>
                    <DropdownMenu>
                        <DropdownMenuTrigger>
                            <EllipsisVertical size={20} strokeWidth={1.3} />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            <DropdownMenuItem onClick={() => setEditTask(true)}>
                                <PenLine
                                    size={20}
                                    className="text-blue-700 hover:!text-blue-700"
                                />
                                Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={() => complete(task.taskId)}
                            >
                                <Check
                                    size={20}
                                    className="text-green-700 hover:!text-green-700"
                                />
                                Mark Complete
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                className="text-red-700 hover:!text-red-700"
                                onClick={() => mutate(task.taskId)}
                            >
                                <Trash2
                                    size={20}
                                    className="text-red-700 hover:!text-red-700"
                                />
                                Delete
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
                <div>
                    <span className="text-gray-700 font-semibold">
                        {task.title}
                    </span>
                </div>
                <span className="text-gray-500 text-sm">
                    {task.description}
                </span>
                <div className="flex justify-between">
                    <span className="text-gray-500 text-sm">
                        {new Date(task.dueDate).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: '2-digit',
                            day: '2-digit',
                        })}
                    </span>
                    <span
                        className={`text-sm ${task.completed ? 'text-green-500' : 'text-red-500'}`}
                    >
                        {task.completed ? 'Completed' : 'Pending'}
                    </span>
                </div>
            </div>
            {editTask && <CreateTaskForm task={task} setOpen={setEditTask} />}
        </div>
    );
};

export default Task;
