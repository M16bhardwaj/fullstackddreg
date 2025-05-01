import { z } from "zod";

export const signupSchema = z.object({
    // username: z.string({required_error: 'username is required.'}).min(1, {message: 'Username is required.'}),
    // password: z.string({required_error: 'password is required.'}).min(6, {message: 'Password must be at least 6 characters long.'}),
    // age: z.number({required_error: 'age is required.'}).min(1, {message: 'Age is required.'}),
    name: z.string({required_error: 'name is required.'}).min(1, {message: 'Name is required.'}),
    email: z.string({required_error: 'email is required.'}).email({message: 'Email is invalid.'}),
    password: z.string({required_error: 'password is required.'}).min(6, {message: 'Password must be at least 6 characters long.'}),
})

export const loginSchema = z.object({
    email: z.string({required_error: 'email is required.'}).min(1, {message: 'email is required'}),
    password: z.string({required_error: 'password is required.'}).min(6, {message: 'Password must be at least 6 characters long'}),
})

export type SignupInput = z.infer<typeof signupSchema>;
export type LoginInput = z.infer<typeof loginSchema>;

