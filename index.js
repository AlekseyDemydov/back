import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import helmet from "helmet";
import multer from "multer";
import dotenv from "dotenv";
import fs from "fs";
// import path from "path";

// Імпортуємо моделі користувачів, продуктів і замовлень
import { User, Product, Feedback } from "./models/index.js";

// Імпортуємо контролери для роботи з роутами
import {
  createFeedback,
  getAllFeedbacks,
  deleteFeedback,
  createProduct,
  getAllProducts,
  getOneProduct,
  deleteProduct,
  updateProduct,
  getMe,
  createUser,
} from "./controllers/index.js";

// Налаштовуємо змінні середовища
dotenv.config();

// Підключаємось до бази даних MongoDB
// mongoose.connect("mongodb+srv://ADministartor:jpUnrAK80ITx0A30@clusterelf.n3cs9ie.mongodb.net/ElfBar?retryWrites=true&w=majority")
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("DB connected"))
  .catch((err) => console.error("DB connection error", err));

// Створюємо екземпляр додатку Express
const app = express();
const allowedOrigin = process.env.FRONTEND_URL || "https://elfbarr-64fed43ca1d5.herokuapp.com";

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", allowedOrigin);
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

// Використовуємо middlewares для Express
app.use(cors({
  origin: allowedOrigin,
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}));
app.use(express.json());
app.use(helmet());
app.use("/uploads", (req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", allowedOrigin);
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
}, express.static("uploads"));

// Перевірка і створення папки для завантажень
const uploadPath = 'uploads';
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath);
}

// Налаштовуємо сховище для завантажуваних файлів за допомогою multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

// Маршрут для завантаження файлів
app.post("/upload", upload.single("image"), (req, res) => {
  res.json({
    url: `/uploads/${req.file.originalname}`,
  });
});

// Додаємо моделі до контексту додатку Express
app.set('UserModel', User);
app.set('ProductModel', Product);
app.set('FeedbackModel', Feedback);

// Маршрути для користувачів
app.get("/me", getMe);
app.post("/me", createUser);

// Маршрути для продуктів
app.get("/products", getAllProducts);
app.get("/products/:id", getOneProduct);
app.post("/products", createProduct);
app.delete("/products/:id", deleteProduct);
app.put("/products/:id", updateProduct);

// Маршрути для відгуків
app.get("/feedback", getAllFeedbacks);
app.post("/feedback", createFeedback);
app.delete("/feedback/:id", deleteFeedback);

// Маршрут, що викликається, якщо запит не знайдено
app.use((req, res, next) => {
  res.status(404).json({ message: "Not Found" });
});

// Middleware для обробки помилок
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Internal Server Error" });
});

// Порт, на якому запускається сервер
const PORT = process.env.PORT || 4444;

// Прослуховуємо порт та виводимо повідомлення про запуск сервера
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
