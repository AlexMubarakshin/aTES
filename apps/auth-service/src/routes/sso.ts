import bcrypt from "bcryptjs";
import express from "express";
import jwt from "jsonwebtoken";
import path from "path";
import {CUD_EVENT, IPopug, TOPICS_NAMES, uuid} from "popug-shared";
import {User} from "../schemas/user";
import {sendMessages} from "../broker";

export const ssoRoutes = express.Router()
  .get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'register.html'));
  })
  .get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'login.html'));
  })
  .post('/register', async (req, res) => {
    try {
      const {email, password, redirectUrl} = req.body;

      if (!email || !password || !redirectUrl) {
        throw new Error('Request is not valid')
      }


      const existedUser = await User.findOne({email: email});
      if (existedUser) {
        throw new Error('User this email already exists');
      }

      const publicId = uuid()

      const user = new User({...req.body, publicId, password: await bcrypt.hash(req.body.password, 8)});
      await user.save();

      const popug: IPopug = {
        publicId,
        email: user.email,
        role: user.role
      }

      await sendMessages(TOPICS_NAMES.USERS_STREAM, [{
        type: CUD_EVENT.USER_CREATED, data: popug
      }])

      res.redirect(`/sso/login?redirectUrl=${redirectUrl}`);
    } catch (error) {
      console.error(error)
      res.status(400).send(error);
    }
  })
  .post('/login', async (req, res) => {
    try {
      const {email, password, redirectUrl} = req.body;
      if (!email || !password || !redirectUrl) {
        throw new Error('Request is not valid')
      }

      const user = await User.findOne({email: email});
      if (!user) {
        throw new Error('Unable to login');
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).send({error: 'Invalid credentials'});
      }

      const popug: IPopug = {
        publicId: user.publicId,
        email: user.email,
        role: user.role,
      }
      const token = jwt.sign(popug, 'SUPER_SECRET_KEY');

      console.log({popug, token})

      user.tokens = user.tokens.concat({token});
      await user.save();

      res.redirect(`${redirectUrl}?token=${token}`)
    } catch (error) {
      console.error(error)
      res.status(400).send(error);
    }
  });

