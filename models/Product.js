import mongoose from "mongoose";

const { Schema } = mongoose;

const DescriptionSchema = new Schema({
  quantity: {
    type: String,
    trim: true,
  },
  strength: {
    type: String,
    trim: true,
  },
  volume: {
    type: String,
    trim: true,
  },
  resistance: {
    type: String,
    trim: true,
  },
  type: {
    type: String,
    required: [true, "Type is required"],
    trim: true,
  },
  charging: {
    type: String,
    trim: true,
  },
}, { _id : false }); // _id: false, щоб уникнути створення _id для піддокумента

const ProductSchema = new Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
    trim: true,
  },
  description: {
    type: DescriptionSchema,
  
  },
  flavor: {
    type: [String],
   
  },
  color: {
    type: [String],
   
  },
  price: {
    type: Number,
    required: [true, "Price is required"],
    min: [0, "Price cannot be negative"],
  },
  imageUrl: {
    type: String,
    trim: true,
  },
}, {
  timestamps: true,
});

const Product = mongoose.model("Product", ProductSchema);

export default Product;