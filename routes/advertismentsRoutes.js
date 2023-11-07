const upload = require("../middlewares/imageMiddleware");
const Router = require("express").Router();
const advertisementController = require("../controllers/advertimentsController");
const bookAdvertisementController = require("../controllers/bookadvertisementController");
const protect = require("../middlewares/authMiddleware");

Router.post("/advertisement/create", upload.array('images', 5), advertisementController.addAdvertisement);
Router.get("/advertisement/read", advertisementController.readAdvertisement);
Router.put("/advertisement/update/:id", advertisementController.updateAdvertisement);
Router.delete("/advertisement/delete/:id", advertisementController.deleteAdvertisement);

Router.put("/advertisement/book/:id", bookAdvertisementController.bookAdvertisement);
Router.put("/advertisement/cancel", advertisementController.cancelAdvetisement);
Router.put("/advertisement/book/advance/:id", bookAdvertisementController.advanceBooking);

Router.get("/user/bookinghistory/:id", advertisementController.getBookingHistory);

module.exports = Router;