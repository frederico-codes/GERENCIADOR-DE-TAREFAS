import { Router } from "express"
import { TeamsController } from "../controllers/teams-controller"
import { ensureAuthenticated } from "../middewares/ensure-authenticated"
import { verifyUserAuthorization } from "../middewares/verify-user-authorization"

const teamsRoutes = Router()
const teamsController = new TeamsController()

teamsRoutes.use(ensureAuthenticated)
teamsRoutes.use(verifyUserAuthorization(["admin"]))

teamsRoutes.post("/", teamsController.createTeam)
teamsRoutes.get("/", teamsController.getTeams)
teamsRoutes.put("/:id", teamsController.updateTeam)
teamsRoutes.delete("/:id", teamsController.deleteTeam)

export { teamsRoutes }
