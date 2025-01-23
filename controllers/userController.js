const usermodel = require('../models/userModel');
const bcrypt = require('bcrypt')

const { userRegistrationValidation } = require('../validations/validate');

// get all user data Controller

const getAllUser = async (req, res) => {
    try {
        const allUser = await usermodel.find({}, 'name email')
        if (allUser.length === 0) {
            return res.status(200).json({
                response: "Error",
                status: 404,
                message: "List data not found."
            })
        }

        return res.status(200).json({
            message: 'User data fetch sucessfully',
            users: allUser
        });

    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
}
// get perticular user data
const userProfileView = async (req, res) => {
    const id = req.user.id
    try {
        const user = await usermodel.findById(id)
        if (!user) {
            return res.status(404).json({ message: "User not found !!" })
        }
        res.status(200).json({ message: "user fetch successfully.", user:{
            id:user._id,
            name:user.name,
            email:user.email,
            role:user.role
        } })
    } catch (error) {

        res.status(500).json({ message: 'Server error' });
    }

}
// register       user Controller
const registerUser = async (req, res) => {
    const { error } = userRegistrationValidation.validate(req.body);
    try {
        if (error) {
            return res.status(400).json({ message: error.details[0].message });
        }
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            return res.status(400).json({ message: 'All fields are required' });
        }
        const existingUser = await usermodel.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }
        const saltRound = 10
        const Hasedpassword = await bcrypt.hash(password, saltRound)
        const newUser = new usermodel({
            name,
            email,
            password: Hasedpassword,
        });
        const savedUser = await newUser.save();
        res.status(201).json({
            message: 'User registered successfully',
            user: {
                id: savedUser._id,
                name: savedUser.name,
                email: savedUser.email,
            },
        });
    } catch (error) {

        res.status(500).json({ message: 'Server error' });
    }
};
// edit user Controller
const editUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { name } = req.body
        if (!id) {
            return res.status(400).json({ message: 'User ID is required' });
        }
        if (!name) {
            return res.status(400).json({ message: 'name fields are required' });
        }
        const user = await usermodel.findById(id);
        if (name) user.name = name
        const updatedUser = await user.save();
        res.status(200).json({
            message: "user update sucessfully", user: {
                id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
            }
        })
    } catch (error) {

        res.status(500).json({ message: 'Server error' });
    }
}
// delete user Controller
const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedData = await usermodel.findOneAndDelete(id)
        res.status(200).json({
            message: "user delete sucessfully", data: deletedData
        })
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }

}

module.exports = { registerUser, editUser, getAllUser, deleteUser, userProfileView };