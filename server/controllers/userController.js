import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import userModel from '../models/userModel.js'


const registerUser = async (req, res)=>{
    try {

        const {name, email, password} = req.body
        const existingUser = await userModel.findOne({ email })

        if(existingUser){
            return res.json({ success: false, message: "User already exists" });
        }

        if(!name || !email || !password){
            return res.status(400).json({ success: false, message: "All fields required" });
        }

        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)
        
        const newUser = new userModel({
            name, 
            email,
            password : hashedPassword
        })

        const user = await newUser.save()
        
        const token =  jwt.sign({id: user._id , name: user.name, email: user.email}, process.env.JWT_SECRET)

        res.status(201).json({
            success: true, 
            token, 
            message: "User registered successfully",
            user: { 
                id: user._id,
                name: user.name,
                email: user.email
            }
        })

    } catch (error) {
        console.log(error);
        res.json({success: false, message: error.message})
    }
}

const loginUser = async (req, res)=>{
    try {

        const {email, password} = req.body
        const user = await userModel.findOne({ email })

        if(!user){
            return res.status(400).json({ success: false, message: "User not found" });
        }

        const isMatch = await bcrypt.compare(password, user.password)

        if(isMatch){
            const token = jwt.sign({id: user._id}, process.env.JWT_SECRET)
            res.status(201).json({
                success: true, 
                token, 
                message: "Login successful",
                user: { id: user._id, name: user.name, email: user.email }
            })
        }
        else{
            return res.status(400).json({ success: false, message: "Invalid credentials" });
        }


    } catch (error) {
        console.log(error);
        res.json({success: false, message: error.message})
    }
}

const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, email, password, age, occupation, maritalStatus } = req.body;

    const updatedData = {};

    if (name) updatedData.name = name;
    if (email) updatedData.email = email;
    if (password) {
      const salt = await bcrypt.genSalt(10);
      updatedData.password = await bcrypt.hash(password, salt);
    }

    // ✅ Add quiz-related fields
    if (age) updatedData.age = age;
    if (occupation) updatedData.occupation = occupation;
    if (maritalStatus) updatedData.maritalStatus = maritalStatus;

    const updatedUser = await userModel
      .findByIdAndUpdate(userId, updatedData, { new: true })
      .select("-password");

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: "User not found ❌",
      });
    }

    const token = jwt.sign(
      { id: updatedUser._id, email: updatedUser.email },
      process.env.JWT_SECRET
    );

    res.json({
      success: true,
      message: "Profile updated successfully ✅",
      user: updatedUser,
      token,
    });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export {registerUser, loginUser, updateProfile}