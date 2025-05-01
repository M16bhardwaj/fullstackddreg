import React from 'react';
import { Chart } from 'react-google-charts';

export const columns = [
    { type: 'string', label: 'Task ID' },
    { type: 'string', label: 'Task Name' },
    { type: 'string', label: 'Resource' },
    { type: 'date', label: 'Start Date' },
    { type: 'date', label: 'End Date' },
    { type: 'number', label: 'Duration' },
    { type: 'number', label: 'Percent Complete' },
    { type: 'string', label: 'Dependencies' },
  ];
  
  // 👇 Sample Data
  export const rows = [
    ['1', 'Design', 'UI Team', new Date(2025, 4, 1, 0), new Date(2025, 4, 1, 12), null, 100, null],
    ['2', 'API Integration', 'Backend', new Date(2025, 4, 1, 13), new Date(2025, 4, 1, 18), null, 60, '1'],
    ['3', 'Frontend Binding', 'Frontend', new Date(2025, 4, 2, 9), new Date(2025, 4, 2, 15), null, 20, '2'],
    ['4', 'Testing', 'QA', new Date(2025, 4, 3, 10), new Date(2025, 4, 3, 18), null, 0, '3'],
    ['5', 'Deployment', 'DevOps', new Date(2025, 4, 4, 8,1,12), new Date(2025, 4, 4, 17), null, 0, '4'],
    ['6', 'Feedback', 'Product', new Date(2025, 4, 5, 9), new Date(2025, 4, 5, 15), null, 0, '5'],
    ['7', 'Final Review', 'Management', new Date(2025, 4, 1, 13), new Date(2025, 4, 6, 13), null, 0, '1'],
    ['8', 'Project Closure', 'Management', new Date(2025, 4, 7, 9), new Date(2025, 4, 7, 17), null, 0, '7'],
  ];
  

const TaskGanttChart = () => {

    const data = [columns, ...rows];

    const options = {
      height: 700,

      gantt: {
        defaultStartDateMillis: new Date(2015, 3, 28),
        trackHeight: 70,
        barHeight: 60,
        timeline: { showRowLabels: true },
        palette: [
          {
            color: '#1b9e77',
            dark: '#1b9e77',
          },
          {
            color: '#d95f02',
            dark: '#d95f02',
          },
          {
            color: '#7570b3',
            dark: '#7570b3',
          },
          {
            color: '#e7298a',
            dark: '#e7298a',
          },
        ],
        criticalPathEnabled: true,
        criticalPathStyle: {
          stroke: '#e64a19',
          strokeWidth: 5,
        },
        arrow: {
          angle: 20,
          width: 2,
          color: '#e64a19',
          radius: 0,
          stroke: '#e64a19',
          strokeWidth: 1,
          fill: '#e64a19',  
        },
      },
    };
  
  
  return (
    <div className="overflow-x-auto  rounded-md border h-fit">
      <Chart
        chartType="Gantt"
        width="100%"
        height="100%"
        data={data}
        options={options}
        loader={<div>Loading Chart...</div>}
      />
    </div>
  );
};

export default TaskGanttChart;
