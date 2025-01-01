const languages = [
  {
    id: 1,
    title: "English",
    image: "img1.jpg",
    status: "Active",
    options: [],
  },
  {
    id: 2,
    title: "Russian",
    image: "img2.jpg",
    status: "Active",
    options: [],
  },
  {
    id: 3,
    title: "Ar",
    image: "img3.jpg",
    status: "Active",
    options: [],
  },
  {
    id: 4,
    title: "Vietnamese",
    image: "img4.jpg",
    status: "Active",
    options: [],
  },
  {
    id: 5,
    title: "infdo",
    image: "img5.jpg",
    status: "Active",
    options: [],
  },
  {
    id: 6,
    title: "French",
    image: "img6.jpg",
    status: "Active",
    options: [],
  },
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
