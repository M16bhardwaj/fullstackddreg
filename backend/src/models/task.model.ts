import mongoose from 'mongoose'
import { nanoid } from "nanoid";

type Priority = "High" | "Medium" | "Low";

export interface ITask extends mongoose.Document {
    taskId: string;
    title: string;
    description: string;
    dueDate: string;
    priority: Priority;
    completed: boolean;
    createdAt?: string;
    updatedAt?: string;
    ownerId?: string;
}

const taskSchema = new mongoose.Schema<ITask>({
    title: {
        type: String,
        required: true,
    },
    taskId:{
        type: String,
        default: () => nanoid(10),
        unique: true,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    dueDate: {
        type: String,
        required: true,
    },
    priority: {
        type: String,
        enum: ["High", "Medium", "Low"],
        default: "Medium",
    },
    completed: {
        type: Boolean,
        default: false,
    },
    ownerId: {
        type: String,
        required: false,
        ref: "User",
    }
}, { timestamps: true });

export const TaskModel = mongoose.model<ITask>("Task", taskSchema);

