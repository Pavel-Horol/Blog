import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt"
import mongoose from "mongoose";
import { registerValidation } from "./validator/auth.js";
import { validationResult } from "express-validator";
import UserModel from "./models/user.js"
import checkAuth from "./utils/checkAuth.js"
import user from "./models/user.js";
import * as UserController from "./controllers/UserController.js";
const app = express()
const mongoDBurl = "mongodb+srv://pashahorolskij3:pavluha2uha@cluster1.zaorxc8.mongodb.net/blog?retryWrites=true&w=majority"

mongoose.connect(mongoDBurl)
    .then(() => console.log("DB ok"))
    .catch((err) => console.log("DB error", err))

app.use(express.json())


app.post('/auth/login', UserController.login )
app.post('/auth/register', registerValidation, UserController.register )
app.get('/auth/me', checkAuth,  UserController.getMe)

app.listen(3000, (err) => {
    if(err){
        return console.log(err)
    }
    console.log("Server ok")
})