import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";


const generateToken = (user) => {
    return jwt.sign(
        {
            id: user._id,
            role: user.role,
            tenantId: user.tenantId,
        },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
    );
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({
                message: "All fields are necessary.",
                success: false,
            });
        }
        const userExists = await User.findOne({ email }).populate('tenantId');
        if (!userExists) {
            return res.status(404).json({
                message: "Invalid credentials",
                success: false,
            });
        }
        const isMatch = await bcrypt.compare(password, userExists.password);
        if (!isMatch) {
            return res.status(400).json({
                message: "Invalid credentials",
                success: false,
            });
        }
        const token = generateToken(userExists);
        const user = {
            id: userExists._id,
            email: userExists.email,
            role: userExists.role,
            tenantId: userExists.tenantId,
        };

        return res
            .status(200)
            .cookie("token", token, {
                maxAge: 24 * 60 * 60 * 1000, // 1 day
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
            })
            .json({
                message: `Welcome back ${userExists.email}`,
                user,
                token,
                success: true,
            });
    } catch (error) {
        console.log(error);
        
        return res.status(500).json({
            message: "Internal server error",
            success: false,
        });
    }
};

export const logout = async (req, res) => {
    try {
        return res.status(200).cookie("token", "", {
            maxAge: 0,
            httpOnly: true,
            sameSite: 'strict',
            secure: process.env.NODE_ENV === 'production'
        }).json({
            message: "Logged out successfully.",
            success: true
        });
    } catch (error) {
        return res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
}

// Only admin can do this
export const inviteUser = async (req, res) => {
    try {
        const { email, role } = req.body;

        if (!email || !role) {
            return res.status(400).json({ success: false, message: 'All fields are necessary.' });
        }

        if (role !== 'admin' && role !== 'member') {
            return res.status(400).json({ success: false, message: 'Please enter a valid role (admin or member).' });
        }

        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ success: false, message: 'User already exists' });
        }

        const tenantId = req.user.tenantId;
        const hashedPassword = await bcrypt.hash('password', 10);

        const invitedUser = await User.create({
            email,
            tenantId,
            role,
            password: hashedPassword,
        });

        return res.status(201).json({
            success: true,
            message: 'User invited successfully',
            user: {
                id: invitedUser._id,
                email: invitedUser.email,
                role: invitedUser.role,
                tenantId: invitedUser.tenantId,
            },
        });
    } catch (error) {
        return res.status(500).json({
            message: "Internal server error",
            success: false,
        });
    }
};


