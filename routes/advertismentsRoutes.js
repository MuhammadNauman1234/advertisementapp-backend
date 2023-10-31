const upload = require("../middlewares/imageMiddleware");
const Router = require("express").Router();
const advertisementController = require("../controllers/advertimentsController");
const protect = require("../middlewares/authMiddleware");

Router.post("/addadvertisement", upload.array('images', 5), advertisementController.addAdvertisement);
Router.get("/getadvertisement", advertisementController.readAdvertisement);
Router.put("/updateadvertisement/:id", advertisementController.updateAdvertisement);
Router.delete("/deleteadvertisement/:id", advertisementController.deleteAdvertisement);
Router.put("/bookadvertisement/:id", advertisementController.bookAdvertisement);

module.exports = Router;