// src\routes\projectMembers.routes.js
import express from "express"
import {listProjectMember} from "../controllers/projectMembers.controllers.js"
import { verifyJWT } from "../middlewares/auth.middleware.js"
import { requireProjectMember, requireProjectAdmin } from "../middlewares/project.middleware.js"
import { addProjectMember, updateProjectMember, removeProjectMember } from "../controllers/projectMembers.controllers.js";
  
const router = express.Router()
//?------------------------- Middleware
router.use(verifyJWT) // this will verify the token for all routes in this router
router.use(requireProjectMember) // this will check if the user is a member of this project


router.route("/:projectId/members").get(listProjectMember) // list all members of a project

router.route("/:projectId/members").post(requireProjectAdmin ,addProjectMember) // add a member to a project

router.route("/:projectId/members/:userId").put(requireProjectAdmin, updateProjectMember) // update a member's role or permissions in a project

router.route("/:projectId/members/:userId").delete(requireProjectAdmin, removeProjectMember) // remove a member from a project
export default router