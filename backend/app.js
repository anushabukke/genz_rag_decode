import express from "express";
import slangRouter from "./routes/slang.js";
import dotenv from "dotenv";
dotenv.config();

const app = express();
app.use(express.json());
app.use("/slang", slangRouter);

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
