import {Request, Response, NextFunction} from 'express';
import jwt from "jsonwebtoken";
import {IPopug} from "popug-shared";

export const verifyToken = (req: Request, res: Response, next: NextFunction) => {
  const {token} = req.query
  if (!token) {
    return next();
  }

  const decodedUser = jwt.verify(token as string, 'SUPER_SECRET_KEY') as IPopug | any
  if (!decodedUser?.publicId) {
    return next();
  }

  (req.session as any).user = decodedUser;
  console.log('SAVE USER', decodedUser)
  req.session.save(function (err) {
    if (err) return next(err)

    res.redirect('/')
  })
};
