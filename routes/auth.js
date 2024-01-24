const express = require("express");
const router = express.Router();
const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

router.post("/register", async (req, res) => {
    try {
        const { name, email, mobile, password } = req.body;

        if (!name || !email || !mobile || !password) {
            return res.status(400).json({
                errorMessage: "Bad Request",
            });
        }

        const isExistingUser = await User.findOne({ email: email });
        if (isExistingUser) {
            return res.status(409).json({ message: "User already exists" });
        }
        // write a check for mobile number also

        const hashedPassword = await bcrypt.hash(password, 10);

        const userData = new User({
            name,
            email,
            mobile,
            password: hashedPassword,
        });

        const userResponse = await userData.save();

        const token = await jwt.sign(
            { userId: userResponse._id },
            process.env.JWT_SECRET
        );

        res.json({
            message: "User registered successfully",
            token: token,
            name: name,
        });
    } catch (error) {
        console.log(error);
    }
});

router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                errorMessage: "Bad Request! Invalid credentials",
            });
        }

        const userDetails = await User.findOne({ email });

        if (!userDetails) {
            return res
                .status(401)
                .json({ errorMessage: "Invalid credentials" });
        }

        const passwordMatch = await bcrypt.compare(
            password,
            userDetails.password
        );

        if (!passwordMatch) {
            return res
                .status(401)
                .json({ errorMessage: "Invalid credentials" });
        }

        const token = await jwt.sign(
            { userId: userDetails._id },
            process.env.JWT_SECRET
        );

        res.json({
            message: "User logged in successfully",
            token: token,
            name: userDetails.name,
        });
    } catch (error) {
        console.log(error);
    }
});

module.exports = router;