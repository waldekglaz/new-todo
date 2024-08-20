import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import TodoRoutes from "./routes/todo.route.js";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("Welcome to my app 🚀");
});
app.use("/api/todos", TodoRoutes);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Connected to MongoDB 🚀");
    app.listen(process.env.PORT, () => {
      console.log(`Server is running on port ${process.env.PORT}`);
    });
  })
  .catch((error) => {
    console.error(`Error connecting to MongoDB: ${error.message}`);
  });
