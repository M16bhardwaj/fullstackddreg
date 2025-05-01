import React, { useState, useMemo } from 'react';
import {
    PieChart,
    Pie,
    Cell,
    ResponsiveContainer,
    Tooltip,
} from 'recharts';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useQuery } from '@tanstack/react-query';
import { getTaskDistribution } from '@/services/user';

type Priority = 'High' | 'Medium' | 'Low';

const COLORS: Record<Priority, string> = {
    High: '#ef4444',   // red-500
    Medium: '#f59e0b', // amber-500
    Low: '#10b981',    // emerald-500
};

const TaskDistribution: React.FC = () => {
    const [tab, setTab] = useState<'all' | 'completed'>('all');

    const { data, isLoading, isError } = useQuery({
        queryKey: ['taskDistribution'],
        queryFn: getTaskDistribution,
        refetchOnWindowFocus: false,
    });

    const chartData = useMemo(() => {
        if (!data || !data.data || data.data.length === 0) return [];

        const {
            priorityDistribution,
            completedPriorityDistribution,
        } = data.data[0];

        const selectedData =
            tab === 'completed'
                ? completedPriorityDistribution
                : priorityDistribution;

        // Ensure all priority levels exist, even if count is 0
        const priorities: Priority[] = ['High', 'Medium', 'Low'];

        return priorities.map((priority) => {
            const found = selectedData.find((item) => item.priority === priority);
            return {
                name: priority,
                value: found?.count || 0,
            };
        });
    }, [data, tab]);

    return (
        <div className="p-4 space-y-4 border w-[400px] sticky top-20 h-fit rounded-md">
            <div className="flex flex-col space-y-2">
                <Tabs value={tab} onValueChange={(val: any) => setTab(val)}>
                    <TabsList className="w-full justify-center bg-gray-100 !rounded-sm">
                        <TabsTrigger value="all" className="px-4 !rounded-sm">
                            All Tasks
                        </TabsTrigger>
                        <TabsTrigger value="completed" className="px-4 !rounded-sm">
                            Completed Tasks
                        </TabsTrigger>
                    </TabsList>
                </Tabs>
            </div>

            {isLoading ? (
                <p className="text-center text-sm text-gray-500">Loading chart...</p>
            ) : isError ? (
                <p className="text-center text-sm text-red-500">Failed to load data</p>
            ) : (
                <ResponsiveContainer width="100%" height={220}>
                    <PieChart>
                        <Pie
                            data={chartData}
                            dataKey="value"
                            nameKey="name"
                            cx="50%"
                            cy="50%"
                            outerRadius={70}
                            innerRadius={35}
                            paddingAngle={3}
                        >
                            {chartData.map((entry, index) => (
                                <Cell
                                    key={`cell-${index}`}
                                    fill={COLORS[entry.name as Priority]}
                                />
                            ))}
                        </Pie>
                        <Tooltip
                            contentStyle={{ borderRadius: '8px', fontSize: '14px' }}
                            formatter={(value: number, name: string) => [
                                `${value} task(s)`,
                                name,
                            ]}
                        />
                    </PieChart>
                </ResponsiveContainer>
            )}
        </div>
    );
};

export default TaskDistribution;
