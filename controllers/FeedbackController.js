import Feedback from '../models/Feedback.js'; // Імпортуємо модель Feedback

// Контролер для створення нового відгуку
export const createFeedback = async (req, res) => {
  try {
    const { imageUrl } = req.body;

    const feedback = new Feedback({
      imageUrl,
    });

    const savedFeedback = await feedback.save();
    res.status(201).json(savedFeedback);
  } catch (error) {
    console.error('Помилка при створенні відгуку:', error);
    res.status(500).json({
      message: 'Не вдалося створити відгук',
    });
  }
};

// Контролер для отримання всіх відгуків
export const getAllFeedbacks = async (req, res) => {
  try {
    const feedbacks = await Feedback.find();
    res.json(feedbacks);
  } catch (error) {
    console.error('Помилка при отриманні відгуків:', error);
    res.status(500).json({
      message: 'Не вдалося отримати список відгуків',
    });
  }
};

// Контролер для видалення відгуку
export const deleteFeedback = async (req, res) => {
  try {
    const feedbackId = req.params.id;
    const deletedFeedback = await Feedback.findByIdAndDelete(feedbackId);
    if (!deletedFeedback) {
      return res.status(404).json({ message: 'Відгук не знайдено' });
    }
    res.json({ message: 'Відгук успішно видалено' });
  } catch (error) {
    console.error('Помилка при видаленні відгуку:', error);
    res.status(500).json({ message: 'Не вдалося видалити відгук' });
  }
};