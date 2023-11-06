const schedule = require("node-schedule");
const Advertisement = require("../models/advertismentModel");
const User = require("../models/usersModel");
const BookingHistory = require("../models/bookingModel");

// book advertisement
const bookAdvertisement = async (req, res) => {
  try {
    const advertisementId = req.params.id;
    const { totalBookingDays, userId } = req.body;
    // Find the user by ID
    const user = await User.findOne({ _id: userId });
    if (!user) {
      return res.json({ message: "user not found!" });
    }
    // Find the advertisement by ID
    const advertisement = await Advertisement.findById(advertisementId);

    // Check if the advertisement was found
    if (!advertisement) {
      return res.status(404).json({ error: "Advertisement not found" });
    }

    //calculate total price
    const totalPrice = totalBookingDays * advertisement.pricePerDay;

    // Create a new booking history entry
    const newBooking = new BookingHistory({
      userId,
      advertisementId,
      totalBookingDays,
      totalPrice,
      bookingDate: new Date(),
      // Other details about the booking
    });

    // Save the new booking history entry
    await newBooking.save();

    user.bookHistory.push(newBooking._id);
    user.save();

    // Update the advertisement properties
    advertisement.status = "booked";
    advertisement.bookedBy = userId;
    advertisement.totalBookingDays = totalBookingDays;
    // Define reservationStartDate here
    const reservationStartDate = new Date();
    advertisement.reservationStartDate = reservationStartDate;
    // Check if totalBookingDays is a positive integer
    if (!Number.isInteger(totalBookingDays) || totalBookingDays <= 0) {
      return res.status(400).json({ error: "Invalid totalBookingDays value" });
    }
    // Define and calculate reservationEndDate
    advertisement.reservationEndDate = new Date(
      reservationStartDate.getTime() + totalBookingDays * 24 * 60 * 60 * 1000
    );
    // pushing id into advertisement collection
    advertisement.bookingId.push(newBooking._id);
    // Save the changes
    await advertisement.save();
    // Start the background task to automatically cancel reservation
    const backgroundTaskJob = startBackgroundTask(advertisementId);

    // Respond with success message
    res.status(200).json({
      message: "Advertisement Booked Successfully!",
      totalPrice: totalPrice,
    });
  } catch (error) {
    // Handle errors and respond with an error message
    console.error(error.message);
    res.status(500).json({ error: error.message });
  }
};

// advance advertisement Booking
const advanceBooking = async (req, res) => {
  try {
    const advertisementId = req.params.id;
    const { totalBookingDays, userId } = req.body;

    const user = await User.findById(userId);

    // if user not found
    if (!user) {
      return res.json({ message: "user not found!" });
    }
    const advertisement = await Advertisement.findById(advertisementId);

    if (!advertisement) {
      return res.json({ message: "advertisement not found!" });
    }
    // Create a new booking history entry with status set to 'pending'
    const price = advertisement.pricePerDay;
    const totalPrice = price * totalBookingDays;
    // Create a new booking history entry with status set to 'pending'
    const newBooking = await BookingHistory.create({
      userId,
      advertisementId,
      totalBookingDays,
      totalPrice,
      bookingDate: new Date(),
      status: "pending", // Set the initial status to 'pending'
      // Other details about the booking
    });
    // pushing booking id into user booking history
    user.bookHistory.push(newBooking._id);
    await user.save();

    // pushing id into advertisement collection
    advertisement.bookingId.push(newBooking._id);
    await advertisement.save();

    res.status(200).json({ message: "advance booking done successfully" });
    // ...
  } catch (error) {
    // Handle errors and respond with an error message
    console.error(error.message);
    res.status(500).json({ error: error.message });
  }
};

// Function to cancel reservation and update status
const cancelReservationAndUpdateStatus = async (advertisementId) => {
  try {
    const advertisement = await Advertisement.findById(advertisementId);

    // Check if the advertisement is currently booked
    if (advertisement.status === "booked") {
      const currentDate = new Date();
      // Check if the reservationEndDate is in the past
      if (currentDate > advertisement.reservationEndDate) {
        // Find the next pending booking
        const nextBooking = await BookingHistory.findOne({
          advertisementId,
          status: "pending",
        }).sort({ bookingDate: 1 });

        if (nextBooking) {
          // Assign the advertisement to the next pending booking
          advertisement.status = "booked";
          advertisement.bookedBy = nextBooking.userId;
          advertisement.totalBookingDays = nextBooking.totalBookingDays;
          advertisement.reservationStartDate = new Date();
          advertisement.reservationEndDate = new Date(
            new Date().getTime() +
              nextBooking.totalBookingDays * 24 * 60 * 60 * 1000
          );

          // Update the status of the next booking to 'booked'
          nextBooking.status = "booked";
          await nextBooking.save();
        } else {
          // Reset relevant fields and update the status to 'open for booking'
          advertisement.status = "open for booking";
          advertisement.bookedBy = undefined;
          advertisement.totalBookingDays = undefined;
          advertisement.reservationStartDate = undefined;
          advertisement.reservationEndDate = undefined;

          await advertisement.save();
        }
      }
    }
  } catch (error) {
    console.error(error.message);
  }
};

// Set up a recurring job using node-schedule
const startBackgroundTask = (advertisementId) => {
  // Set the cron expression for the job (e.g., every hour)
  const cronExpression = "0 * * * *"; // Runs every hour

  // Schedule the job
  const job = schedule.scheduleJob(cronExpression, async () => {
    await cancelReservationAndUpdateStatus(advertisementId);
  });

  // Optionally, save the job in a data structure if you want to cancel it later
  return job;
};

module.exports = {
  bookAdvertisement,
  advanceBooking,
};
