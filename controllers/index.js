import { createProduct, getAllProducts, getOneProduct, deleteProduct, updateProduct } from './ProductController.js';
import { register, login, getMe, getMyProfile, updateMyProfile } from './UserController.js';
import {createFeedback, getAllFeedbacks, deleteFeedback} from './FeedbackController copy.js'

export { createFeedback, getAllFeedbacks, deleteFeedback, getMyProfile, updateMyProfile,  register, login, getMe, createProduct, getAllProducts, getOneProduct, deleteProduct, updateProduct };