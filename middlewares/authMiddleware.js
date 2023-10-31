const jwt = require("jsonwebtoken");
const User = require("../models/usersModel")

const protect = async (req, res, next) => {

  try {
    // Get the Authorization header from the request
    const authorizationHeader = req.headers["authorization"];

    // Check if the header exists
    if (!authorizationHeader) {
      return res
        .status(401)
        .json({ error: "Unauthorized - Token not provided" });
    }

    // Split the header value to get the token part
    let [token] = authorizationHeader.split(" ");

    // Check if the header has the expected format
    if (!token) {
      return res
        .status(401)
        .json({ error: "Unauthorized - Invalid token format" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const userId = decoded.id;

       // Retrieve the user from the database using the user ID
       const user = await User.findOne({ _id:userId });
       req.user = user;
       req.userId = user._id;

       next();
  } catch (error) {
    console.log(error);
    console.error(error.message);
    res.status(500).json({message: error.message});
  }
};

module.exports = protect;