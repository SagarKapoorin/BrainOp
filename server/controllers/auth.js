import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";


/* REGISTER USER */
export const register = async (req, res) => {
    try {
      const {
        username,
        email,
        password,
        picturePath,
      } = req.body;
  
      const salt = await bcrypt.genSalt();
      const passwordHash = await bcrypt.hash(password, salt);
  
      const newUser = new User({
        username,
        email,
        password: passwordHash,
        picturePath,
      });
      const savedUser = await newUser.save();
      const message="Succesfull Login";
      const token = jwt.sign({ id: savedUser._id }, process.env.JWT_SECRET);
      res.status(201).json({savedUser,token,message});
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };
  
  /* LOGGING IN */
  export const login = async (req, res) => {
    console.log("kapoor");
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email: email });
      if (!user) return res.status(400).json({ msg: "User does not exist. " });
  
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return res.status(400).json({ msg: "Invalid credentials. " });
  
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
      delete user.password;
      const message="Succesfull Login";
      res.status(200).json({ token, user ,message });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };