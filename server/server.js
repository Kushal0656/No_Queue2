import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";

import shopRoutes from "./routes/shopRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import queueRoutes from "./routes/queueRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";

dotenv.config();

const app = express();



/* Middleware */

app.use(cors());
app.use(express.json());



/* MongoDB Connection */

mongoose.connect(process.env.MONGO_URI)
.then(() => {

  console.log("MongoDB Connected");

})
.catch((err) => {

  console.log("MongoDB Error:", err);

});



/* Routes */
app.use("/api/auth", authRoutes);
app.use("/api/queue", queueRoutes);
app.use("/api/review", reviewRoutes);
app.use("/api", shopRoutes);



app.get("/", (req, res) => {

  res.send("NoQueue API Running");

});



/* Start Server */

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {

  console.log(`Server running on port ${PORT}`);

});