//@ts-nocheck
const passport = require('passport')
const jwt = require("jsonwebtoken")
import { Message } from "../enums/Message";
import { NextFunction } from "express";

export const middlewareAuth = (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate('jwt', { session: false }, (err, user) => {
      if (err || !user) {
        console.log(err,user)
        return res.status(401).json({ message: Message.InvalidToken });
      }
      if(user.isDeleted){
        return res.status(401).json({ message: Message.Unauthorized });
      }
      jwt.verify(req.headers.authorization!.split(' ')[1], process.env.JWT_SECRET, (verifyErr) => {
        if (verifyErr) {
          return res.status(401).json({ message: Message.ExpiredToken });
        }
  
        req.user = user;
        next();
      });
    })(req, res, next);
  };
