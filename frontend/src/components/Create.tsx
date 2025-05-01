import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';

import { createTask, ITask, updateTask } from '@/services/tasks';
import { Button } from './ui/button';
import { AxiosError } from 'axios';

const priorities = ['High', 'Medium', 'Low'] as const;

const taskSchema = z.object({
    title: z.string().min(1, 'Title is required'),
    description: z.string().min(1, 'Description is required'),
    dueDate: z.string().min(1, 'Due date is required'),
    priority: z.enum(priorities),
});

export type TaskFormData = z.infer<typeof taskSchema>;

interface CreateTaskFormProps {
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
    task?: ITask;
}

const CreateTaskForm: React.FC<CreateTaskFormProps> = ({ setOpen, task }) => {
    const queryClient = useQueryClient();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<TaskFormData>({
        resolver: zodResolver(taskSchema),
        defaultValues: {
            description: task?.description || '',
            dueDate: task?.dueDate || '',
            priority: task?.priority || 'Low',
            title: task?.title || '',
        },
    });

    const { mutate } = useMutation({
        mutationFn: createTask,
        mutationKey: ['createTask'],
        onSuccess: () => {
            setOpen(false);
            toast.success('Task created successfully');
            queryClient.invalidateQueries({
                queryKey: ['tasks'],
            });
        },
        onError: (error: AxiosError) => {
            toast.error(
                (error.response?.data as { message: string }).message ||
                    'Error creating task',
                { position: 'bottom-right' },
            );
        },
    });

    const { mutate: update } = useMutation({
        mutationFn: updateTask,
        mutationKey: ['updateTask'],
        onSuccess: () => {
            setOpen(false);
            toast.success('Task updated successfully');
            queryClient.invalidateQueries({
                queryKey: ['tasks'],
            });
        },
        onError: (error: AxiosError) => {
            toast.error(
                (error.response?.data as { message: string }).message ||
                    'Error updating task',
                { position: 'bottom-right' },
            );
        },
    });

    const onSubmit = (data: TaskFormData) => {
        if (task) {
            update({ taskId: task.taskId, data });
        } else {
            mutate(data);
        }
    };

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className="max-w-md p-4 bg-white space-y-6"
        >
            <div>
                <label className="block mb-1 font-medium text-gray-700">
                    Title
                </label>
                <input
                    {...register('title')}
                    className="w-full px-4 py-2 border rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {errors.title && (
                    <p className="text-red-500 text-sm mt-1">
                        {errors.title.message}
                    </p>
                )}
            </div>

            <div>
                <label className="block mb-1 font-medium text-gray-700">
                    Description
                </label>
                <textarea
                    {...register('description')}
                    rows={3}
                    className="w-full px-4 py-2 border rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[40px] max-h-32"
                />
                {errors.description && (
                    <p className="text-red-500 text-sm mt-1">
                        {errors.description.message}
                    </p>
                )}
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4">
                <div className="flex-1">
                    <label className="block mb-1 font-medium text-gray-700">
                        Due Date
                    </label>
                    <input
                        type="date"
                        {...register('dueDate')}
                        className="w-full px-4 py-2 border rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {errors.dueDate && (
                        <p className="text-red-500 text-sm mt-1">
                            {errors.dueDate.message}
                        </p>
                    )}
                </div>

                <div className="flex-1 mt-4 sm:mt-0">
                    <label className="block mb-1 font-medium text-gray-700">
                        Priority
                    </label>
                    <select
                        {...register('priority')}
                        className="w-full px-4 py-2 border rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        {priorities.map((p) => (
                            <option key={p} value={p}>
                                {p}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-sm transition-colors"
            >
                {task ? 'Update Task' : 'Create Task'}
            </Button>
        </form>
    );
};

export default CreateTaskForm;
