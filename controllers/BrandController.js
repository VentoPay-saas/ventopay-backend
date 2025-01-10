import Brand from "../models/Brand.js";

export const createBrand = async (req, res) => {
  try {
    const { title, active = true, ...queryImages } = req.query;
    console.log(queryImages.images[0].uid);

    if (!title || !queryImages.images[0].uid) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const images = [];

    images.push({
      uid: queryImages.images[0].uid,
      name: queryImages.images[0].name,
      status: queryImages.images[0].status,
      url: queryImages.images[0].url,
      created: queryImages.images[0].created === "true",
    });

    const brand = new Brand({
      title,
      active: active === "1" || active === "true",
      status: "published",
      images,
    });

    await brand.save();

    res
      .status(201)
      .json({ message: "Brand created successfully", data: brand });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

export const getPaginateBrands = async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;

    const pageNumber = parseInt(page, 10);
    const pageSize = parseInt(limit, 10);

    let filter = {};
    if (status) {
      filter.status = status;
    }
    const brands = await Brand.find(filter)
      .skip((pageNumber - 1) * pageSize)
      .limit(pageSize)
      .exec();

    const total = await Brand.countDocuments(filter);

    res.status(200).json({
      message: "Brands fetched successfully",
      data: brands,
      meta: {
        total,
        page: pageNumber,
        pages: Math.ceil(total / pageSize),
        limit: pageSize,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

export const deleteBrand = async (req, res) => {
  try {
    const ids = req.query.ids[0];

    if (!ids) {
      return res
        .status(400)
        .json({ error: "Invalid or missing ID  in query parameters" });
    }

    const result = await Brand.findByIdAndDelete({ _id: ids });

    res.status(200).json({
      message: "Brands deleted successfully",
      deletedCount: result.deletedCount,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

export const getBrandById = async (req, res) => {
  try {
    const { id } = req.params;

    const brand = await Brand.findById(id);

    if (!brand) {
      return res.status(404).json({ error: 'Brand not found' });
    }

    res.status(200).json({
      message: 'Brand fetched successfully',
      data: brand,
    });
  } catch (error) {
    console.error(error);
    if (error.name === 'CastError' && error.kind === 'ObjectId') {
      return res.status(400).json({ error: 'Invalid brand ID' });
    }

    res.status(500).json({ error: 'Server error' });
  }
}

export const updateBrand = async (req, res) => {
  try {
    const { id } = req.params;

    const { title, active, ...rest } = req.query;

    let images = [];
    images.push({
      uid: rest.images[0].uid,
      name: rest.images[0].name,
      status: rest.images[0].status,
      url: rest.images[0].url,
      created: rest.images[0].created === "true",

    })
    const updateData = {};
    if (title) updateData.title = title;
    if (active !== undefined) updateData.active = Boolean(parseInt(active, 10));
    if (images.length > 0) updateData.images = images;
    const updatedBrand = await Brand.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!updatedBrand) {
      return res.status(404).json({ error: 'Brand not found' });
    }

    res.status(200).json({
      message: 'Brand updated successfully',
      data: updatedBrand,
    });
  } catch (error) {
    console.error(error);
    if (error.name === 'CastError' && error.kind === 'ObjectId') {
      return res.status(400).json({ error: 'Invalid brand ID' });
    }

    res.status(500).json({ error: 'Server error' });
  }
}