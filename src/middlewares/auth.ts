//@ts-nocheck
const passport = require('passport')
const jwt = require("jsonwebtoken")
import { Message } from "../enums/Message";
import { NextFunction } from "express";

exports.middlewareAuth = (req:any,res:any,next:any)=>passport.authenticate("jwt",{session:false})(req,res,next)
export const checkJwtToken = (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate('jwt', { session: false }, (err, user) => {
      if (err || !user) {
        return res.status(401).json({ message: Message.InvalidToken });
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
