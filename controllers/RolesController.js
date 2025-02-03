import Roles from "../models/RolesModel.js";

export const getRoles = async (req, res) => {
  try {
    const roles = await Roles.find();
    res.status(200).json({
      data: roles,

    });
  } catch (error) {
    res.status(500).json(error);
  }
}