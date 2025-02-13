import Translation from "../models/TranslationModel.js";

export const createTranslation = async (req, res) => {
  try {
    const { key, group } = req.query;
    const value = req.query.value;
    if (!key || !group || !value || typeof value !== 'object') {
      return res.status(400).json({ status: false, message: "Missing required fields" });
    }

    let translationsArray = Object.keys(value).map(locale => {
      return {
        locale,
        value: value[locale]
      };
    });

    const newTranslation = new Translation({
      key,
      group,
      value: translationsArray
    });

    const savedTranslation = await newTranslation.save();
    console.log("Saved Translations:", savedTranslation);
    return res.json({ status: true, message: "Translations saved successfully", data: savedTranslation });
  } catch (error) {
    console.error("Error saving translation:", error);
    res.status(500).json({ status: false, message: "Server error", error: error.message });
  }
}

export const getTranslation = async (req, res) => {
  try {
    const { lang, perPage = 10, skip = 0, search } = req.query;
    let query = {};

    console.log("🚀 ~ getTranslation ~ query:", query);

    // If there's a search parameter, add it to the query
    if (search) {
      query["key"] = new RegExp(search, "i");
    }

    // Get the total count of documents matching the query
    const total = await Translation.countDocuments(query);

    // Fetch the translations with pagination
    const translations = await Translation.find(query)
      .limit(parseInt(perPage))
      .skip(parseInt(skip))
      .lean();

    // Format the fetched translations
    let formattedData = {};

    translations.forEach((t) => {
      // Group translations by key
      if (!formattedData[t.key]) {
        formattedData[t.key] = [];
      }

      // If specific language is provided, only fetch that language
      // if (lang) {
      //   formattedData[t.key].push({
      //     id: t._id,
      //     group: t.group,
      //     locale: lang,
      //     value: t.value.find(v => v.locale === lang)?.value || "", // Fallback if no translation found
      //   });
      // } else {
      // If no language is specified, return all translations
      t.value.forEach((translation) => {
        console.log("translation:", translation);

        formattedData[t.key].push({
          id: t._id,
          group: t.group,
          locale: translation.locale,
          value: translation.value || "", // Fallback if no translation found
        });
      });
      // }
    });

    return res.status(200).json({
      timestamp: new Date().toISOString(),
      status: true,
      message: "errors.NO_ERROR",
      data: {
        total,
        perPage,
        translations: formattedData,
      },
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "Server error",
      error: error.message,
    });
  }

}

export const getTranslationForSelectedLanguage = async (req, res) => {
  try {
    const { lang } = req.query;
    if (!lang) {
      return res.status(400).json({
        status: false,
        message: 'Language (lang) query parameter is required',
      });
    }

    const translations = await Translation.find().lean();
    let translatedData = {};
    translations.forEach((translation) => {
      const translationForLang = translation.value.find((v) => v.locale === lang);

      if (translationForLang) {
        translatedData[translation.key] = translationForLang.value;
      }
    });

    return res.status(200).json({
      timestamp: new Date().toISOString(),
      status: true,
      message: "Translations fetched successfully",
      data: translatedData,
    });
  } catch (error) {
    console.error("Error fetching translations:", error);
    return res.status(500).json({
      status: false,
      message: "Server error",
      error: error.message,
    });
  }
}
export const updateTranslation = async (req, res) => {
  try {
    const { key } = req.params
    console.log("🚀 ~ updateTranslation ~ key:", key)
    const { group } = req.query;

    const value = req.query.value;
    console.log("🚀 ~ updateTranslation ~ value:", value)

    if (!key || !group || !value || typeof value !== 'object') {
      return res.status(400).json({ status: false, message: "Missing required fields" });
    }

    let translationsArray = Object.keys(value).map(locale => {
      return {
        locale,
        value: value[locale]
      };
    });

    const updatedTranslation = await Translation.findOneAndUpdate(
      { key, group },
      { $set: { value: translationsArray } },
      { new: true, upsert: false } // new: true returns the updated document
    );

    if (!updatedTranslation) {
      return res.status(404).json({ status: false, message: "Translation not found" });
    }

    console.log("Updated Translations:", updatedTranslation);
    return res.json({ status: true, message: "Translations updated successfully", data: updatedTranslation });
  } catch (error) {
    console.error("Error updating translation:", error);
    res.status(500).json({ status: false, message: "Server error", error: error.message });
  }
};
