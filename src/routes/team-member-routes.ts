import { Router } from "express"
import { ensureAuthenticated } from "../middewares/ensure-authenticated"
import { verifyUserAuthorization } from "../middewares/verify-user-authorization"
import { TeamMembersController } from "../controllers/team-members-controller"

const teamMemberRoutes = Router()
const teamMembersController = new TeamMembersController()

teamMemberRoutes.use(ensureAuthenticated)

teamMemberRoutes.post(
  "/",
  verifyUserAuthorization(["admin"]),
  teamMembersController.addTeamMember,
)
teamMemberRoutes.get("/", teamMembersController.listTeamMembers)

teamMemberRoutes.delete(
  "/team/:teamId/member/:userId",
  verifyUserAuthorization(["admin"]),
  teamMembersController.removeTeamMember,
)

export { teamMemberRoutes }
