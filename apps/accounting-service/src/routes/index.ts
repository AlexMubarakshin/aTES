import express from 'express';

export const router = express.Router()
  .get('/', async (req, res) => {
    try {
      res.json({ok: 1});
    } catch (error) {
      res.status(500).send({error: 'Fail 🦜'});
    }
  })

