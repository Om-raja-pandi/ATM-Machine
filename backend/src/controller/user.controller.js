// Import required models and modules
import User from '../models/user.models.js';
import Transaction from '../models/transaction.models.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from "dotenv"
dotenv.config()
// SignUp API
export const signUp = async (req, res) => {
  try {
    console.log("signUp called", req.body);
    const { mobile, pincode, name, email } = req.body || {};
    
    // Check empty fields
    if (!mobile || !pincode) {
      return res.status(400).json({ message: "All fields are required" });
    }
    // Check if mobile already exists
    const userExists = await User.findOne({ mobile });
    if (userExists) {
      return res.status(400).json({ message: "Mobile number already registered" });
    }
     // Hash password
    const hashedPincode = await bcrypt.hash(pincode, 10);
    // Create user
    const user = await User.create({
      mobile : mobile,
      pincode: hashedPincode,
      name: name || '',
      email: email || ''
    });
   const  save = await user.save()
    res.status(201).json({
     save
    });

  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};

//login

export const Login = async (req, res) => {
    const { mobile, pincode } = req.body;
  try {

    // Check empty fields
    if (!mobile || !pincode) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check if mobile already exists
    const user = await User.findOne({ mobile });
    if (!user) {
      return res.status(400).json({ message: "Mobile number is wrong" });
    }

    const compare = await bcrypt.compare(pincode , user.pincode)
    if(!compare){
        return res.status(400).json({ message: "Pincode is wrong" });
    }
    
    const token = jwt.sign(
      { id:user._id, mobile: user.mobile },
      process.env.JWT_SECRET,
      {expiresIn:"1d"}
    )
     
    res.status(201).json({
      message: "Login Successful",
      token,
      
    });

  } catch (error) {
    res.status(500).json({ message:error.message });
  }
};

//balance

export const CheckBalance = async (req,res)=>{
    const mobile = req.user.mobile;
    try{
        
        if(!mobile){
            return res.status(400).json({message:"Mobile not found in token"});
        }
            const user = await User.findOne({ mobile });
            if(!user){
                return res.status(404).json("user not found");
            }
            res.status(200).json({
                message:"balance fetched successfully",
                id: user._id,
                mobile: user.mobile,
                balance: user.balance
            });
            
         
    }catch (error)
    {
            res.status(500).json({
                message:error.message
            })
    };
}

//Deposit

export const Deposit = async (req,res) =>{
  try{
      const { amount } = req.body
      const mobile = req.user.mobile; 
    if( !amount){
      return res.status(400).json({message :"Enter Amount"})
    }
    const user = await User.findOne({ mobile  });
    if(!user){
      return res.status(400).json({message :"User Not Found"})
    }
    if(amount<=0){
      return res.status(400).json({message :"Invalid Amount"})
    }
    user.balance +=Number(amount)
    await user.save()
     await Transaction.create({
      mobile,
     user_id: user._id,
      type: "deposit",
      amount,
      balance:user.balance
    })
    res.status(201).json({
      messsage:"Deposit Successfull",
      balance : user.balance 
    })
   
  } catch(err){
    res.status(400).json({message : err.message})
  }
};
//pin change


export const ChangePin = async (req, res) => {
  try {
    const { oldPin, newPin } = req.body;
    const mobile = req.user.mobile;

    
    if (!oldPin || !newPin) {
      return res.status(400).json({ message: "All fields are required" });
    }

    
    const user = await User.findOne({ mobile });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Compare old PIN
    const isMatch = await bcrypt.compare(oldPin, user.pincode);
    if (!isMatch) {
      return res.status(400).json({ message: "Old PIN is incorrect" });
    }

    // Hash new PIN
    const salt = await bcrypt.genSalt(10);
    const hashedPin = await bcrypt.hash(newPin, salt);

    // Update PIN
    user.pincode = hashedPin;
    await user.save();

    res.status(200).json({ message: "PIN changed successfully" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//ministatement

export const MiniStatement = async (req, res) => {
  try {
    const mobile = req.user.mobile;

    // Find user
    const user = await User.findOne({ mobile });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Get last 5 transactions
    const transactions = await Transaction.find({ mobile  })
      .sort({ createdAt: -1 })
      .limit(5);

    res.status(200).json({
      message: "Mini statement fetched successfully",
      balance: user.balance,
      transactions
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//Exit
const logOut = []
export const Exit = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if(!token){
    return res.status(400).json({
      message: "token is missing"
    });
  }
      logOut.push(token)
      res.status(200).json({
      message: "Thank you for using our ATM. Session ended successfully."
    });

  } catch (error) {
    return res.status(500).json({
      message: "Error while exiting ATM",
      error: error.message
    });
  }
};

// Withdraw
export const Withdraw = async (req, res) => {
  const { amount } = req.body;
  const mobile = req.user.mobile; 
    if (!amount || !mobile)
    return res.status(400).json({ message: "All fields required" });

  const user = await User.findOne({ mobile  });
  if (!user) return res.status(404).json({ message: "User not found" });

  if (user.balance < amount)
    return res.status(400).json({ message: "Insufficient balance" });

  user.balance -= Number(amount);
  await user.save();
  await Transaction.create({
    mobile,
    user_id: user._id,
    type: "withdraw",
    amount,
    balance: user.balance
  });
  res.json({ message: "Withdrawal successful", balance: user.balance });
};

// Get User Details with last 5 transactions
export const getUserDetails = async (req, res) => {
  try {
    const mobile = req.user.mobile;

    // Find user
    const user = await User.findOne({ mobile });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Get last 5 transactions
    const transactions = await Transaction.find({ mobile })
      .sort({ createdAt: -1 })
      .limit(5);

    res.status(200).json({
      message: "User details fetched successfully",
      user: {
        mobile: user.mobile,
        name: user.name || '',
        email: user.email || '',
        balance: user.balance
      },
      transactions
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update User Profile
export const updateProfile = async (req, res) => {
  try {
    console.log("updateProfile called", req.body);
    const mobile = req.user.mobile;
    const { name, email } = req.body;

    console.log("Looking for user with mobile:", mobile);

    const user = await User.findOne({ mobile });
    if (!user) {
      console.log("User not found");
      return res.status(404).json({ message: "User not found" });
    }

    console.log("Current user:", user);

    // Update fields if provided
    if (name !== undefined) user.name = name;
    if (email !== undefined) user.email = email;

    console.log("Updated user:", user);

    await user.save();

    console.log("User saved successfully");

    res.status(200).json({
      message: "Profile updated successfully",
      user: {
        mobile: user.mobile,
        name: user.name,
        email: user.email,
        balance: user.balance
      }
    });

  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ message: error.message });
  }
};
