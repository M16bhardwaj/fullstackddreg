import { http } from '@/http';

import { LoginFormValues, SignupFormValues } from '@/components/Navbar';

export interface User {
    _id: string;
    userId: string;
    email: string;
    name: string;
    password: string;
    createdAt: string; // ISO timestamp string
    updatedAt: string; // ISO timestamp string
    __v: number;
}

interface AuthResponse {
    data: {
        user: User;
        token: string;
    };
    message: string;
    success: boolean;
}

interface DistributionResponse {
    data: {
        completedPriorityDistribution: {
            count: number;
            priority: string;
        }[];

        priorityDistribution: {
            count: number;
            priority: string;
        }[];
    }[]
}

export const signUp = async (data: SignupFormValues) => {
    const res = await http.post<AuthResponse>('/api/v1/signup', data);
    return res.data;
};

export const login = async (data: LoginFormValues) => {
    const res = await http.post<AuthResponse>('/api/v1/login', data);
    return res.data;
};

// analysis

export const getTaskDistribution = async () => {
    const res = await http.get<DistributionResponse>(
        '/api/v1/analytics/p_distribution',
    );
    return res.data;
};
