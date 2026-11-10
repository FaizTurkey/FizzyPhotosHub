import { User } from "../models/User.js";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken'

const signToken = (user) => {
    return jwt.sign({
        id: user._id.toString(),
        email: user.email,
        name: user.name,
    },
        process.env.JWT_SECRET,
        { expiresIn: "30d" }
    )
}


export const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            res.status(400).json({ message: "Name, email and password are required" })
            return;
        }

        const normalizedEmail = email.toLowerCase().trim();
        const existing = await User.findOne({ email: normalizedEmail });
        if (existing) {
            res.status(400).json({ message: "An account with this email already exists" });
            return;
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({
            name: name.trim(),
            email: normalizedEmail,
            password: hashedPassword,
        })

        const token = signToken(user);
        res.status(201).json({
            token,
            user: { _id: user._id, name: user.name, email: user.email }
        })



    } catch (error) {
        res.status(500).json({ message: error.message || "Failed to register" })
    }
}


export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            res.status(400).json({ message: "Email and password are required" })
            return;
        }

        const normalizedEmail = email.toLowerCase().trim();
        const user = await User.findOne({ email: normalizedEmail }).select("+password");

        if (!user || !user.password) {
            res.status(401).json({ message: "Invalid email or password" });
            return;
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            res.status(401).json({ message: "Invalid Email and Password" });
            return;
        }

        const token = signToken(user);
        res.json({
            token,
            user: { _id: user._id, name: user.name, email: user.email }
        })

    } catch (error) {
        res.status(500).json({ message: error.message || "Failed to login" })
    }
}

export const getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user?.id);
        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }
        res.json({ user });

    } catch (error) {
        res.status(500).json({ message: error.message || "Failed to fetch user" })
    }
}