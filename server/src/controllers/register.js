import User from "../models/user.js"
import bcrypt from 'bcrypt'

export const register = async (req, res) => {
    try {
        const existingEmail = await User.findOne({ email: req.body.email });
        if (existingEmail) {
            return res.status(409).json({ error: "Email already in use" });
        }

        if (!["customer", "admin"].includes(req.body.userType)) {
            return res.status(400).json({ error: "Invalid User Type" });
        }

        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const newUser = new User({ ...req.body, password: hashedPassword });
        await newUser.save();
        console.log(req.body);
        res.status(201).json({ message: "User created successfully." });

    } catch (e) {
        res.status(500).json({ error: "Server Error" });
    }
}