import {Request, Response, NextFunction} from 'express';
import {CONFIG} from "../config";

export const verifyAuthentification = (req: Request, res: Response, next: NextFunction) => {

  return (!(req.session as any).user)
    ? res.redirect(CONFIG['sso_service_login_endpoint'])
    : next();
};
