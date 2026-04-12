import { Router } from "express";
import { usersRoutes } from "./users-routes";
import { tasksRoutes } from "./tasks-routes";
import { teamsRoutes } from "./teams-routers";
import { tasksHistoriesRoutes } from "./tasks-histories-routes";
import { sessionsRoutes } from "./sessions-routes";

const routes = Router();


routes.use("/users", usersRoutes);
routes.use("/tasks", tasksRoutes);
routes.use("/teams", teamsRoutes);
routes.use("/task-histories", tasksHistoriesRoutes);
routes.use("/sessions", sessionsRoutes);
export { routes };