const languages = [
  { id: 1, name: "English", code: "en", isActive: true },
  { id: 2, name: "Spanish", code: "es", isActive: true },
  { id: 3, name: "French", code: "fr", isActive: false },
];

app.get("/rest/languages/active", (req, res) => {
  try {
    const queryParams = req.query; // Extract query parameters if needed
    console.log("Query Parameters:", queryParams);

    // Filter active languages
    const activeLanguages = languages.filter((lang) => lang.isActive);

    res.status(200).json({
      success: true,
      data: activeLanguages,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "An error occurred while fetching active languages.",
      error: error.message,
    });
  }
});
