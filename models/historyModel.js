const mongoose = require("mongoose");

const historyModel = new mongoose.Schema(
  {
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
      },
      advertisementId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Advertisement',
        required: true,
      },
      bookingDate: {
        type: Date,
        default: Date.now,
      },
      totalBookingDays: {
        type: Number,
        default: 0,
      },
      totalPrice: {
        type: Number,
      },
        // Other details about the booking
      },
  {
    timestamps: true,
  }
);

const BookingHistory = mongoose.model("BookingHistory", historyModel);

module.exports = BookingHistory;