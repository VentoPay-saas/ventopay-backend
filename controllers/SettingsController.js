import Setting from "../models/SettingsModel.js";

export const getAllSettings = async (req, res) => {
  try {
    const settings = await Setting.find();
    return res.status(200).json({
      message: 'Settings fetched successfully',
      data: settings
    });
  } catch (err) {
    return res.status(500).json({ message: 'Server Error', error: err.message });
  }
};

export const createOrUpdateSetting = async (req, res) => {
  const settingsData = req.body;

  try {
    for (const key in settingsData) {
      const value = settingsData[key];

      let existingSetting = await Setting.findOne({ key });

      if (existingSetting) {
        existingSetting.value = value;
        await existingSetting.save();
      } else {
        const newSetting = new Setting({ key, value });
        await newSetting.save();
      }
    }

    return res.status(200).json({ message: 'Settings updated successfully' });
  } catch (err) {
    return res.status(500).json({ message: 'Server Error', error: err.message });
  }
};
