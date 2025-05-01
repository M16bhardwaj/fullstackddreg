import { TaskFormData } from '@/components/Create';

import { http } from '@/http';

export interface ITask {
    taskId: string;
    title: string;
    description: string;
    dueDate: string;
    priority: 'Low' | 'Medium' | 'High';
    completed: boolean;
    createdAt: string;
    updatedAt: string;
}

interface CreateTaskResponse {
    task: ITask;
    message: string;
    success: boolean;
}

export const createTask = async (data: TaskFormData) => {
    const res = await http.post<CreateTaskResponse>('/api/v1/task', data);
    return res.data;
};

export const getTasks = async () => {
    const res = await http.get<{
        data: {
            tasks: ITask[];
            pagination: {
                currentPage: number;
                limit: number;
                totalPages: number;
                totalTasks: number;
            };
        };
    }>('/api/v1/tasks');
    return res.data.data;
};

export const getTaskById = async (taskId: string) => {
    const res = await http.get<{ data: {task: ITask} }>(
        '/api/v1/task' + `/${taskId}`,
    );
    return res.data.data;
}

export const deleteTask = async (taskId: string) => {
    const res = await http.delete<{ message: string }>(
        '/api/v1/task' + `/${taskId}`,
    );
    return res.data;
};


export const updateTask = async ({data,taskId}:{taskId: string, data: {}}) => {
    const res = await http.put<{ message: string }>(
        '/api/v1/task' + `/${taskId}`,
        data,
    );
    return res.data;
}

export const completeTask = async (taskId: string) => {
    const res = await http.put<{ message: string }>(
        '/api/v1/task' + `/${taskId}/complete`,
    );
    return res.data;
}