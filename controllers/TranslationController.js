import Translation from "../models/TranslationModel.js";

export const createTranslation = async (req, res) => {
  try {


    const { key, group } = req.query;
    const value = req.query.value;
    if (!key || !group || !value || typeof value !== 'object') {
      return res.status(400).json({ status: false, message: "Missing required fields" });
    }

    console.log("Parsed Value Object:", value);

    // Transform the value object into an array of translations
    let translationsArray = Object.keys(value).map(locale => {
      console.log(`Processing locale: ${locale}, value: ${value[locale]}`);
      return {
        locale,
        value: value[locale]
      };
    });

    // Log the resulting translations array
    console.log("Parsed Translations:", translationsArray);

    // Check if the translation already exists

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

    // Validate that the `lang` query parameter is provided
    if (!lang) {
      return res.status(400).json({
        status: false,
        message: 'Language (lang) query parameter is required',
      });
    }

    // Fetch all translations from the database
    const translations = await Translation.find().lean();

    // Initialize an empty object to store the translated keys
    let translatedData = {};

    // Loop through each translation and extract the key-value pairs for the specified language
    translations.forEach((translation) => {
      const translationForLang = translation.value.find((v) => v.locale === lang);

      if (translationForLang) {
        translatedData[translation.key] = translationForLang.value;
      }
    });

    // Return the response with translations for the specified language
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