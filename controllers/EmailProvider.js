import mongoose from "mongoose";
import EmailProvider from "../models/EmailProvider.js";

export const create = async (req, res) => {
  try {
    const {
      smtp_auth,
      smtp_debug,
      port,
      password,
      from_to,
      host,
      active
    } = req.body;

    if (!from_to || !host || !password || !port) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const newEmailProvider = new EmailProvider({
      smtp_auth,
      smtp_debug,
      port,
      password,
      from_to,
      host,
      active
    });

    await newEmailProvider.save();

    res.status(201).json({
      message: "Email Provider created successfully",
      data: newEmailProvider
    });

  } catch (error) {
    res.status(500).json({ message: "Error creating Email Provider", error });
  }
}

export const get = async (req, res) => {
  try {
    const emailSettings = await EmailProvider.find({});
    res.status(200).json({
      message: "Email settings fetched successfully",
      data: emailSettings
    });

  } catch (error) {
    res.status(500).json({ message: "Error fetching email settings", error });
  }
}

export const getById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid ID format" });
    }

    const emailSetting = await EmailProvider.findById({
      _id: id
    });

    if (!emailSetting) {
      return res.status(404).json({ message: "Email setting not found" });
    }

    res.status(200).json({
      message: "Email setting fetched successfully",
      data: emailSetting
    });

  } catch (error) {
    console.log("🚀 ~ getById ~ error:", error)
    res.status(500).json({ message: "Error fetching email setting", error });
  }
}

export const update = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid ID format" });
    }

    const updatedEmailSetting = await EmailProvider.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedEmailSetting) {
      return res.status(404).json({ message: "Email setting not found" });
    }

    res.status(200).json({
      message: "Email setting updated successfully",
      data: updatedEmailSetting
    });

  } catch (error) {
    res.status(500).json({ message: "Error updating email setting", error });
  }
}