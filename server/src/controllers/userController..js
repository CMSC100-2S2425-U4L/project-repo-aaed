import User from "../models/user.js"
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken';


export const register = async (req, res) => {
    try {
        // Check if email already exists/registered
        const existingEmail = await User.findOne({ email: req.body.email });
        if (existingEmail) {
            return res.status(409).json({ error: "Email already in use" });
        }
        // Check if userType is valid
        if (!["customer", "admin"].includes(req.body.userType)) {
            return res.status(400).json({ error: "Invalid User Type" });
        }
        // Hash password using bcrypt
        const hashedPassword = await bcrypt.hash(req.body.password, 10);

        // create and save new user
        const newUser = new User({ ...req.body, password: hashedPassword });
        await newUser.save();
        console.log(req.body);
        res.status(201).json({ message: "User created successfully." });

    } catch (e) {
        res.status(500).json({ error: "Server Error" });
    }
}

// remove user
export const removeUser = async (req, res) => {
    try {
    // delete by email since unique naman siya
    const { email } = req.body;
    const deleted = await User.deleteOne({ email }); 

    
    if (deleted.deletedCount != 0) { 
        res.json({ deleted: true });
        // deleted
    }
    else {
        // not deleted
        res.json({ deleted: false, message: "User not found" });
    }
    } catch(e) {
        res.status(500).json({ error: "Server Error" });
    }
}

// login a user
export const login = async (req, res) => {
    try{
        // check if email and pass are valid
        const {email, password} = req.body;

        // check for missing fields
        if(!email || !password) {
            return res.status(400).json({ message: "Missing fields"});
        }

        // find user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        // compare lang yung password with hashed pass
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid credentials" });
        }
        // create JWT token with 1 hr validity
        const token = jwt.sign(
            { _id: user._id, userType: user.userType },
            process.env.JWT_SECRET,
            { expiresIn: '1h' } 
        );
        // return token to the client
        res.json({ token });
    } catch (e){
        res.status(500).json({ message: "Server Error" });
    }

};

// https://www.geeksforgeeks.org/how-to-create-and-verify-jwts-with-node-js/
// Middleware to restrict access to admin users only
export const isAdmin = async (req, res, next) => {
        // Directly use the token
        const token = req.headers.authorization && req.headers.authorization.split(' ')[1]; 

        // check if token is missing
        if (!token) {
            return res.status(403).json({
                login: false,
                message: "Authorization token is required",
            });
        }

    try {
       // check or verify yung token usinv JWT
        const checker = jwt.verify(token, process.env.JWT_SECRET);

      
        // if admin ba ung usertype
        if (checker.userType !== 'admin') {
            // if no
            return res.status(403).json({
                login: false,
                message: "Only admin can have access into this feature",
            });
        }

        // if admin, save user infos to req para sa next middleware
        req.user = checker;
        // continue lang
        next(); 

    } catch (error) {
        return res.status(401).json({
            // error handler
            login: false,
            message: "Invalid",
        });
    }
};

// get yung list ng users from the database
export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: "Failed to fetch users" });
    }
};