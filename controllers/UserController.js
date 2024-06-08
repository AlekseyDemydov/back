
import userModel from '../models/User.js'
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User from '../models/User.js';

export const register = async (req, res) => {
    try {
      
      const password = req.body.password;
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(password, salt);
  
      const doc = new userModel({
        email: req.body.email,
        fullName: req.body.fullName,
        avatarUrl: req.body.avatarUrl,
        passwordHash: hash,
      });
  
      const user = await doc.save();
  
      const token = jwt.sign(
        {
          _id: user._id,
        },
        "secret123",
        {
          expiresIn: "30d",
        }
      );
  
      const {passwordHash, ...userData}=user._doc
  
      res.json({ ...userData, token });
    } catch (err) {
      console.log(err);
      res.status(500).json({
        message: "не удалось зарегистрироватся",
      });
    }
  }

export const login = async (req, res) => {
    try {
      const user = await userModel.findOne({
        email: req.body.email
      });
  
      if (!user) {
        return res.status(404).json({
          message: 'Пользователь не найден'
        });
      }
  
      const isValidPass = await bcrypt.compare(req.body.password, user.passwordHash);
  
      if (!isValidPass) {
        return res.status(401).json({
          message: "Неверный логин или пароль"
        });
      }
  
      const token = jwt.sign(
        {
          _id: user._id,
        },
        "secret123",
        {
          expiresIn: "30d",
        }
      );
  
      const { passwordHash, ...userData } = user._doc;
  
      res.json({ ...userData, token });
    } catch (err) {
      console.error(err);
      res.status(500).json({
        message: "Не удалось войти в систему",
      });
    }
  }

export const getMe= async (req, res) => {
    try {
      const user = await userModel.findById(req.userId);
  
      if (!user) {
        return res.status(404).json({
          message: "Користувача не знайдено"
        });
      }
  
      const { passwordHash, ...userData } = user._doc;
  
      res.json(userData);
    } catch (err) {
      console.error("Помилка при отриманні користувача:", err);
      res.status(500).json({
        message: "Помилка сервера",
      });
    }
  }

  export const getMyProfile = async (req, res) => {
    try {
        const user = await User.findById(req.userId);
        if (!user) {
            return res.status(404).json({ message: "Користувач не знайдений" });
        }
        res.json(user);
    } catch (error) {
        console.error("Помилка при отриманні профілю користувача:", error);
        res.status(500).json({ message: "Помилка сервера" });
    }
};

export const updateMyProfile = async (req, res) => {
    try {
        const { fullName, email, avatarUrl } = req.body;
        const updatedUser = await User.findByIdAndUpdate(
            req.userId,
            { fullName, email, avatarUrl },
            { new: true }
        );
        res.json(updatedUser);
    } catch (error) {
        console.error("Помилка при оновленні профілю користувача:", error);
        res.status(500).json({ message: "Помилка сервера" });
    }
};