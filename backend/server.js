
import dotenv from "dotenv";
dotenv.config(); 

import express from "express";
import mongoose from 'mongoose';
import chatRoutes from "./routes/chat.js";
import cors from "cors";


import cookie from "cookie-parser";
import session from 'express-session';
import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import User from './models/user.js';
import userRouter from "./routes/user.js"


const app = express();

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));

app.use(express.json());
app.use(cookie());





const sessionOptions = {
    secret: "mysupersecretcode",
    resave: false,
    saveUninitialized: false,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true
    }
};

app.use(session(sessionOptions));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// yaha 
app.use("/api/users", userRouter);

app.use("/api", chatRoutes);

app.get("/demo", async (req, res) => {
    let fakeuser = new User({
        email: "student@gmail.com",
        username: "Aadityaa"
    });

    let reguser = await User.register(fakeuser, "helloo");

    res.send(reguser);
});





const connectDB = async()=>{
    try{
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("The DB is connected sucessfully");
        
    }catch(err){
        console.log("failed to connect",err);
        
    }
}

app.listen(3000, () => {
    connectDB();
    console.log("Server is running on port 3000");
});
