import ExtraGroup from "../models/ExtraGroupModel.js";
import ExtraGroupValue from "../models/ExtraGroupValueModel.js";

export const create = async (req, res) => {
  try {
    const { extra_group_id, value } = req.query;

    if (!extra_group_id || !value) {
      return res.status(400).json({
        success: false,
        message: 'Missing required parameters: extra_group_id or value.'
      });
    }

    const group = await ExtraGroup.findById(extra_group_id);
    if (!group) {
      return res.status(404).json({
        success: false,
        message: 'No group found with the provided extra_group_id.'
      });
    }

    const newValue = new ExtraGroupValue({
      extra_group_id: extra_group_id,
      value
    });
    await newValue.save();
    res.status(201).json({
      success: true,
      message: 'Value added successfully.',
      data: newValue
    });
  } catch (error) {
    if (error instanceof mongoose.Error.CastError) {
      return res.status(400).json({
        success: false,
        message: 'Invalid extra_group_id format.'
      });
    }
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while adding the value.'
    });
  }
};

export const findAll = async (req, res) => {
  try {
    const extraValues = await ExtraGroupValue.find()
      .populate('extra_group_id')

    const response = {
      data: extraValues.map(extraValue => ({
        _id: extraValue._id,
        extra_group_id: extraValue.extra_group_id._id,
        value: extraValue.value,
        active: extraValue.active,
        group: {
          _id: extraValue.extra_group_id._id,
          type: extraValue.extra_group_id.type,
          active: extraValue.extra_group_id.active,
          shop: extraValue.extra_group_id.shop,
          title: extraValue.extra_group_id.title,
        }
      })),
      links: {
        first: "https://yourapi.com/api/v1/extra-values?page=1",
        last: "https://yourapi.com/api/v1/extra-values?page=1",
        prev: null,
        next: null
      },
      meta: {
        current_page: 1,
        from: 1,
        last_page: 1,
        path: "https://yourapi.com/api/v1/extra-values",
        per_page: extraValues.length,
        to: extraValues.length,
        total: extraValues.length
      }
    };

    res.json(response);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch data" });
  }
};

export const findOne = async (req, res) => { };

export const update = async (req, res) => {
  try {
    const { id } = req.params;

    const { extra_group_id, value } = req.query;

    const updatedExtraValue = await ExtraGroupValue.findByIdAndUpdate(
      id,
      {
        extra_group_id,
        value
      },
      { new: true }
    )
    if (!updatedExtraValue) {
      return res
        .status(404)
        .json({ error: "ExtraValue not found" });
    }
    res.json({
      success: true,
      data: updatedExtraValue
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: "An error occurred while updating the ExtraValue"
    });
  }
};

export const remove = async (req, res) => {
  try {
    const ids = req.query.ids[0];

    if (!ids) {
      return res
        .status(400)
        .json({ error: "Please provide the IDs of the records to delete." });
    }


    const result = await ExtraGroupValue.findByIdAndDelete({
      _id: ids
    });

    if (result.deletedCount === 0) {
      return res
        .status(404)
        .json({ error: "No records found for the provided IDs." });
    }
    res.json({
      success: true,
      message: `${result.deletedCount} record(s) deleted successfully.`
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: "An error occurred while deleting the records."
    });
  }
};

export const removeAll = async (req, res) => { };
