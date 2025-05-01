import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from '@/components/ui/sheet';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { SquarePen } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { AxiosError } from 'axios';

import { signUp, login } from '@/services/user';
import { useUser } from '@/contexts/user.context';
import CreateTaskForm from './Create';

// Schemas
const loginSchema = z.object({
    email: z.string().email('Email is required'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
});

const signupSchema = z.object({
    name: z.string().min(1, 'Full name is required'),
    email: z.string().email('Invalid email'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
});

export type LoginFormValues = z.infer<typeof loginSchema>;
export type SignupFormValues = z.infer<typeof signupSchema>;

const Navbar = () => {
    const [open, setOpen] = useState(false);
    const [isLoginOpen, setIsLoginOpen] = useState(false);
    const [toggleRegister, setToggleRegister] = useState(false);

    const { user, setUser, logout } = useUser();

    const form = useForm<LoginFormValues | SignupFormValues>({
        resolver: zodResolver(toggleRegister ? signupSchema : loginSchema),
    });

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = form;

    const handleCreateTask = () => {
        if (user?.isAuthenticated) return setOpen(true);
        setIsLoginOpen(true);
    };

    const { mutate: loginFn } = useMutation({
        mutationKey: ['login'],
        mutationFn: login,
        onSuccess: ({ data }) => {
            setUser({
                email: data.user.email,
                isAuthenticated: true,
                name: data.user.name,
                userId: data.user.userId,
                token: data.token,
            });
            toast.success('Login successful', { position: 'bottom-right' });
            setIsLoginOpen(false);
            setOpen(true);
            form.reset();
        },
        onError: (error: AxiosError) => {
            toast.error(
                (error.response?.data as { message: string })?.message ||
                    'Error logging in',
                { position: 'bottom-right' },
            );
        },
    });

    const { mutate: signupFn } = useMutation({
        mutationKey: ['signup'],
        mutationFn: signUp,
        onSuccess: ({ data }) => {
            setUser({
                email: data.user.email,
                isAuthenticated: true,
                name: data.user.name,
                userId: data.user.userId,
                token: data.token,
            });
            toast.success('Signup successful', { position: 'bottom-right' });
            setIsLoginOpen(false);
            setOpen(true);
            form.reset();
        },
        onError: (error: AxiosError) => {
            toast.error(
                (error.response?.data as { message: string })?.message ||
                    'Error signing up',
                { position: 'bottom-right' },
            );
        },
    });

    const onSubmit = async (data: any) => {
        if (toggleRegister) {
            signupFn(data);
        } else {
            loginFn(data);
        }
    };

    return (
        <div className="flex justify-between items-center shadow text-gray-800 py-3 px-5">
            <div>
                <h1 className="text-3xl font-semibold tracking-wider text-blue-800">
                    Trker
                </h1>
            </div>

            <div className="flex items-center gap-5">
                {/* Create Task */}
                <Sheet open={open} onOpenChange={setOpen}>
                    <Button
                        className="bg-blue-700 text-white hover:bg-blue-800"
                        onClick={handleCreateTask}
                    >
                        <SquarePen />
                        Create Task
                    </Button>
                    <SheetContent className="w-[600px] sm:w-[540px]">
                        <SheetHeader>
                            <SheetTitle>Create New Task</SheetTitle>
                            <SheetDescription>
                                Fill in the details below to create a new task.
                            </SheetDescription>
                        </SheetHeader>
                        <CreateTaskForm setOpen={setOpen} />
                    </SheetContent>
                </Sheet>

                {/* Avatar Menu */}
                {user?.isAuthenticated && (
                    <DropdownMenu>
                        <DropdownMenuTrigger>
                            <Avatar className="!rounded-sm">
                                <AvatarImage src="https://github.com/shadcn.png" />
                                <AvatarFallback>CN</AvatarFallback>
                            </Avatar>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="mt-3.5 mr-4">
                            <DropdownMenuLabel className="">
                                <p>{user.name}</p>
                                <span className="!text-sm text-gray-700 font-normal">
                                    {user?.email}
                                </span>
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                                className="text-red-700 hover:!text-red-700"
                                onClick={logout}
                            >
                                Logout
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                )}
            </div>

            {/* Login / Sign up Dialog */}
            <Dialog open={isLoginOpen} onOpenChange={setIsLoginOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>
                            {toggleRegister ? 'Sign up' : 'Login'}
                        </DialogTitle>
                        <DialogDescription>
                            {toggleRegister
                                ? 'Create a new account to continue.'
                                : 'Login to your account to continue.'}
                        </DialogDescription>
                    </DialogHeader>

                    <form
                        onSubmit={handleSubmit(onSubmit)}
                        className="space-y-4"
                    >
                        {toggleRegister && (
                            <div>
                                <label className="text-sm text-gray-700">
                                    Full Name
                                </label>
                                <input
                                    type="text"
                                    className="border w-full h-10 mt-1 pl-2 rounded-md"
                                    placeholder="Enter your full name"
                                    {...register('name')}
                                />
                                {'name' in errors && errors?.name && (
                                    <p className="text-sm text-red-600 mt-1">
                                        {errors?.name.message}
                                    </p>
                                )}
                            </div>
                        )}

                        <div>
                            <label className="text-sm text-gray-700">
                                Email
                            </label>
                            <input
                                type="email"
                                className="border w-full h-10 mt-1 pl-2 rounded-md"
                                placeholder="Enter your email"
                                {...register('email')}
                            />
                            {errors.email && (
                                <p className="text-sm text-red-600 mt-1">
                                    {errors.email.message}
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="text-sm text-gray-700">
                                Password
                            </label>
                            <input
                                type="password"
                                className="border w-full h-10 mt-1 pl-2 rounded-md"
                                placeholder="Enter your password"
                                {...register('password')}
                            />
                            {errors.password && (
                                <p className="text-sm text-red-600 mt-1">
                                    {errors.password.message}
                                </p>
                            )}
                        </div>

                        <Button
                            type="submit"
                            className="w-full bg-blue-700 text-white hover:bg-blue-800"
                            disabled={isSubmitting}
                        >
                            {isSubmitting
                                ? toggleRegister
                                    ? 'Signing up...'
                                    : 'Logging in...'
                                : toggleRegister
                                  ? 'Sign up'
                                  : 'Login'}
                        </Button>

                        <p className="text-sm text-center mt-2">
                            {toggleRegister
                                ? 'Already have an account? '
                                : "Don't have an account? "}
                            <button
                                type="button"
                                className="text-blue-600 hover:underline ml-1"
                                onClick={() => {
                                    setToggleRegister(!toggleRegister);
                                    form.reset();
                                }}
                            >
                                {toggleRegister ? 'Login' : 'Sign up'}
                            </button>
                        </p>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default Navbar;
