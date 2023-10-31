const upload = require("../middlewares/imageMiddleware");
const Router = require("express").Router();
const advertisementController = require("../controllers/advertimentsController");
const protect = require("../middlewares/authMiddleware");

Router.post("/addadvertisement", upload.array('images', 5), protect, advertisementController.addAdvertisement);
Router.put("/bookadvertisement/:id", protect, advertisementController.bookAdvertisement);

module.exports = Router;