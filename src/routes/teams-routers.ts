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

teamsRoutes.use(ensureAuthenticated);
teamsRoutes.use(verifyUserAuthorization(["admin"]));

teamsRoutes.post(
  "/",
  createTeam,
);
teamsRoutes.get(
  "/",
  getTeams,
);
teamsRoutes.put(
  "/:id",
  updateTeam,
);
teamsRoutes.delete(
  "/teams/:id",
  deleteTeam,
);


export { teamsRoutes };
