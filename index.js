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
  createProduct,
  getAllProducts,
  getOneProduct,
  deleteProduct,
  updateProduct,
  getMe,
  createUser,
} from "./controllers/index.js";

// Імпортуємо функцію перевірки автентифікації


// Підключаємось до бази даних MongoDB
// mongoose.connect("mongodb+srv://ADministartor:jpUnrAK80ITx0A30@clusterelf.n3cs9ie.mongodb.net/ElfBar?retryWrites=true&w=majority")
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
app.use(cors({
  origin: '*', // Дозволяє усім джерелам
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
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
  console.log(req.file); // Перевіряємо, що ми отримали файл
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }
  res.json({
    url: `/uploads/${req.file.originalname}`,
  });
});


// Додаємо моделі до контексту додатку Express
app.set('UserModel', User);
app.set('ProductModel', Product);
app.set('FeedbackModel', Feedback);

// Маршрути для реєстрації та входу користувача

app.get("/me", getMe);
app.post("/me",createUser);


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
