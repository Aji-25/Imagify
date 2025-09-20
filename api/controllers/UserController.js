import UserModel from '../models/User.js'
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export const jwtSecret = 'njusdnwjvdjcoadidkdri';

export const registerUser = async (req,res)=>{
    try {
        const {name,email,password} = req.body;

        if(!name || !email || !password){
            return res.json({sucess:false, message:'Missing Details'});
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password,salt);

        const userData = {
            name,
            email,
            password: hashedPassword,
        }

        const newUser = new UserModel(userData);
        const user = await newUser.save();

        const token = jwt.sign({id: user._id}, jwtSecret)

        res.json({sucess:true, token,user:{name:user.name}})

    } catch (err) {
        if (err.code === 11000) {
            return res.status(409).json({ sucess: false, message: 'Email already registered' });
          }
          res.status(500).json({ sucess: false, message: err.message });
        }
    }


export const loginUser = async(req,res)=>{
    try {
        const {email,password} = req.body;
        const user = await userModel.findOne({email});

        if(!user){
            return res.json({sucess:false, message:'Missing Details'});
        }

        const isMatch = await bcrypt.compare(password,user.password);

        if(isMatch){
            const token = jwt.sign({id: user._id}, jwtSecret);
            res.json({sucess:true, token,user:{name:user.name}});
        }
        else{
            res.json({sucess:false, message:'Invalid Credentials'});
        }

    } catch (err) {
        if (err) throw err;
        res.json({sucess:false, message: err.message})
    }
}

export const userCredits = async(req,res)=>{
    try {
        const {userId} = req.body;

        const user = await userModel.findById(userId);
        res.json({sucess:true, credits :user.creditBalance, user:{name: user.name}})
    } catch (err) {
        if (err) throw err;
        res.json({sucess:false, message: err.message})
    }
}

