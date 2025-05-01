import express from "express";
import cors from "cors";
import { coreOptions,connectMongoDB,securityHeaders } from "./config";

import indexRoutes from "./routes/index.routes";

import { ErrorMiddleware } from "./middlewares/error.mdl";
import { AppResponse } from "./utils/response";

export default class App {
  public app: express.Application;

  constructor() {
    this.app = express();
    this.config();
    this.middlwares()
    this.registerRoutes();
    this.errorMdl();
  }

  /**
   * Middleware for CORS, JSON parsing, and URL encoding
   * @returns {void}
   */
  private config(): void {
    this.app.use(cors(coreOptions))
    this.app.use(express.json({limit: "10mb" }));
    this.app.use(express.urlencoded({ extended: false }));
  }

  /**
   * Middleware for security headers and MongoDB connection
   * @returns {void}
   */
  private middlwares(): void {
    this.app.use(securityHeaders);
    connectMongoDB();  
  }

  /**
   * Error handling middleware
   * @returns {void}
   */
  private errorMdl(): void {
    this.app.use(ErrorMiddleware.handleError);
    ErrorMiddleware.handleUnhandledRejection();
    ErrorMiddleware.handleUncaughtException();
  }

  /**
   * Register routes
   * @returns {void}
   */
  private registerRoutes(): void {
    this.app.use('/health', (req, res) => {
       AppResponse.success(res, {}, "Server is running");
    })
    this.app.use("/api/v1", indexRoutes);
  }

  /**
   * Start the server
   * @returns {void}
   */
  public getInstance(): express.Application {
    return this.app;
  }
}
