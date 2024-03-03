const userController = require("../controllers/userController")
const passport = require('passport')
import Router from "./configRouter"
Router.post('/register',userController.register)
Router.post('/login',passport.authenticate('local',{session:false}),userController.login)
Router.post('/isAdmin',userController.isAdmin)
Router.get('/userInfo/:id',userController.getUserInfo)
Router.post('/userRecords',userController.setUserRecords)
Router.post('/userInfo/:id/rank',userController.setUserRank)

module.exports = Router