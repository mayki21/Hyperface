const express=require("express")
const User=require("../model/user.js")
const userrouter=express.Router();
const bcrypt=require("bcrypt")
const jwt=require("jsonwebtoken")
require("dotenv").config()


userrouter.post("/register", async (req, res) => {
    const { username, email, password } = req.body;
    try {
        // Hash the password
        const hash = await bcrypt.hash(password, 9);
        // Create a new user instance
        const user = new User({ username, email, password: hash });
        // Save the user to the database
        await user.save();
        res.status(200).send({ "msg": "Registration successful" });
    } catch (error) {
        res.status(400).send({ "msg": "Error occurred during registration" });
    }
});

userrouter.post("/login", async (req, res) => {
    const { email, password } = req.body;
    try {
        // Find the user by email
        const user = await User.findOne({ email });
        if (user) {
            // Compare the provided password with the hashed password
            const isMatch = await bcrypt.compare(password, user.password);
            if (isMatch) {
                // Generate JWT token
                const token = jwt.sign({ "userid": user._id }, process.env.tokenpass, { expiresIn: "6h" });
                res.status(200).send({ "msg": "Login successful", "token": token, "userdetails": user });
            } else {
                res.status(401).send({ "msg": "Invalid credentials" });
            }
        } else {
            res.status(400).send({ "msg": "User not found. Please register first" });
        }
    } catch (error) {
        res.status(400).send({ "msg": "Error occurred during login" });
    }
});











module.exports=userrouter;