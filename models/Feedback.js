import mongoose from "mongoose";

const { Schema } = mongoose;

const FeedbackSchema = new Schema({
  
  imageUrl: {
    type: String,
    trim: true,
  },
}, {
  timestamps: true,
});

const Feedback = mongoose.model("Feedback", FeedbackSchema);

export default Feedback;