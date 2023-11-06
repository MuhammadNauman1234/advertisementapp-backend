const Advertisement = require("../models/advertismentModel");
const User = require("../models/usersModel");

// add advertisement
const addAdvertisement = async (req, res) => {
  try {
    const { title, description, price, location, userId } = req.body;

    const images = req.files.map((file) => ({
      name: file.originalname,
      url: `http://localhost:5000/advertisement/${file.filename}`, // Adjust the URL based on your server configuration
    }));

    const advertisement = new Advertisement({
      title,
      description,
      pricePerDay: price,
      images,
      location,
      addedBy: userId,
    });

    await advertisement.save();

    res.status(200).json({ message: "Advertisement created successfully" });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ error: error.message });
  }
};

// Read advertisement
const readAdvertisement = async (req, res) => {
  try {
    // Find the advertisement by ID
    const advertisement = await Advertisement.find().populate('bookingId');

    // Check if the advertisement was found
    if (!advertisement) {
      return res.status(404).json({ error: "Advertisement not found" });
    }

    res.status(200).json({advertisements: advertisement});
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: error.message });
  }
};

// Update advertisement by ID
const updateAdvertisement = async (req, res) => {
  try {
    const advertisementId = req.params.id;
    const { title, description, price, location } = req.body;

    // Find the advertisement by ID
    const advertisement = await Advertisement.findById(advertisementId);

    // Check if the advertisement was found
    if (!advertisement) {
      return res.status(404).json({ error: "Advertisement not found" });
    }
    // Update advertisement properties
    advertisement.title = title;
    advertisement.description = description;
    advertisement.pricePerDay = price;
    advertisement.location = location;

    // Save the changes
    await advertisement.save();

    res.status(200).json({ message: "Advertisement updated successfully" });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: error.message });
  }
};

// Delete advertisement by ID
const deleteAdvertisement = async (req, res) => {
  try {
    const advertisementId = req.params.id;

    // Find and delete the advertisement by ID
    const result = await Advertisement.findByIdAndDelete(advertisementId);

    // Check if the advertisement was found and deleted
    if (!result) {
      return res.status(404).json({ error: "Advertisement not found" });
    }

    res.status(200).json({ message: "Advertisement deleted successfully" });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: error.message });
  }
};


// cancel advertisement
const cancelAdvetisement = async (req, res) => {
  try {
    const advertisementId = req.params.id;

    const advertisement = await Advertisement.findById(advertisementId);
    // Check if the advertisement is currently booked
    if (advertisement.status === "booked") {
      // Reset relevant fields and update the status to 'open for booking'
      advertisement.status = "open for booking";
      advertisement.bookedBy = undefined;
      advertisement.totalBookingDays = undefined;
      advertisement.reservationStartDate = undefined;
      advertisement.reservationEndDate = undefined;

      await advertisement.save();
    }
  } catch (error) {}
};


// get booking history
const getBookingHistory = async (req, res) => {
  try {
    const userId = req.params.id;

    // Find the user by ID
    const user = await User.findById(userId)
    .populate('bookHistory');
    // Respond with the user's booking history
    res.status(200).json({ bookingHistory: user.bookHistory});
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  addAdvertisement,
  readAdvertisement,
  updateAdvertisement,
  deleteAdvertisement,
  cancelAdvetisement,
  getBookingHistory
};
