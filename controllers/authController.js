const usermodel = require('../models/userModel');
const bcrypt = require('bcrypt'); 
const jwt = require('jsonwebtoken');

const login = async (req, res) => {
    const { email, password } = req.body;
  
    try {
        const user = await usermodel.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: "User not found" }); 
        }
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" }); 
        }

        const token = jwt.sign({ id: user._id,role:user.role}, process.env.JWT_SECRET, { expiresIn: '12h' });

        res.status(200).json({
            message: "User successfully logged in",
            token: token
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" }); 
    }
};

module.exports = { login };
