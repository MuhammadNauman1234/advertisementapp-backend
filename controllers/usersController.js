const User = require("../models/usersModel");
const bcrypt = require("bcrypt");
const util = require("util");
const compareAsync = util.promisify(bcrypt.compare);
const generateToken = require("../Config/generateToken");

//get all users
const getUsers = async(req, res) =>{
    res.json("users");
}

//user signup
const userSignUp = async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;

    // Check for all fields
    if (!name || !email || !phone || !password) {
      return res
        .status(400)
        .json({ error: "All necessary fields must be filled" });
    }

    // Check if the user or email already exists
    const userExist = await User.findOne({ email });
    if (userExist) {
      return res.status(400).json({ error: "User already exists" });
    }

    //encrypt user password
    const hashPassword = await bcrypt.hash(password, 10);
    // Create a user entry in the database
    const newUser = await User.create({
      name,
      email,
      phone,
      password: hashPassword,
    });

    res
      .status(201)
      .json({ message: "User registered successfully", user: newUser });
  } catch (error) {
    console.error("Error during user signup:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};


// login controller for users
const userLogin = async (req, res) => {
    try {
      const { email, password } = req.body;
  
      // Find user in db
      const user = await User.findOne({ email });
      if (user) {
        // Use the promisified version of bcrypt.compare
        const isPasswordValid = await compareAsync(password, user.password);
  
        if (isPasswordValid) {
          const userId = user._id;
          const token = generateToken(userId);

          console.log(token);
          
          return res.status(201).json({message:"user login successfully", user:{
              name : user.name,
              email : user.email,
              phone : user.phone,
              token : token
          }});
        }
      }
  
      // If user not found or password is not valid
      res.status(400).json("User not found or invalid credentials");
    } catch (error) {
      console.error(error.message);
      res.status(500).json("Internal Server Error");
    }
  };

module.exports = {
    getUsers,
  userSignUp,
  userLogin
};