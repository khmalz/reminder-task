import "dotenv/config";
import express from "express";
import AuthRouter from "./controllers/auth.controller";
import TaskRouter from "./controllers/task.controller";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use("/auth", AuthRouter);
app.use("/tasks", TaskRouter);

app.get("/", (req, res) => {
   res.status(200).json({ message: "Selamat datang di Express API (TypeScript)!" });
});

app.listen(PORT, () => {
   console.log(`🚀 Server berjalan di http://localhost:${PORT}`);
});
