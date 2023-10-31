const schedule = require('node-schedule');
const Advertisement = require("../models/advertismentModel");
const mongoose = require("mongoose");

// add advertisement
const addAdvertisement = async (req, res) => {
  try {
    const { title, description, price, location } = req.body;

    const images = req.files.map((file) => ({
      name: file.originalname,
      url: `http://localhost:3000/advertisement/${file.filename}`, // Adjust the URL based on your server configuration
    }));

    const advertisement = new Advertisement({
      title,
      description,
      pricePerDay: price,
      images,
      location,
    });

    await advertisement.save();

    res.status(200).json({ message: "Advertisement created successfully" });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ error: error.message });
  }
};

// book advertisement
const bookAdvertisement = async (req, res) => {
  try {
    const advertisementId = req.params.id;
    const { totalBookingDays } = req.body;

    const advertisementObjectId = new mongoose.Types.ObjectId(advertisementId);

    // Find the advertisement by ID
    const advertisement = await Advertisement.findById(advertisementId);

    // Check if the advertisement was found
    if (!advertisement) {
      return res.status(404).json({ error: "Advertisement not found" });
    }

    // Update the advertisement properties
    advertisement.status = "booked";
    advertisement.bookedBy = advertisementObjectId;
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
    // Save the changes
    await advertisement.save();

    //calculate total price
    const totalPrice = totalBookingDays * advertisement.pricePerDay;

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



// Function to cancel reservation and update status
const cancelReservationAndUpdateStatus = async (advertisementId) => {
  try {
    const advertisement = await Advertisement.findById(advertisementId);

    // Check if the advertisement is currently booked
    if (advertisement.status === "booked") {
      const currentDate = new Date();

      // Check if the reservationEndDate is in the past
      if (currentDate > advertisement.reservationEndDate) {
        // Reset relevant fields and update the status to 'open for booking'
        advertisement.status = "open for booking";
        advertisement.bookedBy = undefined;
        advertisement.totalBookingDays = undefined;
        advertisement.reservationStartDate = undefined;
        advertisement.reservationEndDate = undefined;

        await advertisement.save();
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
  addAdvertisement,
  bookAdvertisement,
};
