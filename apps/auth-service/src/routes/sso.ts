import bcrypt from "bcryptjs";
import express from "express";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import path from "path";
import {sendMessages} from "../broker";

const userSchema = new mongoose.Schema({
  email: {type: String, unique: true},
  password: {type: String, required: true},
  tokens: [{
    token: {
      type: String,
      required: true
    }
  }]
});

userSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    // @ts-ignore
    const hashedPassword = await bcrypt.hash(this.password, 8);
    console.log('password:', this.password, hashedPassword)
    // @ts-ignore
    this.password = hashedPassword;
  }
  next();
});

const User = mongoose.model('User', userSchema);


export const ssoRoutes = express.Router()
  .get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'register.html'));
  })
  .get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'login.html'));
  })
  .post('/register', async (req, res) => {
    try {
      const user = new User(req.body);
      await user.save();

      await sendMessages('user-topic', ['User created'])

      res.redirect('/sso/login');
    } catch (error) {
      console.error(error)
      res.status(400).send(error);
    }
  })
  .post('/login', async (req, res) => {
    const {email, password, redirectUrl} = req.body;

    try {
      const user = await User.findOne({email: email});
      if (!user) {
        throw new Error('Unable to login');
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).send({error: 'Invalid credentials'});
      }

      const token = jwt.sign({_id: user._id.toString()}, 'SUPER_SECRET_KEY');
      user.tokens = user.tokens.concat({token});
      await user.save();

      res.redirect(`${redirectUrl}?token=${token}`)
    } catch (error) {
      console.error(error)
      res.status(400).send(error);
    }
  });

