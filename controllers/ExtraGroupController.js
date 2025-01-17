import ExtraGroup from "../models/ExtraGroupModel.js";

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