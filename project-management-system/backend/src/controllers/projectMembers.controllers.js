import { asyncHandler } from "../utils/async-handler.js";
import { projectMember } from "../models/projectMemberRole.model.js";
import { ApiResponse } from "../utils/api-response.js";
import { ApiError } from "../utils/api-error.js";
import { projectTable } from "../models/project.models.js";
import { userTable } from "../models/user.models.js";

//?------------------------- List all members of a project
export const listProjectMember = asyncHandler(async (req, res) => {
  // Get the projectId from the request parameters
  const { projectId } = req.params;

  // throw error if projectId is not provided
  if (!projectId) {
    return res.status(400).json(new ApiError(400, "Project ID is required"));
  }

  // Find all project members for the given projectId
  const members = await projectMember
    .find({ project: projectId })
    .populate("user", "name email")
    .sort({ createdAt: -1 });

  // Return the list of project members
  res
    .status(200)
    .json(
      new ApiResponse(200, members, "Project members fetched successfully"),
    );
});

//?------------------------- Add a member to a project
export const addProjectMember = asyncHandler(async (req, res) => {
  // Get the projectId from the request parameters
  const { projectId } = req.params;
  // throw error if projectId is not provided
  if (!projectId)
    return res.status(400).json(new ApiError(400, "Project ID is required"));

  // Get the email, role and permissions from the request body
  const { email, role = "member", permission } = req.body;

  // Verify project exists
  const project = await projectTable.findById(projectId);
  if (!project)
    return res.status(404).json(new ApiError(404, "Project not found"));

  // Find user by email
  const user = await userTable.findOne({ email: email.toLowerCase().trim() });
  if (!user)
    return res
      .status(404)
      .json(
        new ApiError(
          404,
          "User not found, please ask the user to register first",
        ),
      );

  // Check already member
  const existingMember = await projectMember.findOne({
    project: projectId,
    user: user._id,
  });
  if (existingMember)
    return res
      .status(400)
      .json(
        new ApiError(
          400,
          "User is already a member of this project, you can not add same user twice",
        ),
      );

  // Create ProjectMember
  const newMember = await projectMember.create({
    project: projectId,
    user: user._id,
    role,
    invitedBy: req.user._id,
    permissions: {
      canCreateTasks: permission?.canCreateTasks ?? true,
      canEditTasks: permission?.canEditTasks ?? true,
      canDeleteTasks: permission?.canDeleteTasks ?? false,
      canManageMembers: permission?.canManageMembers ?? false,
      canViewReports: permission?.canViewReports ?? true,
    },
  });

  //! Update project metadata totalMembers++
  await projectTable.findByIdAndUpdate(projectId, {
    $inc: { "metadata.totalMembers": 1 },
    $set: { "metadata.lastActivity": new Date() },
  });

  // Populate the user field before returning the response
  const populatedMember = await projectMember
    .findById(newMember._id)
    .populate("user", "name email");

  // Return the newly added member
  res
    .status(201)
    .json(
      new ApiResponse(
        201,
        populatedMember,
        "Project member added successfully",
      ),
    );
});






//?------------------------- Update a member's role or permissions in a project
export const updateProjectMember = asyncHandler(async (req, res) => {
  // Get the projectId and userId from the request parameters
  const { projectId, userId } = req.params;

  // throw error if projectId or userId is not provided
  if (!projectId || !userId)
    return res
      .status(400)
      .json(new ApiError(400, "Project ID and User ID are required"));

  // Get the role and permissions from the request body
  const { role, permission } = req.body;


  // Verify project exists

  const project = await projectTable.findById(projectId);
  if (!project)
    return res.status(404).json(new ApiError(404, "Project not found"));


  // Find the project member by projectId and userId
  const member = await projectMember.findOne({
    project: projectId,
    user: userId,
  });
  if (!member)
    return res
      .status(404)
      .json(
        new ApiError(
          404,
          "Project member not found, please check the project ID and user ID",
        ),
      );

  // only  allow admin to update role and permissions

  if (req.membership.role !== "admin")
    return res
      .status(403)
      .json(
        new ApiError(
          403,
          "You are not allowed to update this project member",
        ),
      );

  //prevent last removing last admin from project (basic safety )
  if(member.role === "admin" && project.metadata.totalMembers === 1){
    return res.status(400).json(new ApiError(400, "Project must have at least one admin, you can not change role of the last admin"))
  }

  // Update the member's role and permissions

  member.role = role ?? member.role;
  member.permissions ={
    canCreateTasks: permission?.canCreateTasks ?? member.permissions.canCreateTasks,
    canEditTasks: permission?.canEditTasks ?? member.permissions.canEditTasks,
    canDeleteTasks: permission?.canDeleteTasks ?? member.permissions.canDeleteTasks,
    canManageMembers: permission?.canManageMembers ?? member.permissions.canManageMembers,
    canViewReports: permission?.canViewReports ?? member.permissions.canViewReports,
  }

  await member.save();

  //populate the user field before returning the response
  await member.populate("user", "name email");

  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        member,
        "Project member updated successfully",
      ),
    )

});


//?------------------------- Remove a member from a project
export const removeProjectMember = asyncHandler(async (req, res) => {
  // Get the projectId and userId from the request parameters
  const { projectId, userId } = req.params;

  // throw error if projectId or userId is not provided
  if (!projectId)
    return res
      .status(400)
      .json(new ApiError(400, "Project ID  are required"));

      // Verify project exists

  const project = await projectTable.findById(projectId);
  if (!project)
    return res.status(404).json(new ApiError(404, "Project not found"));

  // Find the project member by projectId and userId
  const member = await projectMember.findOne({
    project: projectId,
    user: userId,
  });
  if (!member)
    return res
      .status(404)
      .json(
        new ApiError(
          404,
          "Project member not found, please check the project ID and user ID",
        ),
      );

  // only  allow admin to remove members
  if (member.role === "admin" && project.metadata.totalMembers === 1) {
    return res.status(400).json(new ApiError(400, "Project must have at least one admin, you can not remove the last admin"))
  }
// removing member from project
  await member.remove();

  //! Update project metadata totalMembers--
  await projectTable.findByIdAndUpdate(projectId, {
    $inc: { "metadata.totalMembers": -1 },
    $set: { "metadata.lastActivity": new Date() },
  });



  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        null,
        "Project member removed successfully",
      ),
    )

});

