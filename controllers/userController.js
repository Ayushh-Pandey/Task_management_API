const bcrypt = require('bcrypt');
const Joi = require('joi');

const User = require("../models/usersSchema");
const { generateToken } = require('../middlewares/authMiddleware');

const userRegistration = async (req, res) => {
    // input data validation using Joi
    // creating required data schema by Joi object 
    const schema = Joi.object({
        name: Joi.string().required(),
        email: Joi.string().email().required(),
        password: Joi.string().min(8).required()
    })

    // validate function matches the req.body data with the Joi schema
    const {error} = schema.validate(req.body);
    if(error){
        return res.status(400).json({msg:error.details[0].message});
    }

    const { name, email, password } = req.body;

    try {
        //check if email already exists (as our model have unique email)
        const existingEmail = await User.findOne({email });
    
        if (existingEmail) {
            return res.status(400).json({ message: 'email already exists, try with different Email' });
        }
        
        // encrypting the password to provide privacy
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
    
        const newUser = new User({
            name,
            email,
            password:hashedPassword
        });
    
        await newUser.save();
        
        // generating JWT token
        const token = generateToken(newUser._id)
    
        res.status(201).json({
            message: 'User Created Successfully',
            data: {
                _id: newUser._id,
                name: newUser.name,
                email: newUser.email,
                token: token
            }
        });
    } catch (error) {
        res.status(500).json({message:error.message})
    }
}

const userLogin = async (req, res) => {
    // input data validation using Joi
    // creating required data schema by Joi object 
    const schema = Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().min(8).required()
    })

    // validate function matches the req.body data with the Joi schema
    const {error} = schema.validate(req.body);
    if(error){
        return res.status(400).json({msg:error.details[0].message});
    }

    const { email, password } = req.body;

    try {
        const userFound = await User.findOne({ email });
        if (!userFound) {
            return res.status(400).json({ msg: 'wrong email' })
        }
    
        const matchPassword = await bcrypt.compare(password, userFound.password);
        if (!matchPassword) {
            return res.status(400).json({ msg: 'wrong password' })
        }
    
        const token = generateToken(userFound._id)
    
        res.status(200).json({
            message: 'User Logged In Successfully',
            data: {
                _id: userFound._id,
                name: userFound.name,
                email: userFound.email,
                token: token
            }
        })
    } catch (error) {
        res.status(500).json({message:error.message})
    }
}

module.exports = { userRegistration, userLogin }