const users = require('../Models/userSchema')
const logActivity = require("../Utils/activityLogger");
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

exports.registerAPI = async (req, res) => {
    console.log("Inside registerAPI")
    const { username, email, password } = req.body
    try {
        const existingUser = await users.findOne({ email })
        if (existingUser) {
            res.status(406).json({ message: "Already Registered User" })
        } else {
            const newUser = new users({
                username: username,
                email: email,
                password: password,
                role: "user",
                paymentStatus: false,
                paymentId: "",
                isActive: true,
            })
            await newUser.save()
            res.status(200).json({
                message: "User Registered Successfully",
                user: {
                    id: newUser._id,
                    username: newUser.username,
                    email: newUser.email,
                }
            })
        }
    } catch (err) {
        console.log("Error: ", err)
        res.status(500).json({ message: err })
    }
}

exports.googleAuthCallback = async (req, res) => {
    try {
        const user = req.user;

        if (!user) {
            return res.status(401).json({ message: "Authentication failed" });
        }

        const FRONTEND = process.env.FRONTEND_URL || 'http://localhost:5173';

        // Not paid → go to payment page
        if (!user.paymentStatus) {
            return res.redirect(
                `${FRONTEND}/payment?userId=${user._id}&authSuccess=true`
            );
        }

        // Paid → generate token and redirect to sign-in
        // ✅ Redirect to /sign-in instead of /dashboard
        // so SignIn's useEffect can store all session data properly
        const token = jwt.sign(
            { userId: user._id, role: user.role },
            process.env.jwtKey
        );

        return res.redirect(
            `${FRONTEND}/sign-in?userId=${user._id}&authSuccess=true&token=${token}&username=${encodeURIComponent(user.username)}&role=${user.role}`
        );

    } catch (err) {
        console.error("Error in Google Authentication Callback: ", err);
        return res.status(500).json({ message: "Server Error", error: err });
    }
};

exports.loginAPI = async (req, res) => {
    console.log("Inside Login API")
    const { email, password } = req.body
    try {
        const existingUser = await users.findOne({ email })
        if (!existingUser) {
            return res.status(404).json({ message: 'User Not Found' })
        }
        const isMatch = await bcrypt.compare(password, existingUser.password)
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid Credentials' })
        }
        if (existingUser.paymentStatus !== true) {
            return res.status(406).json({
                message: 'Payment Not Complete. Please Complete The Payment',
                redirectTo: '/payment',
                userId: existingUser._id
            })
        }
        const token = jwt.sign(
            { userId: existingUser._id, role: existingUser.role },
            process.env.jwtKey
        )
        console.log("TOKEN: ", token)
        res.status(200).json({
            message: 'Login Successful',
            currentUser: existingUser,
            token
        })
    } catch (err) {
        console.log("Server Error: ", err)
        res.status(500).json({ message: `Server Error :${err}` })
    }
}

exports.updateUserProfile = async (req, res) => {
    console.log("Inside Update User Profile");
    const { username, password, gender, dateOfBirth } = req.body;
    const { userId } = req.payload;
    const profilePic = req.file && req.file.filename;

    try {
        let updateFields = { username, gender, profilePic };

        if (dateOfBirth) {
            updateFields.dateOfBirth = new Date(dateOfBirth);
        }

        if (password) {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);
            updateFields.password = hashedPassword;
        }

        const User = await users.findByIdAndUpdate(
            { _id: userId },
            updateFields,
            { new: true }
        );

        await User.save();
        await logActivity({
            userId,
            type: "profile_updated",
            title: "Profile Updated",
            description: "Personal information was updated",
        });

        res.status(200).json({
            message: "User Profile Updated Successfully",
            User
        });

    } catch (error) {
        console.log("Server Error: ", error);
        res.status(500).json(error);
    }
};

exports.getUserDetails = async (req, res) => {
    console.log("Inside Get User Details");
    const { userId } = req.payload;
    try {
        const User = await users.findById(userId)
        res.status(200).json({ User: User })
    } catch (error) {
        console.log("Server Error: ", error)
        res.status(500).json("Server Error while getting user details")
    }
}