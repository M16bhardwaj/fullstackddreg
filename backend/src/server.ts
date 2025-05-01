import http from "http";
import App from "./app";
import { appConfig } from "./config";

const app = new App().getInstance()

app.listen(appConfig.port, () => {
  console.log(`Server is running on port ${appConfig.port}`);
});
