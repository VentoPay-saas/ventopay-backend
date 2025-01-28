import ExtraGroup from "../models/ExtraGroupModel.js";
import ExtraGroupValue from "../models/ExtraGroupValueModel.js";

export const createExtraGroup = async (req, res) => {
  try {
    const { title, type } = req.body;
    if (!title || !type) {
      return res.status(400).json({ message: 'Title and type are required.' });
    }

    const group = new ExtraGroup({
      title,
      type
    });

    await group.save();

    return res.status(201).json({
      message: 'Group created successfully.',
      group
    });
  } catch (error) {
    console.error('Error creating group:', error);
    return res.status(500).json({
      message: 'Internal server error.',
      error: error.message
    });
  }
}

export const getExtraGroup = async (req, res) => {

  try {
    const { valid, perPage = 10, page = 1 } = req.query;
    const limit = parseInt(perPage);
    const skip = (parseInt(page) - 1) * limit;
    const query = {};
    if (valid) {
      query.valid = valid === 'true';
    }

    const data = await ExtraGroup.find(query).skip(skip).limit(limit);
    const total = await ExtraGroup.countDocuments(query);

    return res.status(200).json({
      message: 'Groups fetched successfully.',
      data,
      total,
      perPage: limit,
      page: parseInt(page)
    });
  } catch (error) {
    console.error('Error fetching groups:', error);
    return res.status(500).json({
      message: 'Internal server error.',
      error: error.message
    });
  }
}

export const deleteExtraGroup = async (req, res) => {


  try {
    const id = req.query.ids[0];
    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or missing id parameter.'
      });
    }

    const result = await ExtraGroup.findByIdAndDelete(id);

    if (!result) {
      return res.status(404).json({
        success: false,
        message: 'No group found with the provided id.'
      });
    }
    res.status(200).json({
      success: true,
      message: 'Group deleted successfully.'
    });
  } catch (error) {
    if (error instanceof mongoose.Error.CastError) {
      return res.status(400).json({
        success: false,
        message: 'Invalid id format.'
      });
    }
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while deleting the group.'
    });
  }
}

export const getExtraGroupById = async (req, res) => {

  try {
    const id = req.params.id;
    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or missing id parameter.'
      });
    }

    const group = await ExtraGroup.findById(id);
    const extraValues = await ExtraGroupValue.find({ extra_group_id: id });

    // Attach the extra values to the group
    const groupWithValues = {
      ...group.toObject(), // Convert the Mongoose document to a plain object
      extra_values: extraValues, // Add the extra values to the response
    };
    if (!group) {
      return res.status(404).json({
        success: false,
        message: 'No group found with the provided id.'
      });
    }
    res.status(200).json({
      success: true,
      data: groupWithValues
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while retrieving the group.'
    });
  }
}

export const updateExtraGroup = async (req, res) => {
  try {
    const id = req.params.id;
    const updateData = req.body;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or missing id parameter.'
      });
    }

    const group = await ExtraGroup.findByIdAndUpdate(id, updateData, { new: true });

    if (!group) {
      return res.status(404).json({
        success: false,
        message: 'No group found with the provided id.'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Group updated successfully.',
      data: group
    });
  } catch (error) {
    if (error instanceof mongoose.Error.CastError) {
      return res.status(400).json({
        success: false,
        message: 'Invalid id format.'
      });
    }
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while updating the group.'
    });
  }
}