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
    const { page = 1, perPage = 10, type, status, search } = req.query;

    const pageNumber = parseInt(page, 10);
    const itemsPerPage = parseInt(perPage, 10);

    const filter = {};
    if (type) filter.type = type;
    if (status) {
      filter.status = status
    }
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        // { description: { $regex: search, $options: "i" } },
      ];
    }
    const categories = await Category.find(filter)
      .skip((pageNumber - 1) * itemsPerPage)
      .limit(itemsPerPage)
      .populate("shop_id parent_id")

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

export const updateCategoryStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ error: "Status is required." });
    }
    const updatedCategory = await Category.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!updatedCategory) {
      return res.status(404).json({ error: "Category not found." });
    }

    res.status(200).json({
      message: "Category status updated successfully",
      data: updatedCategory,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

export const toggleCategoryActive = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await Category.findById(id);

    if (!category) {
      return res.status(404).json({ error: "Category not found." });
    }
    category.active = !category.active;

    const updatedCategory = await category.save();

    res.status(200).json({
      message: `Category active state toggled successfully. Now active: ${category.active}`,
      data: updatedCategory,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};


export const deleteCategories = async (req, res) => {
  try {
    const id = req.query.ids[0];

    if (!id) {
      return res.status(400).json({
        error: "Invalid input. 'ids' must be an array of category IDs.",
      });
    }
    const deletedCategories = await Category.findByIdAndDelete({
      _id: id,
    });

    if (deletedCategories.deletedCount === 0) {
      return res.status(404).json({
        message: "No categories found to delete.",
      });
    }

    res.status(200).json({
      message: "Categories deleted successfully",
      data: { deletedCount: deletedCategories.deletedCount },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

export const getPaginatedCategoriesWithFilters = async (req, res) => {
  try {
    const { perPage = 10, type, shop_id, statuses, active, search } = req.query;

    const pageNumber = parseInt(req.query.page || 1, 10);
    const itemsPerPage = parseInt(perPage, 10);
    const filter = {};
    if (type) filter.type = type;
    if (shop_id) filter.shop_id = shop_id;
    if (statuses) filter.status = { $in: statuses };
    if (active !== undefined) filter.active = active === "1";
    if (search) filter.title = { $regex: search, $options: "i" };

    const categories = await Category.find(filter)
      .populate("parent_id shop_id")
      .skip((pageNumber - 1) * itemsPerPage)
      .limit(itemsPerPage);

    const totalCategories = await Category.countDocuments(filter);

    // Prepare and return the response
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
};




export const getCategoryById = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await Category.findById(id);

    if (!category) {
      return res.status(404).json({ error: "Category not found." });
    }

    res.status(200).json({
      message: "Category fetched successfully",
      data: category,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};


export const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, parent_id, keywords, active, type, ...images } = req.query;

    if (!title || !description || !keywords || !type) {
      return res.status(400).json({
        error: "Invalid input data. Ensure title, description, keywords, and type are provided.",
      });
    }
    const imagesArr = [];
    imagesArr.push({
      uid: images.images[0].uid,
      name: images.images[0].name,
      status: images.images[0].status,
      url: images.images[0].url,
      created: images.images[0].created === "true",
    });

    const updatedCategory = await Category.findByIdAndUpdate(
      id,
      {
        title,
        description,
        parent_id: parent_id || null,
        keywords,
        images: imagesArr,
        active: active !== undefined ? Boolean(active) : undefined,
        type,
      },
      { new: true, runValidators: true } // Return the updated document
    );

    if (!updatedCategory) {
      return res.status(404).json({ error: "Category not found." });
    }

    res.status(200).json({
      message: "Category updated successfully",
      data: updatedCategory,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};



