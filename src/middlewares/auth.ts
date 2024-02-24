
exports.middlewareAuth = (req:any,res:any,next:any)=>passport.authenticate("jwt",{session:false})(req,res,next)