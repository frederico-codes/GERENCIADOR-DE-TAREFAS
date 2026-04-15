import { Router } from 'express';
import { ensureAuthenticated } from '../middewares/ensure-authenticated';
import { verifyUserAuthorization } from '../middewares/verify-user-authorization';
import { TeamMembersController } from '../controllers/team-members-controller';

const teamMemberRoutes = Router();
const teamMembersController = new TeamMembersController();

teamMemberRoutes.post("/", ensureAuthenticated, verifyUserAuthorization(["admin"]), teamMembersController.addTeamMember);
teamMemberRoutes.get("/", ensureAuthenticated, teamMembersController.listTeamMembers);

teamMemberRoutes.delete("/teams/:teamId/members/:userId", ensureAuthenticated, verifyUserAuthorization(["admin"]), teamMembersController.removeTeamMember);


export { teamMemberRoutes };