import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import bodyParser from "body-parser";
import morgan from "morgan";
import connectDB from "./config/db.js";
import authRoutes from "./routes/userRoutes.js";
import productsRoutes from "./routes/productRoutes.js";
import orderRoutes from "./routes/OrderRoutes.js";
import brandRoutes from "./routes/Brand.js";
import unitRoutes from "./routes/UnitRoutes.js";
import subscriptionRoutes from "./routes/SubscriptionRoutes.js";
import currenciesRoutes from "./routes/CurrenciesRoute.js";
import galleries from "./routes/Galleries.js";
import clientRouter from "./routes/ClientRoute.js";
dotenv.config();

const app = express();
const port = process.env.PORT || 5000;
connectDB();
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/dashboard/admin", currenciesRoutes);
app.use("/api/v1/rest/", productsRoutes);
app.use("/api/v1/rest", orderRoutes);
app.use("/brands", brandRoutes);
app.use("/api/v1/dashboard/admin", unitRoutes);
app.use("/api/v1/dashboard/admin", subscriptionRoutes);
app.use("/api/v1/dashboard", galleries);
app.use("/api/v1/dashboard/admin", clientRouter);

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
