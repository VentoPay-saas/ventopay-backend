import { Language } from "../models/LanguagesModel.js";
import { HttpStatusCode } from "../utils/StatusCodes.js";

export const createLanguage = async (req, res) => {
  const {
    title,
    locale,
    images,
    active,
    backward,
    default: isDefault
  } = req.body;

  if (!title || !locale) {
    return res.status(400).json({ error: 'Title and locale are required.' });
  }

  try {
    const newLanguage = new Language({
      title,
      locale,
      images,
      active,
      backward,
      default: isDefault
    });

    const savedLanguage = await newLanguage.save();

    res.status(201).json(savedLanguage);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create language', details: err });
  }
};

export const getLanguages = async (req, res) => {
  try {
    const languages = await Language.find();
    res.status(HttpStatusCode.OK).json({
      data: languages,
      status: true
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch languages', details: err });
  }
};

export const updateLanguage = async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  try {
    const updatedLanguage = await Language.findByIdAndUpdate(id, updates, { new: true, runValidators: true });

    if (!updatedLanguage) {
      return res.status(404).json({ error: 'Language not found' });
    }

    res.json(updatedLanguage);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update language', details: err });
  }
};

export const deleteLanguage = async (req, res) => {
  const ids = req.query.ids;
  try {
    const deletedLanguage = await Language.findByIdAndDelete(ids[0]);

    if (!deletedLanguage) {
      return res.status(404).json({ error: 'Language not found' });
    }

    res.json({ message: 'Language deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete language', details: err });
  }
};

export const getByIdLanguage = async (req, res) => {
  const { id } = req.params;

  try {
    const language = await Language.findById(id);

    if (!language) {
      return res.status(404).json({ error: 'Language not found' });
    }

    res.json({ data: language, status: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch language', details: err });
  }
};

export const activeLanguage = async (req, res) => {
  const { lang } = req.query;

  try {
    const activeLanguages = await Language.find({ locale: lang, active: 1 });

    if (activeLanguages.length === 0) {
      return res.status(404).json({ error: 'No active languages found for the specified locale' });
    }

    res.json(activeLanguages);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch active languages', details: err });
  }
};



export const getActiveLanguages = async (req, res) => {
  try {
    const activeLanguages = await Language.find({ active: true });

    if (!activeLanguages.length) {
      return res.status(404).json({ message: 'No active languages found' });
    }

    res.status(200).json({
      message: `${activeLanguages.length} active language(s) found`,
      data: activeLanguages,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An error occurred while fetching active languages', error: error.message });
  }
};