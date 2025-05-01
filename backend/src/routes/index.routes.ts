import indexController from "../controllers/index.controller";
import { Router } from "express";

import { ValidationMiddleware, AuthMiddleware } from "../middlewares/index.mdl";
import { signupSchema } from "../validators/auth";

class IndexRouter {
  public router: Router;

  constructor() {
    this.router = Router();
    this.routes();
  }

  private routes(): void {
    this.router.post(
      "/signup",
      ValidationMiddleware.validate(signupSchema),
      indexController.signup
    );
    this.router.post("/login", indexController.login);

    this.router.post(
      "/task",
      AuthMiddleware.authenticate,
      indexController.createTask
    );
    this.router.get(
      "/tasks",
      AuthMiddleware.authenticate,
      indexController.getTasks
    );
    this.router.get(
      "/task/:taskId",
      AuthMiddleware.authenticate,
      indexController.getTaskById
    );
    this.router.put(
      "/task/:taskId",
      AuthMiddleware.authenticate,
      indexController.updateTask
    );
    this.router.delete(
      "/task/:taskId",
      AuthMiddleware.authenticate,
      indexController.deleteTask
    );
    this.router.put(
      "/task/:taskId/complete",
      AuthMiddleware.authenticate,
      indexController.completeTask)

      this.router.get('/analytics/p_distribution',
      AuthMiddleware.authenticate,
      indexController.getPriorityDistribution)
  }
}

export default new IndexRouter().router;
