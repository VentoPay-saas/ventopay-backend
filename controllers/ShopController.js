import Shop from "../models/ShopModel.js";

export const createShop = async (req, res) => {
  try {
    const {
      logo_img,
      background_img,
      status_note,
      status,
      open,
      phone,
      tags,
      order_payment,
      min_amount,
      tax,
      percentage,
      wifi_name,
      wifi_password,
      title,
      description,
      images,
      user_id,
      location,
    } = req.query;

    if (!title) {
      return res.status(400).json({ message: "Title is required" });
    }

    if (!user_id) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const newShop = new Shop({
      logo_img,
      background_img,
      status_note,
      status,
      open,
      phone,
      tags,
      order_payment,
      min_amount,
      tax,
      percentage,
      wifi_name,
      wifi_password,
      title,
      description,
      images,
      user_id,
      location,
    });
    const savedShop = await (
      await newShop.save()
    ).populate({
      path: "user_id",
    });

    const response = {
      ...savedShop.toObject(), // Convert Mongoose document to plain JS object
      seller: savedShop.user_id,
    };
    res
      .status(201)
      .json({ message: "Shop created successfully", data: response });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const updateShop = async (req, res) => {
  try {
    const shopId = req.params.shopId; // Get shop ID from route parameters
    const {
      logo_img,
      background_img,
      status_note,
      status,
      open,
      phone,
      tags,
      order_payment,
      min_amount,
      tax,
      percentage,
      wifi_name,
      wifi_password,
      title,
      description,
      images,
      user_id,
      location,
    } = req.query;

    if (!shopId) {
      return res
        .status(400)
        .json({ message: "shopId is required in the route parameters" });
    }

    // Update the shop document with the provided fields
    const updatedShop = await Shop.findByIdAndUpdate(
      shopId,
      {
        logo_img,
        background_img,
        status_note,
        status,
        open,
        phone,
        tags,
        order_payment,
        min_amount,
        tax,
        percentage,
        wifi_name,
        wifi_password,
        title,
        description,
        images,
        user_id,
        location,
      },
      { new: true }
    );

    if (!updatedShop) {
      return res.status(404).json({ message: "Shop not found" });
    }

    res
      .status(200)
      .json({ message: "Shop updated successfully", data: updatedShop });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const shopCloseDateUpdate = async (req, res) => {
  const { shopId } = req.params;
  try {
    const { dates: closed_dates } = req.body;
    if (!shopId) {
      return res
        .status(400)
        .json({ message: "shopId is required in query parameters" });
    }

    if (!Array.isArray(closed_dates) || closed_dates.length === 0) {
      return res
        .status(400)
        .json({ message: "closed_dates must be a non-empty array" });
    }

    const updatedShop = await Shop.findByIdAndUpdate(
      shopId,
      { closed_dates },
      { new: true }
    );

    if (!updatedShop) {
      return res.status(404).json({ message: "Shop not found" });
    }

    res
      .status(200)
      .json({
        message: "Shop closed_dates updated successfully",
        data: updatedShop,
      });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const shopWorkingDaysUpdate = async (req, res) => {
  try {
    const shopId = req.params.shopId; // Get shop ID from route parameters
    const { dates: working_days } = req.body; // Get dates payload from request body

    if (!shopId) {
      return res
        .status(400)
        .json({ message: "shopId is required in the route parameters" });
    }

    if (!Array.isArray(working_days) || working_days.length === 0) {
      return res
        .status(400)
        .json({ message: "working_days must be a non-empty array" });
    }

    const updatedShop = await Shop.findByIdAndUpdate(
      shopId,
      { working_days },
      { new: true }
    );

    if (!updatedShop) {
      return res.status(404).json({ message: "Shop not found" });
    }

    res
      .status(200)
      .json({
        message: "Shop working days updated successfully",
        data: updatedShop,
      });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getShopWorkingDates = async (req, res) => {
  try {
    const shopId = req.params.shopId; // Get shop ID from route parameters

    if (!shopId) {
      return res.status(400).json({ message: "shopId is required" });
    }

    // Find the shop by ID and select only the working_days field
    const shop = await Shop.findById(shopId).select("working_days");

    if (!shop) {
      return res.status(404).json({ message: "Shop not found" });
    }

    res
      .status(200)
      .json({
        message: "Shop working days fetched successfully",
        working_days: shop.working_days,
      });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getTheShopClosedDates = async (req, res) => {
  try {
    const shopId = req.params.shopId; // Get shop ID from route parameters

    if (!shopId) {
      return res.status(400).json({ message: "shopId is required" });
    }

    const shop = await Shop.findById(shopId).select("closed_dates");

    if (!shop) {
      return res.status(404).json({ message: "Shop not found" });
    }

    res.status(200).json({ message: "Shop fetched successfully", data: shop });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getShops = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const perPage = parseInt(req.query.perPage) || 10;
    const status = req.query.status
    const search = req.query.search
    if (page < 1 || perPage < 1) {
      return res
        .status(400)
        .json({ message: "Page and perPage must be positive integers" });
    }
    let filter = {};
    if (status) {
      filter.status = status
    }
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        // { description: { $regex: search, $options: "i" } },
      ];
    }

    const shops = await Shop.find(filter)
      .skip((page - 1) * perPage)
      .limit(perPage)
      .sort({ createdAt: -1 })
      .populate("user_id")
      .lean();
    const totalShops = await Shop.countDocuments();

    const meta = {
      total: totalShops,
      current_page: page,
      per_page: perPage,
      total_pages: Math.ceil(totalShops / perPage),
    };

    res.status(200).json({
      message: "Shops fetched successfully",
      data: {
        shops,
        meta,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const VerifyShop = async (req, res) => {
  try {
    const { id } = req.params;
    const shop = await Shop.findById(id);
    if (!shop) {
      return res.status(404).json({ message: "Shop not found" });
    }

    shop.verify = shop.verify === true ? false : true;

    await shop.save();

    res.status(200).json({
      message: `Shop status changed to ${shop.status ? "verified" : "unverified"
        }`,
      data: shop,
    });
  } catch (error) {
    console.log("🚀 ~ VerifyShop ~ error:", error)
    if (error.kind === "ObjectId") {
      return res.status(400).json({ message: "Invalid shop ID format" });
    }
    res.status(500).json({ message: "Server error", error: error.message });
  }
};



export const getAllShops = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const perPage = parseInt(req.query.perPage) || 10;
    const searchQuery = req.query.search || "";

    if (page < 1 || perPage < 1) {
      return res
        .status(400)
        .json({ message: "Page and perPage must be positive integers" });
    }

    const searchFilter = searchQuery
      ? {
        $or: [
          { title: { $regex: searchQuery, $options: "i" } },
          { description: { $regex: searchQuery, $options: "i" } },
          { tags: { $regex: searchQuery, $options: "i" } },
          { phone: { $regex: searchQuery, $options: "i" } },
        ],
      }
      : {};

    const data = await Shop.find(searchFilter)
      .skip((page - 1) * perPage)
      .limit(perPage)
      .sort({ createdAt: -1 })
      .populate("user_id")
      .lean();


    const totalShops = await Shop.countDocuments(searchFilter);
    const meta = {
      total: totalShops,
      current_page: page,
      per_page: perPage,
      total_pages: Math.ceil(totalShops / perPage),
    };

    res.status(200).json({
      message: "Shops fetched successfully",
      data: {
        data,
        meta,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getShopById = async (req, res) => {
  try {
    const shopId = req.params.id;
    if (!shopId) {
      return res.status(400).json({ message: "shopId is required" });
    }

    const shop = await Shop.findById(shopId).populate("user_id").lean();
    if (!shop) {
      return res.status(404).json({ message: "Shop not found" });
    }

    res.status(200).json({ message: "Shop fetched successfully", data: shop });
  }
  catch (error) {
    res.status(500).json({ error: error.message });
  }
}



export const getAllShopsSearch = async (req, res) => {
  try {
    const { page = 1, status } = req.query;
    const pageNumber = parseInt(page, 10) || 1;
    const pageSize = 10;
    if (!status) {
      return res.status(400).json({ error: "Status is required" });
    }
    const shops = await Shop.find({ status })
      .skip((pageNumber - 1) * pageSize)
      .limit(pageSize);
    const totalShops = await Shop.countDocuments({ status });

    res.json({
      success: true,
      data: shops,
      page: pageNumber,
      total: totalShops,
      pages: Math.ceil(totalShops / pageSize),
    });

  } catch (error) {
    console.error("Error fetching shops:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

