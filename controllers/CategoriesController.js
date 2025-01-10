import Category from "../models/Categories.js";

export const createCategory = async (req, res) => {
  try {
    const { title, description, parent_id, shop_id, keywords, active, status, type, ...images } =
      req.query;

    if (!keywords || !type || !title || !description) {
      return res
        .status(400)
        .json({
          error:
            "Invalid input data. Ensure keywords, type, and images are provided.",
        });
    }
    let imagesArr = [];
    imagesArr.push({
      uid: images.images[0].uid,
      name: images.images[0].name,
      status: images.images[0].status,
      url: images.images[0].url,
      created: images.images[0].created === "true",
    });
    const category = new Category({
      parent_id: parent_id || null,
      shop_id: shop_id || null,
      keywords,
      images: imagesArr,
      active: active !== undefined ? Boolean(active) : true,
      status: status || "published",
      type,
      title,
      description
    });

    const savedCategory = await category.save();

    res.status(201).json({
      message: "Category created successfully",
      data: savedCategory,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

export const getPaginateCategory = async (req, res) => {
  try {
    const { page = 1, perPage = 10, type } = req.query;

    const pageNumber = parseInt(page, 10);
    const itemsPerPage = parseInt(perPage, 10);

    const filter = {};
    if (type) filter.type = type;
    console.log("🚀 ~ getPaginateCategory ~ filter:", filter)

    const categories = await Category.find(filter)
      .skip((pageNumber - 1) * itemsPerPage)
      .limit(itemsPerPage);

    const totalCategories = await Category.countDocuments(filter);

    res.status(200).json({
      message: "Categories fetched successfully",
      data: categories,
      meta: {
        currentPage: pageNumber,
        perPage: itemsPerPage,
        total: totalCategories,
        totalPages: Math.ceil(totalCategories / itemsPerPage),
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
}
