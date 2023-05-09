import jwt from "jsonwebtoken";
import bcrypt from 'bcrypt'
import { validationResult } from "express-validator";
import UserModel from "../models/user.js"

export const register = async (req, res) => {

    try {
 
     const errors = validationResult(req)
 
     if(!errors.isEmpty()){
         return res.status(400).json(errors.array())
     }
 
     const password = req.body.password;
     const salt = await bcrypt.genSalt(10)
     const hash = await bcrypt.hash(password, salt)
 
     const doc = new UserModel({
         email: req.body.email,
         fullName: req.body.fullName,
         passwordHash: hash,
         avatarUrl: req.body.avatarUrl,
     })
     const user = await doc.save();
 
     const token =  jwt.sign({
         _id: user._id
     }, 
     "secret123",
     {
         expiresIn: '30d'
     }
     )
     const {passwordHash, ...userData} = user._doc
     res.json({
         ...userData,
         token
     })
    } catch (error) {
     res.status(500).json({
         massage: error
     })
    }
 }
export const login = async (req, res) => {
    try {
        const user = await UserModel.findOne({email: req.body.email})

        if(!user){
            return res.status(404).json({
                massage: "Nothing was found"
            })
        }

        const isValidPass = await bcrypt.compare(req.body.password, user._doc.passwordHash)
        if(!isValidPass){
            return res.status(400).json({
                massage: "Login or password is incorrect"
            })
        }

        
        const token =  jwt.sign({
            _id: user._id
        }, 
        "secret123",
        {
            expiresIn: '30d'
        }
        )
        const {passwordHash, ...userData} = user._doc
        res.json({
            ...userData,
            token
        })
       
    } catch (error) {
        console.log(error)
        res.status(500).json({
            massage: "Something went wrong"
        })
    }
}

export const getMe = async(req, res) => {


    try {
        const user = await UserModel.findById(req.userId)
        if(!user){
            return res.status(404).json({
                massage: "User has not found"
            })
        }
        const {passwordHash, ...userData} = user._doc
        res.json(userData)
        res.json({
            succes: true
        })
    } catch (error) {
        console.log(error)
        res.status(500).josn({
            massage: "Something went wrong"
        })
    }
}