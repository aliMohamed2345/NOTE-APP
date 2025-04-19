const bcrypt = require('bcryptjs')
const JWT = require('jsonwebtoken')
const User = require('../models/user')
const { validateLogInCredentials, validateSignUpCredentials } = require('../utils/validateUserCredentials')
const signUpController = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // Validate the user credentials
        const { message, isValid } = validateSignUpCredentials(email, password, username);
        if (!isValid) {
            return res.status(400).json({ success: isValid, message });
        }

        // Handle if the user already exists
        const isUserExist = await User.findOne({ email });
        if (isUserExist) {
            return res.status(400).json({ success: false, message: `The user with this email already exists.` });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create the user in the database
        await User.create({ username, email, password: hashedPassword });

        // Send success response
        return res.status(201).json({ success: true, message: `User created successfully.` });

    } catch (error) {
        console.error(error); // Log the error to the server for debugging
        return res.status(500).json({ success: false, message: "An unexpected error occurred. Please try again later." });
    }
};
const logInController = async (req, res) => {
    try {
        const { email, password } = req.body;
        const { message, isValid } = validateLogInCredentials(email, password);
        if (!isValid) {
            return res.status(400).json({ success: isValid, message });
        }
        const existedUser = await User.findOne({ email })
        if (!existedUser) return res.status(400).json({ success: false, message: `Wrong email` })

        const isPasswordValid = await bcrypt.compare(password, existedUser.password)
        if (!isPasswordValid) {
            return res.status(400).json({ success: false, message: `Wrong password` })
        }

        const token = JWT.sign({ id: existedUser._id, name: existedUser.username }, process.env.jwtSecretKey, { expiresIn: `24h` })
        res.cookie("token", token, {
            httpOnly: true, // Prevents cross-site scripting (XSS)
            secure: process.env.NODE_ENV === 'production' ? true : false,
            sameSite: "Strict", // Prevents cross-site request forgery (CSRF)
            maxAge:  24 * 60 * 60 * 1000 // one week
        });
        res.status(200).json({ success: true, message: `Login successful`, data: { token, id: existedUser._id, name: existedUser.username, email: existedUser.email } })
    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
}
const logOutController = async (req, res) => {
    try {
        // Clear the JWT cookie
        res.clearCookie("token", {
            httpOnly: true,  // Prevents cross-site scripting (XSS)
            secure: true,
            sameSite: "Strict",  // Prevent CSRF
        });
        res.status(200).json({ success: true, message: "Logout successful" });
    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, message: `Internal server error` })
    }
}
const profileController = async (req, res) => {
    try {

        const { id, name } = req.user;
        // Return the profile data (or whatever data is in the decoded token)
        res.status(200).json({ success: true, user: { id, name } });

    } catch (error) {
        // If the token is invalid or expired, this will catch it
        console.log(error)
        res.status(400).json({ success: false, message: `Internal Server Error` });
    }
};
module.exports = { signUpController, logInController, logOutController, profileController }