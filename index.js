import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import helmet from "helmet";
import multer from "multer";

// Імпортуємо моделі користувачів, продуктів і замовлень
import { User, Product, Feedback } from "./models/index.js";

// Імпортуємо контролери для роботи з роутами
import {
  createFeedback,
  getAllFeedbacks,
  deleteFeedback,
  getMyProfile,
  updateMyProfile,
  register,
  login,
  createProduct,
  getAllProducts,
  getOneProduct,
  deleteProduct,
  updateProduct,
  getMe,
} from "./controllers/index.js";

// Імпортуємо функцію перевірки автентифікації
import checkAuth from "./utils/checkAuth.js";
// "mongodb+srv://DemFam:demfam@cluster0.ldq86j4.mongodb.net/ElfBar?retryWrites=true&w=majority"
// "mongodb+srv://DemFam:demfam@cluster0.olmmyzl.mongodb.net/ElfBar?retryWrites=true&w=majority
// Підключаємось до бази даних MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log("DB connected"))
  .catch((err) => console.error("DB connection error", err));

// Створюємо екземпляр додатку Express
const app = express();
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

// Використовуємо middlewares для Express
app.use(cors()); // Для дозволу CORS
app.use(express.json()); // Для роботи з JSON даними
app.use(helmet()); // Для підвищення безпеки
app.use("/uploads", express.static("uploads"));

// Налаштовуємо сховище для завантажуваних файлів за допомогою multer
const storage = multer.diskStorage({
  destination: (_, __, cb) => {
    cb(null, "uploads");
  },
  filename: (_, file, cb) => {
    cb(null, file.originalname);
  },
});

// Налаштовуємо multer з нашою конфігурацією сховища
const upload = multer({ storage });

// Надаємо доступ до статичних файлів у папці "uploads"
app.post("/upload", upload.single("image"), (req, res) => {
  res.json({
    url: `/uploads/${req.file.originalname}`,
  });
});

// Додаємо моделі до контексту додатку Express
app.set('UserModel', User);
app.set('ProductModel', Product);
app.set('FeedbackModel', Feedback);

// Маршрути для реєстрації та входу користувача
app.post("/auth/register", register);
app.post("/auth/login", login);
app.get("/me", checkAuth, getMe);
app.get("/profile", checkAuth, getMyProfile);
app.put("/profile", checkAuth, updateMyProfile);

// Маршрути для отримання всіх продуктів, отримання одного продукту та створення нового продукту
app.get("/products", getAllProducts);
app.get("/products/:id", getOneProduct);
app.post("/products", createProduct);
app.delete("/products/:id", deleteProduct);
app.put("/products/:id", updateProduct);

// Маршрути для отримання всіх відгуків
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
