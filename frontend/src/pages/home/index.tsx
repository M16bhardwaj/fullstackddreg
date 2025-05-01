import emptyState from '@/assets/undraw_cat_lqdj.svg'
import TaskDistrbution from '@/components/TaskDistrbution'
import { useQuery } from '@tanstack/react-query';
import { getTasks } from '@/services/tasks';

import TaskComp from './components/Task';
import { useUser } from '@/contexts/user.context';

const Index = () => {

  const {user} = useUser()

  if(!user.isAuthenticated) {
    return <EmptyState/>
  }


  const { data, isLoading, isError } = useQuery({
    queryKey: ['tasks'],
    queryFn: getTasks,
    refetchOnWindowFocus: false,
  })

  return (
    <div className='flex gap-5 mt-5 px-5'>
      <TaskDistrbution/>
      <div className='w-full h-fit flex flex-wrap gap-4'>
        {isLoading && <span className='text-gray-500'>Loading...</span>}
        {isError && <span className='text-red-500'>Error fetching tasks</span>}
        {data?.tasks?.length === 0 && <EmptyState />}
        {data?.tasks?.map((task) => (
          <TaskComp key={task.taskId} {...task} />
        ))}
      </div>
    </div>
  )
}

export default Index

const EmptyState = () => {
  return (
    <div className='flex flex-col items-center gap-4 justify-center h-[calc(100vh-80px)] mx-auto'>
    <img src={emptyState} className='mx-auto h-[300px]'/>
    <span className='text-gray-700'>No task found !!</span>
  </div>
  )
}