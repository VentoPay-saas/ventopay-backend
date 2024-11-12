import Product from "../models/products.js";

export const createProduct = async (req, res) => {

  try {
    const productData = {
      name: req.body.name,
      description: req.body.description,
      min_qty: req.body.pricing.min_qty,
      max_qty: req.body.pricing.max_qty,
      tax: req.body.pricing.tax,
      interval_unit: req.body.pricing.interval_unit,
      active: req.body.additions.active,
      vegetarian: req.body.additions.vegetarian,
      nutrition_on: req.body.additions.nutrition_on,
      kcal: req.body.nutritional_value.kcal,
      carbs: req.body.nutritional_value.carbs,
      protein: req.body.nutritional_value.protein,
      fats: req.body.nutritional_value.fats,
      shop: req.body.organization.shop?._id,
      category: req.body.organization.category?._id,
      kitchen: req.body.organization.kitchen?._id,
      brand: req.body.organization.brand?._id,
      unit: req.body.organization.unit,
      sku: req.body.organization.sku,
      price: req.body.stock?.[0]?.price,
      quantity: req.body.stock?.[0]?.quantity,
      addons: req.body.stock?.[0]?.addons,
      images: req.body.media.images,
      values: req.body.values.map(value => ({
        addons: value.addons,
        sku: value.sku,
        quantity: value.quantity,
        price: value.price,
        tax: value.tax,
        total_price: value.total_price,
      }))
    };

    const product = new Product(productData);
    await product.save();
    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getProducts = async (req, res) => {
  try {
    const products = await Product.find()
      .populate("shop")
      .populate("category")
      .populate("kitchen")
      .populate("brand");
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getProductById = async () => {
  try {
    const product = await Product.findById(req.params._id)
      .populate("shop")
      .populate("category")
      .populate("kitchen")
      .populate("brand");

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
