import Addons from "../models/products.js";
import Shop from "../models/ShopModel.js";
import { getDateRange } from "../utils/GetTimeFn.js";

export const create_Product_addons = async (req, res) => {
  try {
    const {
      tax,
      min_qty,
      max_qty,
      active,
      interval,
      shop_id,
      unit_id,
      addon,
      title,
      description,
      discount,
    } = req.query;
    if (!title) {
      return res.status(400).json({ message: "Title is required" });
    }
    // if (!price) {
    //   return res.status(400).json({ message: "Price is required" });
    // }
    if (!shop_id) {
      return res.status(400).json({ message: "Shop ID is required" });
    }
    if (!unit_id) {
      return res.status(400).json({ message: "Unit ID is required" });
    }

    const newAddon = new Addons(req.query);

    const savedAddons = await newAddon.save();

    res.status(201).json({
      message: "Product created successfully",
      data: savedAddons,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

export const addProductStocks = async (req, res) => {
  try {
    const addonId = req.params.addonId;
    const { extras } = req.body;

    if (!addonId) {
      return res
        .status(400)
        .json({ message: "Addon ID is required in the route parameters" });
    }

    if (!Array.isArray(extras) || extras.length === 0) {
      return res
        .status(400)
        .json({ message: "Extras must be a non-empty array" });
    }

    for (const extra of extras) {
      if (typeof extra.price !== "number" || extra.price < 0) {
        return res
          .status(400)
          .json({ message: "Each extra must have a valid price (>= 0)" });
      }
      if (typeof extra.quantity !== "number" || extra.quantity < 1) {
        return res
          .status(400)
          .json({ message: "Each extra must have a valid quantity (>= 1)" });
      }
      if (!extra.sku || typeof extra.sku !== "string") {
        return res
          .status(400)
          .json({ message: "Each extra must have a valid SKU (string)" });
      }
    }

    const addons = await Addons.findById(addonId);

    if (!addons) {
      return res.status(404).json({ message: "addons not found" });
    }

    addons.stocks = addons.stocks || [];
    addons.stocks.push(...extras);

    const updatedAddons = await addons.save();

    res.status(201).json({
      message: "Product stocks added successfully",
      data: updatedAddons,
    });
  } catch (error) {
    console.error("Error in addProductStocks:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getProductStockById = async (req, res) => {
  try {
    const addonId = req.params.addonId;
    if (!addonId) {
      return res.status(400).json({ message: "Addon ID is required" });
    }
    const Addon = await Addons.findById(addonId)
      .populate("shop_id")
      .populate("unit_id")
      .populate('extras')
      .populate('category_id')
      .populate('brand_id')
      .lean();

    if (!Addon) {
      return res.status(404).json({ message: "Addon not found" });
    }
    return res.status(200).json({
      message: "Addon fetched successfully",
      data: Addon,
    });
  } catch (error) {
    console.error("Error in getProductById:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getPaginatedProducts_addons = async (req, res) => {
  try {
    const addon = req.query.addon;
    const page = parseInt(req.query.page) || 1;
    const perPage = parseInt(req.query.perPage) || 10;
    if (page < 1 || perPage < 1) {
      return res
        .status(400)
        .json({ message: "Page and perPage must be positive integers" });
    }

    const filter = {};
    if (addon !== undefined) {
      filter.addon = addon;
    }

    const addons = await Addons.find(filter)
      .skip((page - 1) * perPage)
      .limit(perPage)
      .sort({ createdAt: -1 })
      .populate("shop_id")
      .populate("unit_id")
      .populate('extras')
      .populate('category_id')
      .populate('brand_id')
      .lean();

    const totalAddons = await Addons.countDocuments(filter);
    const meta = {
      total: totalAddons,
      current_page: page,
      per_page: perPage,
      total_pages: Math.ceil(totalAddons / perPage),
    };

    res.status(200).json({
      message: "addons fetched successfully",
      data: {
        data: addons,
        meta,
      },
    });
  } catch (error) {
    console.error("Error in getPaginatedAddons:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const deleteProductById = async (req, res) => {
  try {
    const addonId = req.query.ids[0];
    if (!addonId) {
      return res
        .status(400)
        .json({ message: "addons ID is required in query parameters" });
    }

    const deletedAddons = await Addons.findByIdAndDelete(addonId);

    if (!deletedAddons) {
      return res.status(404).json({ message: "addons not found" });
    }

    res.status(200).json({
      message: "addons deleted successfully",
      data: deletedAddons,
    });
  } catch (error) {
    console.error("Error in deleteAddonsById:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


export const toggleProduct_StockActiveStatus = async (req, res) => {
  try {
    const addonId = req.params.addonId;
    if (!addonId) {
      return res.status(400).json({ message: "Addon ID is required in the route" });
    }

    const addon = await Addons.findById(addonId);

    if (!addon) {
      return res.status(404).json({ message: "Addon not found" });
    }

    addon.active = !addon.active;

    await addon.save();

    res.status(200).json({
      message: `addon active status changed to ${addon.active ? "active" : "inactive"}`,
      data: addon,
    });
  } catch (error) {
    console.error("Error in toggleAddonActiveStatus:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const changeProductStatus = async (req, res) => {
  try {
    const addonId = req.params.addonId;
    const { status } = req.query;

    if (!addonId || addonId === "undefined") {
      return res.status(400).json({ message: "Valid Addon ID is required in the route" });
    }
    const validStatuses = ["published", "unpublished", "pending"];
    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({ message: `Invalid status. Valid statuses are: ${validStatuses.join(", ")}` });
    }

    const addon = await Addons.findById(addonId);

    if (!addon) {
      return res.status(404).json({ message: "Addon not found" });
    }

    addon.status = status;

    await addon.save();

    res.status(200).json({
      message: `addon status changed to ${status}`,
      data: addon,
    });
  } catch (error) {
    console.error("Error in changeAddonStatus:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


export const addExtras = async (req, res) => {
  try {
    const { id } = req.params;
    const { extras } = req.body;
    if (!Array.isArray(extras) || extras.length === 0) {
      return res.status(400).json({ message: 'Extras must be a non-empty array of IDs.' });
    }

    const product = await Addons.findByIdAndUpdate(
      id,
      { $addToSet: { extras: { $each: extras } } },
      { new: true }
    );

    if (!product) {
      return res.status(404).json({ message: 'Product not found.' });
    }

    return res.status(200).json({
      message: 'Extras added successfully.',
      product,
    });
  } catch (error) {
    console.error('Error adding extras:', error);
    return res.status(500).json({
      message: 'Internal server error.',
      error: error.message,
    });
  }
}



export const getTheRestProducts = async (req, res) => {
  try {
    const { page = 1, perPage = 12, addon, active } = req.query;

    const limit = parseInt(perPage, 10);
    const skip = (parseInt(page, 10) - 1) * limit;
    const currentPage = parseInt(page, 10);

    const query = {};
    if (addon !== undefined) query.addon = addon;
    if (active !== undefined) query.active = active;

    const products = await Addons.find(query)
      .skip(skip)
      .limit(limit)
      .populate("shop_id")
      .populate("unit_id")
      .populate('extras')
      .populate('category_id')
      .populate('brand_id')
      .lean();

    const total = await Addons.countDocuments(query);
    const lastPage = Math.ceil(total / limit);

    const basePath = `${req.protocol}://${req.get('host')}${req.originalUrl.split('?')[0]}`;
    const queryParams = new URLSearchParams(req.query);
    queryParams.set('page', currentPage - 1);
    const prevUrl = currentPage > 1 ? `${basePath}?${queryParams.toString()}` : null;
    queryParams.set('page', currentPage + 1);
    const nextUrl = currentPage < lastPage ? `${basePath}?${queryParams.toString()}` : null;
    const meta = {
      current_page: currentPage,
      from: skip + 1,
      last_page: lastPage,
      links: [
        {
          url: prevUrl,
          label: '&laquo; Previous',
          active: false,
        },
        ...Array.from({ length: lastPage }, (_, i) => ({
          url: `${basePath}?${new URLSearchParams({ ...req.query, page: i + 1 }).toString()}`,
          label: (i + 1).toString(),
          active: currentPage === i + 1,
        })),
        {
          url: nextUrl,
          label: 'Next &raquo;',
          active: false,
        },
      ],
      path: basePath,
      per_page: perPage.toString(),
      to: Math.min(skip + limit, total),
      total,
    };
    res.status(200).json({
      message: 'Products fetched successfully.',
      data: products,
      meta
    });
  } catch (error) {
    console.error('Error fetching paginated products:', error);
    res.status(500).json({
      message: 'Internal server error.',
      error: error.message,
    });
  }
}


// export const calculateProducts = async (req, res) => {
//   try {
//     const { lang, ...queryWithoutLang } = req.query;
//     console.log("🚀 ~ calculateProducts ~ queryWithoutLang:", queryWithoutLang)

//     const { products, currency_id, shop_id } = queryWithoutLang;

//     if (!currency_id) {
//       return res.status(400).json({ message: "Currency ID is required" });
//     }

//     if (!shop_id) {
//       return res.status(400).json({ message: "Shop ID is required" });
//     }
//     const productsData = [];
//     Object.keys(queryWithoutLang).forEach((key) => {
//       const productMatch = key.match(/^products\[(\d+)\]\[(.+)\]$/);
//       if (productMatch) {
//         const index = parseInt(productMatch[1], 10);
//         const field = productMatch[2];
//         productsData[index] = productsData[index] || {};
//         productsData[index][field] = queryWithoutLang[key];
//       }
//     });
//     console.log("🚀 ~ calculateProducts ~ productsData:", productsData)



//     if (!Array.isArray(productsData) || productsData.length === 0) {
//       return res.status(400).json({ message: "At least one product is required in the query." });
//     }

//     let totalPrice = 0;
//     let totalTax = 0;
//     let totalDiscount = 0;
//     const stocks = [];

//     for (const product of products) {
//       const { stock_id, quantity } = product;
//       console.log("🚀 ~ calculateProducts ~ stock_id, quantity:", stock_id, quantity)

//       if (!stock_id) {
//         return res.status(400).json({ message: "Each product must include a valid stock_id." });
//       }

//       if (!quantity || quantity < 1) {
//         return res.status(400).json({ message: "Each product must have a valid quantity (>= 1)." });
//       }
//       const productData = await Addons.findById({
//         'stocks._id': stock_id
//       }).lean();
//       console.log("🚀 ~ calculateProducts ~ productData:", productData)

//       if (!productData) {
//         return res.status(404).json({ message: `Product with stock_id ${stock_id} not found.` });
//       }

//       const productPrice = productData.price * quantity;
//       const productTax = (productData.tax || 0) * quantity;
//       const productDiscount = (productData.discount || 0) * quantity;

//       totalPrice += productPrice;
//       totalTax += productTax;
//       totalDiscount += productDiscount;

//       stocks.push({
//         stock_id,
//         quantity: Number(quantity),
//         price: productPrice,
//         tax: productTax,
//         discount: productDiscount,
//       });
//     }

//     const shopData = await Shop.findById(shop_id);

//     if (!shopData) {
//       return res.status(404).json({ message: `Shop with ID ${shop_id} not found.` });
//     }

//     const response = {
//       timestamp: new Date().toISOString(),
//       status: true,
//       message: "Success",
//       data: {
//         status: true,
//         code: "NO_ERROR",
//         data: {
//           stocks,
//           total_tax: totalTax,
//           price: totalPrice,
//           total_shop_tax: shopData.tax || 0,
//           total_price: totalPrice - totalDiscount + totalTax,
//           total_discount: totalDiscount,
//           delivery_fee: 0,
//           rate: 1,
//           coupon_price: 0,
//           shop: shopData,
//           coupon: null,
//           tips: 0,
//           service_fee: shopData.service_fee || 1,
//         },
//       },
//     };

//     return res.status(200).json(response);
//   } catch (error) {
//     console.error("Error calculating products:", error);
//     return res.status(500).json({
//       timestamp: new Date().toISOString(),
//       status: false,
//       message: "Server error",
//       error: error.message,
//     });
//   }
// };

export const calculateProducts = async (req, res) => {
  try {
    const { lang, ...queryWithoutLang } = req.query;
    const { products, currency_id, shop_id } = queryWithoutLang;

    if (!currency_id) {
      return res.status(400).json({ message: "Currency ID is required" });
    }

    if (!shop_id) {
      return res.status(400).json({ message: "Shop ID is required" });
    }

    if (!Array.isArray(products) || products.length === 0) {
      return res.status(400).json({ message: "At least one product is required in the query." });
    }

    let totalPrice = 0;
    let totalTax = 0;
    let totalDiscount = 0;
    const stocks = [];

    for (const product of products) {
      const { stock_id, quantity } = product;

      if (!stock_id) {
        return res.status(400).json({ message: "Each product must include a valid stock_id." });
      }

      if (!quantity || quantity < 1) {
        return res.status(400).json({ message: "Each product must have a valid quantity (>= 1)." });
      }

      const productData = await Addons.findOne({
        'stocks._id': stock_id
      }).lean();

      if (!productData) {
        return res.status(404).json({ message: `Product with stock_id ${stock_id} not found.` });
      }
      let prPrice = productData.stocks.reduce((sum, item) => sum + item.price, 0);

      const productPrice = prPrice * quantity;
      const productTax = (productData.tax || 0) * quantity;
      const productDiscount = (productData.discount || 0) * quantity;

      totalPrice += productPrice;
      totalTax += productTax;
      totalDiscount += productDiscount;

      stocks.push({
        stock_id,
        quantity: Number(quantity),
        price: productPrice,
        tax: productTax,
        discount: productDiscount,
      });
    }

    // Fetch the shop data
    const shopData = await Shop.findById(shop_id);

    if (!shopData) {
      return res.status(404).json({ message: `Shop with ID ${shop_id} not found.` });
    }

    // Prepare the response object
    const response = {
      timestamp: new Date().toISOString(),
      status: true,
      message: "Success",
      data: {
        status: true,
        code: "NO_ERROR",
        data: {
          stocks,
          total_tax: totalTax,
          price: totalPrice,
          total_shop_tax: shopData.tax || 0,
          total_price: totalPrice - totalDiscount + totalTax,
          total_discount: totalDiscount,
          delivery_fee: 0,
          rate: 1,
          coupon_price: 0,
          shop: shopData,
          coupon: null,
          tips: 0,
          service_fee: shopData.service_fee || 1,
        },
      },
    };

    return res.status(200).json(response);
  } catch (error) {
    console.error("Error calculating products:", error);
    return res.status(500).json({
      timestamp: new Date().toISOString(),
      status: false,
      message: "Server error",
      error: error.message,
    });
  }
};


export const getProductsStatistics = async (req, res) => {
  try {
    const { time, perPage, page } = req.query;
    const { startDate, endDate } = getDateRange(time);
    const limit = perPage ? parseInt(perPage) : 5;
    const skip = page ? (parseInt(page) - 1) * limit : 0;

    // Get total count of documents
    const totalCount = await Addons.countDocuments({
      createdAt: { $gte: startDate, $lte: endDate }
    });

    // Fetch paginated addons
    const addons = await Addons.find({
      createdAt: { $gte: startDate, $lte: endDate }
    })
      .limit(limit)
      .skip(skip)
      .sort({ createdAt: -1 });

    const totalPages = Math.ceil(totalCount / limit);
    const currentPage = parseInt(page) || 1;

    res.json({
      data: {
        current_page: currentPage,
        data: addons.map(addon => ({
          title: addon.title,
          id: addon._id,
          img: addon?.images[0]?.url,
          count: addon.count,
        })),
        first_page_url: `${req.protocol}://${req.get("host")}${req.originalUrl.split("?")[0]}?page=1`,
        from: skip + 1,
        next_page_url: currentPage < totalPages ? `${req.protocol}://${req.get("host")}${req.originalUrl.split("?")[0]}?page=${currentPage + 1}` : null,
        path: `${req.protocol}://${req.get("host")}${req.originalUrl.split("?")[0]}`,
        per_page: perPage,
        prev_page_url: currentPage > 1 ? `${req.protocol}://${req.get("host")}${req.originalUrl.split("?")[0]}?page=${currentPage - 1}` : null,
        to: skip + addons.length
      }

    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}
