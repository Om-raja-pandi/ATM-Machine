import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
 mobile: {
    type: String,
    required: true,
  },   
  type:{
   type : String,
   required :true
  },
  amount : {
    type : Number,
    required :true
  }
},{ timestamps: true })

const Transaction = mongoose.model("Transaction", transactionSchema);
export default Transaction;