import { NextFunction, Response, Request } from "express";
import { AppResponse } from "../utils/response";
import { UserModel, TaskModel } from "../models/index.model";

import { SignupInput } from "../validators/auth";

import {TokenUtils} from '../utils/tokens'

class IndexController {
  async signup(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, name, password } = req.body as SignupInput;
      const user = await UserModel.create({
        email,
        name,
        password,
      });
      const token = TokenUtils.generateToken({ userId: user.userId });
      AppResponse.success(res, {user,token}, "User created successfully");
    } catch (error) {
      next(error);
    }
  }

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;
      const user = await UserModel.findOne({ email });
      if (!user) {
        AppResponse.error(res, "Invalid credentials", 404);
        return
      }
      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        AppResponse.error(res, "Invalid credentials", 401);
      }
      const token = TokenUtils.generateToken({ userId: user.userId });
      AppResponse.success(res, {user,token}, "Login successful");
    } catch (error) {
      next(error);
    }
  }

  async createTask(req: Request, res: Response, next: NextFunction) {
    try {
      const { title, description, dueDate, priority } = req.body;
      const task = await TaskModel.create({
        title,
        description,
        dueDate,
        priority,
        ownerId: req.user?.userId,
      })
      AppResponse.success(res, task, "Task created successfully");
    } catch (error) {
      next(error);
    }
  }

  async getTasks(req: Request, res: Response, next: NextFunction) {
    try {
      const { page = 1, limit = 10 } = req.query;
      const tasks = await TaskModel.find({ ownerId: req.user?.userId })
        .skip((Number(page) - 1) * Number(limit))
        .limit(Number(limit));
      const totalTasks = await TaskModel.countDocuments();
      const totalPages = Math.ceil(totalTasks / Number(limit));
      const pagination = {
        totalTasks,
        totalPages,
        currentPage: Number(page),
        limit: Number(limit),
      };
      AppResponse.success(
        res,
        { tasks, pagination },
        "Tasks retrieved successfully"
      );
    } catch (error) {
      next(error);
    }
  }

  async getTaskById(req: Request, res: Response, next: NextFunction) {
    try {
      const { taskId } = req.params;
      const task = await TaskModel.findOne({ taskId });
      if (!task) {
        AppResponse.error(res, "Task not found", 404);
      }
      AppResponse.success(res, task, "Task retrieved successfully");
    } catch (error) {
      next(error);
    }
  }

  async updateTask(req: Request, res: Response, next: NextFunction) {
    try {
      const { taskId } = req.params;
      const { title, description,dueDate, priority } = req.body;
      const task = await TaskModel.findOneAndUpdate({taskId},{
        title,
        description,
        dueDate,
        priority
      }, { new: true });
      if (!task) {
        AppResponse.error(res, "Task not found", 404);
      }
      AppResponse.success(res, task, "Task updated successfully");
    } catch (error) {
      next(error);
    }
  }

  async deleteTask(req: Request, res: Response, next: NextFunction) {
    try {
      const { taskId } = req.params;
      const task = await TaskModel.findOneAndDelete({ taskId });
      if (!task) {
        AppResponse.error(res, "Task not found", 404);
      }
      AppResponse.success(res, {}, "Task deleted successfully");
    } catch (error) {
      next(error);
    }
  }

  async completeTask(req: Request, res: Response, next: NextFunction) {
    try {
      const { taskId } = req.params;
      const task = await TaskModel.findOneAndUpdate({ taskId }, { completed: true }, { new: true });
      if (!task) {
        AppResponse.error(res, "Task not found", 404);
      }
      AppResponse.success(res, task, "Task completed successfully");
    } catch (error) {
      next(error);
    }
  }


  // analytics
  async getPriorityDistribution(req: Request<any>, res: Response, next: NextFunction) {
    try {
      // get the task distribution based on priority
      const distribution = await TaskModel.aggregate([
        {
          $match: { ownerId: req.user?.userId }
        },
        {
          $facet: {
            priorityDistribution: [
              {
                $group: {
                  _id: "$priority",
                  count: { $sum: 1 },
                },
              },
              {
                $project: {
                  _id: 0,
                  priority: "$_id",
                  count: 1,
                },
              },
            ],
            completedPriorityDistribution: [
              {
                $match: { completed: true },
              },
              {
                $group: {
                  _id: "$priority",
                  count: { $sum: 1 },
                },
              },
              {
                $project: {
                  _id: 0,
                  priority: "$_id",
                  count: 1,
                },
              },
            ],
          },
        },
      ]);
      
      if (!distribution) {
        AppResponse.error(res, "Task distribution not found", 404);
        return
      }
      AppResponse.success(res, distribution, "Task distribution retrieved successfully");
    } catch (error) {
      next(error);
    }
  }


}

export default new IndexController();
