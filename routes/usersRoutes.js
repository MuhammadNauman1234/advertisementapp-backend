const Router = require("express").Router();
const usersControllor = require("../controllers/usersController");

Router.post("/signup", usersControllor.userSignUp);
Router.post("/login", usersControllor.userLogin);
Router.get("/users", usersControllor.getUsers);

module.exports = Router;