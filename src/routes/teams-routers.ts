import { Router } from "express";
import {
  createTeam,
  getTeams,
  updateTeam,
  deleteTeam, 
} from "../controllers/teams-controller";
import { ensureAuthenticated } from "../middewares/ensure-authenticated";
import { verifyUserAuthorization } from "../middewares/verify-user-authorization";

const teamsRoutes = Router();

teamsRoutes.post(
  "/",
  ensureAuthenticated,
  verifyUserAuthorization(["admin"]),
  createTeam,
);
teamsRoutes.get(
  "/",
  ensureAuthenticated,
  verifyUserAuthorization(["admin"]),
  getTeams,
);
teamsRoutes.put(
  "/:id",
  ensureAuthenticated,
  verifyUserAuthorization(["admin"]),
  updateTeam,
);
teamsRoutes.delete(
  "/:id",
  ensureAuthenticated,
  verifyUserAuthorization(["admin"]),
  deleteTeam,
);


export { teamsRoutes };
