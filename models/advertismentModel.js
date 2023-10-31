const mongoose = require('mongoose');

const advertisementSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  pricePerDay: {
    type: Number,
    required: true
  },
  images: [{
    name: String,
    url: String
  }],
  location: {
    type: String,
    required: true
  },
  totalBookingDays: {
    type: Number,
    default: 0
  },
  bookedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User' // Assuming you have a User model for tracking who booked the advertisement
  },
  status: {
    type: String,
    enum: ['open for booking', 'booked', 'completed'],
    default: 'open for booking'
  },
  reservationStartDate: {
    type: Date,
    default: Date.now // Set default value to current date and time
  },
  reservationEndDate: {
    type: Date,
    default: Date.now // Set default value to current date and time
  }
});

const Advertisement = mongoose.model('Advertisement', advertisementSchema);

module.exports = Advertisement;