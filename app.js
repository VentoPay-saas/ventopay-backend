import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import bodyParser from "body-parser";
import morgan from "morgan";
import connectDB from "./config/db.js";
import authRoutes from "./routes/userRoutes.js";
import orderRoutes from "./routes/OrderRoutes.js";
import brandRoutes from "./routes/Brand.js";
import unitRoutes from "./routes/UnitRoutes.js";
import subscriptionRoutes from "./routes/SubscriptionRoutes.js";
import currenciesRoutes from "./routes/CurrenciesRoute.js";
import galleries from "./routes/Galleries.js";
import languagesRoute from "./routes/languageRoute.js";
import shopTagRoutes from "./routes/ShopTagRoutes.js";
import shopRoutes from "./routes/ShopRoutes.js";
import bannerRoutes from "./routes/Banner.js";
import productRoutes from "./routes/productRoutes.js";
import categoryRoutes from "./routes/CategoriesRoute.js";
import clientRouter from "./routes/ClientRoute.js";
import extraGroupRouter from "./routes/ExtraGroup.js";
import restProductsRoutes from "./routes/RestProducts.js";
import PaymentRoutes from "./routes/PaymentRoutes.js";
import paymentRestRoutes from "./routes/PaymentRestRoutes.js";
import paymentPayloadRoutes from "./routes/Payment_payload.js";
import ExtraGroupValueRoutes from "./routes/ExtraGroupValueRoute.js";
import SettingsRoutes from "./routes/SettingsRoute.js";
import userRoutes from "./routes/user.js";
import languagesRestRoutes from "./routes/LanguagesRestRoutes.js";
import rolesRoutes from "./routes/RolesRoute.js";
import sms_payloadRoutes from "./routes/smsPayloadRoutes.js";
import email_provider_Routes from "./routes/EmailProvider.js";
dotenv.config();

const app = express();
const port = process.env.PORT || 5000;
connectDB();
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use("/api/v1/dashboard/admin", authRoutes);
app.use("/api/v1/dashboard/admin", currenciesRoutes);
app.use("/api/v1/orders", orderRoutes);
app.use("/api/v1/rest", paymentRestRoutes);
app.use("/api/v1/rest", languagesRestRoutes);
app.use("/api/v1/dashboard/admin", brandRoutes);
app.use("/api/v1/dashboard/admin", unitRoutes);
app.use("/api/v1/dashboard/admin", subscriptionRoutes);
app.use("/api/v1/dashboard", galleries);
app.use("/api/v1/dashboard/admin", languagesRoute);
app.use("/api/v1/dashboard/admin", shopTagRoutes);
app.use("/api/v1/dashboard/admin", shopRoutes);
app.use("/api/v1/dashboard/admin", bannerRoutes);
app.use("/api/v1/dashboard/admin", productRoutes);
app.use("/api/v1/dashboard/admin", categoryRoutes);
app.use("/api/v1/dashboard/admin", clientRouter);
app.use("/api/v1/dashboard/admin", extraGroupRouter);
app.use("/api/v1/rest/products", restProductsRoutes);
app.use("/api/v1/dashboard/admin", PaymentRoutes);
app.use("/api/v1/dashboard/admin", paymentPayloadRoutes);
app.use("/api/v1/dashboard/admin", ExtraGroupValueRoutes);
app.use("/api/v1/dashboard/admin", SettingsRoutes);
app.use("/api/v1/dashboard/admin", rolesRoutes);
app.use("/api/v1/dashboard/admin", sms_payloadRoutes);
app.use("/api/v1/dashboard/admin", email_provider_Routes);
app.use("/api/v1/dashboard/user", userRoutes);

app.get("/", (req, res) => {
  res.send("Welcome to the Express Server!");
});

app.use((req, res, next) => {
  res.status(404).send({ message: "Resource not found" });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send({ message: "Internal Server Error" });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
