const passport = require('passport')
const jwt = require("jsonwebtoken")
import { Message } from "../enums/Message";
import { NextFunction } from "express";
import { UserEntity } from "../models/User";
import { Response,Request } from "express";

export const middlewareAuth = (req: Request, res: Response, next: NextFunction) => {
  if(req.originalUrl.includes("/login") || req.originalUrl.includes("/register")){
    return next();
  }
    passport.authenticate('jwt', { session: false }, (err:Error, user:UserEntity) => {
      if (err || !user) {
        return res.status(401).json({ message: Message.InvalidToken });
      }
      if(user.isDeleted){
        return res.status(401).json({ message: Message.Unauthorized });
      }
      jwt.verify(req.headers.authorization!.split(' ')[1], process.env.JWT_SECRET, (verifyErr:Error) => {
        if (verifyErr) {
          return res.status(401).json({ message: Message.ExpiredToken });
        }
  
        req.user = user;
        next();
      });
    })(req, res, next);
  };
  

export const middlewareAuthLocal = (req: Request, res: Response, next: NextFunction) => {
   passport.authenticate("local", { session: false }, (err: Error, user: UserEntity) => {
    if (err || !user) {
      return res.status(401).json({ msg: Message.Unauthorized });
    }
    req.user = user;
    return next();
  })(req, res, next);
}