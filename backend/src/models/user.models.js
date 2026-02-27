import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  mobile: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: false,
    default: ''
  },
  email: {
    type: String,
    required: false,
    default: ''
  },
  pincode: {
    type: String,
    required: true,
  },
  balance : {
    type : Number,
    default : 1000
  },
  
  
}, { timestamps: true });

const User =mongoose.models.User || mongoose.model("User", userSchema);
export default User;
